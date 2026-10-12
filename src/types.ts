export type UnitType = 'ft' | 'in' | 'mm' | 'cm';

export type Language = 'en' | 'bn' | 'hi';

export interface Dimension {
  height: number;
  width: number;
  length?: number;
  depth?: number;
  thickness?: number;
  quantity: number;
  unit: UnitType;
}

export interface PlywoodSize {
  id: string;
  name: string; // e.g., "8x4", "7x4"
  lengthFt: number;
  widthFt: number;
  sqft: number;
  isCustom?: boolean;
}

export interface PlywoodThickness {
  id: string;
  value: string; // e.g. "18mm", "12mm", "6mm"
}

export interface PlywoodBrand {
  id: string;
  name: string; // e.g., "Century", "Greenply", "Kitply", "Action Tesa", "Saburi"
}

export interface PlywoodGrade {
  id: string;
  name: string; // e.g. "BWR", "BWP", "MR", "Commercial", "Marine"
}

export interface PlywoodDatabaseItem {
  id: string;
  brand: string;
  size: string; // e.g. "8x4"
  thickness: string; // e.g. "18mm"
  grade: string; // e.g. "BWR"
  ratePerSqft: number;
  ratePerSheet: number;
}

export interface LaminateBrand {
  id: string;
  name: string; // e.g. "Royale Touche", "Merino", "CenturyLaminates", "Greenlam"
}

export interface LaminateDatabaseItem {
  id: string;
  brand: string;
  sheetSize: string; // e.g. "8x4"
  thickness: string; // e.g. "1.0mm", "0.8mm"
  finishType: string; // e.g. "SF", "High Gloss", "Textured"
  ratePerSheet: number;
}

export type HardwareCategory = 
  | 'Hinges' 
  | 'Drawer Channel' 
  | 'Tandem' 
  | 'Handle' 
  | 'Lock' 
  | 'Magnet' 
  | 'Screw' 
  | 'Nail' 
  | 'PVC Edge Band' 
  | 'Fevicol' 
  | 'Silicone' 
  | 'LED Profile' 
  | 'Profile Handle' 
  | 'Glass' 
  | 'Mirror' 
  | 'Aluminium Profile' 
  | 'Sliding Kit' 
  | 'Custom';

export interface HardwareItem {
  id: string;
  name: string;
  category: HardwareCategory;
  brand?: string;
  unit: string; // e.g., "Pcs", "Pair", "Set", "Kg", "Roll", "Meter", "Feet"
  rate: number;
  stockQty: number;
  minStockAlert: number;
}

export interface FurnitureTypeItem {
  id: string;
  name: string; // e.g., "Wardrobe", "Kitchen", "TV Unit", "Bed"
  description?: string;
  defaultPlywoodThickness: string;
  defaultLaminateThickness: string;
  estimatedSheetsPerSqft: number; // multiplier formula
  isCustom?: boolean;
}

export interface FurnitureProjectItem {
  id: string;
  furnitureTypeId: string;
  furnitureTypeName: string;
  dimension: Dimension;
  plywoodBrand: string;
  plywoodSize: string;
  plywoodThickness: string;
  plywoodGrade: string;
  plywoodRate: number;
  
  laminateOuterBrand: string;
  laminateOuterThickness: string;
  laminateOuterRate: number;
  
  laminateInnerBrand?: string;
  laminateInnerThickness?: string;
  laminateInnerRate?: number;
  
  customNotes?: string;
  
  // Computed values
  sqftArea: number;
  calculatedPlywoodSheets: number;
  calculatedLaminateSheets: number;
  itemMaterialCost: number;
}

export interface AdditionalCost {
  transport: number;
  loading: number;
  unloading: number;
  machineCost: number;
  finishingCost: number;
  paintingCost: number;
  polishingCost: number;
  electricCost: number;
  miscellaneous: number;
}

export interface LabourCostSettings {
  carpenterRatePerSqft: number;
  helperRatePerDay: number;
  helperDays: number;
  painterRatePerSqft: number;
  electricianFixed: number;
  polishRatePerSqft: number;
  installationFixed: number;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  siteAddress: string;
  email?: string;
}

export interface Project {
  id: string;
  projectName: string;
  projectDate: string; // YYYY-MM-DD
  customer: Customer;
  furnitureItems: FurnitureProjectItem[];
  hardwareSelections: { hardwareId: string; hardwareName: string; quantity: number; rate: number; totalCost: number }[];
  
  wastePercentage: number; // default 8%
  additionalCosts: AdditionalCost;
  labourSettings: LabourCostSettings;
  
  profitType: 'percentage' | 'fixed';
  profitValue: number; // e.g. 20 for 20% or 15000 for ₹15000 fixed
  
  applyGst: boolean;
  gstPercentage: number; // e.g. 18%
  
  // Calculated financial totals
  totalMaterialCost: number;
  totalLabourCost: number;
  totalAdditionalCost: number;
  totalWasteCost: number;
  baseCost: number;
  profitAmount: number;
  subTotal: number; // Base + Profit
  gstAmount: number;
  grandTotal: number;
  
  // Payment Tracking
  advancePayment: number;
  paymentStatus: 'Pending' | 'Partial' | 'Paid';
  
  termsAndConditions?: string;
  status: 'Draft' | 'Saved' | 'Quoted' | 'In Progress' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface StockLog {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  type: 'ADD' | 'DEDUCT';
  quantity: number;
  supplier?: string;
  rate?: number;
  totalAmount?: number;
  date: string;
  note?: string;
}

export interface CompanyProfile {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  logoUrl: string; // base64 or placeholder
  defaultTerms: string;
  authorizedSignatoryName: string;
}

export interface AppState {
  projects: Project[];
  customers: Customer[];
  plywoodSizes: PlywoodSize[];
  plywoodThicknesses: PlywoodThickness[];
  plywoodBrands: PlywoodBrand[];
  plywoodGrades: PlywoodGrade[];
  plywoodDb: PlywoodDatabaseItem[];
  
  laminateBrands: LaminateBrand[];
  laminateDb: LaminateDatabaseItem[];
  
  hardwareDb: HardwareItem[];
  furnitureTypes: FurnitureTypeItem[];
  labourRates: LabourCostSettings;
  
  stockLogs: StockLog[];
  companyProfile: CompanyProfile;
  
  settings: {
    darkMode: boolean;
    language: Language;
    currencySymbol: string;
    defaultWastePercentage: number;
  };
}
