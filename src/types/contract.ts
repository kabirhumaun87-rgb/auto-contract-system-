/**
 * Data Model for Auto Contract System
 * Compliant with Military Engineer Services (MES) PW-2 Works Contract Specifications
 */

export interface BOQItem {
  id: string;
  serialNo: number;
  specClauseNumber: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number | null; // null if unpriced
  amount: number; // quantity * (unitRate ?? 0)
}

export type ContractStatus = 'draft' | 'in_review' | 'approved' | 'generated' | 'archived';

export type DrawingStatusType = 'Attached' | 'Nil' | 'As per specification' | 'Other';

export interface Contractor {
  id: string;
  firmName: string;
  proprietorName: string;
  address: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  registrationNumber: string;
  mesEnlistmentCategory: 'A' | 'B' | 'C' | 'D' | 'E';
  otherDepartmentDetails: string;
  securityClearanceRef: string;
  tinNumber: string;
  vatBinNumber: string;
  bankSecurityRef: string;
  authorizedSignatoryName: string;
  authorizedSignatoryDesignation: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractProject {
  id: string;
  contractNo: string; // e.g. "GSDCA/01 OF 2026-2027"
  invitationRefNo: string; // e.g. "GSDCA/XY of 2026-2027/1/E-6"
  projectName: string; // e.g. "Maint Work"
  authReference: string; // Sta HQ & CMES letter references
  codeHead: string; // e.g. "3258106"
  nameOfWork: string;
  procuringEntityName: string; // e.g. "GE (Army) South, Dhaka"
  procuringEntityDistrict: string; // e.g. "Dhaka"
  siteLocation: string;
  subDivision: string; // e.g. "SDO I/C Postogola"
  procurementMethod: string; // e.g. "Limited Tendering Method (LTM)"
  ministryDivision: string; // e.g. "Ministry of Defence"
  agency: string; // e.g. "Military Engineer Services (Army)"
  tenderPackageNo: string; // e.g. "NA"
  lotNo: string; // e.g. "-"
  tenderDocumentPrice: number; // e.g. 100.00
  completionTime: string; // e.g. "07 (Seven) days" or "15 (Fifteen) days"
  drawingStatus: DrawingStatusType;
  dateOfContract: string; // e.g. "10-2026"
  issuedOnDate: string; // e.g. "-10-2026"
  fiscalYear: string; // e.g. "2026-2027" or "2025-2026"
  internalRemarks: string;
  status: ContractStatus;

  // Tender Timeline and Submission
  tenderPublicationDate: string;
  tenderLastSellingDateTime: string;
  tenderClosingDateTime: string;
  tenderOpeningDateTime: string;
  tenderValidityPeriod: string; // e.g. "60 days"
  tenderSecurityAmount: string; // e.g. "Tk. 0.00" or "-"
  performanceSecurityPercentage: number; // default 5%
  sellingOffice: string;
  receivingOffice: string;
  openingOffice: string;
  eligibilityText: string;

  // Authorities and Officials
  officialInvitingName: string; // e.g. "GE (Army) South Dhaka"
  officialInvitingDesignation: string; // e.g. "Lt Col"
  officialInvitingAddress: string;
  officialInvitingContact: string; // e.g. "Tel No : 9834144"
  militaryExchangeTel: string; // e.g. "Mil : 4144"
  projectManager: string; // e.g. "SDO I/C Postogola"
  projectManagerAddress: string;
  authorizedRepresentative: string; // e.g. "GE (Army) Dhaka Cantt."
  signatoryName: string; // e.g. "Abdullah Al Mamun Billah"
  signatoryRank: string; // e.g. "Lt Col"

  // Bengali Forwarding Letter Specifics
  bnOffice: string;
  bnCantt: string;
  bnTel: string;
  bnMonthYear: string;
  bnKartikYear: string;
  bnLetterRef: string;
  bnSignatoryName?: string; // e.g. "আব্দুল্লাহ আল মামুন বিল্লাহ"
  bnSignatoryRank?: string; // e.g. "লে. কর্নেল"

  // Contractor mapping
  contractorId: string | null;
  contractorName: string;
  contractorAddress: string;

  // Contract Conditions (PCC Section 4)
  possessionDays: string; // e.g. "Within 03 days after signing the Contract Agreement."
  commencementClause: string; // e.g. "shown in 1st written Work Orders (WO) by the Project Manager i.e. SDO."
  pccCompletionPeriod: string; // e.g. "15 (Fifteen) days"
  workProgrammeDays: string; // e.g. "within 03 days of signing the Contract. NA"
  defectsLiabilityPeriod: string; // e.g. "03 (Three) month."
  otherContractDocs: string; // e.g. "NA"
  specialNote: string;

  // Specifications and Store Issuance (Section 7)
  cementRateOpc: number; // e.g. 12.20
  cementRatePcc: number; // e.g. 11.80
  storePlaceOfIssue: string; // "Contractor Own supply."
  storeIssuanceDetails: string;
  waterChargesNote: string;
  measurementBookNo: string; // "BAFW-2261"

  // BOQ Items & Financials
  boqItems: BOQItem[];
  totalContractPrice: number;
  priceInWords: string;
  boqCorrectionsCount: number;

  createdAt: string;
  updatedAt: string;
}

export type ValidationSeverity = 'ERROR' | 'WARNING' | 'INFORMATION';

export interface ValidationIssue {
  id: string;
  field?: string;
  severity: ValidationSeverity;
  title: string;
  description: string;
  acknowledged?: boolean;
  acknowledgmentReason?: string;
}

export interface GeneratedDocumentRecord {
  id: string;
  projectId: string;
  contractNo: string;
  projectName: string;
  contractorName: string;
  fileName: string;
  fileFormat: 'DOCX' | 'PDF' | 'CSV';
  generatedAt: string;
  templateVersion: string;
  totalPrice: number;
  status: 'SUCCESS' | 'WARNING_OVERRIDDEN' | 'FAILED';
  fileDataUrl?: string; // stored for local viewing/re-download
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  entityId?: string;
}
