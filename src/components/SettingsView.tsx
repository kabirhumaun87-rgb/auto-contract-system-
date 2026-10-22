import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    defaultMinistry: 'Ministry of Defence',
    defaultAgency: 'Military Engineer Services (Army)',
    defaultProcuringEntity: 'GE (Army) South, Dhaka',
    defaultDistrict: 'Dhaka',
    defaultSubDivision: 'SDO I/C Postogola',
    militaryTelPrefix: 'Mil : 4144',
    defaultCurrency: 'BDT (Taka)',
    roundingRule: 'Round line item amounts to 2 decimals, Say Tk= rounded to nearest integer',
    defaultScheduleOfRates: 'MES Schedule of Rates 2016 (Amended to date)',
    measurementBookFormat: 'BAFW-2261',
    waterChargesRate: '31 paisa per 100 Taka whole cost',
    opcCementRate: 12.20,
    pccCementRate: 11.80,
    paperSize: 'Legal 8.5" x 14" (215.9mm x 355.6mm)'
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-sm font-bold text-slate-900">Application & Procurement Settings</h2>
        <p className="text-xs text-slate-500">Configure default Military Engineer Services procurement station parameters</p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Default Ministry / Division</label>
            <input
              type="text"
              value={settings.defaultMinistry}
              onChange={(e) => setSettings({ ...settings, defaultMinistry: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Default Agency</label>
            <input
              type="text"
              value={settings.defaultAgency}
              onChange={(e) => setSettings({ ...settings, defaultAgency: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Default Procuring Entity Office</label>
            <input
              type="text"
              value={settings.defaultProcuringEntity}
              onChange={(e) => setSettings({ ...settings, defaultProcuringEntity: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Military Exchange Extension</label>
            <input
              type="text"
              value={settings.militaryTelPrefix}
              onChange={(e) => setSettings({ ...settings, militaryTelPrefix: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Standard Schedule of Rates</label>
            <input
              type="text"
              value={settings.defaultScheduleOfRates}
              onChange={(e) => setSettings({ ...settings, defaultScheduleOfRates: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Measurement Book Code</label>
            <input
              type="text"
              value={settings.measurementBookFormat}
              onChange={(e) => setSettings({ ...settings, measurementBookFormat: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Default OPC Cement Rate (Tk/Kg)</label>
            <input
              type="number"
              step="0.01"
              value={settings.opcCementRate}
              onChange={(e) => setSettings({ ...settings, opcCementRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Default PCC Cement Rate (Tk/Kg)</label>
            <input
              type="number"
              step="0.01"
              value={settings.pccCementRate}
              onChange={(e) => setSettings({ ...settings, pccCementRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Standard Print Paper Size</label>
            <input
              type="text"
              readOnly
              value={settings.paperSize}
              className="w-full px-3 py-1.5 border border-slate-300 rounded bg-slate-50 font-mono font-medium text-blue-700"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Financial Currency Rounding Policy</label>
            <input
              type="text"
              value={settings.roundingRule}
              onChange={(e) => setSettings({ ...settings, roundingRule: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-200">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
