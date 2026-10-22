import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Plus, 
  Trash2, 
  Printer, 
  FileDown, 
  CheckCircle2, 
  Eye, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ContractProject, Contractor, BOQItem, ValidationIssue } from '../types/contract';
import { ContractValidator } from '../services/validator';
import { formatBangladeshiCurrency, numberToBangladeshiTakaWords } from '../utils/numberToWordsBangla';
import { DocumentGenerator } from '../services/documentGenerator';
import { StorageService } from '../services/storage';
import { AutoBOQExtractorModal } from './AutoBOQExtractorModal';
import { BOQQuantityInput } from './BOQQuantityInput';

interface ContractWizardProps {
  initialProject?: ContractProject | null;
  contractors: Contractor[];
  onSave: (project: ContractProject) => void;
  onCancel: () => void;
  onOpenPreview: (project: ContractProject) => void;
}

const WIZARD_STEPS = [
  { id: 1, title: 'Project Info' },
  { id: 2, title: 'Tender Info' },
  { id: 3, title: 'Authorities' },
  { id: 4, title: 'Contractor' },
  { id: 5, title: 'BOQ Schedule' },
  { id: 6, title: 'Validation' },
  { id: 7, title: 'Generate' }
];

export const ContractWizard: React.FC<ContractWizardProps> = ({
  initialProject,
  contractors,
  onSave,
  onCancel,
  onOpenPreview
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ContractProject>(() => {
    if (initialProject) return initialProject;
    return {
      id: `proj-${Date.now()}`,
      contractNo: 'GSDCA/02 OF 2026-2027',
      invitationRefNo: 'GSDCA/XY of 2026-2027/2/E-6',
      projectName: 'Maint Work',
      authReference: 'Auth: Sta HQ Dhaka Ltr No-23.01.901.661.07. 026. 01. 01. 07. 2026/Board/Q-3 Dt. 01 July 2026 & CMES (Army) Dhaka Ltr No.6005/DCA/South/Part-04/08/E-6 Dt. 20 September 2026',
      codeHead: '3258106',
      nameOfWork: 'Repair/Maint of Internal Decoration Works to Bldg No 04 Office Bldg for 05 RE BN Area at Postogola Cantt.',
      procuringEntityName: 'GE (Army) South, Dhaka',
      procuringEntityDistrict: 'Dhaka',
      siteLocation: 'Repair/Maint of Internal Decoration Works to Bldg No 04 Office Bldg for 05 RE BN Area at Postogola Cantt.',
      subDivision: 'SDO I/C Postogola',
      procurementMethod: 'Limited Tendering Method (LTM)',
      ministryDivision: 'Ministry of Defence',
      agency: 'Military Engineer Services (Army)',
      tenderPackageNo: 'NA',
      lotNo: '-',
      tenderDocumentPrice: 100.00,
      completionTime: '07 (Seven) days',
      drawingStatus: 'Attached',
      dateOfContract: '10-2026',
      issuedOnDate: '-10-2026',
      fiscalYear: '2026-2027',
      internalRemarks: '',
      status: 'draft',

      tenderPublicationDate: '- 10-2026',
      tenderLastSellingDateTime: '- 10-2026 at 1400 hrs',
      tenderClosingDateTime: '- 10-2026 at 1200 hrs',
      tenderOpeningDateTime: '- 10-2026 at 1230 hrs',
      tenderValidityPeriod: '60 (Sixty) days',
      tenderSecurityAmount: '-',
      performanceSecurityPercentage: 5,
      sellingOffice: 'GE (Army) South, Dhaka',
      receivingOffice: 'GE (Army) South, Dhaka',
      openingOffice: 'GE (Army) South, Dhaka',
      eligibilityText: 'MES Enlisted Contractors Only (Categories D & E, or DGFI security clearance)',

      officialInvitingName: 'GE (Army) South Dhaka',
      officialInvitingDesignation: 'Lt Col',
      officialInvitingAddress: 'GE (Army) South, Dhaka Cantt',
      officialInvitingContact: 'Tel No : 9834144',
      militaryExchangeTel: 'Mil : 4144',
      projectManager: 'SDO I/C Postogola',
      projectManagerAddress: 'GE (Army) South, Dhaka Cantonment, Dhaka-1206',
      authorizedRepresentative: 'GE (Army) Dhaka Cantt.',
      signatoryName: 'Abdullah Al Mamun Billah',
      signatoryRank: 'Lt Col',

      bnOffice: 'জিই (আর্মি) সাউথ ঢাকা',
      bnCantt: 'ঢাকা সেনানিবাস',
      bnTel: 'সামরিক ঃ ৪১৪৪',
      bnMonthYear: 'অক্টোবর ২০২৬',
      bnKartikYear: 'কার্তিক ১৪৩৩',
      bnLetterRef: '৬০০১/     /ই-৬',

      contractorId: contractors[0]?.id || null,
      contractorName: contractors[0]?.firmName || '',
      contractorAddress: contractors[0]?.address || '',

      possessionDays: 'Within 03 days after signing the Contract Agreement.',
      commencementClause: 'The Start Date shall be the date of Commencement shown in 1st written Work Orders (WO) by the Project Manager i.e. SDO.',
      pccCompletionPeriod: '15 (Fifteen) days',
      workProgrammeDays: 'The Contractor shall submit a Programme for the Works within 03 days of signing the Contract. NA',
      defectsLiabilityPeriod: '03 (Three) month.',
      otherContractDocs: 'NA',
      specialNote: '(1) Recovery of VAT, Income tax and other charges will be applicable as per latest Government order.',

      cementRateOpc: 12.20,
      cementRatePcc: 11.80,
      storePlaceOfIssue: 'Contractor Own supply.',
      storeIssuanceDetails: 'Any MES store at GE (Army) South / Contractor Own supply.',
      waterChargesNote: 'Water used on work charged @ 31 paisa per 100 Taka whole cost',
      measurementBookNo: 'BAFW-2261',

      boqItems: [
        {
          id: `boq-item-${Date.now()}-1`,
          serialNo: 1,
          specClauseNumber: '',
          description: 'Supply and fixing of Cup board 625 mm depth any colour made of both side melamine coated / laminated board 19mm thick including 2xdrawer, shelf, 3mm thick plastic board liner, steel channel for drawer, steel lama hinges, steel handle, steel lock, etc. complete (OTOBI / NAVANA / PARTEX BRAND) as spd after Demolition Done by DEL.',
          unit: 'Sqm',
          quantity: 5.00,
          unitRate: 4250.00,
          amount: 21250.00
        },
        {
          id: `boq-item-${Date.now()}-2`,
          serialNo: 2,
          specClauseNumber: '',
          description: 'Supply and fixing of Plastic Cat Door Door incl. hanging with chowkat and SS mongaries after Taking out old cat Door remove to Store Done by DEL.',
          unit: 'Sqm',
          quantity: 0.45,
          unitRate: 3600.00,
          amount: 1620.00
        }
      ],
      totalContractPrice: 22870.00,
      priceInWords: 'Taka Twenty-Two Thousand Eight Hundred Seventy Only',
      boqCorrectionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [acknowledgedIssues, setAcknowledgedIssues] = useState<Record<string, string>>({});
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isBOQExtractorOpen, setIsBOQExtractorOpen] = useState(false);

  // Re-calculate BOQ totals whenever items change
  const handleUpdateBOQ = (newItems: BOQItem[]) => {
    let total = 0;
    const computed = newItems.map(item => {
      const rate = item.unitRate ?? 0;
      const amt = Math.round((item.quantity * rate) * 100) / 100;
      total += amt;
      return { ...item, amount: amt };
    });

    const roundedTotal = Math.round(total * 100) / 100;
    const words = numberToBangladeshiTakaWords(roundedTotal);

    setFormData(prev => ({
      ...prev,
      boqItems: computed,
      totalContractPrice: roundedTotal,
      priceInWords: words
    }));
  };

  const handleApplyExtractedBOQ = (
    extractedItems: BOQItem[],
    mode: 'replace' | 'append',
    detectedWorkName?: string
  ) => {
    let newItems: BOQItem[] = [];
    if (mode === 'replace') {
      newItems = extractedItems.map((item, idx) => ({
        ...item,
        serialNo: idx + 1,
        amount: Math.round(((item.quantity || 0) * (item.unitRate ?? 0)) * 100) / 100
      }));
    } else {
      const startIdx = formData.boqItems.length;
      const renumbered = extractedItems.map((item, idx) => ({
        ...item,
        serialNo: startIdx + idx + 1,
        amount: Math.round(((item.quantity || 0) * (item.unitRate ?? 0)) * 100) / 100
      }));
      newItems = [...formData.boqItems, ...renumbered];
    }

    if (detectedWorkName) {
      setFormData(prev => ({
        ...prev,
        nameOfWork: detectedWorkName,
        siteLocation: detectedWorkName
      }));
    }

    handleUpdateBOQ(newItems);
  };

  // Run validation whenever step 7 or data updates
  useEffect(() => {
    const issues = ContractValidator.validate(formData);
    setValidationIssues(issues);
  }, [formData]);

  const updateField = (field: keyof ContractProject, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContractorSelect = (contractorId: string) => {
    const selected = contractors.find(c => c.id === contractorId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        contractorId: selected.id,
        contractorName: selected.firmName,
        contractorAddress: selected.address
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        contractorId: null
      }));
    }
  };

  const handleSaveDraft = () => {
    const saved = StorageService.saveProject({
      ...formData,
      status: 'draft'
    });
    onSave(saved);
    setSaveMessage('Contract draft saved successfully.');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleAcknowledge = (issueId: string, reason: string) => {
    setAcknowledgedIssues(prev => ({ ...prev, [issueId]: reason }));
  };

  const fatalErrors = validationIssues.filter(i => i.severity === 'ERROR');
  const warnings = validationIssues.filter(i => i.severity === 'WARNING');
  const infoNotices = validationIssues.filter(i => i.severity === 'INFORMATION');

  const unacknowledgedWarnings = warnings.filter(w => !acknowledgedIssues[w.id]);
  const canGenerate = fatalErrors.length === 0 && unacknowledgedWarnings.length === 0;

  const handleExportCSV = () => {
    const csvContent = DocumentGenerator.generateBOQCSV(formData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BOQ_${formData.contractNo.replace(/[^a-zA-Z0-9_-]/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    StorageService.saveGeneratedDoc({
      id: `doc-${Date.now()}`,
      projectId: formData.id,
      contractNo: formData.contractNo,
      projectName: formData.projectName,
      contractorName: formData.contractorName,
      fileName: link.download,
      fileFormat: 'CSV',
      generatedAt: new Date().toISOString(),
      templateVersion: '1.0.0',
      totalPrice: formData.totalContractPrice,
      status: 'SUCCESS'
    });
  };

  const handlePrintFullContract = () => {
    const htmlContent = DocumentGenerator.generatePrintableHTML(formData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);

      StorageService.saveGeneratedDoc({
        id: `doc-${Date.now()}`,
        projectId: formData.id,
        contractNo: formData.contractNo,
        projectName: formData.projectName,
        contractorName: formData.contractorName,
        fileName: `Completed_Contract_${formData.contractNo.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
        fileFormat: 'PDF',
        generatedAt: new Date().toISOString(),
        templateVersion: '1.0.0',
        totalPrice: formData.totalContractPrice,
        status: 'SUCCESS'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      {/* Wizard Step Navigation */}
      <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1">
          {WIZARD_STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'text-slate-200 hover:bg-slate-800'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent ? 'bg-white text-blue-600' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {isCompleted ? <Check className="w-2.5 h-2.5" /> : step.id}
                  </span>
                  <span>{step.title}</span>
                </button>
                {idx < WIZARD_STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-xs text-emerald-400 font-medium animate-fade-in">{saveMessage}</span>
          )}
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        {/* STEP 1: PROJECT INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-4 max-w-4xl">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-sm font-bold text-slate-900">Step 1: Project & Contract Identification</h2>
              <p className="text-xs text-slate-500">Official references, titles, and budget codes matching Page 1 & 4 of PW-2</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Agreement No. (CA No.) *</label>
                <input
                  type="text"
                  value={formData.contractNo}
                  onChange={(e) => updateField('contractNo', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono focus:ring-1 focus:ring-blue-600"
                  placeholder="e.g. GSDCA/01 OF 2026-2027"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Invitation Reference Number *</label>
                <input
                  type="text"
                  value={formData.invitationRefNo}
                  onChange={(e) => updateField('invitationRefNo', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600"
                  placeholder="e.g. GSDCA/XY of 2026-2027/1/E-6"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Name Of Work (Full Contract Title) *</label>
                <textarea
                  rows={2}
                  value={formData.nameOfWork}
                  onChange={(e) => updateField('nameOfWork', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project / Programme Name</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => updateField('projectName', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Code Head *</label>
                <input
                  type="text"
                  value={formData.codeHead}
                  onChange={(e) => updateField('codeHead', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono"
                  placeholder="e.g. 3258106"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fiscal Year</label>
                <input
                  type="text"
                  value={formData.fiscalYear}
                  onChange={(e) => updateField('fiscalYear', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="2026-2027"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Completion Time (Cover/IFT)</label>
                <input
                  type="text"
                  value={formData.completionTime}
                  onChange={(e) => updateField('completionTime', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="07 (Seven) days"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Drawing Status</label>
                <select
                  value={formData.drawingStatus}
                  onChange={(e) => updateField('drawingStatus', e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                >
                  <option value="Attached">Attached</option>
                  <option value="Nil">Nil</option>
                  <option value="As per specification">As per specification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tender Document Price (Tk)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.tenderDocumentPrice}
                  onChange={(e) => updateField('tenderDocumentPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Authorization Reference Letters</label>
                <textarea
                  rows={2}
                  value={formData.authReference}
                  onChange={(e) => updateField('authReference', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TENDER INFORMATION */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-4xl">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-sm font-bold text-slate-900">Step 2: Tender Timetable and Submissions</h2>
              <p className="text-xs text-slate-500">Publication, selling, closing, opening milestones, and office locations (IFT Page 3)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Contract / Issued Date</label>
                <input
                  type="text"
                  value={formData.dateOfContract}
                  onChange={(e) => updateField('dateOfContract', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="10-2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tender Publication Date</label>
                <input
                  type="text"
                  value={formData.tenderPublicationDate}
                  onChange={(e) => updateField('tenderPublicationDate', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="- 10-2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Selling Date & Time</label>
                <input
                  type="text"
                  value={formData.tenderLastSellingDateTime}
                  onChange={(e) => updateField('tenderLastSellingDateTime', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="- 10-2026 at 1400 hrs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tender Closing Date & Time</label>
                <input
                  type="text"
                  value={formData.tenderClosingDateTime}
                  onChange={(e) => updateField('tenderClosingDateTime', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="- 10-2026 at 1200 hrs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tender Opening Date & Time</label>
                <input
                  type="text"
                  value={formData.tenderOpeningDateTime}
                  onChange={(e) => updateField('tenderOpeningDateTime', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="- 10-2026 at 1230 hrs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tender Validity Period</label>
                <input
                  type="text"
                  value={formData.tenderValidityPeriod}
                  onChange={(e) => updateField('tenderValidityPeriod', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="60 (Sixty) days"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Receiving / Opening Office</label>
                <input
                  type="text"
                  value={formData.receivingOffice}
                  onChange={(e) => updateField('receivingOffice', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Procurement Method</label>
                <input
                  type="text"
                  value={formData.procurementMethod}
                  onChange={(e) => updateField('procurementMethod', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Eligibility Criteria</label>
                <textarea
                  rows={2}
                  value={formData.eligibilityText}
                  onChange={(e) => updateField('eligibilityText', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PROCURING ENTITY & AUTHORITIES */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-4xl">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-sm font-bold text-slate-900">Step 3: Procuring Entity & Authority Credentials</h2>
              <p className="text-xs text-slate-500">Military Engineer Services offices, Project Manager, and official signatories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Procuring Entity Name</label>
                <input
                  type="text"
                  value={formData.procuringEntityName}
                  onChange={(e) => updateField('procuringEntityName', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sub-Division / SDO</label>
                <input
                  type="text"
                  value={formData.subDivision}
                  onChange={(e) => updateField('subDivision', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Inviting Tender (Name & Rank)</label>
                <input
                  type="text"
                  value={formData.signatoryName}
                  onChange={(e) => updateField('signatoryName', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="Abdullah Al Mamun Billah"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Signatory Rank</label>
                <input
                  type="text"
                  value={formData.signatoryRank}
                  onChange={(e) => updateField('signatoryRank', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="Lt Col"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Military Exchange Tel</label>
                <input
                  type="text"
                  value={formData.militaryExchangeTel}
                  onChange={(e) => updateField('militaryExchangeTel', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="Mil : 4144"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Telephone / PABX</label>
                <input
                  type="text"
                  value={formData.officialInvitingContact}
                  onChange={(e) => updateField('officialInvitingContact', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  placeholder="Tel No : 9834144"
                />
              </div>

              <div className="md:col-span-2 pt-2 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 mb-2">Bengali Forwarding Letter Specifics (সীমিত - Page 2, Font: Nikosh)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">দপ্তরের নাম (বাংলা)</label>
                    <input
                      type="text"
                      value={formData.bnOffice}
                      onChange={(e) => updateField('bnOffice', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-nikosh"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">বাংলা মাস-সন</label>
                    <input
                      type="text"
                      value={formData.bnKartikYear}
                      onChange={(e) => updateField('bnKartikYear', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-nikosh"
                      placeholder="কার্তিক ১৪৩৩"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">স্মারক নং</label>
                    <input
                      type="text"
                      value={formData.bnLetterRef}
                      onChange={(e) => updateField('bnLetterRef', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono"
                      placeholder="৬০০১/     /ই-৬"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">স্বাক্ষরকারীর নাম (বাংলা)</label>
                    <input
                      type="text"
                      value={formData.bnSignatoryName || 'আব্দুল্লাহ আল মামুন বিল্লাহ'}
                      onChange={(e) => updateField('bnSignatoryName', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-nikosh font-medium"
                      placeholder="আব্দুল্লাহ আল মামুন বিল্লাহ"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">স্বাক্ষরকারীর পদবী (বাংলা)</label>
                    <input
                      type="text"
                      value={formData.bnSignatoryRank || 'লে. কর্নেল'}
                      onChange={(e) => updateField('bnSignatoryRank', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-nikosh font-medium"
                      placeholder="লে. কর্নেল"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">সেনানিবাস (বাংলা)</label>
                    <input
                      type="text"
                      value={formData.bnCantt || 'ঢাকা সেনানিবাস'}
                      onChange={(e) => updateField('bnCantt', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-nikosh"
                      placeholder="ঢাকা সেনানিবাস"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONTRACTOR SELECTION */}
        {currentStep === 4 && (
          <div className="space-y-4 max-w-4xl">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-sm font-bold text-slate-900">Step 4: Contractor Selection & Credentials</h2>
              <p className="text-xs text-slate-500">Pick from enrolled MES contractors or enter project-specific firm details</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Registered Contractor</label>
              <select
                value={formData.contractorId || ''}
                onChange={(e) => handleContractorSelect(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white font-medium"
              >
                <option value="">-- Choose from Enlisted Contractors --</option>
                {contractors.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.firmName} (Category: {c.mesEnlistmentCategory} | Reg: {c.registrationNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contractor / Firm Name *</label>
                <input
                  type="text"
                  value={formData.contractorName}
                  onChange={(e) => updateField('contractorName', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-medium"
                  placeholder="e.g. M/S Bengal Engineering & Construction Ltd."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Firm Address</label>
                <textarea
                  rows={2}
                  value={formData.contractorAddress}
                  onChange={(e) => updateField('contractorAddress', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: BILL OF QUANTITIES (BOQ) */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Step 5: Bill of Quantities (BOQ) Editor</h2>
                <p className="text-xs text-slate-500">Live quantity × unit rate spreadsheet calculations & automatic PDF/image import</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBOQExtractorOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs"
                  title="Upload PDF or JPEG file to collect all BOQ items automatically"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Auto-Extract from PDF / JPEG</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: BOQItem = {
                      id: `boq-${Date.now()}`,
                      serialNo: formData.boqItems.length + 1,
                      specClauseNumber: '',
                      description: '',
                      unit: 'Sqm',
                      quantity: 1,
                      unitRate: 0,
                      amount: 0
                    };
                    handleUpdateBOQ([...formData.boqItems, newItem]);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 w-12 text-center">Ser</th>
                    <th className="py-2 px-3 w-28">Spec Clause</th>
                    <th className="py-2 px-3 min-w-[280px]">Brief Description of Works</th>
                    <th className="py-2 px-3 w-24 text-center">Unit</th>
                    <th className="py-2 px-3 w-24 text-right">Quantity</th>
                    <th className="py-2 px-3 w-32 text-right">Unit Rate (Tk)</th>
                    <th className="py-2 px-3 w-32 text-right">Amount (Tk)</th>
                    <th className="py-2 px-3 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {formData.boqItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-2 px-3 text-center font-mono font-medium">{index + 1}</td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.specClauseNumber}
                          onChange={(e) => {
                            const updated = [...formData.boqItems];
                            updated[index].specClauseNumber = e.target.value;
                            handleUpdateBOQ(updated);
                          }}
                          placeholder="Clause"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...formData.boqItems];
                            updated[index].description = e.target.value;
                            handleUpdateBOQ(updated);
                          }}
                          placeholder="Description of work..."
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-normal"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => {
                            const updated = [...formData.boqItems];
                            updated[index].unit = e.target.value;
                            handleUpdateBOQ(updated);
                          }}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-center font-medium"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <BOQQuantityInput
                          value={item.quantity}
                          onChange={(newQty) => {
                            const updated = [...formData.boqItems];
                            updated[index].quantity = newQty;
                            handleUpdateBOQ(updated);
                          }}
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitRate !== null ? item.unitRate : ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : parseFloat(e.target.value);
                            const updated = [...formData.boqItems];
                            updated[index].unitRate = val;
                            handleUpdateBOQ(updated);
                          }}
                          placeholder="Unpriced"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-right font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatBangladeshiCurrency(item.amount)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => {
                            const updated = formData.boqItems.filter((_, i) => i !== index);
                            handleUpdateBOQ(updated);
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-xs">
                  <tr>
                    <td colSpan={6} className="py-2.5 px-4 text-right">Total TK:</td>
                    <td className="py-2.5 px-3 text-right font-mono text-sm text-blue-700 tabular-nums">
                      Tk {formatBangladeshiCurrency(formData.totalContractPrice)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Price in Words Box */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-xs font-bold text-blue-900 block mb-1">Bangladeshi Taka in Words (Official Form PW2-1):</span>
              <span className="text-xs text-blue-800 font-medium italic">{formData.priceInWords}</span>
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW & INCONSISTENCY VALIDATION */}
        {currentStep === 6 && (
          <div className="space-y-4 max-w-4xl">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-sm font-bold text-slate-900">Step 6: Inconsistency Detection & Pre-Generation Audit</h2>
              <p className="text-xs text-slate-500">
                Automated cross-check against reference template discrepancies and mandatory procurement rules
              </p>
            </div>

            {/* Fatal Errors */}
            {fatalErrors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Fatal Blocking Errors ({fatalErrors.length}) - Must be resolved before generation</span>
                </h3>
                {fatalErrors.map(err => (
                  <div key={err.id} className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                    <strong>{err.title}:</strong> {err.description}
                  </div>
                ))}
              </div>
            )}

            {/* Inconsistency Warnings */}
            {warnings.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Inconsistency Warnings ({warnings.length}) - Review and acknowledge before final print</span>
                </h3>
                {warnings.map(warn => {
                  const isAck = acknowledgedIssues[warn.id];
                  return (
                    <div key={warn.id} className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <strong>{warn.title}:</strong> {warn.description}
                        {isAck && (
                          <div className="mt-1 text-emerald-700 font-semibold text-[11px]">
                            Acknowledged: "{isAck}"
                          </div>
                        )}
                      </div>
                      {!isAck ? (
                        <button
                          onClick={() => {
                            const reason = prompt(`Acknowledge "${warn.title}": Enter your authorization reason:`, 'Authorised as per Station HQ requirement');
                            if (reason) handleAcknowledge(warn.id, reason);
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-200 hover:bg-amber-300 rounded shrink-0"
                        >
                          Acknowledge Issue
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-bold shrink-0 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Acknowledged
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Informational */}
            {infoNotices.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Informational Guidance ({infoNotices.length})</span>
                </h3>
                {infoNotices.map(info => (
                  <div key={info.id} className="p-2.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    <strong>{info.title}:</strong> {info.description}
                  </div>
                ))}
              </div>
            )}

            {validationIssues.length === 0 && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="font-bold text-sm">Validation Check Passed</div>
                  <div className="text-xs">No errors or unconfirmed discrepancies detected. Ready to generate contract documents.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: GENERATE & EXPORT */}
        {currentStep === 7 && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-sm font-bold text-slate-900">Step 7: Document Generation & Export</h2>
              <p className="text-xs text-slate-500">Produce completed 12-page PW-2 contract packages, DOCX, PDF, and CSV</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col justify-between space-y-3">
                <div>
                  <div className="font-bold text-sm text-slate-900 mb-1">Print / Save as PDF</div>
                  <div className="text-xs text-slate-500">Full 12-page formatted document matching Bangladesh MES standard with running headers and page numbers.</div>
                </div>
                <button
                  onClick={handlePrintFullContract}
                  disabled={!canGenerate}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors ${
                    canGenerate
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Printer className="w-4 h-4" />
                  <span>Print 12-Page Contract</span>
                </button>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col justify-between space-y-3">
                <div>
                  <div className="font-bold text-sm text-slate-900 mb-1">Export BOQ (CSV)</div>
                  <div className="text-xs text-slate-500">Spreadsheet-compatible data file with all 7 columns, serial numbers, descriptions, rates and totals.</div>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="w-full py-2 px-3 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download BOQ CSV</span>
                </button>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col justify-between space-y-3">
                <div>
                  <div className="font-bold text-sm text-slate-900 mb-1">Interactive Page Viewer</div>
                  <div className="text-xs text-slate-500">Preview all 12 individual pages on screen before printing or sending to contractor.</div>
                </div>
                <button
                  onClick={() => onOpenPreview(formData)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Document</span>
                </button>
              </div>
            </div>

            {!canGenerate && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                Please resolve all fatal errors and acknowledge warnings in <strong>Step 6 (Validation)</strong> to enable document generation.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>

        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          )}

          {currentStep < WIZARD_STEPS.length ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                const saved = StorageService.saveProject({
                  ...formData,
                  status: 'generated'
                });
                onSave(saved);
              }}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm transition-colors"
            >
              <span>Finish & Save Contract</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Auto BOQ Extractor Modal */}
      <AutoBOQExtractorModal
        isOpen={isBOQExtractorOpen}
        onClose={() => setIsBOQExtractorOpen(false)}
        onApplyItems={handleApplyExtractedBOQ}
        existingCount={formData.boqItems.length}
      />
    </div>
  );
};
