import React, { useState } from 'react';
import { DatabaseBackup, Download, Upload, CheckCircle2, AlertTriangle, History } from 'lucide-react';
import { StorageService } from '../services/storage';
import { AuditLog } from '../types/contract';

interface BackupRestoreViewProps {
  onRefreshData: () => void;
}

export const BackupRestoreView: React.FC<BackupRestoreViewProps> = ({ onRefreshData }) => {
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const auditLogs = StorageService.getAuditLogs();

  const handleDownloadBackup = () => {
    try {
      const json = StorageService.exportFullBackupJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `AutoContractSystem_Backup_${timestamp}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: `Backup created and downloaded successfully (${(blob.size / 1024).toFixed(1)} KB).` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed to create backup: ${err.message}` });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importFullBackupJson(content);
      if (success) {
        setStatusMessage({ type: 'success', text: 'Database restored successfully! All contracts, contractors, and logs updated.' });
        onRefreshData();
      } else {
        setStatusMessage({ type: 'error', text: 'Invalid or corrupt backup JSON file.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Database Backup & Disaster Recovery</h2>
          <p className="text-xs text-slate-500">Safeguard all contract drafts, BOQ pricing, and contractor records with portable backups</p>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded text-xs flex items-center gap-2 ${
            statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Export Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-sm text-slate-900 mb-1">Export Database Snapshot</div>
              <div className="text-xs text-slate-500">
                Exports all SQLite/local database tables, contracts, BOQ line items, contractors, and logs into a single structured JSON archive.
              </div>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="w-full py-2 px-3 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Database Backup</span>
            </button>
          </div>

          {/* Import Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-sm text-slate-900 mb-1">Restore from Backup</div>
              <div className="text-xs text-slate-500">
                Restore contracts and database records from a previously exported backup file. Pre-verifies structure before replacing records.
              </div>
            </div>
            <label className="w-full py-2 px-3 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Select Backup File to Restore</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <History className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900">Database Audit & Event Log</h3>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Action</th>
                <th className="py-2 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-slate-500 font-sans">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70 text-[11px]">
                    <td className="py-1.5 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-1.5 px-3 font-bold text-blue-700 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-1.5 px-3 text-slate-800 font-sans">
                      {log.details}
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
