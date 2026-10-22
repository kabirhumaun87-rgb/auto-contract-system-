import React, { useState, useRef, useEffect } from 'react';
import { Plus, Printer, Search, X, FileText, ArrowRight, Eye, Building2, Hash, Monitor, Sparkles } from 'lucide-react';
import { NavigationTab } from './Sidebar';
import { ContractProject } from '../types/contract';
import { formatBangladeshiCurrency } from '../utils/numberToWordsBangla';

interface HeaderProps {
  activeTab: NavigationTab;
  projects: ContractProject[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewContract: () => void;
  onSelectProject: (project: ContractProject) => void;
  onPreviewProject: (project: ContractProject) => void;
  onPrintPreview?: () => void;
  canPrint?: boolean;
  onOpenInstallGuide?: () => void;
  onOpenChat?: () => void;
}

const TAB_TITLES: Record<NavigationTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of works contracts, procurement statistics, and active drafts' },
  create_contract: { title: 'Contract Creation Wizard', subtitle: '8-step automated PW-2 contract and tender formulation' },
  all_contracts: { title: 'All Contracts', subtitle: 'Search, manage, duplicate, and validate saved MES contracts' },
  contractors: { title: 'Contractor Database', subtitle: 'MES enlisted contractors, DGFI security clearance, and tax records' },
  boq_editor: { title: 'Bill of Quantities (BOQ)', subtitle: 'Priced schedule of works, unit rate calculations, and Say Tk totals' },
  gemini_chat: { title: 'Gemini AI Chatbot', subtitle: 'Multi-turn engineering, BOQ calculation & legal contract advisor' },
  templates: { title: 'Document Templates', subtitle: 'Master PW-2 12-page template mappings and variable placeholders' },
  generated_docs: { title: 'Generated Documents', subtitle: 'Audit log of generated DOCX, PDF, and CSV contract packages' },
  backup: { title: 'Backup & Restore', subtitle: 'Local database snapshot, export, and disaster recovery' },
  settings: { title: 'System Settings', subtitle: 'Procuring entity defaults, currency formatting, and officer credentials' },
  help: { title: 'Help & Reference', subtitle: 'PW-2 documentation, PPA 2006/PPR 2008 guidelines, and offline guide' }
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  projects,
  searchQuery,
  onSearchChange,
  onNewContract,
  onSelectProject,
  onPreviewProject,
  onPrintPreview,
  canPrint,
  onOpenInstallGuide,
  onOpenChat
}) => {
  const current = TAB_TITLES[activeTab];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsDropdownOpen(true);
      } else if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter projects by Name of Work, Contract ID / CA No, or Contractor Name across all views
  const trimmed = searchQuery.trim().toLowerCase();
  const searchResults = trimmed
    ? projects.filter(p => {
        const nameMatch = p.nameOfWork?.toLowerCase().includes(trimmed) || p.projectName?.toLowerCase().includes(trimmed);
        const idMatch = p.contractNo?.toLowerCase().includes(trimmed) || p.id?.toLowerCase().includes(trimmed) || p.invitationRefNo?.toLowerCase().includes(trimmed);
        const contractorMatch = p.contractorName?.toLowerCase().includes(trimmed);
        return nameMatch || idMatch || contractorMatch;
      })
    : [];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-6 shrink-0 relative z-40">
      {/* Zone 1: Breadcrumb & Title */}
      <div className="shrink-0 max-w-[260px] lg:max-w-xs overflow-hidden">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Auto Contract System</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-800">{current.title}</span>
        </div>
        <h1 className="text-sm font-bold text-slate-900 truncate leading-tight">{current.subtitle}</h1>
      </div>

      {/* Zone 2: Global Search Bar */}
      <div ref={searchContainerRef} className="flex-1 max-w-xl relative">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => {
              if (searchQuery.trim()) setIsDropdownOpen(true);
            }}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsDropdownOpen(true);
            }}
            placeholder="Search projects by name, CA ID, or contractor... (Ctrl+K)"
            className="w-full pl-9 pr-14 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-800 placeholder-slate-400"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsDropdownOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-200/70 border border-slate-300 rounded px-1.5 py-0.5">
                Ctrl K
              </kbd>
            )}
          </div>
        </div>

        {/* Global Search Results Dropdown */}
        {isDropdownOpen && trimmed.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium">
                Found <strong className="text-slate-800 font-mono">{searchResults.length}</strong> matching contracts
              </span>
              <span className="text-[10px]">Filter by: Name · CA ID · Contractor</span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No contracts found matching <strong className="text-slate-800">"{searchQuery}"</strong>.
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        onNewContract();
                        setIsDropdownOpen(false);
                      }}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      + Create new contract with this title
                    </button>
                  </div>
                </div>
              ) : (
                searchResults.map(p => (
                  <div
                    key={p.id}
                    className="p-3 hover:bg-blue-50/60 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                          {p.contractNo}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          p.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.status}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                          Tk {formatBangladeshiCurrency(p.totalContractPrice)}
                        </span>
                      </div>
                      <div className="font-medium text-xs text-slate-800 truncate" title={p.nameOfWork}>
                        {p.nameOfWork}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 truncate max-w-[200px]" title={p.contractorName}>
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{p.contractorName || 'No Contractor'}</span>
                        </span>
                        <span>·</span>
                        <span className="truncate">{p.subDivision || p.procuringEntityName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onPreviewProject(p);
                          setIsDropdownOpen(false);
                        }}
                        title="Quick Preview 12-Page Contract"
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 rounded transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectProject(p);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 rounded transition-all shadow-2xs"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Zone 3: Primary Action buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        {onOpenChat && (
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors whitespace-nowrap shadow-2xs"
            title="Open Gemini AI Chatbot"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Gemini AI</span>
          </button>
        )}
        {onOpenInstallGuide && (
          <button
            onClick={onOpenInstallGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded transition-colors whitespace-nowrap shadow-2xs"
            title="Install Auto Contract System on your Desktop (Windows / Mac / Linux)"
          >
            <Monitor className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Install Desktop App</span>
            <span className="sm:hidden">Install</span>
          </button>
        )}
        {canPrint && onPrintPreview && (
          <button
            onClick={onPrintPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Print 12-Page Contract</span>
            <span className="md:hidden">Print</span>
          </button>
        )}
        <button
          onClick={onNewContract}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Contract</span>
        </button>
      </div>
    </header>
  );
};
