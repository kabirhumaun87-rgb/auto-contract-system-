import React, { useState, useEffect } from 'react';
import { Search, Plus, Printer, Copy, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { ContractProject, ContractStatus } from '../types/contract';
import { formatBangladeshiCurrency } from '../utils/numberToWordsBangla';

interface AllContractsViewProps {
  projects: ContractProject[];
  searchQuery?: string;
  onNewContract: () => void;
  onEditContract: (project: ContractProject) => void;
  onPreviewContract: (project: ContractProject) => void;
  onDuplicateContract: (id: string) => void;
  onDeleteContract: (id: string) => void;
}

export const AllContractsView: React.FC<AllContractsViewProps> = ({
  projects,
  searchQuery = '',
  onNewContract,
  onEditContract,
  onPreviewContract,
  onDuplicateContract,
  onDeleteContract
}) => {
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const query = searchTerm.trim().toLowerCase();
  const filtered = projects.filter(p => {
    const matchesSearch = 
      !query ||
      p.contractNo.toLowerCase().includes(query) ||
      p.id?.toLowerCase().includes(query) ||
      p.nameOfWork.toLowerCase().includes(query) ||
      p.projectName.toLowerCase().includes(query) ||
      p.invitationRefNo.toLowerCase().includes(query) ||
      (p.contractorName && p.contractorName.toLowerCase().includes(query));
    
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm space-y-4 p-4">
      {/* Header & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search CA No, title, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            {['all', 'draft', 'generated'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded transition-colors uppercase ${
                  statusFilter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onNewContract}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Contract</span>
        </button>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4">CA Number</th>
              <th className="py-2.5 px-4">Invitation Ref No</th>
              <th className="py-2.5 px-4 min-w-[240px]">Name of Work</th>
              <th className="py-2.5 px-4">Contractor</th>
              <th className="py-2.5 px-4 text-right">BOQ Total</th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No contracts found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {p.contractNo}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {p.invitationRefNo}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800 max-w-sm truncate" title={p.nameOfWork}>
                    {p.nameOfWork}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 max-w-[150px] truncate" title={p.contractorName}>
                    {p.contractorName || 'Unassigned'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-medium text-slate-900 tabular-nums whitespace-nowrap">
                    Tk {formatBangladeshiCurrency(p.totalContractPrice)}
                  </td>
                  <td className="py-2.5 px-4 text-center whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPreviewContract(p)}
                        title="Print / View 12 Pages"
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDuplicateContract(p.id)}
                        title="Duplicate Contract"
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditContract(p)}
                        title="Edit in Wizard"
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        title="Delete"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-sm text-slate-900">Confirm Contract Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this contract record from the local database? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteContract(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
              >
                Delete Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
