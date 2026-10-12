import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  CheckCircle,
  RefreshCw,
  Sliders
} from "lucide-react";
import { AppState, HardwareItem } from "../types";
import { getText } from "../i18n/translations";
import { formatCurrency } from "../utils/calculator";

interface InventoryViewProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  state,
  onUpdateState,
}) => {
  const lang = state.settings.language;
  const curr = state.settings.currencySymbol;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterLowStockOnly, setFilterLowStockOnly] = useState<boolean>(false);

  const [selectedHw, setSelectedHw] = useState<HardwareItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<"ADD" | "DEDUCT">("ADD");

  const filteredHardware = state.hardwareDb.filter((hw) => {
    const matchesSearch =
      hw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hw.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterLowStockOnly) {
      return matchesSearch && hw.stockQty <= hw.minStockAlert;
    }
    return matchesSearch;
  });

  const handleStockAdjust = () => {
    if (!selectedHw) return;

    onUpdateState((prev) => ({
      ...prev,
      hardwareDb: prev.hardwareDb.map((hw) => {
        if (hw.id === selectedHw.id) {
          const newQty =
            adjustType === "ADD"
              ? hw.stockQty + adjustQty
              : Math.max(0, hw.stockQty - adjustQty);
          return { ...hw, stockQty: newQty };
        }
        return hw;
      }),
    }));

    setSelectedHw(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <Package className="w-6 h-6 text-purple-600" />
            <span>{getText("inventory", lang)} Manager</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track hardware fittings, hinges, channels, fevicol & edge band stock levels.
          </p>
        </div>

        <button
          onClick={() => setFilterLowStockOnly((prev) => !prev)}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
            filterLowStockOnly
              ? "bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300"
              : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>{filterLowStockOnly ? "Showing Low Stock Only" : "Filter Low Stock"}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search inventory by hardware name or category..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Hardware Stock Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-900 font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="p-3 rounded-l-lg">Hardware Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Unit Rate</th>
              <th className="p-3">In Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredHardware.map((hw) => {
              const isLow = hw.stockQty <= hw.minStockAlert;
              return (
                <tr key={hw.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-100">
                    {hw.name}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">
                    {hw.category}
                  </td>
                  <td className="p-3 font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(hw.rate, curr)} / {hw.unit}
                  </td>
                  <td className="p-3 font-black text-sm text-slate-800 dark:text-slate-100">
                    {hw.stockQty} {hw.unit}
                  </td>
                  <td className="p-3">
                    {isLow ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 inline-flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Low Stock</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Sufficient</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedHw(hw)}
                      className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 dark:bg-purple-900/50 dark:text-purple-200 font-bold text-xs rounded-lg transition"
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {selectedHw && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Update Stock: {selectedHw.name}
              </h3>
              <button
                onClick={() => setSelectedHw(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-slate-500 block">Current Stock:</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                  {selectedHw.stockQty} {selectedHw.unit}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Action Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAdjustType("ADD")}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center space-x-1 ${
                      adjustType === "ADD"
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Stock</span>
                  </button>
                  <button
                    onClick={() => setAdjustType("DEDUCT")}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center space-x-1 ${
                      adjustType === "DEDUCT"
                        ? "bg-rose-600 text-white shadow-md"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                    <span>- Deduct Stock</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity ({selectedHw.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseInt(e.target.value) || 1)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-700 pt-3">
              <button
                onClick={() => setSelectedHw(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleStockAdjust}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
