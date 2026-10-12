import { AppState, Project, Customer, HardwareItem, PlywoodDatabaseItem, LaminateDatabaseItem, FurnitureTypeItem } from "../types";

const STORAGE_KEY = "saniaj_furniture_calc_app_state_v1";

export const initialPlywoodSizes = [
  { id: "ps-1", name: "8x4", lengthFt: 8, widthFt: 4, sqft: 32 },
  { id: "ps-2", name: "7x4", lengthFt: 7, widthFt: 4, sqft: 28 },
  { id: "ps-3", name: "6x4", lengthFt: 6, widthFt: 4, sqft: 24 },
  { id: "ps-4", name: "8x3", lengthFt: 8, widthFt: 3, sqft: 24 },
  { id: "ps-5", name: "7x3", lengthFt: 7, widthFt: 3, sqft: 21 },
  { id: "ps-6", name: "6x3", lengthFt: 6, widthFt: 3, sqft: 18 },
];

export const initialPlywoodThicknesses = [
  { id: "pt-1", value: "6mm" },
  { id: "pt-2", value: "9mm" },
  { id: "pt-3", value: "12mm" },
  { id: "pt-4", value: "16mm" },
  { id: "pt-5", value: "18mm" },
  { id: "pt-6", value: "19mm" },
  { id: "pt-7", value: "25mm" },
];

export const initialPlywoodBrands = [
  { id: "pb-1", name: "Century" },
  { id: "pb-2", name: "Greenply" },
  { id: "pb-3", name: "Kitply" },
  { id: "pb-4", name: "Action Tesa" },
  { id: "pb-5", name: "Saburi" },
  { id: "pb-6", name: "Merino" },
  { id: "pb-7", name: "Sharon" },
  { id: "pb-8", name: "Austin" },
];

export const initialPlywoodGrades = [
  { id: "pg-1", name: "BWR (Boiling Water Resistant)" },
  { id: "pg-2", name: "BWP / Marine Grade" },
  { id: "pg-3", name: "MR (Moisture Resistant)" },
  { id: "pg-4", name: "Commercial Grade" },
  { id: "pg-5", name: "Calibrated HDMR" },
];

export const initialPlywoodDb: PlywoodDatabaseItem[] = [
  { id: "pdb-1", brand: "Century", size: "8x4", thickness: "18mm", grade: "BWR (Boiling Water Resistant)", ratePerSqft: 110, ratePerSheet: 3520 },
  { id: "pdb-2", brand: "Century", size: "8x4", thickness: "12mm", grade: "BWR (Boiling Water Resistant)", ratePerSqft: 85, ratePerSheet: 2720 },
  { id: "pdb-3", brand: "Century", size: "8x4", thickness: "6mm", grade: "MR (Moisture Resistant)", ratePerSqft: 45, ratePerSheet: 1440 },
  { id: "pdb-4", brand: "Greenply", size: "8x4", thickness: "18mm", grade: "BWP / Marine Grade", ratePerSqft: 125, ratePerSheet: 4000 },
  { id: "pdb-5", brand: "Greenply", size: "8x4", thickness: "12mm", grade: "BWR (Boiling Water Resistant)", ratePerSqft: 90, ratePerSheet: 2880 },
  { id: "pdb-6", brand: "Kitply", size: "8x4", thickness: "18mm", grade: "BWR (Boiling Water Resistant)", ratePerSqft: 95, ratePerSheet: 3040 },
  { id: "pdb-7", brand: "Action Tesa", size: "8x4", thickness: "18mm", grade: "Calibrated HDMR", ratePerSqft: 80, ratePerSheet: 2560 },
  { id: "pdb-8", brand: "Saburi", size: "8x4", thickness: "18mm", grade: "MR (Moisture Resistant)", ratePerSqft: 70, ratePerSheet: 2240 },
];

export const initialLaminateBrands = [
  { id: "lb-1", name: "Royale Touche" },
  { id: "lb-2", name: "Merino" },
  { id: "lb-3", name: "CenturyLaminates" },
  { id: "lb-4", name: "Greenlam" },
  { id: "lb-5", name: "Formica" },
  { id: "lb-6", name: "Offberg" },
];

export const initialLaminateDb: LaminateDatabaseItem[] = [
  { id: "ldb-1", brand: "Royale Touche", sheetSize: "8x4", thickness: "1.0mm", finishType: "High Gloss", ratePerSheet: 2400 },
  { id: "ldb-2", brand: "Merino", sheetSize: "8x4", thickness: "1.0mm", finishType: "SF Matte", ratePerSheet: 1850 },
  { id: "ldb-3", brand: "CenturyLaminates", sheetSize: "8x4", thickness: "1.0mm", finishType: "Textured Wood", ratePerSheet: 2100 },
  { id: "ldb-4", brand: "Greenlam", sheetSize: "8x4", thickness: "0.8mm", finishType: "SF Standard", ratePerSheet: 1350 },
  { id: "ldb-5", brand: "Offberg", sheetSize: "8x4", thickness: "0.7mm (Liner)", finishType: "White Liner", ratePerSheet: 850 },
];

export const initialHardwareDb: HardwareItem[] = [
  { id: "hw-1", name: "Soft Close Auto Hinges (3D)", category: "Hinges", brand: "Godrej / Hettich", unit: "Pair", rate: 280, stockQty: 45, minStockAlert: 10 },
  { id: "hw-2", name: "Telescopic Drawer Channel 18\"", category: "Drawer Channel", brand: "Ebco", unit: "Set", rate: 380, stockQty: 18, minStockAlert: 5 },
  { id: "hw-3", name: "Tandem Box Drawer System 20\"", category: "Tandem", brand: "Hafele", unit: "Set", rate: 3200, stockQty: 6, minStockAlert: 2 },
  { id: "hw-4", name: "Designer Zinc Handle 8\"", category: "Handle", brand: "Kaff", unit: "Pcs", rate: 180, stockQty: 60, minStockAlert: 15 },
  { id: "hw-5", name: "Concealed Profile Handle (Aluminum)", category: "Profile Handle", brand: "General", unit: "Feet", rate: 120, stockQty: 80, minStockAlert: 20 },
  { id: "hw-6", name: "Computerized Drawer Lock", category: "Lock", brand: "Godrej", unit: "Pcs", rate: 250, stockQty: 12, minStockAlert: 4 },
  { id: "hw-7", name: "Door Magnet Catcher Heavy", category: "Magnet", brand: "Local", unit: "Pcs", rate: 35, stockQty: 100, minStockAlert: 25 },
  { id: "hw-8", name: "Star Screw 1.5\" (Box of 500)", category: "Screw", brand: "Unbrako", unit: "Box", rate: 320, stockQty: 15, minStockAlert: 3 },
  { id: "hw-9", name: "Paneling Nails 1\" (1 Kg)", category: "Nail", brand: "General", unit: "Kg", rate: 110, stockQty: 8, minStockAlert: 2 },
  { id: "hw-10", name: "PVC Edge Band Tape 22x0.8mm (50m)", category: "PVC Edge Band", brand: "Rehau", unit: "Roll", rate: 450, stockQty: 12, minStockAlert: 3 },
  { id: "hw-11", name: "Fevicol SH Synthetic Resin (5kg)", category: "Fevicol", brand: "Pidilite", unit: "Kg", rate: 1250, stockQty: 5, minStockAlert: 2 },
  { id: "hw-12", name: "Silicone Clear Sealant Tube", category: "Silicone", brand: "Pidilite", unit: "Pcs", rate: 220, stockQty: 10, minStockAlert: 3 },
  { id: "hw-13", name: "LED Profile Light Channel 2m", category: "LED Profile", brand: "Wipro", unit: "Length", rate: 350, stockQty: 14, minStockAlert: 4 },
  { id: "hw-14", name: "Fluted Toughened Glass 6mm", category: "Glass", brand: "Saint Gobain", unit: "SqFt", rate: 220, stockQty: 50, minStockAlert: 10 },
  { id: "hw-15", name: "LED Touch Mirror 5mm", category: "Mirror", brand: "Modiguard", unit: "SqFt", rate: 350, stockQty: 30, minStockAlert: 10 },
  { id: "hw-16", name: "Sliding Wardrobe Track Kit 2 Door", category: "Sliding Kit", brand: "Ebco", unit: "Set", rate: 2800, stockQty: 4, minStockAlert: 2 },
];

export const initialFurnitureTypes: FurnitureTypeItem[] = [
  { id: "ft-1", name: "Wardrobe", description: "Standard Bedroom Wardrobe with doors & drawers", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 2.5 },
  { id: "ft-2", name: "Kitchen", description: "Modular Kitchen Cabinets & Drawers", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 2.8 },
  { id: "ft-3", name: "TV Unit", description: "Living room wall mounted TV console", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 2.2 },
  { id: "ft-4", name: "Bed", description: "King/Queen bed frame with storage box", defaultPlywoodThickness: "19mm", defaultLaminateThickness: "0.8mm", estimatedSheetsPerSqft: 2.4 },
  { id: "ft-5", name: "Box Paneling", description: "Wall feature box paneling", defaultPlywoodThickness: "12mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 1.5 },
  { id: "ft-6", name: "Ceiling", description: "Wooden rafters or ceiling paneling", defaultPlywoodThickness: "12mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 1.3 },
  { id: "ft-7", name: "Study Table", description: "Writing desk with drawer unit & bookshelf", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 2.0 },
  { id: "ft-8", name: "Shoe Rack", description: "Entryway shoe storage cabinet", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "0.8mm", estimatedSheetsPerSqft: 2.2 },
  { id: "ft-9", name: "Mandir", description: "Wooden pooja mandir unit", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 2.5 },
  { id: "ft-10", name: "Dressing Table", description: "Vanity cabinet with mirror unit", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 2.1 },
  { id: "ft-11", name: "Office Furniture", description: "Workstation desks and filing cabinets", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 2.2 },
  { id: "ft-12", name: "Reception", description: "Front reception desk counter", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "1.25mm", estimatedSheetsPerSqft: 2.6 },
  { id: "ft-13", name: "Partition", description: "Room divider wooden partition", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 1.8 },
  { id: "ft-14", name: "Wall Panel", description: "Decorative wall cladding panel", defaultPlywoodThickness: "12mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 1.4 },
  { id: "ft-15", name: "Loft", description: "Overhead loft storage cabinets", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "0.8mm", estimatedSheetsPerSqft: 2.0 },
  { id: "ft-16", name: "Cabinet", description: "General storage side cabinet", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "1.0mm", estimatedSheetsPerSqft: 2.2 },
  { id: "ft-17", name: "Drawer Unit", description: "Pedestal modular drawer unit", defaultPlywoodThickness: "18mm", defaultLaminateThickness: "0.8mm", estimatedSheetsPerSqft: 2.3 },
];

export const initialCustomers: Customer[] = [
  { id: "cust-1", name: "Rajesh Sharma", mobile: "+91 98301 23456", address: "Sector 5, Salt Lake, Kolkata", siteAddress: "Flat 4B, Greenfield Heights, Rajarhat" },
  { id: "cust-2", name: "Amitabh Sen", mobile: "+91 94330 87654", address: "Garia Main Road, Kolkata", siteAddress: "Ballygunge Place, Kolkata" },
  { id: "cust-3", name: "Sanjay Kumar", mobile: "+91 89102 55432", address: "Howrah AC Market", siteAddress: "Shibpur, Howrah" },
];

export const initialProjects: Project[] = [
  {
    id: "proj-101",
    projectName: "Master Bedroom Wardrobe & TV Unit",
    projectDate: "2026-07-20",
    customer: initialCustomers[0],
    furnitureItems: [
      {
        id: "fitem-1",
        furnitureTypeId: "ft-1",
        furnitureTypeName: "Wardrobe",
        dimension: { height: 7, width: 8, depth: 2, quantity: 1, unit: "ft" },
        plywoodBrand: "Century",
        plywoodSize: "8x4",
        plywoodThickness: "18mm",
        plywoodGrade: "BWR (Boiling Water Resistant)",
        plywoodRate: 110,
        laminateOuterBrand: "Royale Touche",
        laminateOuterThickness: "1.0mm",
        laminateOuterRate: 2400,
        laminateInnerBrand: "Offberg",
        laminateInnerThickness: "0.7mm (Liner)",
        laminateInnerRate: 850,
        sqftArea: 56,
        calculatedPlywoodSheets: 5,
        calculatedLaminateSheets: 4,
        itemMaterialCost: 30500,
      }
    ],
    hardwareSelections: [
      { hardwareId: "hw-1", hardwareName: "Soft Close Auto Hinges (3D)", quantity: 6, rate: 280, totalCost: 1680 },
      { hardwareId: "hw-2", hardwareName: "Telescopic Drawer Channel 18\"", quantity: 3, rate: 380, totalCost: 1140 },
      { hardwareId: "hw-4", hardwareName: "Designer Zinc Handle 8\"", quantity: 8, rate: 180, totalCost: 1440 },
      { hardwareId: "hw-10", hardwareName: "PVC Edge Band Tape 22x0.8mm (50m)", quantity: 1, rate: 450, totalCost: 450 },
      { hardwareId: "hw-11", hardwareName: "Fevicol SH Synthetic Resin (5kg)", quantity: 1, rate: 1250, totalCost: 1250 },
    ],
    wastePercentage: 8,
    additionalCosts: {
      transport: 1200,
      loading: 400,
      unloading: 400,
      machineCost: 800,
      finishingCost: 1000,
      paintingCost: 0,
      polishingCost: 0,
      electricCost: 500,
      miscellaneous: 600,
    },
    labourSettings: {
      carpenterRatePerSqft: 180,
      helperRatePerDay: 600,
      helperDays: 4,
      painterRatePerSqft: 0,
      electricianFixed: 500,
      polishRatePerSqft: 0,
      installationFixed: 1500,
    },
    profitType: "percentage",
    profitValue: 20,
    applyGst: true,
    gstPercentage: 18,
    totalMaterialCost: 36460,
    totalLabourCost: 14480,
    totalAdditionalCost: 4900,
    totalWasteCost: 2916,
    baseCost: 58756,
    profitAmount: 11751,
    subTotal: 70507,
    gstAmount: 12691,
    grandTotal: 83198,
    advancePayment: 30000,
    paymentStatus: "Partial",
    status: "Saved",
    createdAt: "2026-07-20T10:00:00.000Z",
    updatedAt: "2026-07-20T10:00:00.000Z",
  }
];

export const initialCompanyProfile = {
  name: "Saniaj Interior & Woodcrafts",
  tagline: "Quality Plywood, Modular Kitchens & Furniture Contractor",
  phone: "+91 98300 00000",
  email: "saniaj786@gmail.com",
  address: "Grand Trunk Road, Wood Market, Kolkata, WB - 700001",
  gstin: "19AABCU9603R1ZM",
  logoUrl: "", // blank uses beautiful SVG badge icon
  defaultTerms: "1. 50% advance payment upon order confirmation.\n2. Balance 50% payment before final installation.\n3. Material price valid for 15 days from quote date.\n4. Site electricity & workspace to be provided by client.",
  authorizedSignatoryName: "Saniaj Manager",
};

export function loadAppState(): AppState {
  return getInitialState();
}

export function getInitialState(): AppState {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      return {
        ...parsed,
        // Ensure defaults if keys added in update
        plywoodSizes: parsed.plywoodSizes || initialPlywoodSizes,
        plywoodThicknesses: parsed.plywoodThicknesses || initialPlywoodThicknesses,
        plywoodBrands: parsed.plywoodBrands || initialPlywoodBrands,
        plywoodGrades: parsed.plywoodGrades || initialPlywoodGrades,
        plywoodDb: parsed.plywoodDb || initialPlywoodDb,
        laminateBrands: parsed.laminateBrands || initialLaminateBrands,
        laminateDb: parsed.laminateDb || initialLaminateDb,
        hardwareDb: parsed.hardwareDb || initialHardwareDb,
        furnitureTypes: parsed.furnitureTypes || initialFurnitureTypes,
        customers: parsed.customers || initialCustomers,
        projects: parsed.projects || initialProjects,
        companyProfile: parsed.companyProfile || initialCompanyProfile,
        stockLogs: parsed.stockLogs || [],
        settings: {
          darkMode: parsed.settings?.darkMode ?? false,
          language: parsed.settings?.language || "en",
          currencySymbol: parsed.settings?.currencySymbol || "₹",
          defaultWastePercentage: parsed.settings?.defaultWastePercentage || 8,
        }
      };
    }
  } catch (e) {
    console.error("Error reading localStorage:", e);
  }

  return {
    projects: initialProjects,
    customers: initialCustomers,
    plywoodSizes: initialPlywoodSizes,
    plywoodThicknesses: initialPlywoodThicknesses,
    plywoodBrands: initialPlywoodBrands,
    plywoodGrades: initialPlywoodGrades,
    plywoodDb: initialPlywoodDb,
    laminateBrands: initialLaminateBrands,
    laminateDb: initialLaminateDb,
    hardwareDb: initialHardwareDb,
    furnitureTypes: initialFurnitureTypes,
    labourRates: {
      carpenterRatePerSqft: 180,
      helperRatePerDay: 600,
      helperDays: 4,
      painterRatePerSqft: 35,
      electricianFixed: 500,
      polishRatePerSqft: 45,
      installationFixed: 1500,
    },
    stockLogs: [],
    companyProfile: initialCompanyProfile,
    settings: {
      darkMode: false,
      language: "en",
      currencySymbol: "₹",
      defaultWastePercentage: 8,
    },
  };
}

export function saveAppState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state to localStorage:", e);
  }
}

export function exportBackupJson(state: AppState) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `saniaj_furniture_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importBackupJson(jsonStr: string): AppState | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && Array.isArray(parsed.projects)) {
      return parsed as AppState;
    }
  } catch (e) {
    console.error("Failed to parse backup json:", e);
  }
  return null;
}

