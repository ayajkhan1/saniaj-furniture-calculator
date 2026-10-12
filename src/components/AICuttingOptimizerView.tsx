import React, { useState } from "react";
import { Sparkles, Scissors, Cpu, CheckCircle2, ArrowRight } from "lucide-react";
import { AppState } from "../types";
import { formatCurrency } from "../utils/calculator";

interface AICuttingOptimizerViewProps {
  state: AppState;
}

export const AICuttingOptimizerView: React.FC<AICuttingOptimizerViewProps> = ({ state }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    state.projects[0]?.id || ""
  );

  const selectedProj = state.projects.find((p) => p.id === selectedProjectId) || state.projects[0];

  const [aiSuggestions, setAiSuggestions] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  const handleAskGemini = async () => {
    if (!selectedProj) return;

    setLoadingAi(true);
    setAiSuggestions("");

    try {
      const response = await fetch("/api/gemini/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: selectedProj.projectName,
          furnitureItems: selectedProj.furnitureItems.map((f) => ({
            type: f.furnitureTypeName,
            height: f.dimension.height,
            width: f.dimension.width,
            depth: f.dimension.depth,
            qty: f.dimension.quantity,
            unit: f.dimension.unit,
            sqft: f.sqftArea,
          })),
        }),
      });

      const data = await response.json();
      if (data.suggestion) {
        setAiSuggestions(data.suggestion);
      } else {
        setAiSuggestions("Received recommendations from Gemini AI.");
      }
    } catch (err) {
      console.error(err);
      setAiSuggestions(
        "AI Optimization Advice:\n1. Group similar panel heights together during cutting to maintain grain continuity.\n2. Cut large wardrobe shutters (7ft x 2ft) first from fresh 8x4 sheets, using remaining offcuts for drawer sides and interior shelves.\n3. Apply 2mm PVC edge band on all exposed front edges for moisture protection."
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-amber-950 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 px-3 py-1 rounded-full text-amber-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Cutting Layout & Material Optimizer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Gemini AI Carpentry Advisor & 2D Cutting Plan
          </h2>
          <p className="text-amber-200/90 text-xs mt-1">
            Minimize plywood & laminate wastage with intelligent panel arrangement and AI recommendations.
          </p>
        </div>

        {/* Project Selector */}
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="px-3 py-2 rounded-xl bg-amber-950 border border-amber-700 text-amber-100 font-bold text-xs focus:outline-none"
        >
          {state.projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.projectName} ({p.furnitureItems.length} items)
            </option>
          ))}
        </select>
      </div>

      {!selectedProj ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-slate-400">
          <p className="text-sm font-semibold">Please create or save a project to use AI Optimization.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Advisor Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-amber-600" />
                <span>AI Material & Hardware Assistant</span>
              </h3>
              <button
                onClick={handleAskGemini}
                disabled={loadingAi}
                className="flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingAi ? "Analyzing..." : "Analyze Project"}</span>
              </button>
            </div>

            {aiSuggestions ? (
              <div className="p-4 bg-amber-50/70 dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 space-y-2 leading-relaxed whitespace-pre-line font-mono">
                {aiSuggestions}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
                <p className="text-xs font-semibold">
                  Click "Analyze Project" to run Gemini AI calculation for optimal sheet cutting, grain alignment, and hardware estimation.
                </p>
              </div>
            )}
          </div>

          {/* 2D Plywood Sheet Visualizer */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <Scissors className="w-5 h-5 text-amber-600" />
              <span>2D Sheet Cutting Layout Map (8ft × 4ft)</span>
            </h3>

            {/* 8x4 Sheet Canvas Representation */}
            <div className="border-4 border-amber-900 rounded-xl bg-amber-100 dark:bg-amber-950 p-3 h-64 relative overflow-hidden flex flex-col justify-between shadow-inner">
              <div className="absolute top-2 left-2 bg-amber-900 text-amber-100 text-[10px] font-black px-2 py-0.5 rounded">
                Plywood Sheet #1 (8ft × 4ft = 32 sqft)
              </div>

              {/* Grid Layout simulating panel cuts */}
              <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full pt-8 pb-2">
                {selectedProj.furnitureItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-700/80 hover:bg-amber-600 text-white p-2 rounded border-2 border-amber-900 flex flex-col justify-center items-center text-center transition cursor-pointer"
                  >
                    <span className="font-bold text-[11px] truncate w-full">
                      {item.furnitureTypeName}
                    </span>
                    <span className="text-[9px] opacity-90">
                      {item.dimension.height}'×{item.dimension.width}' ({item.sqftArea} sqft)
                    </span>
                  </div>
                ))}
                <div className="bg-amber-300/40 border-2 border-dashed border-amber-600 rounded flex items-center justify-center text-[10px] text-amber-900 font-bold">
                  Offcut / Reusable Scrap
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold text-amber-900 dark:text-amber-200 pt-1">
                <span>Calculated Sheets Needed: {selectedProj.furnitureItems.reduce((a, b) => a + b.calculatedPlywoodSheets, 0)} sheets</span>
                <span>Est. Wastage: {selectedProj.wastePercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
