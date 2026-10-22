import React, { useState, useEffect } from 'react';
import { 
  X, 
  Monitor, 
  Download, 
  Terminal, 
  CheckCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  WifiOff, 
  Laptop,
  FolderArchive,
  ArrowRight
} from 'lucide-react';

interface InstallDesktopModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onTriggerInstallPrompt: () => void;
  isInstallable: boolean;
}

export const InstallDesktopModal: React.FC<InstallDesktopModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstallPrompt,
  isInstallable
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'exe' | 'offline'>('pwa');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-inner">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Install Auto Contract System on Desktop</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono font-medium px-2 py-0.5 rounded border border-blue-400/30">
                  Windows / Mac / Linux
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Run as a native desktop app with offline capability and desktop shortcut
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'pwa'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Option 1: 1-Click Desktop App (Recommended)</span>
          </button>
          <button
            onClick={() => setActiveTab('exe')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'exe'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-600" />
            <span>Option 2: Windows Standalone .exe</span>
          </button>
          <button
            onClick={() => setActiveTab('offline')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'offline'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Laptop className="w-4 h-4 text-purple-600" />
            <span>Option 3: Run Locally (Node.js)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: 1-CLICK DESKTOP APP (PWA) */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-md shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">Fastest & Recommended Method</h3>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Installs the application directly onto your Windows Desktop as a standalone window. It gets its own desktop icon, starts from the Windows Start menu or Taskbar, and requires <strong>zero installation files or software</strong>.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1 text-[11px] font-medium text-blue-900">
                    <span className="flex items-center gap-1"><WifiOff className="w-3.5 h-3.5 text-blue-600" /> Works 100% Offline</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Zero Cloud Dependency</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-blue-600" /> Auto-updates</span>
                  </div>
                </div>
              </div>

              {/* Direct Install Button if supported */}
              {isInstallable && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-900 block text-xs">Your browser supports 1-Click Install</span>
                    <span className="text-[11px] text-emerald-700">Click below to add Auto Contract System to your Desktop immediately</span>
                  </div>
                  <button
                    onClick={onTriggerInstallPrompt}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors text-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install Desktop App Now</span>
                  </button>
                </div>
              )}

              {/* Step by step instructions for Chrome & Edge */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  How to install in 2 clicks (Google Chrome, Microsoft Edge, or Brave):
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 space-y-2">
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                      <span>From Address Bar (Fastest)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Look at the right side of your browser URL/address bar:
                    </p>
                    <div className="bg-white p-2 rounded border border-slate-200 text-center font-mono text-[11px] text-slate-700 flex items-center justify-center gap-2">
                      <span>Click the</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-bold">⊕</span>
                      <span>or</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-bold">💻 [Install]</span>
                      <span>icon</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Confirm by clicking <strong>Install</strong> in the popup prompt.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 space-y-2">
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                      <span>From Browser Menu (⋮)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      If the address bar icon isn't visible:
                    </p>
                    <div className="bg-white p-2 rounded border border-slate-200 text-[11px] text-slate-700 space-y-1">
                      <div>• <strong>Chrome:</strong> Click <strong>⋮ (Menu)</strong> → <strong>Save and share</strong> → <strong>Install Auto Contract System...</strong></div>
                      <div>• <strong>Edge:</strong> Click <strong>⋯ (Menu)</strong> → <strong>Apps</strong> → <strong>Install this site as an app</strong></div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 space-y-1">
                  <strong>Pin to Taskbar & Desktop Shortcut:</strong>
                  <p>When installation completes, Windows will ask <em>"Pin to taskbar?"</em> and <em>"Pin to Start?"</em>. Check both boxes to have one-click access right from your Windows desktop anytime, even without an active internet connection!</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STANDALONE WINDOWS .EXE */}
          {activeTab === 'exe' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                  <Terminal className="w-5 h-5 text-emerald-600" />
                  <span>Native Windows Executable: Auto Contract System.exe</span>
                </div>
                <p className="text-emerald-900 leading-relaxed text-xs">
                  The codebase contains a full native Python + PySide6 (Qt) desktop application located in the <strong>`/desktop_app`</strong> folder. It packages into a single standalone <strong>`.exe`</strong> file with an embedded SQLite database and offline document generators.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Build Auto Contract System.exe on your Windows PC:
                </h4>

                {/* Step 1 */}
                <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Step 1: Open Command Prompt or PowerShell in the desktop_app folder</span>
                    <button
                      onClick={() => copyToClipboard('cd desktop_app', 1)}
                      className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800"
                    >
                      {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 text-emerald-400 p-2.5 rounded font-mono text-[11px] overflow-x-auto">
                    cd desktop_app
                  </pre>
                </div>

                {/* Step 2 */}
                <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Step 2: Install required Python dependencies</span>
                    <button
                      onClick={() => copyToClipboard('pip install -r requirements.txt\npip install pyinstaller', 2)}
                      className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800"
                    >
                      {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 text-emerald-400 p-2.5 rounded font-mono text-[11px] overflow-x-auto">
                    pip install -r requirements.txt{'\n'}pip install pyinstaller
                  </pre>
                </div>

                {/* Step 3 */}
                <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Step 3: Run the automated Windows build script</span>
                    <button
                      onClick={() => copyToClipboard('build_windows.bat', 3)}
                      className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800"
                    >
                      {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 3 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 text-emerald-400 p-2.5 rounded font-mono text-[11px] overflow-x-auto">
                    build_windows.bat
                  </pre>
                  <p className="text-[11px] text-slate-500">
                    Or run PyInstaller directly: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">pyinstaller --noconfirm --clean auto_contract.spec</code>
                  </p>
                </div>

                {/* Output */}
                <div className="p-3 bg-slate-100 border border-slate-300 rounded text-[11px] text-slate-800 space-y-1">
                  <strong className="text-slate-900">Output Location:</strong>
                  <div className="font-mono text-blue-700 bg-white p-2 rounded border border-slate-200 font-bold select-all">
                    desktop_app\dist\Auto Contract System.exe
                  </div>
                  <p className="text-slate-600">
                    Double-click <strong>Auto Contract System.exe</strong> to run. You can move this file anywhere (such as your Desktop or USB drive) and run it without requiring Python installed!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RUN LOCALLY VIA NODE.JS */}
          {activeTab === 'offline' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-1">
                <div className="flex items-center gap-2 font-bold text-purple-950 text-sm">
                  <Laptop className="w-5 h-5 text-purple-600" />
                  <span>Run Web Version Locally with Node.js</span>
                </div>
                <p className="text-purple-900 leading-relaxed text-xs">
                  You can also run this complete Vite + React web interface on your local computer server on port 3000.
                </p>
              </div>

              <div className="space-y-3">
                <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">In the project root directory:</span>
                    <button
                      onClick={() => copyToClipboard('npm install\nnpm run dev', 4)}
                      className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800"
                    >
                      {copiedIndex === 4 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 4 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 text-purple-300 p-2.5 rounded font-mono text-[11px] overflow-x-auto">
                    npm install{'\n'}npm run dev
                  </pre>
                  <p className="text-[11px] text-slate-600">
                    Open <strong className="text-blue-600">http://localhost:3000</strong> in your browser. All contract records, templates, and BOQs will be securely saved in your browser's local storage.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Client-Side / Offline Capable • PPA 2006 & PPR 2008 Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
