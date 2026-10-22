import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Body parser with 50MB limit to handle multi-page scanned PDFs and high-res JPEG/PNG images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Endpoint: Extract BOQ from uploaded PDF or Image
  app.post('/api/extract-boq', async (req, res) => {
    try {
      const { fileBase64, mimeType, fileName } = req.body;

      if (!fileBase64 || !mimeType) {
        return res.status(400).json({ 
          error: 'Missing file data. Please provide fileBase64 and mimeType.' 
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.' 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Strip data URI header if included
      const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');

      const prompt = `You are an expert Military Engineer Services (MES) Works Contract and Schedule of Rates / Bill of Quantities (BOQ) analyst.
Carefully examine the provided document (PDF or image such as JPEG/PNG/scan).
Extract all Bill of Quantities (BOQ) items, tender work specifications, measurements, quantities, unit rates, and totals.

Requirements for each item:
- serialNo: item sequence integer (1, 2, 3...)
- specClauseNumber: specification clause number or code if present (e.g. "12.4", "Item 3", "PW-2/04", or empty string if not listed)
- description: full description of work or supply item (materials, dimensions, brand specifications like OTOBI, NAVANA, PARTEX, Seven Rings, BSRM, finishes, demolition, fixing, etc.)
- unit: engineering unit of measurement (e.g., "Sqm", "Cum", "Rmt", "M", "Nos", "Kg", "Each", "Job", "Set", "Sqft", "Cft", etc.)
- quantity: numerical quantity (float/integer, e.g. 5.0, 12.5, 100)
- unitRate: unit rate in Bangladeshi Taka or currency (float/integer). If unpriced or not filled, set to null.
- amount: total item price = quantity * (unitRate ?? 0). If not listed, calculate it.

Also extract any document-level metadata found:
- detectedWorkName: Name of work or project title in the document header/cover (or empty string)
- detectedContractNo: Contract number or Tender Ref (or empty string)
- detectedTotalTaka: The grand total amount in Taka if explicitly mentioned at the bottom of the table (or 0)

Ensure all text descriptions are complete and legible, preserving technical terms.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
        config: {
          systemInstruction: 'You extract tabular Bill of Quantities (BOQ), work schedule, and construction estimate data accurately from document scans, PDFs, and images into structured JSON format.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedWorkName: { type: Type.STRING },
              detectedContractNo: { type: Type.STRING },
              detectedTotalTaka: { type: Type.NUMBER },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    serialNo: { type: Type.INTEGER },
                    specClauseNumber: { type: Type.STRING },
                    description: { type: Type.STRING },
                    unit: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    unitRate: { type: Type.NUMBER },
                    amount: { type: Type.NUMBER },
                  },
                  required: ['serialNo', 'description', 'unit', 'quantity'],
                },
              },
            },
            required: ['items'],
          },
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);

      return res.json({
        success: true,
        fileName,
        detectedWorkName: parsed.detectedWorkName || '',
        detectedContractNo: parsed.detectedContractNo || '',
        detectedTotalTaka: parsed.detectedTotalTaka || 0,
        items: parsed.items || [],
      });
    } catch (error: any) {
      console.error('BOQ extraction error:', error);
      return res.status(500).json({
        error: error.message || 'An error occurred during BOQ document extraction.',
        details: String(error),
      });
    }
  });

  // API Endpoint: Multi-Turn Gemini Chatbot
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, model, systemInstruction, contractContext } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages array is required and cannot be empty.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in Settings.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Normalize model name (supported: gemini-3.8-flash, gemini-3.1-flash-lite, gemini-4-argon)
      let selectedModel = (model || 'gemini-3.8-flash').replace(/^models\//, '').trim();
      const validModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-4-argon'];
      if (!validModels.includes(selectedModel)) {
        selectedModel = 'gemini-3.8-flash';
      }

      // Default system instruction if not supplied
      let sysInstruction = systemInstruction || 
        'You are an expert Military Engineer Services (MES) Works Contract and Schedule of Rates Consultant. You assist engineers, contractors, and project managers with MES PW-2 contracts, tender documentation, public procurement rules (PPA 2006 / PPR 2008), BOQ calculations, measurement items, and contract administration in Bangladesh.';

      if (contractContext && typeof contractContext === 'string' && contractContext.trim()) {
        sysInstruction += `\n\n[Active Project / Contract Context]:\n${contractContext.trim()}`;
      }

      // Prepare conversation turns ensuring proper role alternation ('user' and 'model')
      const sanitizedTurns: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      for (const m of messages) {
        const text = typeof m.content === 'string' ? m.content.trim() : '';
        if (!text) continue;
        const role = (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user';

        if (sanitizedTurns.length > 0 && sanitizedTurns[sanitizedTurns.length - 1].role === role) {
          // Merge consecutive same-role messages
          sanitizedTurns[sanitizedTurns.length - 1].parts[0].text += `\n\n${text}`;
        } else {
          sanitizedTurns.push({
            role,
            parts: [{ text }],
          });
        }
      }

      if (sanitizedTurns.length === 0) {
        return res.status(400).json({ error: 'No valid message content provided.' });
      }

      // Gemini requires first message to have role 'user'
      if (sanitizedTurns[0].role !== 'user') {
        sanitizedTurns.unshift({
          role: 'user',
          parts: [{ text: 'Hello' }],
        });
      }

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: sanitizedTurns,
        config: {
          systemInstruction: sysInstruction,
        },
      });

      const reply = response.text || '';
      return res.json({
        success: true,
        model: selectedModel,
        reply,
      });
    } catch (error: any) {
      console.error('Gemini Chat error:', error);
      return res.status(500).json({
        error: error.message || 'An error occurred while generating chat response.',
        details: String(error),
      });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Serve with Vite in development or static in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Auto Contract System server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
