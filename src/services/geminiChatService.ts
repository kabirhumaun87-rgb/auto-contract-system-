/**
 * Gemini Chat Service
 * Handles multi-turn chat sessions, model tiers, and communication with /api/chat.
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  isError?: boolean;
}

export type GeminiModelId = 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon';

export interface ModelTierConfig {
  id: GeminiModelId;
  name: string;
  badge: string;
  description: string;
  bestFor: string;
}

export const GEMINI_MODELS: ModelTierConfig[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    badge: 'Standard / Recommended',
    description: 'Balanced speed and high intelligence for general tasks',
    bestFor: 'General tasks, standard contract queries, BOQ drafting, and guidance (Default)',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    badge: 'Ultra Fast',
    description: 'Minimal latency for quick lookups and summary answers',
    bestFor: 'Tasks that should happen fast, definitions, rate lookups, and quick math',
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    badge: 'Deep Reasoning',
    description: 'State-of-the-art reasoning for high-complexity legal and technical audits',
    bestFor: 'Particularly complex tasks, contract dispute analysis, deep specification audits',
  },
];

export interface ChatbotRole {
  id: string;
  title: string;
  badge: string;
  iconName: string;
  shortDesc: string;
  systemInstruction: string;
}

export const CHATBOT_ROLES: ChatbotRole[] = [
  {
    id: 'mes_contract_advisor',
    title: 'MES PW-2 Works & Tender Advisor',
    badge: 'Default Persona',
    iconName: 'Building2',
    shortDesc: 'Specialized in Bangladesh Military Engineer Services PW-2 contracts and procurement regulations.',
    systemInstruction: `You are an expert Military Engineer Services (MES) Works Contract and Tender Formulation Consultant in Bangladesh.
You provide authoritative, clear, and professional guidance on:
- The MES PW-2 standard contract for works and Schedule of Rates.
- Tender procedures, Notice Inviting Tender (NIT), Instructions to Tenderers, and Tender Data Sheets.
- Earnest Money (Tender Security), Performance Security, Security Deposit deduction (normally 10%), Defect Liability Period (DLP), and Retention Money release.
- Public Procurement Act (PPA 2006) and Public Procurement Rules (PPR 2008) compliance in Bangladesh military and defense establishments.
- Liquidated damages (delay penalties), extension of time (EOT), and variation orders.
Provide structured responses with bullet points, references to relevant sections/clauses, and practical recommendations.`,
  },
  {
    id: 'boq_estimator',
    title: 'BOQ & SSR Estimator',
    badge: 'Quantity Surveying',
    iconName: 'Calculator',
    shortDesc: 'Calculates material breakdown, civil measurements, unit conversions, and priced work schedules.',
    systemInstruction: `You are a Chief Quantity Surveyor and BOQ Estimator specializing in Bangladesh Military Engineer Services Schedule of Rates (MES SSR) and CPWD engineering standards.
Your role:
- Help users break down Bill of Quantities (BOQ) items for civil, electrical, sanitary, plumbing, and road works.
- Compute unit rates, analysis of rates, and material consumption (cement, sand/Sylhet sand, stone chips, brick khoa, BSRM 500W rebar).
- Perform accurate conversions between Metric (Cum, Sqm, Rmt) and Imperial (Cft, Sft, Rft) units.
- Always provide numbers clearly and format single-digit quantities with a leading zero (e.g. 05.00, 02.25) where relevant in schedules.`,
  },
  {
    id: 'legal_auditor',
    title: 'Contract Legal & Dispute Auditor',
    badge: 'Legal & Risk',
    iconName: 'ShieldAlert',
    shortDesc: 'Reviews contract risk clauses, special conditions, dispute resolution, and compliance.',
    systemInstruction: `You are a Senior Legal & Compliance Auditor specialized in government construction contracts, dispute avoidance, and risk mitigation under Bangladesh contract law.
Your role:
- Scrutinize contract clauses, identify ambiguous specifications or liability loopholes.
- Advise on Special Conditions of Contract (SCC/PCC) to protect government and procuring entity interests.
- Explain dispute settlement mechanisms, arbitration procedures, amicable settlement steps, and force majeure events.
- Draft clear, legally sound notifications and contractual letters (e.g., Default Notice, Termination Warning, Time Extension Assessment).`,
  },
  {
    id: 'general_assistant',
    title: 'General Contract Assistant',
    badge: 'All-Purpose',
    iconName: 'Bot',
    shortDesc: 'Drafts official letters, memos, minutes of meetings, and answers general engineering inquiries.',
    systemInstruction: `You are an intelligent, versatile assistant for the Auto Contract System.
Your role:
- Draft official engineering correspondence, memos to contractors, and meeting minutes.
- Summarize contract terms, extract actionable deliverables, and prepare executive briefings.
- Answer any general technical, administrative, or project management questions cleanly and professionally.`,
  },
];

export interface ChatSession {
  id: string;
  title: string;
  roleId: string;
  model: GeminiModelId;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  attachedProjectId?: string;
}

const STORAGE_KEY_SESSIONS = 'acs_gemini_chat_sessions_v1';
const STORAGE_KEY_ACTIVE = 'acs_gemini_active_session_id_v1';

export const GeminiChatService = {
  getSessions(): ChatSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse chat sessions:', e);
    }
    // Default initial session
    const initialSession = this.createNewSession();
    return [initialSession];
  },

  saveSessions(sessions: ChatSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save chat sessions:', e);
    }
  },

  getActiveSessionId(): string {
    return localStorage.getItem(STORAGE_KEY_ACTIVE) || '';
  },

  setActiveSessionId(id: string): void {
    localStorage.setItem(STORAGE_KEY_ACTIVE, id);
  },

  createNewSession(roleId = 'mes_contract_advisor', model: GeminiModelId = 'gemini-3.8-flash'): ChatSession {
    const id = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newSession: ChatSession = {
      id,
      title: 'New Conversation',
      roleId,
      model,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    return newSession;
  },

  async sendChatMessage(
    messages: ChatMessage[],
    model: GeminiModelId = 'gemini-3.8-flash',
    systemInstruction: string,
    contractContext?: string
  ): Promise<string> {
    const apiPayload = {
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      model,
      systemInstruction,
      contractContext,
    };

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiPayload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Server returned error status ${res.status}`);
    }

    return data.reply || '';
  },
};
