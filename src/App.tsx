import React, { useState, useEffect } from "react";
import { AppState, Project, Language } from "./types";
import { loadAppState, saveAppState } from "./lib/storage";
import { Navbar } from "./components/Navbar";
import { DashboardView } from "./components/DashboardView";
import { ProjectFormView } from "./components/ProjectFormView";
import { SavedProjectsView } from "./components/SavedProjectsView";
import { QuotationView } from "./components/QuotationView";
import { DatabaseAdminView } from "./components/DatabaseAdminView";
import { InventoryView } from "./components/InventoryView";
import { ReportsView } from "./components/ReportsView";
import { SettingsView } from "./components/SettingsView";
import { AICuttingOptimizerView } from "./components/AICuttingOptimizerView";

export default function App() {
  const [state, setState] = useState<AppState>(loadAppState);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Project selected for quotation or editing
  const [selectedProjectIdForQuote, setSelectedProjectIdForQuote] = useState<string | null>(
    state.projects[0]?.id || null
  );
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(state.settings.darkMode);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, darkMode },
    }));
  }, [darkMode]);

  // Save state on changes
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Language change handler
  const setLanguage = (lang: Language) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, language: lang },
    }));
  };

  // Save or Update Project Handler
  const handleSaveProject = (savedProj: Project) => {
    setState((prev) => {
      const exists = prev.projects.some((p) => p.id === savedProj.id);
      let updatedProjects = exists
        ? prev.projects.map((p) => (p.id === savedProj.id ? savedProj : p))
        : [savedProj, ...prev.projects];

      // Also ensure customer is saved/updated in customer list
      let updatedCustomers = [...prev.customers];
      if (savedProj.customer && savedProj.customer.name) {
        const custIdx = updatedCustomers.findIndex(
          (c) => c.mobile === savedProj.customer.mobile || c.id === savedProj.customer.id
        );
        if (custIdx >= 0) {
          updatedCustomers[custIdx] = savedProj.customer;
        } else {
          updatedCustomers.push(savedProj.customer);
        }
      }

      return {
        ...prev,
        projects: updatedProjects,
        customers: updatedCustomers,
      };
    });

    setSelectedProjectIdForQuote(savedProj.id);
    setEditingProject(null);
    setActiveTab("quotation");
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Low Stock Counter
  const lowStockCount = state.hardwareDb.filter((hw) => hw.stockQty <= hw.minStockAlert).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === "new-project" && activeTab !== "new-project") {
            setEditingProject(null);
          }
          setActiveTab(tab);
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={state.settings.language}
        setLanguage={setLanguage}
        lowStockCount={lowStockCount}
        projectCount={state.projects.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "dashboard" && (
          <DashboardView
            state={state}
            setActiveTab={setActiveTab}
            onSelectProjectForQuote={(id) => setSelectedProjectIdForQuote(id)}
          />
        )}

        {activeTab === "new-project" && (
          <ProjectFormView
            state={state}
            onSaveProject={handleSaveProject}
            editingProject={editingProject}
            onCancel={() => {
              setEditingProject(null);
              setActiveTab("saved-projects");
            }}
          />
        )}

        {activeTab === "saved-projects" && (
          <SavedProjectsView
            state={state}
            onSelectProjectForQuote={(id) => setSelectedProjectIdForQuote(id)}
            onEditProject={(proj) => {
              setEditingProject(proj);
              setActiveTab("new-project");
            }}
            onDeleteProject={handleDeleteProject}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "quotation" && (
          <QuotationView
            state={state}
            selectedProject={state.projects.find((p) => p.id === selectedProjectIdForQuote)}
            onSelectProject={(id) => setSelectedProjectIdForQuote(id)}
          />
        )}

        {activeTab === "inventory" && (
          <InventoryView
            state={state}
            onUpdateState={setState}
          />
        )}

        {activeTab === "admin-db" && (
          <DatabaseAdminView
            state={state}
            onUpdateState={setState}
          />
        )}

        {activeTab === "ai-optimizer" && (
          <AICuttingOptimizerView
            state={state}
          />
        )}

        {activeTab === "reports" && (
          <ReportsView
            state={state}
          />
        )}

        {activeTab === "settings" && (
          <SettingsView
            state={state}
            onUpdateState={setState}
            setDarkMode={setDarkMode}
            darkMode={darkMode}
            setLanguage={setLanguage}
          />
        )}
      </main>
    </div>
  );
}
