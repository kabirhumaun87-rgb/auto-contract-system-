import { ContractProject, Contractor, GeneratedDocumentRecord, AuditLog } from '../types/contract';
import { INITIAL_SAMPLE_PROJECT } from '../data/template_mappings';

const STORAGE_KEYS = {
  PROJECTS: 'acs_projects_v1',
  CONTRACTORS: 'acs_contractors_v1',
  GENERATED_DOCS: 'acs_generated_docs_v1',
  AUDIT_LOGS: 'acs_audit_logs_v1',
  SETTINGS: 'acs_settings_v1'
};

const SAMPLE_CONTRACTORS: Contractor[] = [
  {
    id: 'c1',
    firmName: 'M/S Bengal Engineering & Construction Ltd.',
    proprietorName: 'Engr. Tariqul Islam',
    address: 'House 42, Road 11, Banani, Dhaka-1213',
    contactPerson: 'Md. Tariqul Islam',
    mobileNumber: '+880 1711-234567',
    email: 'bengal.engg.bd@gmail.com',
    registrationNumber: 'MES/DCA/2022/D-104',
    mesEnlistmentCategory: 'D',
    otherDepartmentDetails: 'PWD Class-I Enlisted, RHD Enlisted',
    securityClearanceRef: 'DGFI/Sec/Clear/2025/8892 Dt. 14 Jan 2025',
    tinNumber: '782910481239',
    vatBinNumber: '002938471-0101',
    bankSecurityRef: 'Trust Bank Ltd, Principal Br. BG-4402/26',
    authorizedSignatoryName: 'Engr. Tariqul Islam',
    authorizedSignatoryDesignation: 'Managing Director',
    remarks: 'Approved Contractor for Cantt Works',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'c2',
    firmName: 'M/S Meghna Builders & Interior',
    proprietorName: 'Kazi Farhad Hossain',
    address: 'Plot 18, Block D, Mirpur-12, Dhaka',
    contactPerson: 'Kazi Farhad',
    mobileNumber: '+880 1819-876543',
    email: 'meghna.builders@yahoo.com',
    registrationNumber: 'MES/DCA/2023/E-058',
    mesEnlistmentCategory: 'E',
    otherDepartmentDetails: 'EED Enlisted',
    securityClearanceRef: 'DGFI/Clear/2024/4412 Dt. 09 May 2024',
    tinNumber: '554433221100',
    vatBinNumber: '001122334-0202',
    bankSecurityRef: 'Dhaka Bank Ltd, Banani Br.',
    authorizedSignatoryName: 'Kazi Farhad Hossain',
    authorizedSignatoryDesignation: 'Proprietor',
    remarks: 'Specialized in interior renovation & joinery',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class StorageService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // --- Initial Data Seeding ---
  public static initSeedData(): void {
    if (!this.isBrowser()) return;

    if (!localStorage.getItem(STORAGE_KEYS.CONTRACTORS)) {
      localStorage.setItem(STORAGE_KEYS.CONTRACTORS, JSON.stringify(SAMPLE_CONTRACTORS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      const initialProject: ContractProject = {
        ...INITIAL_SAMPLE_PROJECT,
        id: 'proj-mes-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([initialProject]));
      this.logAudit('INITIAL_SEED', 'System seeded with approved reference PW-2 contract project.', initialProject.id);
    }
  }

  // --- Projects CRUD ---
  public static getProjects(): ContractProject[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static getProjectById(id: string): ContractProject | null {
    const list = this.getProjects();
    return list.find(p => p.id === id) || null;
  }

  public static saveProject(project: ContractProject): ContractProject {
    const list = this.getProjects();
    const index = list.findIndex(p => p.id === project.id);
    const updatedProject = {
      ...project,
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      list[index] = updatedProject;
      this.logAudit('UPDATE_PROJECT', `Updated contract ${project.contractNo}`, project.id);
    } else {
      updatedProject.createdAt = new Date().toISOString();
      list.unshift(updatedProject);
      this.logAudit('CREATE_PROJECT', `Created contract ${project.contractNo}`, project.id);
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(list));
    }
    return updatedProject;
  }

  public static deleteProject(id: string): boolean {
    const list = this.getProjects();
    const target = list.find(p => p.id === id);
    const filtered = list.filter(p => p.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
      this.logAudit('DELETE_PROJECT', `Deleted contract ${target?.contractNo || id}`, id);
    }
    return true;
  }

  public static duplicateProject(id: string): ContractProject | null {
    const original = this.getProjectById(id);
    if (!original) return null;

    const newId = `proj-${Date.now()}`;
    const duplicated: ContractProject = {
      ...original,
      id: newId,
      contractNo: `${original.contractNo} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.saveProject(duplicated);
  }

  // --- Contractors CRUD ---
  public static getContractors(): Contractor[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTRACTORS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveContractor(contractor: Contractor): Contractor {
    const list = this.getContractors();
    const index = list.findIndex(c => c.id === contractor.id);
    const updated = { ...contractor, updatedAt: new Date().toISOString() };

    if (index >= 0) {
      list[index] = updated;
      this.logAudit('UPDATE_CONTRACTOR', `Updated contractor ${contractor.firmName}`, contractor.id);
    } else {
      updated.createdAt = new Date().toISOString();
      list.unshift(updated);
      this.logAudit('CREATE_CONTRACTOR', `Added contractor ${contractor.firmName}`, contractor.id);
    }

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CONTRACTORS, JSON.stringify(list));
    }
    return updated;
  }

  public static deleteContractor(id: string): boolean {
    const list = this.getContractors();
    const target = list.find(c => c.id === id);
    const filtered = list.filter(c => c.id !== id);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CONTRACTORS, JSON.stringify(filtered));
      this.logAudit('DELETE_CONTRACTOR', `Deleted contractor ${target?.firmName || id}`, id);
    }
    return true;
  }

  // --- Generated Documents Log ---
  public static getGeneratedDocs(): GeneratedDocumentRecord[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GENERATED_DOCS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveGeneratedDoc(record: GeneratedDocumentRecord): void {
    const list = this.getGeneratedDocs();
    list.unshift(record);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.GENERATED_DOCS, JSON.stringify(list));
      this.logAudit('GENERATE_DOCUMENT', `Generated ${record.fileFormat} for ${record.contractNo}`, record.projectId);
    }
  }

  // --- Audit Logs ---
  public static logAudit(action: string, details: string, entityId?: string): void {
    if (!this.isBrowser()) return;
    try {
      const logs = this.getAuditLogs();
      const newLog: AuditLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        action,
        details,
        entityId
      };
      logs.unshift(newLog);
      // keep latest 200 logs
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 200)));
    } catch {
      // Ignore storage errors for audit logging
    }
  }

  public static getAuditLogs(): AuditLog[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // --- Backup and Restore ---
  public static exportFullBackupJson(): string {
    return JSON.stringify({
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      projects: this.getProjects(),
      contractors: this.getContractors(),
      generatedDocs: this.getGeneratedDocs(),
      auditLogs: this.getAuditLogs()
    }, null, 2);
  }

  public static importFullBackupJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (!data.projects || !Array.isArray(data.projects)) {
        throw new Error('Invalid backup file structure: missing projects array.');
      }
      if (this.isBrowser()) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
        if (data.contractors) localStorage.setItem(STORAGE_KEYS.CONTRACTORS, JSON.stringify(data.contractors));
        if (data.generatedDocs) localStorage.setItem(STORAGE_KEYS.GENERATED_DOCS, JSON.stringify(data.generatedDocs));
        if (data.auditLogs) localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(data.auditLogs));
        this.logAudit('RESTORE_BACKUP', `Database restored with ${data.projects.length} contracts.`);
      }
      return true;
    } catch (err: unknown) {
      console.error('Failed to restore backup:', err);
      return false;
    }
  }
}
