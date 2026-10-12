import React, { useState } from "react";
import {
  FileText,
  Printer,
  Download,
  Share2,
  Mail,
  MessageCircle,
  Building,
  Phone,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  FileCheck
} from "lucide-react";
import { AppState, Project } from "../types";
import { getText } from "../i18n/translations";
import { formatCurrency } from "../utils/calculator";
import { generatePdfFromElement } from "../utils/pdfGenerator";

interface QuotationViewProps {
  state: AppState;
  selectedProject?: Project | null;
  onSelectProject: (projectId: string) => void;
}

export const QuotationView: React.FC<QuotationViewProps> = ({
  state,
  selectedProject,
  onSelectProject,
}) => {
  const lang = state.settings.language;
  const curr = state.settings.currencySymbol;
  const company = state.companyProfile;

  // Active project selection
  const currentProject = selectedProject || state.projects[0] || null;
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    if (!currentProject) return;
    setIsExporting(true);
    await generatePdfFromElement("quotation-print-container", `Quotation_${currentProject.projectName.replace(/\s+/g, "_")}`);
    setIsExporting(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsapp = () => {
    if (!currentProject) return;
    const text = `*QUOTATION FROM ${company.name.toUpperCase()}*\n\n` +
      `*Project:* ${currentProject.projectName}\n` +
      `*Customer:* ${currentProject.customer?.name}\n` +
      `*Grand Total:* ${formatCurrency(currentProject.grandTotal, curr)}\n` +
      `*Payment Status:* ${currentProject.paymentStatus}\n\n` +
      `Thank you for choosing ${company.name}! Contact: ${company.phone}`;

    const url = `https://wa.me/${currentProject.customer?.mobile?.replace(/[^0-9]/g, "") || ""}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleShareEmail = () => {
    if (!currentProject) return;
    const subject = `Furniture Quotation - ${currentProject.projectName}`;
    const body = `Dear ${currentProject.customer?.name},\n\nPlease find your furniture quotation summary for ${currentProject.projectName}:\n\nGrand Total: ${formatCurrency(currentProject.grandTotal, curr)}\nSite Address: ${currentProject.customer?.siteAddress}\n\nRegards,\n${company.name}\n${company.phone}`;
    window.open(`mailto:${currentProject.customer?.email || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Action Header Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Project Switcher Selector */}
        <div className="w-full sm:w-auto flex items-center space-x-2">
          <FileText className="w-5 h-5 text-amber-600" />
          <select
            value={currentProject?.id || ""}
            onChange={(e) => onSelectProject(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold text-xs focus:outline-none"
          >
            {state.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName} - {p.customer?.name} ({formatCurrency(p.grandTotal, curr)})
              </option>
            ))}
          </select>
        </div>

        {/* Export / Share Actions */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting || !currentProject}
            className="flex items-center space-x-1 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? "Generating..." : "Download PDF"}</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={!currentProject}
            className="flex items-center space-x-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleShareWhatsapp}
            disabled={!currentProject}
            className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleShareEmail}
            disabled={!currentProject}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-sm"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>
        </div>
      </div>

      {/* Printable Quotation Document Container */}
      {!currentProject ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold">No project selected for quotation.</p>
        </div>
      ) : (
        <div
          id="quotation-print-container"
          className="bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 space-y-6 font-sans print:shadow-none print:border-none print:p-0"
        >
          {/* Company Branding & Header */}
          <div className="flex justify-between items-start border-b-2 border-amber-800 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-800 text-amber-100 flex items-center justify-center font-black text-2xl shadow-md border-2 border-amber-600">
                S
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-amber-950 uppercase">
                  {company.name}
                </h1>
                <p className="text-xs font-bold text-amber-700">{company.tagline}</p>
                <p className="text-[11px] text-slate-600 mt-1 max-w-md">{company.address}</p>
                <p className="text-[11px] text-slate-600 font-semibold">
                  Phone: {company.phone} | Email: {company.email}
                </p>
                {company.gstin && (
                  <p className="text-[11px] font-bold text-amber-900 mt-0.5">
                    GSTIN: {company.gstin}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-amber-100 text-amber-900 font-black px-3 py-1 rounded-lg text-xs uppercase tracking-widest mb-2">
                ESTIMATE QUOTATION
              </span>
              <p className="text-xs font-bold text-slate-700">Quote ID: #{currentProject.id.slice(-6).toUpperCase()}</p>
              <p className="text-xs text-slate-500">Date: {currentProject.projectDate}</p>
            </div>
          </div>

          {/* Customer & Site Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 text-xs">
            <div>
              <span className="font-extrabold text-amber-900 uppercase tracking-wider block mb-1">
                Client Information:
              </span>
              <p className="font-bold text-slate-900 text-sm">{currentProject.customer?.name}</p>
              <p className="text-slate-600">Phone: {currentProject.customer?.mobile}</p>
              <p className="text-slate-600">{currentProject.customer?.address}</p>
            </div>

            <div>
              <span className="font-extrabold text-amber-900 uppercase tracking-wider block mb-1">
                Site & Project Location:
              </span>
              <p className="font-bold text-slate-900">{currentProject.projectName}</p>
              <p className="text-slate-600">{currentProject.customer?.siteAddress || "Site address same as client address"}</p>
            </div>
          </div>

          {/* Itemized Furniture Specifications Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              1. Furniture Specification & Item Breakdown
            </h3>
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-amber-900 text-white font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">S.No</th>
                  <th className="p-2.5">Furniture Type</th>
                  <th className="p-2.5">Dimensions & Qty</th>
                  <th className="p-2.5">Area</th>
                  <th className="p-2.5">Plywood & Laminate Specs</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentProject.furnitureItems.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-2.5 font-bold text-slate-600">{idx + 1}</td>
                    <td className="p-2.5 font-bold text-slate-900">{item.furnitureTypeName}</td>
                    <td className="p-2.5">
                      {item.dimension.height}H × {item.dimension.width}W × {item.dimension.depth || 0}D {item.dimension.unit} ({item.dimension.quantity} Qty)
                    </td>
                    <td className="p-2.5 font-bold text-amber-800">{item.sqftArea} sq.ft</td>
                    <td className="p-2.5 text-[11px]">
                      <span className="font-semibold block">{item.plywoodBrand} {item.plywoodThickness} ({item.plywoodGrade})</span>
                      <span className="text-slate-500">Outer: {item.laminateOuterBrand} ({item.laminateOuterThickness})</span>
                    </td>
                    <td className="p-2.5 font-extrabold text-right text-slate-900">
                      {formatCurrency(item.itemMaterialCost, curr)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hardware & Extra Expenses Table */}
          {currentProject.hardwareSelections.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                2. Fittings, Hardware & Accessories
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                {currentProject.hardwareSelections.map((hw, idx) => (
                  <div key={idx} className="flex justify-between p-1 border-b border-slate-200">
                    <span className="font-medium text-slate-700">{hw.hardwareName} ({hw.quantity}x)</span>
                    <span className="font-bold">{formatCurrency(hw.totalCost, curr)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grand Financial Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Terms & Conditions
              </h4>
              <div className="text-[11px] text-slate-600 whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                {currentProject.termsAndConditions || company.defaultTerms}
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-amber-200">
                <span className="text-slate-600">Material Total:</span>
                <span className="font-bold">{formatCurrency(currentProject.totalMaterialCost, curr)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-200">
                <span className="text-slate-600">Labour & Charges:</span>
                <span className="font-bold">{formatCurrency(currentProject.totalLabourCost + currentProject.totalAdditionalCost, curr)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-200">
                <span className="text-slate-600">Wastage Margin ({currentProject.wastePercentage}%):</span>
                <span className="font-bold">{formatCurrency(currentProject.totalWasteCost, curr)}</span>
              </div>
              {currentProject.applyGst && (
                <div className="flex justify-between py-1 border-b border-amber-200">
                  <span className="text-slate-600">GST Tax ({currentProject.gstPercentage}%):</span>
                  <span className="font-bold">{formatCurrency(currentProject.gstAmount, curr)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 font-black text-sm text-amber-950 border-t-2 border-amber-800">
                <span>Grand Total:</span>
                <span className="text-lg text-amber-900">{formatCurrency(currentProject.grandTotal, curr)}</span>
              </div>
              {currentProject.advancePayment > 0 && (
                <div className="flex justify-between text-[11px] text-emerald-800 font-bold pt-1">
                  <span>Advance Received:</span>
                  <span>{formatCurrency(currentProject.advancePayment, curr)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Authorized Signatures */}
          <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs font-semibold text-slate-700">
            <div>
              <p className="text-slate-400">Client Signature:</p>
              <div className="h-10 border-b border-dashed border-slate-400 w-40 mt-2"></div>
            </div>

            <div className="text-right">
              <p className="text-slate-400">For {company.name}:</p>
              <div className="h-10 border-b border-dashed border-slate-400 w-44 mt-2 mb-1"></div>
              <p className="font-extrabold text-amber-950">{company.authorizedSignatoryName}</p>
              <p className="text-[10px] text-slate-500">Authorized Signatory</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
