import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  PlusCircle,
  ArrowRight,
  Eye,
  CheckSquare,
  Square,
  HelpCircle
} from 'lucide-react';
import { BOQItem } from '../types/contract';
import { formatBangladeshiCurrency, numberToBangladeshiTakaWords, formatBOQQuantity } from '../utils/numberToWordsBangla';

interface ExtractedBOQData {
  items: BOQItem[];
  detectedWorkName?: string;
  detectedContractNo?: string;
  detectedTotalTaka?: number;
}

interface AutoBOQExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyItems: (items: BOQItem[], mode: 'replace' | 'append', detectedWorkName?: string) => void;
  existingCount: number;
}

export const AutoBOQExtractorModal: React.FC<AutoBOQExtractorModalProps> = ({
  isOpen,
  onClose,
  onApplyItems,
  existingCount
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [extractedData, setExtractedData] = useState<ExtractedBOQData | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [updateWorkName, setUpdateWorkName] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile: File) => {
    setError(null);
    setExtractedData(null);

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    const isPdfOrImage = validTypes.includes(selectedFile.type) || 
      /\.(pdf|jpe?g|png|webp)$/i.test(selectedFile.name);

    if (!isPdfOrImage) {
      setError('Please provide a valid PDF document or Image file (JPEG, PNG, WebP).');
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size exceeds 25MB limit. Please upload a smaller file or image.');
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const loadSampleMESDocument = () => {
    setError(null);
    setLoadingStep('Simulating MES tender schedule analysis...');
    setIsLoading(true);

    setTimeout(() => {
      const sampleItems: BOQItem[] = [
        {
          id: `boq-extracted-${Date.now()}-1`,
          serialNo: 1,
          specClauseNumber: '1',
          description: 'Supply and fixing of Cup board 625 mm depth any colour made of both side melamine coated / laminated board 19mm thick including 2xdrawer, shelf, 3mm thick plastic board liner, steel channel for drawer, steel lama hinges, steel handle, steel lock, etc. complete (OTOBI / NAVANA / PARTEX BRAND) as spd after Demolition Done by DEL.',
          unit: 'Sqm',
          quantity: 5.0,
          unitRate: 4250.0,
          amount: 21250.0
        },
        {
          id: `boq-extracted-${Date.now()}-2`,
          serialNo: 2,
          specClauseNumber: '2',
          description: 'Supply and fixing decorative PVC false ceiling with heavy aluminium suspended T-runner framework, corner angle trims, including all hangings, screws, joints and finishes complete as spd.',
          unit: 'Sqm',
          quantity: 42.5,
          unitRate: 1150.0,
          amount: 48875.0
        },
        {
          id: `boq-extracted-${Date.now()}-3`,
          serialNo: 3,
          specClauseNumber: '3',
          description: 'Internal wall painting with 2 coats of luxury plastic emulsion paint of approved shade and brand over 1 coat of acrylic primer after thoroughly cleaning and preparing plaster surface with putty complete.',
          unit: 'Sqm',
          quantity: 185.0,
          unitRate: 145.0,
          amount: 26825.0
        },
        {
          id: `boq-extracted-${Date.now()}-4`,
          serialNo: 4,
          specClauseNumber: '4',
          description: 'Supply and installation of 1.5 HP inverter type wall mounted split air conditioner unit including indoor & outdoor unit, refrigerant copper piping up to 10 Rft, drainage pipe, power cable and brackets complete (Gree / General / Daikin).',
          unit: 'Nos',
          quantity: 2.0,
          unitRate: 68500.0,
          amount: 137000.0
        },
        {
          id: `boq-extracted-${Date.now()}-5`,
          serialNo: 5,
          specClauseNumber: '5',
          description: 'Laying 600mm x 600mm mirror polished homogeneous floor tiles of approved quality (RAK / CBC / DBL) set in 1:4 cement mortar bed and joints grouted with matching tinted white cement complete.',
          unit: 'Sqm',
          quantity: 36.0,
          unitRate: 1650.0,
          amount: 59400.0
        }
      ];

      setExtractedData({
        items: sampleItems,
        detectedWorkName: 'Repair/Maint of Internal Decoration Works to Bldg No 04 Office Bldg for 05 RE BN Area at Postogola Cantt.',
        detectedContractNo: 'GSDCA/02 OF 2026-2027',
        detectedTotalTaka: 293350.0
      });

      setSelectedItemIds(new Set(sampleItems.map(i => i.id)));
      setIsLoading(false);
      setLoadingStep('');
    }, 700);
  };

  const handleProcessFile = async () => {
    if (!file) {
      setError('Please select a PDF or JPEG file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep('Reading file and preparing for AI vision...');

    try {
      // Convert file to Base64
      const base64Promise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file into memory'));
        reader.readAsDataURL(file);
      });

      const fileBase64 = await base64Promise;
      setLoadingStep('Uploading to Gemini 3.8 Flash Vision engine...');

      const response = await fetch('/api/extract-boq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileBase64,
          mimeType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
          fileName: file.name
        })
      });

      setLoadingStep('Parsing items, quantities, and rates...');

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const resData = await response.json();

      if (!resData.success || !resData.items || resData.items.length === 0) {
        throw new Error('No BOQ items could be identified in the uploaded document. Please check the document quality.');
      }

      // Map response to proper BOQItem format with unique IDs
      const mappedItems: BOQItem[] = resData.items.map((it: any, idx: number) => {
        const qty = typeof it.quantity === 'number' ? it.quantity : (parseFloat(it.quantity) || 1);
        const rate = it.unitRate !== null && it.unitRate !== undefined ? (typeof it.unitRate === 'number' ? it.unitRate : parseFloat(it.unitRate)) : null;
        const amt = it.amount !== null && it.amount !== undefined ? (typeof it.amount === 'number' ? it.amount : parseFloat(it.amount)) : Math.round((qty * (rate ?? 0)) * 100) / 100;

        return {
          id: `boq-ai-${Date.now()}-${idx + 1}`,
          serialNo: it.serialNo || (idx + 1),
          specClauseNumber: it.specClauseNumber ? String(it.specClauseNumber) : '',
          description: String(it.description || '').trim(),
          unit: String(it.unit || 'Sqm').trim(),
          quantity: qty,
          unitRate: rate,
          amount: amt
        };
      });

      setExtractedData({
        items: mappedItems,
        detectedWorkName: resData.detectedWorkName,
        detectedContractNo: resData.detectedContractNo,
        detectedTotalTaka: resData.detectedTotalTaka || mappedItems.reduce((acc, it) => acc + (it.amount || 0), 0)
      });

      setSelectedItemIds(new Set(mappedItems.map(i => i.id)));
    } catch (err: any) {
      console.error('Failed to extract BOQ:', err);
      setError(`Extraction failed: ${err.message}. You can also click "Use Sample MES Schedule" to test the automated workflow.`);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const toggleItemSelect = (id: string) => {
    const next = new Set(selectedItemIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedItemIds(next);
  };

  const toggleSelectAll = () => {
    if (!extractedData) return;
    if (selectedItemIds.size === extractedData.items.length) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(extractedData.items.map(i => i.id)));
    }
  };

  const handleApply = () => {
    if (!extractedData) return;
    const finalItems = extractedData.items.filter(it => selectedItemIds.has(it.id));
    if (finalItems.length === 0) {
      setError('Please select at least one item to import.');
      return;
    }

    onApplyItems(
      finalItems,
      importMode,
      updateWorkName && extractedData.detectedWorkName ? extractedData.detectedWorkName : undefined
    );
    onClose();
  };

  const selectedCount = selectedItemIds.size;
  const selectedTotal = extractedData
    ? extractedData.items
        .filter(it => selectedItemIds.has(it.id))
        .reduce((acc, it) => acc + (it.amount || 0), 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Sparkles className="w-5 h-5 text-blue-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Auto-Extract Bill of Quantities (BOQ)</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide bg-blue-500/30 text-blue-200 rounded border border-blue-400/30">
                  Gemini AI Vision
                </span>
              </div>
              <p className="text-xs text-blue-100/80">
                Provide a PDF tender schedule or JPEG/PNG document photo to collect all items automatically
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-slate-800 text-xs">
          
          {/* Top Instructions & Sample helper */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-blue-900 text-xs">
                <span className="font-semibold">Supported files:</span> PDF documents, JPEG/JPG, PNG, and WebP images.
                The system scans table rows, descriptions, units, quantities, and rates with intelligent OCR.
              </div>
            </div>
            <button
              type="button"
              onClick={loadSampleMESDocument}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-100 border border-blue-300 rounded shadow-xs transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Load Sample MES Schedule</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          {!extractedData && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50/50 scale-[1.005]' 
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60 bg-slate-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              <div className="max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Drag and drop your PDF or JPEG file here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    or click to browse from your computer
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-red-500" /> PDF Document
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> JPEG / PNG Photo
                  </span>
                  <span>•</span>
                  <span>Max 25MB</span>
                </div>
              </div>
            </div>
          )}

          {/* File Selected State */}
          {file && !extractedData && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  {file.type.includes('pdf') || file.name.endsWith('.pdf') ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-900 truncate">{file.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Document'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded transition-colors"
                >
                  Change File
                </button>
                <button
                  type="button"
                  onClick={handleProcessFile}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded shadow-xs transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start Automatic Extraction</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Loading Animation Card */}
          {isLoading && (
            <div className="p-6 bg-blue-50/50 border border-blue-200 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-blue-950">Analyzing Bill of Quantities with AI Vision</p>
              <p className="text-xs text-blue-700 animate-pulse">{loadingStep || 'Processing document...'}</p>
              <div className="max-w-xs mx-auto bg-blue-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-2/3 animate-[pulse_1s_ease-in-out_infinite]"></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold">Notice:</span> {error}
              </div>
            </div>
          )}

          {/* Extracted Data View */}
          {extractedData && (
            <div className="space-y-4">
              {/* Header stats & detected details */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">
                      Successfully Extracted {extractedData.items.length} BOQ Items
                    </h4>
                    {extractedData.detectedWorkName && (
                      <p className="text-[11px] text-emerald-800 line-clamp-1 max-w-xl">
                        <span className="font-semibold">Detected Work:</span> {extractedData.detectedWorkName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-emerald-700 block font-medium">Selected Total:</span>
                  <span className="text-sm font-bold font-mono text-emerald-950">
                    {formatBangladeshiCurrency(selectedTotal)}
                  </span>
                </div>
              </div>

              {/* Table of items */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-blue-600"
                  >
                    {selectedItemIds.size === extractedData.items.length ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    <span>
                      {selectedItemIds.size === extractedData.items.length
                        ? 'Deselect All'
                        : `Select All (${extractedData.items.length})`}
                    </span>
                  </button>

                  <span className="text-[11px] text-slate-500">
                    {selectedCount} of {extractedData.items.length} items checked for import
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 w-10 text-center">Sel</th>
                        <th className="py-2 px-2 w-10 text-center">Ser</th>
                        <th className="py-2 px-3 w-20">Clause</th>
                        <th className="py-2 px-3 min-w-[240px]">Brief Description of Works</th>
                        <th className="py-2 px-2 w-16 text-center">Unit</th>
                        <th className="py-2 px-3 w-20 text-right">Qty</th>
                        <th className="py-2 px-3 w-24 text-right">Rate (Tk)</th>
                        <th className="py-2 px-3 w-28 text-right">Amount (Tk)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {extractedData.items.map((it, idx) => {
                        const isSelected = selectedItemIds.has(it.id);
                        return (
                          <tr
                            key={it.id}
                            onClick={() => toggleItemSelect(it.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'bg-slate-50/30 text-slate-400 hover:bg-slate-100/50'
                            }`}
                          >
                            <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleItemSelect(it.id)}
                                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                              />
                            </td>
                            <td className="py-2 px-2 text-center font-mono font-medium text-slate-600">
                              {it.serialNo || idx + 1}
                            </td>
                            <td className="py-2 px-3 font-mono text-[11px] text-slate-700">
                              {it.specClauseNumber || '-'}
                            </td>
                            <td className="py-2 px-3 font-normal text-slate-800">
                              <p className="line-clamp-2">{it.description}</p>
                            </td>
                            <td className="py-2 px-2 text-center font-medium text-slate-700">
                              {it.unit}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-medium text-slate-800">
                              {formatBOQQuantity(it.quantity)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-slate-800">
                              {it.unitRate !== null ? it.unitRate.toFixed(2) : <span className="text-amber-600 italic">Unpriced</span>}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                              {formatBangladeshiCurrency(it.amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Import Options */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Import Mode:</span>
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-slate-800">
                      Replace all current BOQ items ({existingCount} items will be replaced)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-slate-800">
                      Append to existing items (add {selectedCount} items to end)
                    </span>
                  </label>
                </div>

                {extractedData.detectedWorkName && (
                  <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-200 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={updateWorkName}
                      onChange={(e) => setUpdateWorkName(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>
                      Also apply detected Project / Work Name: <span className="font-semibold text-slate-900">"{extractedData.detectedWorkName}"</span>
                    </span>
                  </label>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div>
            {extractedData && (
              <button
                type="button"
                onClick={() => {
                  setExtractedData(null);
                  setFile(null);
                }}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
              >
                Upload different file
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>

            {extractedData && (
              <button
                type="button"
                onClick={handleApply}
                disabled={selectedCount === 0}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Import {selectedCount} Items into BOQ</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
