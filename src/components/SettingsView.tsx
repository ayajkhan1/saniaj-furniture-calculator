import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Save,
  HardDriveDownload,
  HardDriveUpload,
  Building,
  CheckCircle,
  FileText,
  DollarSign,
  Globe,
  Moon,
  Sun
} from "lucide-react";
import { AppState, CompanyProfile, Language } from "../types";
import { getText } from "../i18n/translations";
import { exportBackupJson, importBackupJson } from "../lib/storage";

interface SettingsViewProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  darkMode: boolean;
  setLanguage: (lang: Language) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onUpdateState,
  setDarkMode,
  darkMode,
  setLanguage,
}) => {
  const lang = state.settings.language;

  const [company, setCompany] = useState<CompanyProfile>(state.companyProfile);
  const [currencySymbol, setCurrencySymbol] = useState<string>(state.settings.currencySymbol);
  const [defaultWaste, setDefaultWaste] = useState<number>(state.settings.defaultWastePercentage);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSaveSettings = () => {
    onUpdateState((prev) => ({
      ...prev,
      companyProfile: company,
      settings: {
        ...prev.settings,
        currencySymbol,
        defaultWastePercentage: defaultWaste,
      },
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonStr = event.target?.result as string;
        const imported = importBackupJson(jsonStr);
        if (imported) {
          onUpdateState(() => imported);
          alert("Database successfully restored from JSON backup!");
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Failed to parse backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <SettingsIcon className="w-6 h-6 text-amber-600" />
            <span>{getText("settings", lang)} & Company Profile</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customize company details, default rates, quotation header, backup database, and language.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center space-x-1.5 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
        >
          {saveSuccess ? <CheckCircle className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? "Saved!" : "Save Settings"}</span>
        </button>
      </div>

      {/* Company Profile Settings */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-2">
          <Building className="w-4 h-4" />
          <span>Company & Workshop Branding</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Carpenter Workshop Name</label>
            <input
              type="text"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tagline / Business Subtitle</label>
            <input
              type="text"
              value={company.tagline}
              onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone / Mobile Number</label>
            <input
              type="text"
              value={company.phone}
              onChange={(e) => setCompany({ ...company, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input
              type="text"
              value={company.email}
              onChange={(e) => setCompany({ ...company, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Workshop & Office Address</label>
            <input
              type="text"
              value={company.address}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GSTIN Number (Optional)</label>
            <input
              type="text"
              value={company.gstin || ""}
              onChange={(e) => setCompany({ ...company, gstin: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Authorized Signatory Name</label>
            <input
              type="text"
              value={company.authorizedSignatoryName}
              onChange={(e) => setCompany({ ...company, authorizedSignatoryName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Default Quotation Terms */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-2">
          <FileText className="w-4 h-4" />
          <span>Default Quotation Terms & Conditions</span>
        </h3>

        <textarea
          rows={4}
          value={company.defaultTerms}
          onChange={(e) => setCompany({ ...company, defaultTerms: e.target.value })}
          className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono leading-relaxed"
        />
      </div>

      {/* App Preferences & Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-2">
            <Globe className="w-4 h-4" />
            <span>Preferences & Currency</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Default Material Waste %</label>
              <input
                type="number"
                value={defaultWaste}
                onChange={(e) => setDefaultWaste(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Data Backup & Restore */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-2">
            <HardDriveDownload className="w-4 h-4" />
            <span>Backup & Restore Database</span>
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export all saved furniture projects, customer lists, and custom database sizes into a JSON backup file.
          </p>

          <div className="flex flex-col space-y-2 pt-2">
            <button
              onClick={() => exportBackupJson(state)}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md transition"
            >
              <HardDriveDownload className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>

            <label className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition">
              <HardDriveUpload className="w-4 h-4" />
              <span>Restore Data From File</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
