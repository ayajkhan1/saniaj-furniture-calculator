import React from "react";
import {
  FolderPlus,
  FolderOpen,
  FileText,
  Package,
  Database,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
  Plus,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from "lucide-react";
import { AppState, Language } from "../types";
import { getText } from "../i18n/translations";
import { formatCurrency } from "../utils/calculator";

interface DashboardViewProps {
  state: AppState;
  setActiveTab: (tab: string) => void;
  onSelectProjectForQuote: (projectId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  setActiveTab,
  onSelectProjectForQuote,
}) => {
  const lang = state.settings.language;
  const curr = state.settings.currencySymbol;

  const totalQuotedValue = state.projects.reduce((acc, p) => acc + (p.grandTotal || 0), 0);
  const lowStockItems = state.hardwareDb.filter((hw) => hw.stockQty <= hw.minStockAlert);
  const pendingPayments = state.projects.filter((p) => p.paymentStatus !== "Paid");

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Card */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-amber-950 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-amber-700/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-700/50 dark:bg-amber-500/20 px-3 py-1 rounded-full text-amber-200 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Saniaj Furniture & Plywood Estimator v2.0</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getText("appTitle", lang)}
            </h2>
            <p className="text-amber-200/90 dark:text-slate-300 text-sm mt-1 max-w-xl">
              Complete offline-capable estimation, quotation, rate calculation, and stock manager for carpenters, designers & plywood contractors.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("new-project")}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition"
          >
            <FolderPlus className="w-5 h-5" />
            <span>{getText("newProject", lang)}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {getText("totalProjects", lang)}
            </p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {state.projects.length}
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
              {pendingPayments.length} Pending Payments
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {getText("totalQuoted", lang)}
            </p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(totalQuotedValue, curr)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Calculated automatically
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {getText("lowStockAlert", lang)}
            </p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {lowStockItems.length}
            </h3>
            <p className="text-xs text-rose-500 font-medium mt-0.5">
              {lowStockItems.length > 0 ? "Requires reordering" : "All stock good"}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            lowStockItems.length > 0 ? "bg-rose-100 dark:bg-rose-900/40 text-rose-600" : "bg-slate-100 dark:bg-slate-700 text-slate-500"
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {getText("activeCustomers", lang)}
            </p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {state.customers.length}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Plywood contractors & clients
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Hub Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center space-x-2">
          <span>Quick Actions</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveTab("new-project")}
            className="bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <FolderPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {getText("newProject", lang)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("saved-projects")}
            className="bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {getText("savedProjects", lang)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("quotation")}
            className="bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {getText("quotation", lang)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className="bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {getText("inventory", lang)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("admin-db")}
            className="bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {getText("adminPanel", lang)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ai-optimizer")}
            className="bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {getText("aiOptimizer", lang)}
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Projects & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>{getText("recentProjects", lang)}</span>
            </h3>
            <button
              onClick={() => setActiveTab("saved-projects")}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {state.projects.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
              <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No saved projects yet.</p>
              <button
                onClick={() => setActiveTab("new-project")}
                className="mt-3 text-xs text-amber-600 font-bold hover:underline"
              >
                + Create First Project
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {state.projects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 p-2 rounded-xl transition"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {project.projectName}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        project.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                      }`}>
                        {project.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Client: <span className="font-medium text-slate-700 dark:text-slate-300">{project.customer?.name}</span> ({project.customer?.mobile}) • {project.projectDate}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Items: {project.furnitureItems.map((f) => f.furnitureTypeName).join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 sm:self-center justify-between sm:justify-end">
                    <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                      {formatCurrency(project.grandTotal, curr)}
                    </span>
                    <button
                      onClick={() => {
                        onSelectProjectForQuote(project.id);
                        setActiveTab("quotation");
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:hover:bg-amber-800 dark:text-amber-200 rounded-lg transition flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Quote</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Widget */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>{getText("lowStockAlert", lang)}</span>
            </h3>
            <button
              onClick={() => setActiveTab("inventory")}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Manage Stock
            </button>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="text-center py-8 text-emerald-600 dark:text-emerald-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <p className="text-xs font-semibold">All hardware items are adequately stocked!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockItems.slice(0, 5).map((hw) => (
                <div
                  key={hw.id}
                  className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {hw.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Category: {hw.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400 block">
                      {hw.stockQty} {hw.unit}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Min: {hw.minStockAlert}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
