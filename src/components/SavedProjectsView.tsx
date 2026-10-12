import React, { useState } from "react";
import {
  FolderOpen,
  Search,
  FileText,
  Edit,
  Trash2,
  Calendar,
  User,
  DollarSign,
  Download,
  CheckCircle,
  Clock,
  ChevronRight
} from "lucide-react";
import { AppState, Project } from "../types";
import { getText } from "../i18n/translations";
import { formatCurrency } from "../utils/calculator";

interface SavedProjectsViewProps {
  state: AppState;
  onSelectProjectForQuote: (projectId: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  setActiveTab: (tab: string) => void;
}

export const SavedProjectsView: React.FC<SavedProjectsViewProps> = ({
  state,
  onSelectProjectForQuote,
  onEditProject,
  onDeleteProject,
  setActiveTab,
}) => {
  const lang = state.settings.language;
  const curr = state.settings.currencySymbol;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredProjects = state.projects.filter((p) => {
    const matchesSearch =
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer?.mobile.includes(searchTerm);

    if (statusFilter === "ALL") return matchesSearch;
    return matchesSearch && p.paymentStatus === statusFilter;
  });

  const handleExportCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Project ID,Project Name,Customer Name,Mobile,Project Date,Grand Total,Payment Status\n";

    state.projects.forEach((p) => {
      csvContent += `"${p.id}","${p.projectName}","${p.customer?.name || ''}","${p.customer?.mobile || ''}","${p.projectDate}",${p.grandTotal},"${p.paymentStatus}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `furniture_projects_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <FolderOpen className="w-6 h-6 text-amber-600" />
            <span>{getText("savedProjects", lang)}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            View, edit, or generate quotes for saved carpentry & furniture projects ({state.projects.length} total).
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setActiveTab("new-project")}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project name, customer, or phone..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700 space-y-3">
          <FolderOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            No projects match your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base line-clamp-1">
                      {project.projectName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-0.5">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      <span>{project.customer?.name}</span>
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    project.paymentStatus === "Paid"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                      : project.paymentStatus === "Partial"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300"
                  }`}>
                    {project.paymentStatus}
                  </span>
                </div>

                {/* Furniture Summary Badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.furnitureItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                    >
                      {item.furnitureTypeName} ({item.sqftArea} sqft)
                    </span>
                  ))}
                </div>

                <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{project.projectDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{project.customer?.mobile}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Grand Total & Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Grand Total</span>
                  <span className="text-lg font-black text-amber-700 dark:text-amber-400">
                    {formatCurrency(project.grandTotal, curr)}
                  </span>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      onSelectProjectForQuote(project.id);
                      setActiveTab("quotation");
                    }}
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200 rounded-xl transition"
                    title="View Quotation"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onEditProject(project);
                      setActiveTab("new-project");
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 rounded-xl transition"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${project.projectName}"?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/50 rounded-xl transition"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
