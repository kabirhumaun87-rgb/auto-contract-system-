import React from 'react';
import { 
  LayoutDashboard, 
  FilePlus, 
  FileText, 
  Users, 
  Calculator, 
  Layers, 
  FileCheck, 
  DatabaseBackup, 
  Settings, 
  HelpCircle,
  ShieldAlert,
  Monitor,
  Bot,
  Sparkles
} from 'lucide-react';

export type NavigationTab = 
  | 'dashboard'
  | 'create_contract'
  | 'all_contracts'
  | 'contractors'
  | 'boq_editor'
  | 'gemini_chat'
  | 'templates'
  | 'generated_docs'
  | 'backup'
  | 'settings'
  | 'help';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  draftCount: number;
  onOpenInstallGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onSelectTab, 
  draftCount,
  onOpenInstallGuide 
}) => {
  const menuItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create_contract', label: 'Create New Contract', icon: FilePlus, badge: draftCount > 0 ? draftCount : undefined },
    { id: 'all_contracts', label: 'All Contracts', icon: FileText },
    { id: 'contractors', label: 'Contractor Database', icon: Users },
    { id: 'gemini_chat', label: 'Gemini Chatbot', icon: Bot, badge: 'AI' },
    { id: 'templates', label: 'Document Templates', icon: Layers },
    { id: 'generated_docs', label: 'Generated Documents', icon: FileCheck },
    { id: 'backup', label: 'Backup & Restore', icon: DatabaseBackup },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & About', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
          ACS
        </div>
        <div className="overflow-hidden">
          <div className="font-bold text-sm tracking-tight text-white whitespace-nowrap">Auto Contract System</div>
          <div className="text-xs text-slate-400 whitespace-nowrap">MES PW-2 Automation</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors text-left ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-blue-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Status Bar & Desktop Install */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
        {onOpenInstallGuide && (
          <button
            onClick={onOpenInstallGuide}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 hover:border-emerald-500 text-emerald-300 rounded text-xs font-semibold transition-all shadow-xs"
          >
            <Monitor className="w-3.5 h-3.5 text-emerald-400" />
            <span>Install on Desktop</span>
          </button>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300 font-mono">Offline Local Ready</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">v1.0.0</span>
        </div>
        <div className="text-slate-500 text-[10px]">MES Schedule 2016 / PW-2 v1.0</div>
      </div>
    </aside>
  );
};
