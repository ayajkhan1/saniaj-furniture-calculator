import React from "react";
import {
  Calculator,
  FolderPlus,
  FolderOpen,
  FileText,
  Package,
  Users,
  BarChart2,
  Settings as SettingsIcon,
  Database,
  Moon,
  Sun,
  Globe,
  Sparkles,
  AlertTriangle,
  HardDrive
} from "lucide-react";
import { Language } from "../types";
import { getText } from "../i18n/translations";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  lowStockCount: number;
  projectCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  lowStockCount,
}) => {
  const navItems = [
    { id: "dashboard", label: getText("dashboard", language), icon: Calculator },
    { id: "new-project", label: getText("newProject", language), icon: FolderPlus, highlight: true },
    { id: "saved-projects", label: getText("savedProjects", language), icon: FolderOpen },
    { id: "quotation", label: getText("quotation", language), icon: FileText },
    { id: "inventory", label: getText("inventory", language), icon: Package, badge: lowStockCount },
    { id: "admin-db", label: getText("adminPanel", language), icon: Database },
    { id: "ai-optimizer", label: getText("aiOptimizer", language), icon: Sparkles },
    { id: "reports", label: getText("reports", language), icon: BarChart2 },
    { id: "settings", label: getText("settings", language), icon: SettingsIcon },
  ];

  return (
    <header className="bg-amber-900 dark:bg-slate-900 text-white shadow-lg sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 dark:bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-md transform group-hover:scale-105 transition">
              S
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-amber-50 leading-tight">
                {getText("appTitle", language)}
              </h1>
              <p className="text-xs text-amber-200/80 font-medium hidden sm:block">
                Carpenters & Plywood Contractors Hub
              </p>
            </div>
          </div>

          {/* Quick Actions & Preferences */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector */}
            <div className="relative flex items-center bg-amber-950/60 dark:bg-slate-800 rounded-lg p-1 border border-amber-700/40 dark:border-slate-700">
              <Globe className="w-4 h-4 text-amber-300 ml-1.5 mr-1 hidden sm:inline" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-amber-100 dark:text-slate-200 focus:outline-none cursor-pointer py-1 px-1.5"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="bn" className="bg-slate-900 text-white">বাংলা</option>
                <option value="hi" className="bg-slate-900 text-white">हिन्दी</option>
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-lg bg-amber-950/60 dark:bg-slate-800 hover:bg-amber-800/60 dark:hover:bg-slate-700 text-amber-200 transition border border-amber-700/40 dark:border-slate-700"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Material Scrollable Nav Tabs */}
      <div className="bg-amber-950/80 dark:bg-slate-950/90 border-t border-amber-800/40 dark:border-slate-800 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-2 flex space-x-1 sm:space-x-2 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  isActive
                    ? "bg-amber-600 text-white shadow-md font-semibold dark:bg-amber-600"
                    : item.highlight
                    ? "bg-amber-700/60 hover:bg-amber-600/80 text-amber-100"
                    : "text-amber-200/90 hover:bg-amber-900/60 dark:hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-bold animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
