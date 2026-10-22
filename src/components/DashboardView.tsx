import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  FileEdit, 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  Search, 
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Copy,
  Printer
} from 'lucide-react';
import { ContractProject, GeneratedDocumentRecord } from '../types/contract';
import { formatBangladeshiCurrency } from '../utils/numberToWordsBangla';
import { NavigationTab } from './Sidebar';

interface DashboardViewProps {
  projects: ContractProject[];
  generatedDocs: GeneratedDocumentRecord[];
  searchQuery?: string;
  onNavigate: (tab: NavigationTab) => void;
  onEditProject: (project: ContractProject) => void;
  onPreviewProject: (project: ContractProject) => void;
  onDuplicateProject: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  generatedDocs,
  searchQuery = '',
  onNavigate,
  onEditProject,
  onPreviewProject,
  onDuplicateProject
}) => {
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  // Sync with global header search if provided
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Real statistics derived from actual data
  const totalContracts = projects.length;
  const draftContracts = projects.filter(p => p.status === 'draft').length;
  const completedDocsCount = generatedDocs.length;
  
  const currentMonthPrefix = new Date().toISOString().substring(0, 7);
  const generatedThisMonth = generatedDocs.filter(d => d.generatedAt.startsWith(currentMonthPrefix)).length;

  const totalQuotedValue = projects.reduce((acc, p) => acc + (p.totalContractPrice || 0), 0);

  const query = searchTerm.trim().toLowerCase();
  const filteredProjects = projects.filter(p => 
    !query ||
    p.contractNo.toLowerCase().includes(query) ||
    p.id?.toLowerCase().includes(query) ||
    p.nameOfWork.toLowerCase().includes(query) ||
    p.projectName.toLowerCase().includes(query) ||
    p.invitationRefNo?.toLowerCase().includes(query) ||
    (p.contractorName && p.contractorName.toLowerCase().includes(query))
  );

  return (
    <div className="space-y-6">
      {/* 5 Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Contracts</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalContracts}</div>
          <div className="text-[11px] text-slate-400 mt-1">Saved in database</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Drafts</span>
            <FileEdit className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{draftContracts}</div>
          <div className="text-[11px] text-slate-400 mt-1">Work in progress</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Generated Docs</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{completedDocsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">DOCX & PDF packages</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">This Month</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{generatedThisMonth}</div>
          <div className="text-[11px] text-slate-400 mt-1">Generated this cycle</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Quoted Value</span>
            <DollarSign className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums truncate">
            Tk {formatBangladeshiCurrency(totalQuotedValue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Aggregated BOQ pricing</div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold">Quick Actions</h2>
          <p className="text-xs text-slate-300">Fast access to contract operations and database management</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('create_contract')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Contract</span>
          </button>
          <button
            onClick={() => onNavigate('contractors')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 rounded transition-colors text-slate-200"
          >
            <span>Manage Contractors</span>
          </button>
          <button
            onClick={() => onNavigate('generated_docs')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 rounded transition-colors text-slate-200"
          >
            <span>Open Generated Docs</span>
          </button>
          <button
            onClick={() => onNavigate('backup')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 rounded transition-colors text-slate-200"
          >
            <span>Backup Database</span>
          </button>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Projects & Contracts</h2>
            <p className="text-xs text-slate-500">Live database records with BOQ valuation</p>
          </div>
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search CA No, title, or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">CA Number</th>
                <th className="py-2.5 px-4">Name of Work</th>
                <th className="py-2.5 px-4">Procuring Entity</th>
                <th className="py-2.5 px-4">Contractor</th>
                <th className="py-2.5 px-4 text-right">BOQ Total (Tk)</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No contracts found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-blue-700 whitespace-nowrap">
                      {p.contractNo}
                    </td>
                    <td className="py-2.5 px-4 max-w-xs truncate font-medium text-slate-800" title={p.nameOfWork}>
                      {p.nameOfWork}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                      {p.subDivision || p.procuringEntityName}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap max-w-[150px] truncate" title={p.contractorName}>
                      {p.contractorName || 'Not Assigned'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium text-slate-900 tabular-nums whitespace-nowrap">
                      {formatBangladeshiCurrency(p.totalContractPrice)}
                    </td>
                    <td className="py-2.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                        p.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                        p.status === 'generated' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreviewProject(p)}
                          title="View 12-Page PW-2 Document"
                          className="p-1 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicateProject(p.id)}
                          title="Duplicate Contract"
                          className="p-1 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditProject(p)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                        >
                          <span>Edit</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
