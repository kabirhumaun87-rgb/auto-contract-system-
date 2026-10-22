import React from 'react';
import { HelpCircle, FileText, CheckCircle, Terminal, HardDrive, Shield } from 'lucide-react';

interface HelpAboutViewProps {
  onOpenInstallModal?: () => void;
}

export const HelpAboutView: React.FC<HelpAboutViewProps> = ({ onOpenInstallModal }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-6 max-w-4xl text-xs text-slate-700">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">About Auto Contract System (Auto Contract System.exe)</h2>
          <p className="text-xs text-slate-500">Military Engineer Services (MES) PW-2 Works Contract Automation Platform</p>
        </div>
        <div className="flex items-center gap-2">
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>Install Desktop App</span>
            </button>
          )}
          <span className="font-mono bg-blue-50 text-blue-800 px-2.5 py-1 rounded border border-blue-200 font-bold">
            v1.0.0 (Production)
          </span>
        </div>
      </div>

      {/* Desktop Installation Section */}
      <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-emerald-600" />
          <span>Desktop Installation Guide</span>
        </h3>
        <p className="leading-relaxed">
          You can run and install <strong>Auto Contract System</strong> on your PC in two primary ways:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded space-y-2">
            <strong className="text-blue-700 font-bold block">Method 1: 1-Click Desktop App (PWA)</strong>
            <p className="text-[11px] text-slate-600">
              Open this app in <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>, then click the <strong>Install [⊕]</strong> icon on the right side of the URL bar (or Menu → "Save and share" → "Install page as app").
            </p>
            <ul className="text-[11px] text-slate-500 list-disc pl-4 space-y-0.5">
              <li>Opens in dedicated window without browser bars</li>
              <li>Adds Windows Desktop shortcut & Taskbar icon</li>
              <li>Works 100% offline with local browser storage</li>
            </ul>
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <span>Open Interactive Install Helper →</span>
              </button>
            )}
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded space-y-2">
            <strong className="text-emerald-700 font-bold block">Method 2: Windows Standalone .exe</strong>
            <p className="text-[11px] text-slate-600">
              The full native Python + PySide6 desktop application is in the <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">/desktop_app</code> directory:
            </p>
            <div className="p-2 bg-slate-950 text-emerald-400 font-mono text-[10px] rounded space-y-0.5">
              <div>cd desktop_app</div>
              <div>pip install -r requirements.txt pyinstaller</div>
              <div>build_windows.bat</div>
            </div>
            <p className="text-[10px] text-slate-500">
              Produces standalone <strong className="font-mono">Auto Contract System.exe</strong> inside <code className="font-mono">desktop_app/dist/</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="space-y-2">
        <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Purpose & Reference Architecture</span>
        </h3>
        <p className="leading-relaxed">
          <strong>Auto Contract System</strong> automatically generates completed, compliant Bangladesh government and Military Engineer Services (MES) works contract packages based on the standard approved <strong>PW-2 Contract 2026–2027</strong> template.
        </p>
        <p className="leading-relaxed">
          The application preserves the exact layout, clauses, declarations, tables, and typography of the 12-page reference document, including:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li><strong>Page 1:</strong> Automatic Contract System Master Sheet (19 variables & store parameters)</li>
          <li><strong>Page 2:</strong> Official Bengali Tender Forwarding Letter (সীমিত, Kartik 1433, Memo 6001, Nikosh font)</li>
          <li><strong>Page 3:</strong> 25-Point Invitation for Tenders (IFT) Form & Dispatch Notice</li>
          <li><strong>Page 4:</strong> Standard Tender Document PW-2 National Works Cover Page</li>
          <li><strong>Page 5:</strong> Section 2 - Tender Data Sheet (ITT 1.1, 3.1, 4.1, 7.1, 8.1(a), 8.1(b))</li>
          <li><strong>Page 6:</strong> Section 4 - Particular Conditions of Contract (GCC 1.1, 3.1, 5.1, 10.1, 11.1, 12.1, 19.2)</li>
          <li><strong>Page 7:</strong> Form PW2-1 - Tender Submission Letter with Taka in figures and words</li>
          <li><strong>Page 8:</strong> Section 6 - Guidance Notes on Bill of Quantities & mandatory error certification</li>
          <li><strong>Page 9:</strong> Section 6 - Priced Schedule of Works with 7-column technical specifications</li>
          <li><strong>Page 10:</strong> Section 7 - General Specifications (16 clauses, MES Schedule of Rates 2016, Water Charges, MB BAFW-2261)</li>
          <li><strong>Page 11:</strong> Section 8 - Particular Specifications cross-reference</li>
          <li><strong>Page 12:</strong> Section 9 - Drawings declaration (Nil / Attached status)</li>
        </ul>
      </div>

      {/* Discrepancy Detection */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Automated Inconsistency Audit Engine</span>
        </h3>
        <p className="leading-relaxed">
          The system actively flags and guards against document anomalies observed in standard reference papers:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <strong>Completion Period Check:</strong> Warns when Cover page (7 days) conflicts with GCC Clause 11.1 (15 days).
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <strong>Fiscal Year Check:</strong> Verifies Contract Agreement Number (e.g. 2026-2027) matches running headers (2025-2026).
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <strong>Drawing Status Sync:</strong> Confirms consistency between Page 1 (-Attached-') and Page 12 (Nil).
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <strong>Bangladeshi Taka in Words:</strong> Validates that the legal words match the exact decimal arithmetic total.
          </div>
        </div>
      </div>

      {/* Security & Reliability */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
        <div>100% Offline Capability — Zero External Cloud API Dependencies</div>
        <div>Compliant with PPA 2006 & PPR 2008</div>
      </div>
    </div>
  );
};
