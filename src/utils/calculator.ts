import { Dimension, UnitType } from "../types";

// Convert any dimension to Feet
export function convertToFeet(val: number, unit: UnitType): number {
  if (!val || isNaN(val)) return 0;
  switch (unit) {
    case 'ft':
      return val;
    case 'in':
      return val / 12;
    case 'mm':
      return val / 304.8;
    case 'cm':
      return val / 30.48;
    default:
      return val;
  }
}

// Convert Feet to target unit
export function convertFromFeet(valFt: number, unit: UnitType): number {
  if (!valFt || isNaN(valFt)) return 0;
  switch (unit) {
    case 'ft':
      return valFt;
    case 'in':
      return valFt * 12;
    case 'mm':
      return valFt * 304.8;
    case 'cm':
      return valFt * 30.48;
    default:
      return valFt;
  }
}

// Parse sheet size string like "8x4", "7x4", "6x4", "8x3" to SqFt
export function parseSheetSizeSqft(sizeStr: string): number {
  if (!sizeStr) return 32; // Default 8x4
  const parts = sizeStr.toLowerCase().split('x');
  if (parts.length === 2) {
    const l = parseFloat(parts[0].trim());
    const w = parseFloat(parts[1].trim());
    if (!isNaN(l) && !isNaN(w) && l > 0 && w > 0) {
      return l * w;
    }
  }
  return 32; // Default
}

// Calculate SqFt area for a furniture item
export function calculateSqft(dim: Dimension): number {
  const hFt = convertToFeet(dim.height, dim.unit);
  const wFt = convertToFeet(dim.width, dim.unit);
  const qty = dim.quantity || 1;
  return Number((hFt * wFt * qty).toFixed(2));
}

// Estimate Plywood Sheet count based on item dimensions and selected sheet size
export function calculatePlywoodSheets(dim: Dimension, sheetSizeSqft: number = 32, wastePercent: number = 8): number {
  const sqft = calculateSqft(dim);
  // Box 3D multiplier (~2.2x to 2.8x of front elevation for 5-sided cabinet with shelves)
  const multiplier = 2.5;
  const totalRawSqft = sqft * multiplier;
  const withWaste = totalRawSqft * (1 + wastePercent / 100);
  const sheets = Math.ceil(withWaste / sheetSizeSqft);
  return Math.max(1, sheets);
}

// Estimate Laminate Sheet count (Outer + Inner)
export function calculateLaminateSheets(dim: Dimension, sheetSizeSqft: number = 32, wastePercent: number = 8): number {
  const sqft = calculateSqft(dim);
  // Outer laminate covers front/sides (~1.2x elevation area), Inner liner covers shelf/inside (~1.5x)
  const totalLaminateSqft = sqft * 2.2;
  const withWaste = totalLaminateSqft * (1 + wastePercent / 100);
  return Math.max(1, Math.ceil(withWaste / sheetSizeSqft));
}

// Calculate Edge Banding length in meters
export function calculateEdgeBandMeters(dim: Dimension): number {
  const hFt = convertToFeet(dim.height, dim.unit);
  const wFt = convertToFeet(dim.width, dim.unit);
  const qty = dim.quantity || 1;
  // Perimeter in feet = 2 * (h + w) * qty * shelf factor 3
  const totalPerimeterFt = 2 * (hFt + wFt) * qty * 3;
  // Convert feet to meters (1 ft = 0.3048 m)
  return Math.ceil(totalPerimeterFt * 0.3048);
}

// Calculate Fevicol/Adhesive in KG (roughly 0.08 kg per sqft of laminate surface)
export function calculateFevicolKg(dim: Dimension): number {
  const sqft = calculateSqft(dim);
  const laminateArea = sqft * 2.2;
  const kg = laminateArea * 0.08;
  return Number(Math.max(1, Math.ceil(kg)));
}

// Calculate Screws in Box/Pcs
export function calculateScrewsQty(dim: Dimension): number {
  const sqft = calculateSqft(dim);
  // Approx 15 screws per sqft of furniture front
  return Math.max(50, Math.ceil(sqft * 12));
}

// Calculate Hinges pairs count
export function calculateHingesPairs(dim: Dimension): number {
  const hFt = convertToFeet(dim.height, dim.unit);
  const wFt = convertToFeet(dim.width, dim.unit);
  const qty = dim.quantity || 1;
  // Doors estimation: 1 door per 2 ft width. Hinges per door: 2 hinges if h <= 4ft, 3 hinges if h <= 7ft, 4 if higher.
  const doorsPerUnit = Math.max(1, Math.ceil(wFt / 1.8));
  const hingesPerDoor = hFt > 6.5 ? 4 : hFt > 4 ? 3 : 2;
  const totalHinges = doorsPerUnit * hingesPerDoor * qty;
  // Convert individual hinges to pairs
  return Math.ceil(totalHinges / 2);
}

// Calculate Handles count
export function calculateHandlesQty(dim: Dimension): number {
  const wFt = convertToFeet(dim.width, dim.unit);
  const qty = dim.quantity || 1;
  const doors = Math.max(1, Math.ceil(wFt / 1.8));
  const drawers = Math.max(0, Math.floor(wFt / 2));
  return (doors + drawers) * qty;
}

// Format currency
export function formatCurrency(amount: number, symbol: string = "₹"): string {
  if (isNaN(amount)) return `${symbol}0`;
  return `${symbol}${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}
