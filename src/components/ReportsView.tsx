import React from "react";
import {
  BarChart2,
  TrendingUp,
  DollarSign,
  Download,
  Users,
  CheckCircle,
  Clock
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { AppState } from "../types";
import { getText } from "../i18n/translations";
import { formatCurrency } from "../utils/calculator";

interface ReportsViewProps {
  state: AppState;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ state }) => {
  const lang = state.settings.language;
  const curr = state.settings.currencySymbol;

  const totalRevenue = state.projects.reduce((acc, p) => acc + (p.grandTotal || 0), 0);
  const totalProfit = state.projects.reduce((acc, p) => acc + (p.profitAmount || 0), 0);
  const totalAdvance = state.projects.reduce((acc, p) => acc + (p.advancePayment || 0), 0);
  const totalOutstanding = Math.max(0, totalRevenue - totalAdvance);

  // Chart Data: Projects Financial Breakdown
  const projectChartData = state.projects.map((p) => ({
    name: p.projectName.length > 12 ? p.projectName.substring(0, 12) + "..." : p.projectName,
    Material: p.totalMaterialCost || 0,
    Labour: p.totalLabourCost || 0,
    Profit: p.profitAmount || 0,
    Total: p.grandTotal || 0,
  }));

  // Pie Data: Furniture Types distribution
  const typeCounts: Record<string, number> = {};
  state.projects.forEach((p) => {
    p.furnitureItems.forEach((f) => {
      typeCounts[f.furnitureTypeName] = (typeCounts[f.furnitureTypeName] || 0) + 1;
    });
  });

  const pieColors = ["#d97706", "#2563eb", "#059669", "#7c3aed", "#e11d48", "#0891b2"];
  const pieData = Object.keys(typeCounts).map((key, i) => ({
    name: key,
    value: typeCounts[key],
    color: pieColors[i % pieColors.length],
  }));

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <BarChart2 className="w-6 h-6 text-amber-600" />
            <span>Business Reports & Financial Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time breakdown of revenue, material expenditure, profits, and client pending balances.
          </p>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Quoted Revenue</p>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{formatCurrency(totalRevenue, curr)}</h3>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Estimated Profit</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(totalProfit, curr)}</h3>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Advance Collected</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">{formatCurrency(totalAdvance, curr)}</h3>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Outstanding Balance</p>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{formatCurrency(totalOutstanding, curr)}</h3>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Project Cost & Profit Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="Material" fill="#d97706" stackId="a" />
                <Bar dataKey="Labour" fill="#2563eb" stackId="a" />
                <Bar dataKey="Profit" fill="#059669" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Furniture Types Distribution
          </h3>
          {pieData.length === 0 ? (
            <p className="text-xs text-slate-400 py-12 text-center">No project items available.</p>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 text-[10px] justify-center mt-2">
                {pieData.map((d) => (
                  <span key={d.name} className="flex items-center space-x-1 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span>{d.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
