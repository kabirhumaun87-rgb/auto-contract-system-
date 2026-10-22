import React, { useState } from 'react';
import { Plus, Trash2, Copy, FileDown, FileUp, Calculator, Sparkles } from 'lucide-react';
import { BOQItem } from '../types/contract';
import { formatBangladeshiCurrency, numberToBangladeshiTakaWords } from '../utils/numberToWordsBangla';
import { INITIAL_SAMPLE_PROJECT } from '../data/template_mappings';
import { AutoBOQExtractorModal } from './AutoBOQExtractorModal';
import { BOQQuantityInput } from './BOQQuantityInput';

export const BOQEditorView: React.FC = () => {
  const [items, setItems] = useState<BOQItem[]>(() => INITIAL_SAMPLE_PROJECT.boqItems);
  const [correctionsCount, setCorrectionsCount] = useState<number>(0);
  const [isExtractorOpen, setIsExtractorOpen] = useState(false);

  const calculateTotal = (currentItems: BOQItem[]) => {
    return currentItems.reduce((acc, it) => acc + (it.amount || 0), 0);
  };

  const handleApplyExtracted = (extractedItems: BOQItem[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      const renumbered = extractedItems.map((item, idx) => ({
        ...item,
        serialNo: idx + 1,
        amount: Math.round(((item.quantity || 0) * (item.unitRate ?? 0)) * 100) / 100
      }));
      setItems(renumbered);
    } else {
      const startIdx = items.length;
      const renumbered = extractedItems.map((item, idx) => ({
        ...item,
        serialNo: startIdx + idx + 1,
        amount: Math.round(((item.quantity || 0) * (item.unitRate ?? 0)) * 100) / 100
      }));
      setItems([...items, ...renumbered]);
    }
  };

  const updateItem = (index: number, field: keyof BOQItem, value: any) => {
    const updated = [...items];
    const target = { ...updated[index], [field]: value };

    if (field === 'quantity' || field === 'unitRate') {
      const q = field === 'quantity' ? (parseFloat(value) || 0) : target.quantity;
      const r = field === 'unitRate' ? (value === '' ? null : parseFloat(value)) : target.unitRate;
      target.quantity = q;
      target.unitRate = r;
      target.amount = Math.round((q * (r ?? 0)) * 100) / 100;
    }

    updated[index] = target;
    setItems(updated);
  };

  const addItem = () => {
    const newItem: BOQItem = {
      id: `boq-manual-${Date.now()}`,
      serialNo: items.length + 1,
      specClauseNumber: '',
      description: '',
      unit: 'Sqm',
      quantity: 1,
      unitRate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const duplicateItem = (index: number) => {
    const original = items[index];
    const dup: BOQItem = {
      ...original,
      id: `boq-dup-${Date.now()}`,
      serialNo: items.length + 1
    };
    setItems([...items, dup]);
  };

  const deleteItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index).map((item, idx) => ({
      ...item,
      serialNo: idx + 1
    }));
    setItems(updated);
  };

  const handleExportCSV = () => {
    const headers = ['Ser No', 'Specification Clause', 'Brief Description', 'Unit', 'Quantity', 'Unit Rate', 'Amount'];
    const rows = items.map(it => [
      it.serialNo,
      `"${it.specClauseNumber || ''}"`,
      `"${it.description.replace(/"/g, '""')}"`,
      `"${it.unit}"`,
      it.quantity,
      it.unitRate ?? '',
      it.amount
    ]);
    const total = calculateTotal(items);
    rows.push(['', '', '"Total TK"', '', '', '', total]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MES_PW2_BOQ_Export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const total = calculateTotal(items);
  const words = numberToBangladeshiTakaWords(total);
  const unpricedCount = items.filter(i => i.unitRate === null || i.unitRate === undefined).length;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 shadow-sm">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Standalone Bill of Quantities (BOQ) Workbench</h2>
          <p className="text-xs text-slate-500">Section 6 Schedule of Rates & Works Estimator for MES Contracts</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExtractorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs"
            title="Upload PDF or JPEG file to collect all BOQ items automatically"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Auto-Extract from PDF / JPEG</span>
          </button>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {unpricedCount > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
          Notice: {unpricedCount} item(s) are currently unpriced. Under Section 7 Clause 14, unpriced items will be deemed covered by other prices in the tender.
        </div>
      )}

      {/* Spreadsheet Table */}
      <div className="border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center">Ser</th>
              <th className="py-2.5 px-3 w-28">Spec Clause</th>
              <th className="py-2.5 px-3 min-w-[320px]">Brief Description of works</th>
              <th className="py-2.5 px-3 w-20 text-center">Unit</th>
              <th className="py-2.5 px-3 w-24 text-right">Quantity</th>
              <th className="py-2.5 px-3 w-28 text-right">Unit Rate (Tk)</th>
              <th className="py-2.5 px-3 w-32 text-right">Amount (Tk)</th>
              <th className="py-2.5 px-3 w-20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="py-2 px-3 text-center font-mono font-medium">{index + 1}</td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={item.specClauseNumber}
                    onChange={(e) => updateItem(index, 'specClauseNumber', e.target.value)}
                    placeholder="Clause"
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  />
                </td>
                <td className="py-2 px-3">
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-center font-bold"
                  />
                </td>
                <td className="py-2 px-3">
                  <BOQQuantityInput
                    value={item.quantity}
                    onChange={(newQty) => updateItem(index, 'quantity', newQty)}
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitRate !== null ? item.unitRate : ''}
                    onChange={(e) => updateItem(index, 'unitRate', e.target.value)}
                    placeholder="Unpriced"
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-right font-mono"
                  />
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                  {formatBangladeshiCurrency(item.amount)}
                </td>
                <td className="py-2 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => duplicateItem(index)}
                      title="Duplicate"
                      className="p-1 text-slate-400 hover:text-blue-600 rounded"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteItem(index)}
                      title="Delete"
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-xs">
            <tr>
              <td colSpan={6} className="py-2.5 px-4 text-right">Total TK:</td>
              <td className="py-2.5 px-3 text-right font-mono text-sm text-blue-700 tabular-nums">
                Tk {formatBangladeshiCurrency(total)}
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={6} className="py-2 px-4 text-right">Say Tk=:</td>
              <td className="py-2 px-3 text-right font-mono text-xs text-slate-900 tabular-nums">
                Tk {Math.round(total).toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Official Words Box */}
      <div className="p-4 bg-slate-900 text-white rounded-lg space-y-1">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Bangladeshi Taka in Words (PW2-1 Tender Submission Format):
        </div>
        <div className="text-sm font-medium italic text-blue-200">
          {words}
        </div>
      </div>

      {/* Auto BOQ Extractor Modal */}
      <AutoBOQExtractorModal
        isOpen={isExtractorOpen}
        onClose={() => setIsExtractorOpen(false)}
        onApplyItems={(newItems, mode) => handleApplyExtracted(newItems, mode)}
        existingCount={items.length}
      />
    </div>
  );
};
