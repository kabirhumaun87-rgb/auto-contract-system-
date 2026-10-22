/**
 * Auto Contract System
 * Main Application Orchestrator
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ContractWizard } from './components/ContractWizard';
import { AllContractsView } from './components/AllContractsView';
import { ContractorDatabaseView } from './components/ContractorDatabaseView';
import { BOQEditorView } from './components/BOQEditorView';
import { TemplateManagementView } from './components/TemplateManagementView';
import { GeneratedDocsView } from './components/GeneratedDocsView';
import { BackupRestoreView } from './components/BackupRestoreView';
import { SettingsView } from './components/SettingsView';
import { HelpAboutView } from './components/HelpAboutView';
import { ContractPreviewModal } from './components/ContractPreviewModal';
import { InstallDesktopModal } from './components/InstallDesktopModal';
import { GeminiChatView } from './components/GeminiChatView';
import { GeminiQuickChatWidget } from './components/GeminiQuickChatWidget';

import { ContractProject, Contractor, GeneratedDocumentRecord } from './types/contract';
import { StorageService } from './services/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [projects, setProjects] = useState<ContractProject[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocumentRecord[]>([]);
  
  // Active contract for Wizard or Preview
  const [editingProject, setEditingProject] = useState<ContractProject | null>(null);
  const [previewProject, setPreviewProject] = useState<ContractProject | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  
  // Desktop Installation Modal & PWA Prompt
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  // Initialize and load persistent data
  const refreshData = () => {
    StorageService.initSeedData();
    setProjects(StorageService.getProjects());
    setContractors(StorageService.getContractors());
    setGeneratedDocs(StorageService.getGeneratedDocs());
  };

  useEffect(() => {
    refreshData();

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleTriggerInstallPrompt = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
        setIsInstallModalOpen(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleNewContract = () => {
    setEditingProject(null);
    setActiveTab('create_contract');
  };

  const handleEditContract = (project: ContractProject) => {
    setEditingProject(project);
    setActiveTab('create_contract');
  };

  const handleSaveContract = (saved: ContractProject) => {
    refreshData();
    setEditingProject(saved);
  };

  const handleDeleteContract = (id: string) => {
    StorageService.deleteProject(id);
    refreshData();
  };

  const handleDuplicateContract = (id: string) => {
    const dup = StorageService.duplicateProject(id);
    refreshData();
    if (dup) {
      setEditingProject(dup);
      setActiveTab('create_contract');
    }
  };

  const handleSaveContractor = (contractor: Contractor) => {
    StorageService.saveContractor(contractor);
    refreshData();
  };

  const handleDeleteContractor = (id: string) => {
    StorageService.deleteContractor(id);
    refreshData();
  };

  const draftCount = projects.filter(p => p.status === 'draft').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 font-sans antialiased">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'create_contract') {
            setEditingProject(null);
          }
        }}
        draftCount={draftCount}
        onOpenInstallGuide={() => setIsInstallModalOpen(true)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activeTab={activeTab}
          projects={projects}
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          onNewContract={handleNewContract}
          onSelectProject={handleEditContract}
          onPreviewProject={(p) => setPreviewProject(p)}
          onPrintPreview={projects[0] ? () => setPreviewProject(projects[0]) : undefined}
          canPrint={projects.length > 0}
          onOpenInstallGuide={() => setIsInstallModalOpen(true)}
          onOpenChat={() => setActiveTab('gemini_chat')}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                projects={projects}
                generatedDocs={generatedDocs}
                searchQuery={globalSearchQuery}
                onNavigate={setActiveTab}
                onEditProject={handleEditContract}
                onPreviewProject={(p) => setPreviewProject(p)}
                onDuplicateProject={handleDuplicateContract}
              />
            )}

            {activeTab === 'create_contract' && (
              <ContractWizard
                initialProject={editingProject}
                contractors={contractors}
                onSave={handleSaveContract}
                onCancel={() => {
                  setEditingProject(null);
                  setActiveTab('all_contracts');
                }}
                onOpenPreview={(p) => setPreviewProject(p)}
              />
            )}

            {activeTab === 'all_contracts' && (
              <AllContractsView
                projects={projects}
                searchQuery={globalSearchQuery}
                onNewContract={handleNewContract}
                onEditContract={handleEditContract}
                onPreviewContract={(p) => setPreviewProject(p)}
                onDuplicateContract={handleDuplicateContract}
                onDeleteContract={handleDeleteContract}
              />
            )}

            {activeTab === 'contractors' && (
              <ContractorDatabaseView
                contractors={contractors}
                onSaveContractor={handleSaveContractor}
                onDeleteContractor={handleDeleteContractor}
              />
            )}

            {activeTab === 'gemini_chat' && (
              <GeminiChatView
                projects={projects}
                initialActiveProjectId={editingProject?.id}
              />
            )}

            {activeTab === 'templates' && (
              <TemplateManagementView />
            )}

            {activeTab === 'generated_docs' && (
              <GeneratedDocsView
                records={generatedDocs}
                projects={projects}
                onPreviewProject={(p) => setPreviewProject(p)}
              />
            )}

            {activeTab === 'backup' && (
              <BackupRestoreView onRefreshData={refreshData} />
            )}

            {activeTab === 'settings' && (
              <SettingsView />
            )}

            {activeTab === 'help' && (
              <HelpAboutView onOpenInstallModal={() => setIsInstallModalOpen(true)} />
            )}
          </div>
        </main>
      </div>

      {/* 3. Full 12-Page Print & Interactive Preview Modal */}
      {previewProject && (
        <ContractPreviewModal
          project={previewProject}
          onClose={() => setPreviewProject(null)}
        />
      )}

      {/* 4. Desktop Installation Guide & 1-Click Trigger Modal */}
      <InstallDesktopModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onTriggerInstallPrompt={handleTriggerInstallPrompt}
        isInstallable={isInstallable}
      />

      {/* 5. Floating Gemini Quick Chat Widget (Available Across All Views) */}
      <GeminiQuickChatWidget
        onOpenFullChat={() => setActiveTab('gemini_chat')}
        activeProject={editingProject}
      />
    </div>
  );
}
