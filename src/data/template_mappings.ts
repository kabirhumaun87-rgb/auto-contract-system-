/**
 * Master Template & Field Mapping Configuration for PW-2 Contract Generation
 * Covers all 12 pages of the approved MES template
 */

export interface TemplateFieldMapping {
  placeholder: string;
  fieldKey: string;
  description: string;
  page: number;
  section: string;
  required: boolean;
  category: 'project' | 'tender' | 'authority' | 'contractor' | 'financial' | 'specification';
}

export const MASTER_TEMPLATE_MAPPINGS: TemplateFieldMapping[] = [
  // Page 1: Master Sheet
  { placeholder: '{{invitation_reference}}', fieldKey: 'invitationRefNo', description: 'Invitation Reference Number', page: 1, section: 'Master Sheet', required: true, category: 'project' },
  { placeholder: '{{date_of_contract}}', fieldKey: 'dateOfContract', description: 'Date of Contract (Month/Year)', page: 1, section: 'Master Sheet', required: true, category: 'project' },
  { placeholder: '{{project_name}}', fieldKey: 'projectName', description: 'Project / Programme Name', page: 1, section: 'Master Sheet', required: true, category: 'project' },
  { placeholder: '{{tender_publication_date}}', fieldKey: 'tenderPublicationDate', description: 'Tender Publication Date', page: 1, section: 'Master Sheet', required: true, category: 'tender' },
  { placeholder: '{{tender_last_selling_datetime}}', fieldKey: 'tenderLastSellingDateTime', description: 'Last Selling Date and Time', page: 1, section: 'Master Sheet', required: true, category: 'tender' },
  { placeholder: '{{tender_closing_datetime}}', fieldKey: 'tenderClosingDateTime', description: 'Closing Date and Time', page: 1, section: 'Master Sheet', required: true, category: 'tender' },
  { placeholder: '{{tender_opening_datetime}}', fieldKey: 'tenderOpeningDateTime', description: 'Opening Date and Time', page: 1, section: 'Master Sheet', required: true, category: 'tender' },
  { placeholder: '{{tender_doc_price}}', fieldKey: 'tenderDocumentPrice', description: 'Price of Tender Document in BDT', page: 1, section: 'Master Sheet', required: true, category: 'tender' },
  { placeholder: '{{completion_time}}', fieldKey: 'completionTime', description: 'Completion Time', page: 1, section: 'Master Sheet', required: true, category: 'project' },
  { placeholder: '{{name_of_work}}', fieldKey: 'nameOfWork', description: 'Name of Work (Full Title)', page: 1, section: 'Master Sheet', required: true, category: 'project' },
  { placeholder: '{{auth_reference}}', fieldKey: 'authReference', description: 'Administrative & Financial Authority Letters', page: 1, section: 'Master Sheet', required: true, category: 'authority' },
  { placeholder: '{{sub_division}}', fieldKey: 'subDivision', description: 'Sub-Division (e.g. SDO I/C Postogola)', page: 1, section: 'Master Sheet', required: true, category: 'authority' },
  { placeholder: '{{code_head}}', fieldKey: 'codeHead', description: 'Budget Code Head (e.g. 3258106)', page: 1, section: 'Master Sheet', required: true, category: 'project' },
  { placeholder: '{{drawing_status}}', fieldKey: 'drawingStatus', description: 'Drawing Status (Attached or Nil)', page: 1, section: 'Master Sheet', required: true, category: 'specification' },
  { placeholder: '{{cement_rate_opc}}', fieldKey: 'cementRateOpc', description: 'Cement Rate per KG (OPC)', page: 1, section: 'Master Sheet', required: true, category: 'specification' },
  { placeholder: '{{cement_rate_pcc}}', fieldKey: 'cementRatePcc', description: 'Cement Rate per KG (PCC)', page: 1, section: 'Master Sheet', required: true, category: 'specification' },

  // Page 2: Forwarding Letter
  { placeholder: '{{bn_office}}', fieldKey: 'bnOffice', description: 'Bengali Office Title', page: 2, section: 'Forwarding Letter', required: true, category: 'authority' },
  { placeholder: '{{bn_tel}}', fieldKey: 'bnTel', description: 'Bengali Military Phone', page: 2, section: 'Forwarding Letter', required: true, category: 'authority' },
  { placeholder: '{{bn_month_year}}', fieldKey: 'bnMonthYear', description: 'Bengali Month/Year (e.g. অক্টোবর ২০২৬)', page: 2, section: 'Forwarding Letter', required: true, category: 'tender' },
  { placeholder: '{{bn_kartik_year}}', fieldKey: 'bnKartikYear', description: 'Bengali Era Date (e.g. কার্তিক ১৪৩৩)', page: 2, section: 'Forwarding Letter', required: true, category: 'tender' },
  { placeholder: '{{bn_signatory_name}}', fieldKey: 'signatoryName', description: 'Signatory Name in Bengali/English', page: 2, section: 'Forwarding Letter', required: true, category: 'authority' },

  // Page 3: IFT Notice
  { placeholder: '{{procuring_entity_name}}', fieldKey: 'procuringEntityName', description: 'Procuring Entity Name', page: 3, section: 'IFT Notice', required: true, category: 'authority' },
  { placeholder: '{{procuring_entity_district}}', fieldKey: 'procuringEntityDistrict', description: 'District', page: 3, section: 'IFT Notice', required: true, category: 'authority' },
  { placeholder: '{{official_inviting_name}}', fieldKey: 'officialInvitingName', description: 'Official Inviting Tender', page: 3, section: 'IFT Notice', required: true, category: 'authority' },
  { placeholder: '{{official_inviting_designation}}', fieldKey: 'officialInvitingDesignation', description: 'Designation of Official Inviting Tender', page: 3, section: 'IFT Notice', required: true, category: 'authority' },

  // Page 4: Tender Cover
  { placeholder: '{{ca_number}}', fieldKey: 'contractNo', description: 'Contract Agreement (CA) Number', page: 4, section: 'Tender Cover', required: true, category: 'project' },
  { placeholder: '{{fiscal_year}}', fieldKey: 'fiscalYear', description: 'Contract Fiscal Year (e.g. 2026-2027)', page: 4, section: 'Tender Cover', required: true, category: 'project' },

  // Page 5: TDS Section 2
  { placeholder: '{{itt_clarification_tel}}', fieldKey: 'officialInvitingContact', description: 'Tender Clarification Phone', page: 5, section: 'Tender Data Sheet', required: true, category: 'authority' },

  // Page 6: PCC Section 4
  { placeholder: '{{contractor_name}}', fieldKey: 'contractorName', description: 'Contractor / Firm Name (GCC 1.1(d))', page: 6, section: 'Particular Conditions', required: true, category: 'contractor' },
  { placeholder: '{{project_manager}}', fieldKey: 'projectManager', description: 'Project Manager (GCC 1.1(u))', page: 6, section: 'Particular Conditions', required: true, category: 'authority' },
  { placeholder: '{{site_location}}', fieldKey: 'siteLocation', description: 'Site Location (GCC 1.1(aa))', page: 6, section: 'Particular Conditions', required: true, category: 'project' },
  { placeholder: '{{pcc_completion_period}}', fieldKey: 'pccCompletionPeriod', description: 'Intended Completion Date (GCC 11.1)', page: 6, section: 'Particular Conditions', required: true, category: 'project' },
  { placeholder: '{{defects_liability_period}}', fieldKey: 'defectsLiabilityPeriod', description: 'Defects Liability Period (GCC 19.2)', page: 6, section: 'Particular Conditions', required: true, category: 'project' },

  // Page 7: Form PW2-1
  { placeholder: '{{tender_price_numeric}}', fieldKey: 'totalContractPrice', description: 'Total Tender Price in Figures (Tk.)', page: 7, section: 'Form PW2-1', required: true, category: 'financial' },
  { placeholder: '{{tender_price_words}}', fieldKey: 'priceInWords', description: 'Total Tender Price in Words', page: 7, section: 'Form PW2-1', required: true, category: 'financial' },

  // Page 9: BOQ
  { placeholder: '{{boq_total}}', fieldKey: 'totalContractPrice', description: 'Sum of all BOQ Item Amounts', page: 9, section: 'BOQ Schedule', required: true, category: 'financial' }
];

export const INITIAL_SAMPLE_PROJECT = {
  contractNo: 'GSDCA/01 OF 2026-2027',
  invitationRefNo: 'GSDCA/XY of 2026-2027/1/E-6',
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
  drawingStatus: 'Attached' as const,
  dateOfContract: '10-2026',
  issuedOnDate: '-10-2026',
  fiscalYear: '2026-2027',
  internalRemarks: 'Sample approved PW-2 reference contract from Postogola Cantonment',
  status: 'draft' as const,

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
  eligibilityText: 'MES Enlisted Contractors Only (Categories D & E, or DGFI security cleared)',

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
  bnSignatoryName: 'আব্দুল্লাহ আল মামুন বিল্লাহ',
  bnSignatoryRank: 'লে. কর্নেল',

  contractorId: 'c1',
  contractorName: 'M/S Bengal Engineering & Construction Ltd.',
  contractorAddress: 'House 42, Road 11, Banani, Dhaka-1213',

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
  waterChargesNote: 'Water used on work when contractor takes water supply from MES sources charged @ 31 paisa per 100 Taka whole of cost; or 14 paisa per 1,000 litre if metered.',
  measurementBookNo: 'BAFW-2261',

  boqItems: [
    {
      id: 'boq-1',
      serialNo: 1,
      specClauseNumber: '',
      description: 'Supply and fixing of Cup board 625 mm depth any colour made of both side melamine coated / laminated board 19mm thick including 2xdrawer, shelf, 3mm thick plastic board liner, steel channel for drawer, steel lama hinges, steel handle, steel lock, etc. complete (OTOBI / NAVANA / PARTEX BRAND) as spd after Demolition Done by DEL.',
      unit: 'Sqm',
      quantity: 5.00,
      unitRate: 4250.00,
      amount: 21250.00
    },
    {
      id: 'boq-2',
      serialNo: 2,
      specClauseNumber: '',
      description: 'Supply and fixing of Plastic Cat Door Door incl. hanging with chowkat and SS mongaries after Taking out old cat Door remove to Store Done by DEL.',
      unit: 'Sqm',
      quantity: 0.45,
      unitRate: 3600.00,
      amount: 1620.00
    },
    {
      id: 'boq-3',
      serialNo: 3,
      specClauseNumber: '',
      description: 'S/F of Chowkat for doors gates including holdfast and fixed in position as specified (Silkorai Ctg) as spd after taking down & remove to store done by DEL.',
      unit: 'Cum',
      quantity: 0.043,
      unitRate: 75000.00,
      amount: 3225.00
    },
    {
      id: 'boq-4',
      serialNo: 4,
      specClauseNumber: '',
      description: 'S/F of 36mm thick flush door shutter both side Chapalish veeneered excluding mongeries after taking down & remove to store done by DEL.',
      unit: 'Sqm',
      quantity: 2.252,
      unitRate: 5200.00,
      amount: 11710.40
    },
    {
      id: 'boq-5',
      serialNo: 5,
      specClauseNumber: '',
      description: 'S/F SS mongeries for single leaf door as spd.',
      unit: 'Each',
      quantity: 1.000,
      unitRate: 1850.00,
      amount: 1850.00
    },
    {
      id: 'boq-6',
      serialNo: 6,
      specClauseNumber: '',
      description: 'S/F 300mm long 15mm dia SS sliding & locking bolt as spd.',
      unit: 'Each',
      quantity: 1.000,
      unitRate: 980.00,
      amount: 980.00
    },
    {
      id: 'boq-7',
      serialNo: 7,
      specClauseNumber: '',
      description: 'Spirit polishing to new Wood Surface complete rate.',
      unit: 'Sqm',
      quantity: 5.040,
      unitRate: 450.00,
      amount: 2268.00
    }
  ],
  totalContractPrice: 42903.40,
  priceInWords: 'Taka Forty-Two Thousand Nine Hundred Three and Forty Paisa Only',
  boqCorrectionsCount: 0
};
