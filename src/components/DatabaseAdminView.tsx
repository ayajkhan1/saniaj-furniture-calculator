import React, { useState } from "react";
import {
  Database,
  Plus,
  Edit,
  Trash2,
  Save,
  Check,
  Layers,
  Wrench,
  DollarSign,
  Tag,
  Maximize2
} from "lucide-react";
import {
  AppState,
  PlywoodSize,
  PlywoodThickness,
  PlywoodBrand,
  PlywoodGrade,
  PlywoodDatabaseItem,
  LaminateBrand,
  LaminateDatabaseItem,
  HardwareItem,
  FurnitureTypeItem
} from "../types";
import { getText } from "../i18n/translations";
import { formatCurrency } from "../utils/calculator";

interface DatabaseAdminViewProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
}

export const DatabaseAdminView: React.FC<DatabaseAdminViewProps> = ({
  state,
  onUpdateState,
}) => {
  const lang = state.settings.language;
  const curr = state.settings.currencySymbol;

  const [activeSubTab, setActiveSubTab] = useState<
    "plywood" | "laminate" | "hardware" | "furniture" | "labour"
  >("plywood");

  // Local Form state for adding items
  const [newSizeName, setNewSizeName] = useState("");
  const [newSizeLength, setNewSizeLength] = useState(8);
  const [newSizeWidth, setNewSizeWidth] = useState(4);

  const [newBrandName, setNewBrandName] = useState("");
  const [newPlyRate, setNewPlyRate] = useState(100);

  const [newLamBrand, setNewLamBrand] = useState("");
  const [newLamRate, setNewLamRate] = useState(1800);

  const [newHwName, setNewHwName] = useState("");
  const [newHwCategory, setNewHwCategory] = useState<any>("Hinges");
  const [newHwUnit, setNewHwUnit] = useState("Pcs");
  const [newHwRate, setNewHwRate] = useState(150);

  const [newFurnitureName, setNewFurnitureName] = useState("");

  // Handlers for Plywood Size
  const handleAddPlywoodSize = () => {
    if (!newSizeName.trim()) return;
    const sqft = newSizeLength * newSizeWidth;
    const newSize: PlywoodSize = {
      id: `ps-${Date.now()}`,
      name: newSizeName.trim(),
      lengthFt: newSizeLength,
      widthFt: newSizeWidth,
      sqft,
      isCustom: true,
    };
    onUpdateState((prev) => ({
      ...prev,
      plywoodSizes: [...prev.plywoodSizes, newSize],
    }));
    setNewSizeName("");
  };

  const handleDeletePlywoodSize = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      plywoodSizes: prev.plywoodSizes.filter((s) => s.id !== id),
    }));
  };

  // Handlers for Plywood Brand
  const handleAddPlywoodBrand = () => {
    if (!newBrandName.trim()) return;
    const newB: PlywoodBrand = {
      id: `pb-${Date.now()}`,
      name: newBrandName.trim(),
    };
    onUpdateState((prev) => ({
      ...prev,
      plywoodBrands: [...prev.plywoodBrands, newB],
    }));
    setNewBrandName("");
  };

  const handleDeletePlywoodBrand = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      plywoodBrands: prev.plywoodBrands.filter((b) => b.id !== id),
    }));
  };

  // Handlers for Laminate Brand
  const handleAddLaminateBrand = () => {
    if (!newLamBrand.trim()) return;
    const newLB: LaminateBrand = {
      id: `lb-${Date.now()}`,
      name: newLamBrand.trim(),
    };
    onUpdateState((prev) => ({
      ...prev,
      laminateBrands: [...prev.laminateBrands, newLB],
    }));
    setNewLamBrand("");
  };

  const handleDeleteLaminateBrand = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      laminateBrands: prev.laminateBrands.filter((b) => b.id !== id),
    }));
  };

  // Handlers for Hardware
  const handleAddHardwareItem = () => {
    if (!newHwName.trim()) return;
    const newHw: HardwareItem = {
      id: `hw-${Date.now()}`,
      name: newHwName.trim(),
      category: newHwCategory,
      unit: newHwUnit,
      rate: newHwRate,
      stockQty: 50,
      minStockAlert: 10,
    };
    onUpdateState((prev) => ({
      ...prev,
      hardwareDb: [...prev.hardwareDb, newHw],
    }));
    setNewHwName("");
  };

  const handleDeleteHardwareItem = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      hardwareDb: prev.hardwareDb.filter((h) => h.id !== id),
    }));
  };

  // Handlers for Furniture Types
  const handleAddFurnitureType = () => {
    if (!newFurnitureName.trim()) return;
    const newFT: FurnitureTypeItem = {
      id: `ft-${Date.now()}`,
      name: newFurnitureName.trim(),
      description: "Custom user created furniture type",
      defaultPlywoodThickness: "18mm",
      defaultLaminateThickness: "1.0mm",
      estimatedSheetsPerSqft: 2.2,
      isCustom: true,
    };
    onUpdateState((prev) => ({
      ...prev,
      furnitureTypes: [...prev.furnitureTypes, newFT],
    }));
    setNewFurnitureName("");
  };

  const handleDeleteFurnitureType = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      furnitureTypes: prev.furnitureTypes.filter((f) => f.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <Database className="w-6 h-6 text-indigo-600" />
            <span>{getText("adminPanel", lang)}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fully customizable database. Add, edit, or delete any plywood size, laminate brand, hardware item, or furniture type.
          </p>
        </div>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex space-x-2 overflow-x-auto border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveSubTab("plywood")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === "plywood"
              ? "bg-amber-600 text-white shadow-md"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          }`}
        >
          Plywood Sizes & Brands
        </button>

        <button
          onClick={() => setActiveSubTab("laminate")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === "laminate"
              ? "bg-amber-600 text-white shadow-md"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          }`}
        >
          Laminate Database
        </button>

        <button
          onClick={() => setActiveSubTab("hardware")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === "hardware"
              ? "bg-amber-600 text-white shadow-md"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          }`}
        >
          Hardware Items
        </button>

        <button
          onClick={() => setActiveSubTab("furniture")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === "furniture"
              ? "bg-amber-600 text-white shadow-md"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          }`}
        >
          Furniture Types
        </button>
      </div>

      {/* Content Section 1: Plywood Sizes & Brands */}
      {activeSubTab === "plywood" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plywood Sheet Sizes */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Editable Plywood Sheet Sizes
            </h3>

            {/* Add Size Form */}
            <div className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="Name (e.g. 8x4, 9x4)"
                value={newSizeName}
                onChange={(e) => setNewSizeName(e.target.value)}
                className="px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 flex-1 font-semibold"
              />
              <input
                type="number"
                placeholder="Len (ft)"
                value={newSizeLength}
                onChange={(e) => setNewSizeLength(parseFloat(e.target.value) || 1)}
                className="w-16 px-2 py-2 border rounded-xl bg-white dark:bg-slate-900 font-bold"
              />
              <input
                type="number"
                placeholder="Wid (ft)"
                value={newSizeWidth}
                onChange={(e) => setNewSizeWidth(parseFloat(e.target.value) || 1)}
                className="w-16 px-2 py-2 border rounded-xl bg-white dark:bg-slate-900 font-bold"
              />
              <button
                onClick={handleAddPlywoodSize}
                className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500"
              >
                + Add Size
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
              {state.plywoodSizes.map((size) => (
                <div key={size.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{size.name}</span>
                    <span className="text-slate-400 text-[11px] ml-2">({size.lengthFt}ft × {size.widthFt}ft = {size.sqft} sqft)</span>
                  </div>
                  <button
                    onClick={() => handleDeletePlywoodSize(size.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Plywood Brands */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Editable Plywood Companies & Brands
            </h3>

            <div className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="Brand Name (e.g. Century, Greenply, Saburi)"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 flex-1 font-semibold"
              />
              <button
                onClick={handleAddPlywoodBrand}
                className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500"
              >
                + Add Brand
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
              {state.plywoodBrands.map((brand) => (
                <div key={brand.id} className="py-2.5 flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-100">{brand.name}</span>
                  <button
                    onClick={() => handleDeletePlywoodBrand(brand.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Section 2: Laminate Brands */}
      {activeSubTab === "laminate" && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Editable Laminate Brands
          </h3>

          <div className="flex gap-2 text-xs max-w-md">
            <input
              type="text"
              placeholder="Brand Name (e.g. Royale Touche, Greenlam)"
              value={newLamBrand}
              onChange={(e) => setNewLamBrand(e.target.value)}
              className="px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 flex-1 font-semibold"
            />
            <button
              onClick={handleAddLaminateBrand}
              className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500"
            >
              + Add Laminate Brand
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-2">
            {state.laminateBrands.map((brand) => (
              <div
                key={brand.id}
                className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center bg-slate-50 dark:bg-slate-900"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200">{brand.name}</span>
                <button
                  onClick={() => handleDeleteLaminateBrand(brand.id)}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Section 3: Hardware Database */}
      {activeSubTab === "hardware" && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Editable Hardware & Fittings Database
          </h3>

          {/* Add Hardware Form */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
            <input
              type="text"
              placeholder="Hardware Item Name"
              value={newHwName}
              onChange={(e) => setNewHwName(e.target.value)}
              className="px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 font-semibold"
            />
            <select
              value={newHwCategory}
              onChange={(e) => setNewHwCategory(e.target.value as any)}
              className="px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 font-bold"
            >
              <option value="Hinges">Hinges</option>
              <option value="Drawer Channel">Drawer Channel</option>
              <option value="Tandem">Tandem</option>
              <option value="Handle">Handle</option>
              <option value="Lock">Lock</option>
              <option value="Magnet">Magnet</option>
              <option value="Screw">Screw</option>
              <option value="Nail">Nail</option>
              <option value="PVC Edge Band">PVC Edge Band</option>
              <option value="Fevicol">Fevicol</option>
              <option value="Silicone">Silicone</option>
              <option value="LED Profile">LED Profile</option>
              <option value="Profile Handle">Profile Handle</option>
              <option value="Glass">Glass</option>
              <option value="Mirror">Mirror</option>
              <option value="Custom">Custom</option>
            </select>
            <input
              type="text"
              placeholder="Unit (e.g. Pair, Set, Kg)"
              value={newHwUnit}
              onChange={(e) => setNewHwUnit(e.target.value)}
              className="px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 font-semibold"
            />
            <input
              type="number"
              placeholder="Rate"
              value={newHwRate}
              onChange={(e) => setNewHwRate(parseFloat(e.target.value) || 0)}
              className="px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 font-bold"
            />
            <button
              onClick={handleAddHardwareItem}
              className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500"
            >
              + Add Hardware
            </button>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 font-bold text-slate-500 uppercase">
                <tr>
                  <th className="p-2.5">Name</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Unit</th>
                  <th className="p-2.5">Rate</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {state.hardwareDb.map((hw) => (
                  <tr key={hw.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-2.5 font-bold text-slate-800 dark:text-slate-100">{hw.name}</td>
                    <td className="p-2.5 text-slate-500">{hw.category}</td>
                    <td className="p-2.5">{hw.unit}</td>
                    <td className="p-2.5 font-bold text-amber-600">{formatCurrency(hw.rate, curr)}</td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleDeleteHardwareItem(hw.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content Section 4: Furniture Types */}
      {activeSubTab === "furniture" && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Editable Furniture Types (Unlimited Custom)
          </h3>

          <div className="flex gap-2 text-xs max-w-md">
            <input
              type="text"
              placeholder="Custom Furniture Type Name"
              value={newFurnitureName}
              onChange={(e) => setNewFurnitureName(e.target.value)}
              className="px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 flex-1 font-semibold"
            />
            <button
              onClick={handleAddFurnitureType}
              className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500"
            >
              + Add Type
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs pt-2">
            {state.furnitureTypes.map((ft) => (
              <div
                key={ft.id}
                className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center bg-slate-50 dark:bg-slate-900"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200">{ft.name}</span>
                <button
                  onClick={() => handleDeleteFurnitureType(ft.id)}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
