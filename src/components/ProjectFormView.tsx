import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Calculator,
  Save,
  Check,
  ChevronDown,
  Layers,
  Wrench,
  DollarSign,
  User,
  MapPin,
  Phone,
  Sparkles,
  Info
} from "lucide-react";
import {
  AppState,
  Project,
  FurnitureProjectItem,
  Dimension,
  UnitType,
  Customer
} from "../types";
import { getText } from "../i18n/translations";
import {
  calculateSqft,
  calculatePlywoodSheets,
  calculateLaminateSheets,
  calculateEdgeBandMeters,
  calculateFevicolKg,
  calculateScrewsQty,
  calculateHingesPairs,
  calculateHandlesQty,
  formatCurrency,
  parseSheetSizeSqft
} from "../utils/calculator";

interface ProjectFormViewProps {
  state: AppState;
  onSaveProject: (project: Project) => void;
  editingProject?: Project | null;
  onCancel?: () => void;
}

export const ProjectFormView: React.FC<ProjectFormViewProps> = ({
  state,
  onSaveProject,
  editingProject,
  onCancel,
}) => {
  const lang = state.settings.language;
  const curr = state.settings.currencySymbol;

  // Form State
  const [projectId, setProjectId] = useState<string>(editingProject?.id || `proj-${Date.now()}`);
  const [projectName, setProjectName] = useState<string>(editingProject?.projectName || "");
  const [projectDate, setProjectDate] = useState<string>(
    editingProject?.projectDate || new Date().toISOString().slice(0, 10)
  );

  // Customer State
  const [customerName, setCustomerName] = useState<string>(editingProject?.customer?.name || "");
  const [customerMobile, setCustomerMobile] = useState<string>(editingProject?.customer?.mobile || "");
  const [customerAddress, setCustomerAddress] = useState<string>(editingProject?.customer?.address || "");
  const [siteAddress, setSiteAddress] = useState<string>(editingProject?.customer?.siteAddress || "");

  // Furniture Items
  const [furnitureItems, setFurnitureItems] = useState<FurnitureProjectItem[]>(
    editingProject?.furnitureItems || []
  );

  // Hardware Selections
  const [hardwareSelections, setHardwareSelections] = useState<
    { hardwareId: string; hardwareName: string; quantity: number; rate: number; totalCost: number }[]
  >(editingProject?.hardwareSelections || []);

  // Waste & Financials
  const [wastePercentage, setWastePercentage] = useState<number>(
    editingProject?.wastePercentage ?? state.settings.defaultWastePercentage
  );

  const [additionalCosts, setAdditionalCosts] = useState(
    editingProject?.additionalCosts || {
      transport: 1000,
      loading: 300,
      unloading: 300,
      machineCost: 500,
      finishingCost: 500,
      paintingCost: 0,
      polishingCost: 0,
      electricCost: 0,
      miscellaneous: 500,
    }
  );

  const [labourSettings, setLabourSettings] = useState(
    editingProject?.labourSettings || state.labourRates
  );

  const [profitType, setProfitType] = useState<"percentage" | "fixed">(
    editingProject?.profitType || "percentage"
  );
  const [profitValue, setProfitValue] = useState<number>(editingProject?.profitValue ?? 20);

  const [applyGst, setApplyGst] = useState<boolean>(editingProject?.applyGst ?? true);
  const [gstPercentage, setGstPercentage] = useState<number>(editingProject?.gstPercentage ?? 18);

  const [advancePayment, setAdvancePayment] = useState<number>(editingProject?.advancePayment ?? 0);
  const [paymentStatus, setPaymentStatus] = useState<"Pending" | "Partial" | "Paid">(
    editingProject?.paymentStatus || "Pending"
  );

  // Modal / Add Furniture Item Local State
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [selectedFurnitureTypeId, setSelectedFurnitureTypeId] = useState<string>(
    state.furnitureTypes[0]?.id || ""
  );

  const [dimHeight, setDimHeight] = useState<number>(7);
  const [dimWidth, setDimWidth] = useState<number>(6);
  const [dimDepth, setDimDepth] = useState<number>(2);
  const [dimQty, setDimQty] = useState<number>(1);
  const [dimUnit, setDimUnit] = useState<UnitType>("ft");

  const [selectedPlywoodBrand, setSelectedPlywoodBrand] = useState<string>(
    state.plywoodBrands[0]?.name || "Century"
  );
  const [selectedPlywoodSize, setSelectedPlywoodSize] = useState<string>("8x4");
  const [selectedPlywoodThickness, setSelectedPlywoodThickness] = useState<string>("18mm");
  const [selectedPlywoodGrade, setSelectedPlywoodGrade] = useState<string>(
    state.plywoodGrades[0]?.name || "BWR (Boiling Water Resistant)"
  );
  const [selectedPlywoodRate, setSelectedPlywoodRate] = useState<number>(110);

  const [selectedLaminateOuterBrand, setSelectedLaminateOuterBrand] = useState<string>(
    state.laminateBrands[0]?.name || "Royale Touche"
  );
  const [selectedLaminateOuterThickness, setSelectedLaminateOuterThickness] = useState<string>("1.0mm");
  const [selectedLaminateOuterRate, setSelectedLaminateOuterRate] = useState<number>(2200);

  const [selectedLaminateInnerBrand, setSelectedLaminateInnerBrand] = useState<string>("Offberg");
  const [selectedLaminateInnerThickness, setSelectedLaminateInnerThickness] = useState<string>("0.7mm (Liner)");
  const [selectedLaminateInnerRate, setSelectedLaminateInnerRate] = useState<number>(850);

  // Auto-fill hardware defaults when furniture items change
  useEffect(() => {
    if (hardwareSelections.length === 0 && furnitureItems.length > 0) {
      // Calculate auto hardware recommendations from items
      let totalSqft = furnitureItems.reduce((acc, f) => acc + f.sqftArea, 0);
      let hingesHw = state.hardwareDb.find((h) => h.category === "Hinges");
      let channelHw = state.hardwareDb.find((h) => h.category === "Drawer Channel");
      let handleHw = state.hardwareDb.find((h) => h.category === "Handle");
      let tapeHw = state.hardwareDb.find((h) => h.category === "PVC Edge Band");
      let fevicolHw = state.hardwareDb.find((h) => h.category === "Fevicol");

      const autoList = [];
      if (hingesHw) {
        const pairs = Math.max(2, Math.ceil(totalSqft / 15));
        autoList.push({
          hardwareId: hingesHw.id,
          hardwareName: hingesHw.name,
          quantity: pairs,
          rate: hingesHw.rate,
          totalCost: pairs * hingesHw.rate,
        });
      }
      if (channelHw) {
        const sets = Math.max(1, Math.ceil(totalSqft / 25));
        autoList.push({
          hardwareId: channelHw.id,
          hardwareName: channelHw.name,
          quantity: sets,
          rate: channelHw.rate,
          totalCost: sets * channelHw.rate,
        });
      }
      if (handleHw) {
        const handles = Math.max(2, Math.ceil(totalSqft / 12));
        autoList.push({
          hardwareId: handleHw.id,
          hardwareName: handleHw.name,
          quantity: handles,
          rate: handleHw.rate,
          totalCost: handles * handleHw.rate,
        });
      }
      if (tapeHw) {
        autoList.push({
          hardwareId: tapeHw.id,
          hardwareName: tapeHw.name,
          quantity: 1,
          rate: tapeHw.rate,
          totalCost: tapeHw.rate,
        });
      }
      if (fevicolHw) {
        const kg = Math.max(1, Math.ceil(totalSqft * 0.08 / 5)); // 5kg buckets
        autoList.push({
          hardwareId: fevicolHw.id,
          hardwareName: fevicolHw.name,
          quantity: kg,
          rate: fevicolHw.rate,
          totalCost: kg * fevicolHw.rate,
        });
      }

      setHardwareSelections(autoList);
    }
  }, [furnitureItems]);

  // Compute live financial totals
  const rawMaterialItemsCost = furnitureItems.reduce((acc, f) => acc + f.itemMaterialCost, 0);
  const hardwareTotalCost = hardwareSelections.reduce((acc, h) => acc + h.totalCost, 0);
  const totalMaterialCost = rawMaterialItemsCost + hardwareTotalCost;

  const totalSqftAll = furnitureItems.reduce((acc, f) => acc + f.sqftArea, 0);

  // Labour Calculation
  const carpenterCost = totalSqftAll * labourSettings.carpenterRatePerSqft;
  const helperCost = labourSettings.helperDays * labourSettings.helperRatePerDay;
  const painterCost = totalSqftAll * labourSettings.painterRatePerSqft;
  const polishCost = totalSqftAll * labourSettings.polishRatePerSqft;
  const totalLabourCost =
    carpenterCost +
    helperCost +
    painterCost +
    polishCost +
    labourSettings.electricianFixed +
    labourSettings.installationFixed;

  const totalAdditionalCost = (Object.values(additionalCosts) as number[]).reduce((a, b) => a + (Number(b) || 0), 0);
  const wasteCost = Math.round((totalMaterialCost * wastePercentage) / 100);
  const baseCost = totalMaterialCost + totalLabourCost + totalAdditionalCost + wasteCost;

  const profitAmount =
    profitType === "percentage"
      ? Math.round((baseCost * profitValue) / 100)
      : Math.round(Number(profitValue) || 0);

  const subTotal = baseCost + profitAmount;
  const gstAmount = applyGst ? Math.round((subTotal * gstPercentage) / 100) : 0;
  const grandTotal = subTotal + gstAmount;

  // Add Item Handler
  const handleAddFurnitureItem = () => {
    const fType = state.furnitureTypes.find((ft) => ft.id === selectedFurnitureTypeId);
    const fName = fType ? fType.name : "Custom Furniture";

    const dim: Dimension = {
      height: dimHeight,
      width: dimWidth,
      depth: dimDepth,
      quantity: dimQty,
      unit: dimUnit,
    };

    const sqft = calculateSqft(dim);
    const sheetSqft = parseSheetSizeSqft(selectedPlywoodSize);
    const plySheets = calculatePlywoodSheets(dim, sheetSqft, wastePercentage);
    const lamSheets = calculateLaminateSheets(dim, sheetSqft, wastePercentage);

    // Calculate material cost for this item
    const plyCost = plySheets * sheetSqft * selectedPlywoodRate;
    const lamOuterCost = lamSheets * selectedLaminateOuterRate;
    const lamInnerCost = lamSheets * selectedLaminateInnerRate;
    const itemCost = plyCost + lamOuterCost + lamInnerCost;

    const newItem: FurnitureProjectItem = {
      id: `fitem-${Date.now()}`,
      furnitureTypeId: selectedFurnitureTypeId,
      furnitureTypeName: fName,
      dimension: dim,
      plywoodBrand: selectedPlywoodBrand,
      plywoodSize: selectedPlywoodSize,
      plywoodThickness: selectedPlywoodThickness,
      plywoodGrade: selectedPlywoodGrade,
      plywoodRate: selectedPlywoodRate,
      laminateOuterBrand: selectedLaminateOuterBrand,
      laminateOuterThickness: selectedLaminateOuterThickness,
      laminateOuterRate: selectedLaminateOuterRate,
      laminateInnerBrand: selectedLaminateInnerBrand,
      laminateInnerThickness: selectedLaminateInnerThickness,
      laminateInnerRate: selectedLaminateInnerRate,
      sqftArea: sqft,
      calculatedPlywoodSheets: plySheets,
      calculatedLaminateSheets: lamSheets,
      itemMaterialCost: itemCost,
    };

    setFurnitureItems((prev) => [...prev, newItem]);
    setShowAddItemModal(false);
  };

  // Remove Item
  const handleRemoveFurnitureItem = (id: string) => {
    setFurnitureItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Add Hardware Row
  const handleAddHardwareRow = (hwId: string) => {
    const hw = state.hardwareDb.find((h) => h.id === hwId);
    if (!hw) return;
    if (hardwareSelections.some((h) => h.hardwareId === hwId)) return;

    setHardwareSelections((prev) => [
      ...prev,
      {
        hardwareId: hw.id,
        hardwareName: hw.name,
        quantity: 1,
        rate: hw.rate,
        totalCost: hw.rate,
      },
    ]);
  };

  // Save Project
  const handleSave = () => {
    if (!projectName.trim()) {
      alert("Please enter a Project Name.");
      return;
    }
    if (!customerName.trim()) {
      alert("Please enter Customer Name.");
      return;
    }

    const customerObj: Customer = {
      id: editingProject?.customer?.id || `cust-${Date.now()}`,
      name: customerName,
      mobile: customerMobile,
      address: customerAddress,
      siteAddress: siteAddress,
    };

    const finalProject: Project = {
      id: projectId,
      projectName,
      projectDate,
      customer: customerObj,
      furnitureItems,
      hardwareSelections,
      wastePercentage,
      additionalCosts,
      labourSettings,
      profitType,
      profitValue,
      applyGst,
      gstPercentage,
      totalMaterialCost,
      totalLabourCost,
      totalAdditionalCost,
      totalWasteCost: wasteCost,
      baseCost,
      profitAmount,
      subTotal,
      gstAmount,
      grandTotal,
      advancePayment,
      paymentStatus:
        advancePayment >= grandTotal
          ? "Paid"
          : advancePayment > 0
          ? "Partial"
          : "Pending",
      status: "Saved",
      createdAt: editingProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveProject(finalProject);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-amber-600" />
            <span>{editingProject ? "Edit Furniture Project" : "New Furniture Calculation Project"}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fill in customer & furniture details to compute material, hardware, labour & final quotation.
          </p>
        </div>
        <div className="flex space-x-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition text-xs sm:text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{getText("save", lang)} Project</span>
          </button>
        </div>
      </div>

      {/* Section 1: Customer & Project Info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-2">
          <User className="w-4 h-4" />
          <span>Project & Customer Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {getText("projectName", lang)} *
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Master Bedroom & Modular Kitchen"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {getText("projectDate", lang)}
            </label>
            <input
              type="date"
              value={projectDate}
              onChange={(e) => setProjectDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {getText("customerName", lang)} *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Client Full Name"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {getText("mobileNumber", lang)}
            </label>
            <input
              type="text"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              placeholder="+91 98300 XXXXX"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {getText("address", lang)}
            </label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Client Address"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {getText("siteAddress", lang)}
            </label>
            <input
              type="text"
              value={siteAddress}
              onChange={(e) => setSiteAddress(e.target.value)}
              placeholder="Workplace / Site Location"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Furniture Items List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4" />
            <span>Furniture Items & Measurement</span>
          </h3>
          <button
            onClick={() => setShowAddItemModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Furniture Item</span>
          </button>
        </div>

        {furnitureItems.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400">
            <p className="text-xs font-medium">No furniture items added yet.</p>
            <button
              onClick={() => setShowAddItemModal(true)}
              className="mt-2 text-xs font-bold text-amber-600 hover:underline"
            >
              + Add Wardrobe, Kitchen, TV Unit, Bed, etc.
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Item Type</th>
                  <th className="p-2.5">Dimensions</th>
                  <th className="p-2.5">Sq.Ft</th>
                  <th className="p-2.5">Plywood Choice</th>
                  <th className="p-2.5">Laminate Choice</th>
                  <th className="p-2.5">Sheets (P/L)</th>
                  <th className="p-2.5">Cost</th>
                  <th className="p-2.5 text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {furnitureItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-2.5 font-bold text-slate-800 dark:text-slate-100">
                      {item.furnitureTypeName}
                    </td>
                    <td className="p-2.5 font-medium">
                      {item.dimension.height}H × {item.dimension.width}W × {item.dimension.depth || 0}D {item.dimension.unit} ({item.dimension.quantity} qty)
                    </td>
                    <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400">
                      {item.sqftArea} sq.ft
                    </td>
                    <td className="p-2.5 text-[11px]">
                      <span className="font-semibold block">{item.plywoodBrand} ({item.plywoodThickness})</span>
                      <span className="text-slate-400">{item.plywoodGrade} • {item.plywoodSize}</span>
                    </td>
                    <td className="p-2.5 text-[11px]">
                      <span className="font-semibold block">{item.laminateOuterBrand} ({item.laminateOuterThickness})</span>
                      <span className="text-slate-400">Inner: {item.laminateInnerBrand || "Standard"}</span>
                    </td>
                    <td className="p-2.5 font-bold">
                      <span className="text-amber-700 dark:text-amber-300">{item.calculatedPlywoodSheets} Ply</span> /{" "}
                      <span className="text-emerald-700 dark:text-emerald-300">{item.calculatedLaminateSheets} Lam</span>
                    </td>
                    <td className="p-2.5 font-extrabold text-slate-800 dark:text-slate-100">
                      {formatCurrency(item.itemMaterialCost, curr)}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleRemoveFurnitureItem(item.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 3: Hardware Checklist */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2">
            <Wrench className="w-4 h-4" />
            <span>Hardware & Fitting Selections</span>
          </h3>
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAddHardwareRow(e.target.value);
                e.target.value = "";
              }
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="">+ Add Hardware Item...</option>
            {state.hardwareDb.map((hw) => (
              <option key={hw.id} value={hw.id}>
                {hw.name} ({hw.category}) - {formatCurrency(hw.rate, curr)} / {hw.unit}
              </option>
            ))}
          </select>
        </div>

        {hardwareSelections.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No hardware selected yet. Pick items from dropdown above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hardwareSelections.map((hw, idx) => (
              <div
                key={hw.hardwareId + idx}
                className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-2"
              >
                <div className="flex-1">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                    {hw.hardwareName}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Rate: {formatCurrency(hw.rate, curr)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={hw.quantity}
                    onChange={(e) => {
                      const q = Math.max(1, parseInt(e.target.value) || 1);
                      setHardwareSelections((prev) =>
                        prev.map((item, i) =>
                          i === idx ? { ...item, quantity: q, totalCost: q * item.rate } : item
                        )
                      );
                    }}
                    className="w-16 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-center"
                  />
                  <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400 min-w-[60px] text-right">
                    {formatCurrency(hw.totalCost, curr)}
                  </span>
                  <button
                    onClick={() =>
                      setHardwareSelections((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Wastage, Labour & Extra Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Labour Rates */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-2">
            <Wrench className="w-4 h-4" />
            <span>Labour Rates ({getText("labourCalculator", lang)})</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Carpenter Rate (per Sq.Ft)</label>
              <input
                type="number"
                value={labourSettings.carpenterRatePerSqft}
                onChange={(e) => setLabourSettings({ ...labourSettings, carpenterRatePerSqft: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Helper Rate (per Day)</label>
              <input
                type="number"
                value={labourSettings.helperRatePerDay}
                onChange={(e) => setLabourSettings({ ...labourSettings, helperRatePerDay: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Helper Days</label>
              <input
                type="number"
                value={labourSettings.helperDays}
                onChange={(e) => setLabourSettings({ ...labourSettings, helperDays: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Painter Rate (per Sq.Ft)</label>
              <input
                type="number"
                value={labourSettings.painterRatePerSqft}
                onChange={(e) => setLabourSettings({ ...labourSettings, painterRatePerSqft: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Polish Rate (per Sq.Ft)</label>
              <input
                type="number"
                value={labourSettings.polishRatePerSqft}
                onChange={(e) => setLabourSettings({ ...labourSettings, polishRatePerSqft: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Installation Fixed Charge</label>
              <input
                type="number"
                value={labourSettings.installationFixed}
                onChange={(e) => setLabourSettings({ ...labourSettings, installationFixed: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-slate-900 rounded-xl flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>Calculated Total Labour:</span>
            <span className="text-amber-700 dark:text-amber-400 text-sm font-black">{formatCurrency(totalLabourCost, curr)}</span>
          </div>
        </div>

        {/* Expenses & Wastage */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-2">
            <DollarSign className="w-4 h-4" />
            <span>Wastage Margin & Extra Expenses</span>
          </h3>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>{getText("wastePercentage", lang)}</span>
              <span className="text-amber-600">{wastePercentage}% ({formatCurrency(wasteCost, curr)})</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={wastePercentage}
              onChange={(e) => setWastePercentage(parseInt(e.target.value) || 0)}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <label className="block text-slate-500 mb-0.5">Transport</label>
              <input
                type="number"
                value={additionalCosts.transport}
                onChange={(e) => setAdditionalCosts({ ...additionalCosts, transport: parseFloat(e.target.value) || 0 })}
                className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-0.5">Loading</label>
              <input
                type="number"
                value={additionalCosts.loading}
                onChange={(e) => setAdditionalCosts({ ...additionalCosts, loading: parseFloat(e.target.value) || 0 })}
                className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-0.5">Unloading</label>
              <input
                type="number"
                value={additionalCosts.unloading}
                onChange={(e) => setAdditionalCosts({ ...additionalCosts, unloading: parseFloat(e.target.value) || 0 })}
                className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-0.5">Machine Cost</label>
              <input
                type="number"
                value={additionalCosts.machineCost}
                onChange={(e) => setAdditionalCosts({ ...additionalCosts, machineCost: parseFloat(e.target.value) || 0 })}
                className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-0.5">Finishing Cost</label>
              <input
                type="number"
                value={additionalCosts.finishingCost}
                onChange={(e) => setAdditionalCosts({ ...additionalCosts, finishingCost: parseFloat(e.target.value) || 0 })}
                className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-0.5">Miscellaneous</label>
              <input
                type="number"
                value={additionalCosts.miscellaneous}
                onChange={(e) => setAdditionalCosts({ ...additionalCosts, miscellaneous: parseFloat(e.target.value) || 0 })}
                className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Profit & Final Price Card */}
      <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-white rounded-2xl p-6 shadow-xl space-y-5">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-300">
          Profit Margin & Grand Total Quotation Calculation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">Profit Type</label>
            <select
              value={profitType}
              onChange={(e) => setProfitType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-amber-950 text-white border border-amber-700 text-xs font-bold focus:outline-none"
            >
              <option value="percentage">Profit Percentage (%)</option>
              <option value="fixed">Fixed Amount ({curr})</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Profit Value ({profitType === "percentage" ? "%" : curr})
            </label>
            <input
              type="number"
              value={profitValue}
              onChange={(e) => setProfitValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-amber-950 text-white border border-amber-700 text-sm font-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">GST Tax Options</label>
            <div className="flex items-center space-x-3 pt-1">
              <label className="flex items-center space-x-1.5 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyGst}
                  onChange={(e) => setApplyGst(e.target.checked)}
                  className="rounded text-amber-500 accent-amber-500 w-4 h-4"
                />
                <span>Apply GST ({gstPercentage}%)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="bg-amber-950/80 rounded-xl p-4 border border-amber-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-amber-300/80 block">Material Total:</span>
            <span className="font-bold text-sm">{formatCurrency(totalMaterialCost, curr)}</span>
          </div>
          <div>
            <span className="text-amber-300/80 block">Labour & Extras:</span>
            <span className="font-bold text-sm">{formatCurrency(totalLabourCost + totalAdditionalCost, curr)}</span>
          </div>
          <div>
            <span className="text-amber-300/80 block">Wastage ({wastePercentage}%):</span>
            <span className="font-bold text-sm">{formatCurrency(wasteCost, curr)}</span>
          </div>
          <div>
            <span className="text-amber-300/80 block">Profit ({profitValue}{profitType === 'percentage' ? '%' : ''}):</span>
            <span className="font-bold text-sm text-emerald-400">{formatCurrency(profitAmount, curr)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t border-amber-800 gap-3">
          <div>
            <span className="text-xs text-amber-200 block">Grand Total Quotation Price:</span>
            <span className="text-3xl font-black text-amber-400">{formatCurrency(grandTotal, curr)}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div>
              <label className="block text-[11px] text-amber-200 mb-0.5">Advance Payment Received:</label>
              <input
                type="number"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(parseFloat(e.target.value) || 0)}
                placeholder="₹0"
                className="px-3 py-1.5 rounded-lg bg-amber-900 border border-amber-700 text-white font-bold text-xs w-32"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black rounded-xl shadow-lg transition text-sm flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save & Generate Quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Add Furniture Item */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                Add Furniture Item & Material Choice
              </h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Furniture Type
                </label>
                <select
                  value={selectedFurnitureTypeId}
                  onChange={(e) => setSelectedFurnitureTypeId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
                >
                  {state.furnitureTypes.map((ft) => (
                    <option key={ft.id} value={ft.id}>
                      {ft.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div>
                  <label className="block font-bold mb-0.5">Height</label>
                  <input
                    type="number"
                    value={dimHeight}
                    onChange={(e) => setDimHeight(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-0.5">Width</label>
                  <input
                    type="number"
                    value={dimWidth}
                    onChange={(e) => setDimWidth(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-0.5">Depth</label>
                  <input
                    type="number"
                    value={dimDepth}
                    onChange={(e) => setDimDepth(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-0.5">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={dimQty}
                    onChange={(e) => setDimQty(parseInt(e.target.value) || 1)}
                    className="w-full p-2 rounded-lg border font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-0.5">Unit</label>
                  <select
                    value={dimUnit}
                    onChange={(e) => setDimUnit(e.target.value as UnitType)}
                    className="w-full p-2 rounded-lg border font-bold bg-amber-50 dark:bg-slate-900"
                  >
                    <option value="ft">Feet (ft)</option>
                    <option value="in">Inches (in)</option>
                    <option value="mm">MM</option>
                    <option value="cm">CM</option>
                  </select>
                </div>
              </div>

              {/* Plywood Specs */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-amber-800 dark:text-amber-400 block">Plywood Specification</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold">Brand</label>
                    <select
                      value={selectedPlywoodBrand}
                      onChange={(e) => setSelectedPlywoodBrand(e.target.value)}
                      className="w-full p-1.5 rounded-lg border font-medium"
                    >
                      {state.plywoodBrands.map((b) => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold">Sheet Size</label>
                    <select
                      value={selectedPlywoodSize}
                      onChange={(e) => setSelectedPlywoodSize(e.target.value)}
                      className="w-full p-1.5 rounded-lg border font-medium"
                    >
                      {state.plywoodSizes.map((s) => (
                        <option key={s.id} value={s.name}>{s.name} ({s.sqft} sqft)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold">Thickness</label>
                    <select
                      value={selectedPlywoodThickness}
                      onChange={(e) => setSelectedPlywoodThickness(e.target.value)}
                      className="w-full p-1.5 rounded-lg border font-medium"
                    >
                      {state.plywoodThicknesses.map((t) => (
                        <option key={t.id} value={t.value}>{t.value}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold">Rate per Sq.Ft ({curr})</label>
                    <input
                      type="number"
                      value={selectedPlywoodRate}
                      onChange={(e) => setSelectedPlywoodRate(parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 rounded-lg border font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Laminate Specs */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 block">Laminate Specification</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold">Outer Brand</label>
                    <select
                      value={selectedLaminateOuterBrand}
                      onChange={(e) => setSelectedLaminateOuterBrand(e.target.value)}
                      className="w-full p-1.5 rounded-lg border font-medium"
                    >
                      {state.laminateBrands.map((lb) => (
                        <option key={lb.id} value={lb.name}>{lb.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold">Outer Rate ({curr}/sheet)</label>
                    <input
                      type="number"
                      value={selectedLaminateOuterRate}
                      onChange={(e) => setSelectedLaminateOuterRate(parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 rounded-lg border font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold">Inner Liner Rate ({curr}/sheet)</label>
                    <input
                      type="number"
                      value={selectedLaminateInnerRate}
                      onChange={(e) => setSelectedLaminateInnerRate(parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 rounded-lg border font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-700 pt-3">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFurnitureItem}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md"
              >
                + Add To Calculation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
