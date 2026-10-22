import { ContractProject, ValidationIssue } from '../types/contract';
import { numberToBangladeshiTakaWords } from '../utils/numberToWordsBangla';

export class ContractValidator {
  public static validate(project: ContractProject): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // --- 1. FATAL ERRORS (BLOCKING) ---
    if (!project.contractNo?.trim()) {
      issues.push({
        id: 'ERR_CONTRACT_NO',
        field: 'contractNo',
        severity: 'ERROR',
        title: 'Missing Contract Agreement Number',
        description: 'Every contract must possess an official Contract Agreement Number (e.g. GSDCA/01 OF 2026-2027).'
      });
    }

    if (!project.invitationRefNo?.trim()) {
      issues.push({
        id: 'ERR_INVITATION_REF',
        field: 'invitationRefNo',
        severity: 'ERROR',
        title: 'Missing Invitation Reference Number',
        description: 'Tender Invitation Reference Number is mandatory on Page 1 and Page 3 IFT.'
      });
    }

    if (!project.nameOfWork?.trim()) {
      issues.push({
        id: 'ERR_NAME_OF_WORK',
        field: 'nameOfWork',
        severity: 'ERROR',
        title: 'Missing Name of Work',
        description: 'Work title is required across all 12 pages of the contract document.'
      });
    }

    if (!project.codeHead?.trim()) {
      issues.push({
        id: 'ERR_CODE_HEAD',
        field: 'codeHead',
        severity: 'ERROR',
        title: 'Missing Budget Code Head',
        description: 'Official budget code head (e.g. 3258106) is required for government audit compliance.'
      });
    }

    if (!project.boqItems || project.boqItems.length === 0) {
      issues.push({
        id: 'ERR_BOQ_EMPTY',
        field: 'boqItems',
        severity: 'ERROR',
        title: 'Empty Bill of Quantities',
        description: 'At least one BOQ line item is required to generate Section 6 and Form PW2-1.'
      });
    } else {
      const unpricedItems = project.boqItems.filter(item => item.unitRate === null || item.unitRate === undefined);
      if (unpricedItems.length > 0) {
        issues.push({
          id: 'WARN_BOQ_UNPRICED',
          field: 'boqItems',
          severity: 'WARNING',
          title: `${unpricedItems.length} BOQ Items are Unpriced`,
          description: `Items #${unpricedItems.map(i => i.serialNo).join(', ')} do not have a unit rate. As per Clause 14, unpriced items will not be paid separately.`
        });
      }
    }

    // --- 2. INCONSISTENCY WARNINGS (REFERENCE AUDIT) ---
    // Conflict 1: Completion Time mismatch (Page 1/3 vs GCC 11.1)
    const coverDays = (project.completionTime || '').toLowerCase();
    const pccDays = (project.pccCompletionPeriod || '').toLowerCase();
    if (coverDays && pccDays && coverDays !== pccDays) {
      issues.push({
        id: 'WARN_COMPLETION_TIME_MISMATCH',
        field: 'completionTime',
        severity: 'WARNING',
        title: 'Completion Period Discrepancy Detected',
        description: `Cover/IFT states "${project.completionTime}" but GCC Clause 11.1 states "${project.pccCompletionPeriod}". This was observed in the sample PDF (7 days vs 15 days). Please confirm the authoritative project timeline.`
      });
    }

    // Conflict 2: Fiscal Year vs CA Number Year
    if (project.fiscalYear && project.contractNo && !project.contractNo.includes(project.fiscalYear)) {
      issues.push({
        id: 'WARN_FISCAL_YEAR_MISMATCH',
        field: 'fiscalYear',
        severity: 'WARNING',
        title: 'Contract Number & Fiscal Year Mismatch',
        description: `Fiscal year is set to "${project.fiscalYear}", but CA No is "${project.contractNo}". Ensure uniform fiscal accounting.`
      });
    }

    // Conflict 3: Drawing Status Conflict
    if (project.drawingStatus === 'Attached') {
      issues.push({
        id: 'WARN_DRAWING_STATUS',
        field: 'drawingStatus',
        severity: 'WARNING',
        title: 'Drawing Attachment Check',
        description: 'Page 1 specifies drawings are Attached, but Section 9 (Drawings) in the standard form states "Nil". Please verify if physical drawing sheets are to be appended.'
      });
    }

    // Check Tender Price in Words accuracy
    if (project.totalContractPrice > 0) {
      const expectedWords = numberToBangladeshiTakaWords(project.totalContractPrice);
      if (project.priceInWords && project.priceInWords.trim() !== expectedWords.trim()) {
        issues.push({
          id: 'WARN_WORDS_MISMATCH',
          field: 'priceInWords',
          severity: 'WARNING',
          title: 'Price in Words Discrepancy',
          description: `Entered price in words does not match the computed total of Tk ${project.totalContractPrice.toFixed(2)}. Computed: "${expectedWords}".`
        });
      }
    }

    // --- 3. INFORMATIONAL NOTICES ---
    if (!project.contractorId) {
      issues.push({
        id: 'INFO_NO_CONTRACTOR',
        field: 'contractorId',
        severity: 'INFORMATION',
        title: 'No Registered Contractor Linked',
        description: 'Contractor details are currently manually typed or blank. Linking a contractor from the database auto-populates enlistment and tax data.'
      });
    }

    if (!project.militaryExchangeTel?.trim()) {
      issues.push({
        id: 'INFO_MIL_TEL',
        field: 'militaryExchangeTel',
        severity: 'INFORMATION',
        title: 'Military Exchange Extension',
        description: 'Military telephone extension (e.g. Mil : 4144) is recommended for MES cantonment correspondence.'
      });
    }

    return issues;
  }
}
