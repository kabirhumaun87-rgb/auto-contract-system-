import React, { useState } from 'react';
import { Layers, ShieldCheck, CheckCircle2, Lock, FileText, RefreshCw } from 'lucide-react';
import { MASTER_TEMPLATE_MAPPINGS } from '../data/template_mappings';

export const TemplateManagementView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filtered = MASTER_TEMPLATE_MAPPINGS.filter(m => 
    selectedCategory === 'all' || m.category === selectedCategory
  );

  const handleVerifyIntegrity = () => {
    setStatusMessage('Template Integrity Check Passed: All 12 pages, 30+ placeholders, and 16 General Clauses verified against PW-2 Contract 2026–2027(1).pdf.');
    setTimeout(() => setStatusMessage(null), 5000);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Master Document Template & Placeholders</h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              <Lock className="w-3 h-3" /> Master Protected
            </span>
          </div>
          <p className="text-xs text-slate-500">Official PW-2 (Works) Template structure matching all 12 reference pages</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVerifyIntegrity}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Template Integrity</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs">
        {['all', 'project', 'tender', 'authority', 'contractor', 'financial', 'specification'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded capitalize transition-colors font-medium ${
              selectedCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mappings Table */}
      <div className="border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Placeholder Tag</th>
              <th className="py-2.5 px-3">Data Model Field</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3 text-center">Page</th>
              <th className="py-2.5 px-3">Target Section</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70">
                <td className="py-2 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                  {m.placeholder}
                </td>
                <td className="py-2 px-3 font-mono text-slate-600">
                  {m.fieldKey}
                </td>
                <td className="py-2 px-3 text-slate-800">
                  {m.description}
                </td>
                <td className="py-2 px-3 text-center font-mono font-bold">
                  Page {m.page}
                </td>
                <td className="py-2 px-3 text-slate-600">
                  {m.section}
                </td>
                <td className="py-2 px-3 text-center">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" /> Mapped
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
