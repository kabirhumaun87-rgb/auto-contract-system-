import React, { useState } from 'react';
import { FileCheck, Search, Download, Printer, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import { GeneratedDocumentRecord, ContractProject } from '../types/contract';
import { formatBangladeshiCurrency } from '../utils/numberToWordsBangla';

interface GeneratedDocsViewProps {
  records: GeneratedDocumentRecord[];
  projects: ContractProject[];
  onPreviewProject: (project: ContractProject) => void;
}

export const GeneratedDocsView: React.FC<GeneratedDocsViewProps> = ({
  records,
  projects,
  onPreviewProject
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = records.filter(r =>
    r.contractNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Generated Documents Archive</h2>
          <p className="text-xs text-slate-500">Historical log of all generated DOCX, PDF, and CSV contract exports</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search generated files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4">Contract No</th>
              <th className="py-2.5 px-4">File Name</th>
              <th className="py-2.5 px-4 text-center">Format</th>
              <th className="py-2.5 px-4 text-center">Template Ver</th>
              <th className="py-2.5 px-4 text-right">Total Price</th>
              <th className="py-2.5 px-4">Generated At</th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No generated documents recorded yet. Create and export a contract in the Wizard to log it here.
                </td>
              </tr>
            ) : (
              filtered.map(r => {
                const matchedProject = projects.find(p => p.id === r.projectId);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {r.contractNo}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-800 font-medium">
                      {r.fileName}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.fileFormat === 'PDF' ? 'bg-red-100 text-red-800' :
                        r.fileFormat === 'DOCX' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.fileFormat}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono text-slate-600">
                      v{r.templateVersion}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums">
                      Tk {formatBangladeshiCurrency(r.totalPrice)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(r.generatedAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" /> {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {matchedProject && (
                        <button
                          onClick={() => onPreviewProject(matchedProject)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        >
                          View / Print
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
