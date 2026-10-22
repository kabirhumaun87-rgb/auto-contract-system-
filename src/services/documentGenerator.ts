import { ContractProject } from '../types/contract';
import { 
  formatBangladeshiCurrency, 
  numberToBangladeshiTakaWords,
  getBengaliRank,
  getBengaliSignatoryName,
  formatBOQQuantity
} from '../utils/numberToWordsBangla';

export class DocumentGenerator {
  /**
   * Generates a CSV export of the Bill of Quantities
   */
  public static generateBOQCSV(project: ContractProject): string {
    const headers = [
      'Ser No',
      'Specification Clause',
      'Brief Description of Works',
      'Unit of Works',
      'Quantity of Works',
      'Unit Rate (in TK)',
      'Amount (in TK)'
    ];

    const rows = (project.boqItems || []).map(item => [
      `"${item.serialNo}"`,
      `"${item.specClauseNumber || ''}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      `"${item.unit}"`,
      `"${formatBOQQuantity(item.quantity, 3)}"`,
      `"${item.unitRate !== null ? item.unitRate.toFixed(2) : ''}"`,
      `"${item.amount.toFixed(2)}"`
    ]);

    rows.push([
      '""',
      '""',
      '"Total TK"',
      '""',
      '""',
      '""',
      `"${project.totalContractPrice.toFixed(2)}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  }

  /**
   * Generates an official standalone HTML document containing all 12 pages with print styling
   * suitable for native browser Save-as-PDF or Direct Print
   */
  public static generatePrintableHTML(project: ContractProject): string {
    const totalWords = project.priceInWords || numberToBangladeshiTakaWords(project.totalContractPrice);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Contract Document - ${project.contractNo}</title>
  <link rel="preconnect" href="https://fonts.maateen.me">
  <link href="https://fonts.maateen.me/nikosh/font.css" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @font-face {
      font-family: 'Nikosh';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Nikosh'), local('NikoshBAN'),
           url('https://fonts.maateen.me/nikosh/files/Nikosh.woff2') format('woff2'),
           url('https://fonts.maateen.me/nikosh/files/Nikosh.woff') format('woff'),
           url('https://fonts.maateen.me/nikosh/files/Nikosh.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Nikosh';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: local('Nikosh Bold'), local('NikoshBAN Bold'),
           url('https://fonts.maateen.me/nikosh/files/Nikosh.woff2') format('woff2'),
           url('https://fonts.maateen.me/nikosh/files/Nikosh.woff') format('woff'),
           url('https://fonts.maateen.me/nikosh/files/Nikosh.ttf') format('truetype');
    }
    @page {
      size: legal portrait; /* Legal Size: 8.5in x 14in (215.9mm x 355.6mm) */
      margin: 15mm 15mm 15mm 15mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.35;
      color: #000;
      margin: 0;
      padding: 0;
      background: #fff;
    }
    .font-nikosh, .bangla-page, .bangla-page * {
      font-family: 'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif !important;
    }
    .page-break {
      page-break-after: always;
      break-after: page;
      min-height: 315mm; /* Legal height minus margins */
      position: relative;
      margin-bottom: 30px;
      padding-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
    }
    th, td {
      border: 1px solid #000;
      padding: 4px 6px;
      vertical-align: top;
      font-size: 10pt;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    .uppercase { text-transform: uppercase; }
    .underline { text-decoration: underline; }
    .page-footer-seal {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
      font-weight: bold;
    }
    .running-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #999;
      padding-bottom: 4px;
      margin-bottom: 14px;
      font-size: 9.5pt;
      font-weight: bold;
    }
    .box-bordered {
      border: 1px solid #000;
      padding: 10px;
      margin: 10px 0;
      text-align: center;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: MASTER SUMMARY SHEET -->
  <div class="page-break">
    <div class="text-center font-bold underline" style="font-size: 14pt; margin-bottom: 2px;">
      AUTOMATIC CONTRACT SYSTEM
    </div>
    <div class="text-center font-bold underline" style="font-size: 11pt; margin-bottom: 2px;">
      Fill Up The Billow Information
    </div>
    <div class="text-center font-bold underline" style="font-size: 11pt; margin-bottom: 12px;">
      Contract Sheet Will Be Automatic Generate
    </div>

    <div style="background-color: #ff0000; color: #fff; text-align: center; font-weight: bold; padding: 4px; font-size: 11pt; border: 1px solid #000;">
      Never Modify In Contract SHEET
    </div>

    <table>
      <tr><td style="width: 35%; font-weight: bold;">Invitation Ref No</td><td style="color: blue;">${project.invitationRefNo}</td></tr>
      <tr><td class="font-bold">Date</td><td>${project.dateOfContract}</td></tr>
      <tr><td class="font-bold">Project/Programmer Name</td><td>${project.projectName}</td></tr>
      <tr><td class="font-bold">Tender Publication Date</td><td>${project.tenderPublicationDate}</td></tr>
      <tr><td class="font-bold">Tender Last Selling Date and Time</td><td>${project.tenderLastSellingDateTime}</td></tr>
      <tr><td class="font-bold">Tender Closing Date and Time</td><td>${project.tenderClosingDateTime}</td></tr>
      <tr><td class="font-bold">Tender Opening Date and Time</td><td>${project.tenderOpeningDateTime}</td></tr>
      <tr><td class="font-bold">Price of Tender document (TK)</td><td>${project.tenderDocumentPrice.toFixed(2)}</td></tr>
      <tr><td class="font-bold">Completion Time</td><td>${project.completionTime}</td></tr>
      <tr><td class="font-bold">Name Of Work</td><td style="font-weight: 500;">${project.nameOfWork}</td></tr>
      <tr><td class="font-bold">Auth</td><td>${project.authReference}</td></tr>
      <tr><td class="font-bold">Sub-Division</td><td>${project.subDivision}</td></tr>
      <tr><td class="font-bold">Invitation for Tender No</td><td>Invitation for Tender No: ${project.invitationRefNo} dt. ${project.issuedOnDate}</td></tr>
      <tr><td class="font-bold">Issued on</td><td>Issued on : ${project.issuedOnDate}</td></tr>
      <tr style="background-color: #ffff00;"><td class="font-bold">Code Head</td><td class="font-bold">Code Head : ${project.codeHead}</td></tr>
      <tr><td class="font-bold">Drg Attached/Nil</td><td>${project.drawingStatus === 'Attached' ? "-Attached-'" : 'Nil'}</td></tr>
      <tr><td class="font-bold">Cement Rate (Per KG)</td><td>${project.cementRateOpc.toFixed(2)} (OPC)<br>${project.cementRatePcc.toFixed(2)} (PCC)</td></tr>
      <tr><td class="font-bold">Place of Issue</td><td>${project.storePlaceOfIssue}</td></tr>
      <tr><td class="font-bold">Store</td><td>${project.storeIssuanceDetails}</td></tr>
    </table>
  </div>

  <!-- PAGE 2: BENGALI FORWARDING LETTER -->
  <div class="page-break bangla-page font-nikosh" style="font-family: 'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif;">
    <div class="text-center font-bold font-nikosh" style="margin-bottom: 20px; font-size: 13pt;">সীমিত</div>
    <div style="margin-left: auto; width: fit-content; text-align: left; line-height: 1.4; margin-bottom: 20px;" class="font-nikosh">
      <div>${project.bnOffice || 'জিই (আর্মি) সাউথ ঢাকা'}</div>
      <div>${project.bnCantt || 'ঢাকা সেনানিবাস'}</div>
      <div>তারআলাপনী ঃ ${project.bnTel || 'সামরিক ঃ ৪১৪৪'}</div>
      <div>${project.bnKartikYear || 'কার্তিক ১৪৩৩'}</div>
      <div>${project.bnMonthYear || 'অক্টোবর ২০২৬'}</div>
    </div>
    <div style="margin-bottom: 20px; font-weight: bold;" class="font-nikosh">
      ${project.bnLetterRef || '৬০০১/     /ই-৬'}
    </div>
    <div style="margin-bottom: 25px; text-decoration: underline; font-weight: bold;" class="font-nikosh">
      ${project.nameOfWork}
    </div>
    <div style="line-height: 1.8; text-align: justify; margin-bottom: 40px;" class="font-nikosh">
      <p>১। অত্র দপ্তরের আওতাধীন বিষয়োক্ত কাজের দরপত্র এতদসংগে প্রেরণ করা হলো। উক্ত দরপত্রে আপনাদের দর অংকে এবং কথায় লিখে নির্দিষ্ট স্থানে স্বাক্ষর করতঃ আগামী..... ${project.bnMonthYear || 'অক্টোবর ২০২৬'} তারিখে সময় ১২০০ ঘটিকার মধ্যে অত্র দপ্তরে রক্ষিত টেন্ডার বাক্সে ফেলতে হবে।</p>
      <p>২। উল্লেখ্য দরপত্রে কোন রকম ওভাররাইটিং করা যাবে না এবং ঠিকাদারদের স্বাক্ষর না থাকলে উক্ত দরপত্র বাতিল বলে গণ্য হবে। তাছাড়া দরপত্র গ্রহণকারী কর্মকর্তা সর্বনিম্ন দরপত্র গ্রহণ অথবা বাতিল করতে পারবেন।</p>
      <p>৩। কোন কারণে যদি আপনাদের ঠিকাপ্রতিষ্ঠান কর্তৃক দর উল্লেখ করতে ব্যর্থ হন তাহলে খালি দরপত্র অবশ্যই অত্র দপ্তরে দাখিল করতে হবে। অন্যথায় আপনাদের প্রতিষ্ঠান এমইএস এর ঠিকাদারী তালিকা হতে বাতিল বলে গণ্য হতে পারে।</p>
      <p>৪। বিষয়টি আপনাদের পরবর্তী কার্যক্রমের জন্য প্রেরণ করা হলো।</p>
    </div>
    <div style="margin-left: auto; width: fit-content; text-align: left; line-height: 1.3; margin-bottom: 40px;" class="font-nikosh">
      <div class="font-bold font-nikosh">${getBengaliSignatoryName(project.bnSignatoryName, project.signatoryName)}</div>
      <div class="font-nikosh">${getBengaliRank(project.bnSignatoryRank || project.signatoryRank)}</div>
      <div class="font-nikosh">${project.bnOffice || 'জিই (আর্মি) সাউথ ঢাকা'}</div>
    </div>
    <div style="font-size: 10pt; line-height: 1.5;" class="font-nikosh">
      <div><strong>সংযুক্ত :</strong> ১। দরপত্র = ০১ সেট।</div>
      <div><strong>বিতরণ :</strong></div>
      <div>বাহ্যিক : কার্যক্রম :</div>
      <div>মেসার্স ${project.contractorName}</div>
    </div>
    <div class="page-footer-seal font-nikosh" style="text-align: center; justify-content: center;">
      <span>সীমিত</span>
    </div>
  </div>

  <!-- PAGE 3: INVITATION FOR TENDERS (25 ITEMS) -->
  <div class="page-break">
    <div class="text-center font-bold" style="font-size: 11pt;">
      GOVERNMENT OF THE PEOPLE’S REPUBLIC OF BANGLADESH<br>
      MILITARY ENGINEER SERVICES<br>
      ${project.procuringEntityName.toUpperCase()}<br>
      DHAKA CANTT<br>
      <span class="underline">INVITATION FOR TENDERS</span>
    </div>

    <table>
      <tr><td style="width: 5%;">1</td><td style="width: 35%;">Ministry/Division</td><td>${project.ministryDivision}</td></tr>
      <tr><td>2</td><td>Agency</td><td>${project.agency}</td></tr>
      <tr><td>3</td><td>Procuring Entity Name</td><td>${project.procuringEntityName}</td></tr>
      <tr><td>4</td><td>Procuring Entity District</td><td>${project.procuringEntityDistrict}</td></tr>
      <tr><td>5</td><td>Invitation for</td><td>Procurement of Works</td></tr>
      <tr><td>6</td><td>Invitation Ref No</td><td>${project.invitationRefNo}</td></tr>
      <tr><td>7</td><td>Date</td><td>${project.dateOfContract}</td></tr>
      <tr><td>8</td><td>Procurement Method</td><td>${project.procurementMethod}</td></tr>
      <tr><td>9</td><td>Budget and Source of Funds</td><td>Government of Bangladesh</td></tr>
      <tr><td>10</td><td>Project/Programmer Code</td><td>${project.authReference}</td></tr>
      <tr><td>11</td><td>Project/Programmer Name</td><td>${project.projectName}</td></tr>
      <tr><td>12</td><td>Tender Publication Date</td><td>${project.tenderPublicationDate}</td></tr>
      <tr><td>13</td><td>Tender Last Selling Date and Time</td><td>${project.tenderLastSellingDateTime}</td></tr>
      <tr><td>14</td><td>Tender Closing Date and Time</td><td>${project.tenderClosingDateTime}</td></tr>
      <tr><td>15</td><td>Tender Opening Date and Time</td><td>${project.tenderOpeningDateTime}</td></tr>
      <tr><td>16</td><td>Name and Address of the Office (S)<br>- Selling Tender Document<br>- Receiving Tender Document<br>- Opening Tender Document</td>
          <td>${project.sellingOffice}<br>${project.receivingOffice}<br>${project.openingOffice}</td></tr>
      <tr><td>17</td><td>Eligibility of Tender</td><td>${project.eligibilityText}</td></tr>
      <tr><td>18</td><td>Brief Description of Works</td><td><strong>${project.nameOfWork}</strong></td></tr>
      <tr><td>19</td><td>Price of Tender document (TK)</td><td><strong>${project.tenderDocumentPrice.toFixed(2)}</strong></td></tr>
      <tr><td>20</td><td>Lot Details</td><td>Location: ${project.procuringEntityDistrict} | Completion Time: ${project.completionTime}</td></tr>
      <tr><td>21</td><td>Name of Official Inviting Tender</td><td>${project.officialInvitingName}</td></tr>
      <tr><td>22</td><td>Designation of Official Inviting Tender</td><td>${project.officialInvitingDesignation}</td></tr>
      <tr><td>23</td><td>Address of Official Inviting Tender</td><td>${project.officialInvitingAddress}</td></tr>
      <tr><td>24</td><td>Contact Details of Official Inviting Tender</td><td>${project.officialInvitingContact}</td></tr>
      <tr><td>25</td><td colspan="2">The Procuring entity reserves the right to accept or reject all tenders</td></tr>
    </table>

    <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 9.5pt;">
      <div>
        <strong>${project.procuringEntityName}</strong><br>
        Dhaka Cantonment<br>
        Tel : ${project.militaryExchangeTel}<br>
        No. ${project.invitationRefNo}<br>
        Date : ${project.dateOfContract}
      </div>
      <div style="text-align: right;">
        <strong>${project.signatoryName}</strong><br>
        ${project.signatoryRank}<br>
        ${project.procuringEntityName}
      </div>
    </div>
    <div class="page-footer-seal">
      <span>- 01 -</span>
    </div>
  </div>

  <!-- PAGE 4: PW-2 COVER -->
  <div class="page-break">
    <div class="running-header">
      <span>Standard Tender Document PW-2</span>
      <span>CA NO. GSDCA/<span style="display: inline-block; width: 0.5in;">&nbsp;</span>OF ${project.fiscalYear || '2026-2027'}</span>
    </div>

    <div style="height: 40px;"></div>
    <div class="box-bordered" style="padding: 25px 15px; max-width: 500px; margin: 0 auto;">
      <div style="font-size: 13pt; font-weight: bold;">${project.procuringEntityName.toUpperCase()}</div>
      <div style="font-size: 11pt;">DHAKA CANTONMENT, DHAKA - 1206</div>
    </div>

    <div style="height: 50px;"></div>
    <div class="text-center font-bold" style="font-size: 14pt;">TENDER DOCUMENT (NATIONAL)</div>
    <div class="text-center font-bold" style="font-size: 12pt; margin-bottom: 40px;">FOR THE PROCUREMENT OF WORKS</div>

    <div class="box-bordered" style="text-align: left; padding: 20px; font-size: 11pt;">
      <div class="font-bold underline">${project.nameOfWork}</div>
    </div>

    <div style="margin-top: 30px; font-size: 10pt; line-height: 1.5;">
      <strong>Auth:</strong> ${project.authReference}
    </div>

    <div style="margin-top: 40px; font-size: 10.5pt; line-height: 1.8;">
      <div><strong>Issued on :</strong> ${project.issuedOnDate}</div>
      <div><strong>Tender Package No:</strong> ${project.tenderPackageNo}</div>
      <div><strong>Code Head :</strong> ${project.codeHead}</div>
    </div>

    <div class="page-footer-seal">
      <span>SIG SEAL OF TENDERER</span>
      <span>4</span>
    </div>
  </div>

  <!-- PAGE 5: SECTION 2 - TENDER DATA SHEET -->
  <div class="page-break">
    <div class="running-header">
      <span>Standard Tender Document PW-2</span>
      <span>CA NO. GSDCA/<span style="display: inline-block; width: 0.5in;">&nbsp;</span>OF ${project.fiscalYear || '2026-2027'}</span>
    </div>

    <div class="text-center font-bold underline" style="font-size: 13pt; margin-bottom: 15px;">
      Section 2. Tender Data Sheet
    </div>

    <table>
      <thead>
        <tr><th style="width: 15%;">ITT Clause</th><th>Amendments of, and Supplements to, Clauses in the Instructions to Tenderers</th></tr>
      </thead>
      <tbody>
        <tr><td class="font-bold" colspan="2" style="background: #f0f0f0;">A. General</td></tr>
        <tr>
          <td class="font-bold">ITT 1.1</td>
          <td>The Procuring Entity is: <strong>${project.procuringEntityName} represented by ${project.subDivision}</strong><br><br>
              <strong>${project.nameOfWork}</strong></td>
        </tr>
        <tr>
          <td class="font-bold">ITT 3.1</td>
          <td>i) Only MES Enlisted Contractor of the Categories ' D' & 'E' are eligible.<br>
              ii) Non-enlisted in MES but enlisted in other Dept. having Security clearance from DGFI are also eligible.<br>
              <strong>Option : Limited Tendering method (LTM)</strong></td>
        </tr>
        <tr><td class="font-bold" colspan="2" style="background: #f0f0f0;">B. Tender Document</td></tr>
        <tr>
          <td class="font-bold">ITT 4.1</td>
          <td>For clarification of Tender Document purposes only, the Procuring Entity's address is:<br>
              <strong>Attention:</strong> ${project.signatoryName}<br>
              <strong>Address:</strong> ${project.procuringEntityName}, Dhaka Cantt.Dhaka-1206.<br>
              <strong>Telephone:</strong> ${project.officialInvitingContact}<br>
              <strong>e-mail address:</strong> Not Applicable</td>
        </tr>
        <tr><td class="font-bold" colspan="2" style="background: #f0f0f0;">C. Qualification Criteria</td></tr>
        <tr><td class="font-bold">ITT 7.1</td><td>A satisfactory completion of similar works: <strong>N.A.</strong></td></tr>
        <tr><td class="font-bold">ITT 8.1(a)</td><td>The required average annual construction turnover shall be greater than Tk 6.00 lac over the last 05 (Five) years.: <strong>NA</strong></td></tr>
        <tr><td class="font-bold">ITT 8.1(b)</td><td>The minimum amount of liquid assets or working capital or credit facilities of the Tenderer shall be Tk 2.00 lac. <strong>NA</strong></td></tr>
      </tbody>
    </table>

    <div class="page-footer-seal">
      <span>SIG SEAL OF TENDERER</span>
      <span>15</span>
    </div>
  </div>

  <!-- PAGE 6: SECTION 4 - PARTICULAR CONDITIONS OF CONTRACT -->
  <div class="page-break">
    <div class="running-header">
      <span>Standard Tender Document PW-2</span>
      <span>CA NO. GSDCA/<span style="display: inline-block; width: 0.5in;">&nbsp;</span>OF ${project.fiscalYear || '2026-2027'}</span>
    </div>

    <div class="text-center font-bold underline" style="font-size: 13pt; margin-bottom: 8px;">
      Section 4. Particular Conditions of Contract
    </div>
    <div style="font-size: 8.5pt; font-style: italic; margin-bottom: 10px;">
      Instructions for completing the Particular Conditions of Contract are provided in italics in parenthesis for the relevant GCC Clauses.
    </div>

    <table>
      <thead>
        <tr><th style="width: 20%;">GCC Clause</th><th>Amendments of, and Supplements to, Clauses in the General Conditions of Contract</th></tr>
      </thead>
      <tbody>
        <tr><td class="font-bold">GCC 1.1(d)</td><td>The Contractor is<br><strong>Name of Firm :</strong> ${project.contractorName || '...................................................................................'}</td></tr>
        <tr><td class="font-bold">GCC 1.1(t)</td><td><strong>The Procuring Entity :</strong><br>other documents forming part of the Contract are : NA<br><strong>Address :</strong> Dhaka Cantt.Dhaka-1206<br><strong>Name of Authorised representative:</strong> ${project.authorizedRepresentative}</td></tr>
        <tr><td class="font-bold">GCC 1.1(u)</td><td><strong>The Project Manager :</strong> ${project.projectManager}<br><strong>Address :</strong> ${project.projectManagerAddress}</td></tr>
        <tr><td class="font-bold">GCC 1.1(v)</td><td><strong>The Work Consists of :</strong><br>${project.nameOfWork}</td></tr>
        <tr><td class="font-bold">GCC 1.1(aa)</td><td><strong>The Site Location :</strong><br>${project.siteLocation}</td></tr>
        <tr><td class="font-bold">GCC 3.1 (j)</td><td>other documents forming part of the Contract are : <strong>NA</strong></td></tr>
        <tr><td class="font-bold">GCC 5.1</td><td>Possession of the Site to the Contractor shall be given on the following date; <strong>${project.possessionDays}</strong></td></tr>
        <tr><td class="font-bold">GCC 10.1</td><td>The Start Date shall be the date of <strong>${project.commencementClause}</strong></td></tr>
        <tr><td class="font-bold">GCC 11.1</td><td>The Intended Completion Date for the whole of the Works shall be <strong>${project.pccCompletionPeriod}</strong></td></tr>
        <tr><td class="font-bold">GCC 12.1</td><td>The Contractor shall submit a Programme for the Works <strong>${project.workProgrammeDays}</strong></td></tr>
        <tr><td class="font-bold">GCC 19.2</td><td>The Defects Liability Period is <strong>${project.defectsLiabilityPeriod}</strong></td></tr>
      </tbody>
    </table>

    <div style="margin-top: 15px; font-weight: bold; font-size: 9.5pt;">
      <u>Special note :</u> ${project.specialNote}
    </div>

    <div class="page-footer-seal">
      <span>SIG SEAL OF TENDERER</span>
      <span>27</span>
    </div>
  </div>

  <!-- PAGE 7: FORM PW2-1 - TENDER SUBMISSION LETTER -->
  <div class="page-break">
    <div class="running-header">
      <span>Standard Tender Document PW-2</span>
      <span>CA NO. GSDCA/<span style="display: inline-block; width: 0.5in;">&nbsp;</span>OF ${project.fiscalYear || '2026-2027'}</span>
    </div>

    <div class="text-center font-bold" style="font-size: 13pt;">Tender Submission Letter (Form PW2-1)</div>
    <div class="text-center" style="font-size: 9pt; font-style: italic; margin-bottom: 12px;">
      [This letter should be completed and signed by the Authorised Signatory preferably on the Letter-Head Pad of the Tenderer]
    </div>

    <div style="display: flex; justify-content: space-between; font-size: 10pt; margin-bottom: 8px;">
      <div>
        <strong>To:</strong><br>
        ${project.procuringEntityName}<br>
        Dhaka-1206
      </div>
      <div><strong>Date :</strong> ${project.dateOfContract}</div>
    </div>
    <div style="font-size: 10pt; margin-bottom: 4px;">
      <strong>Invitation for Tender No:</strong> ${project.invitationRefNo} dt. ${project.issuedOnDate}
    </div>
    <div style="font-size: 10pt; margin-bottom: 8px;">
      <strong>Tender Package No:</strong> ${project.tenderPackageNo} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Lot No:</strong> ${project.lotNo}
    </div>
    <div style="font-size: 10pt; margin-bottom: 12px;">
      <strong>Name of Works:</strong> <u>${project.nameOfWork}</u>
    </div>

    <div style="font-size: 9.5pt; margin-bottom: 8px;">In accordance with ITT Clauses 13, the following prices apply to our Tender:</div>
    <div class="box-bordered" style="text-align: left; padding: 8px 12px; margin-bottom: 12px; font-size: 10pt;">
      <div><strong>The Tender Price is:</strong> Tk. ${formatBangladeshiCurrency(project.totalContractPrice)}</div>
      <div style="margin-top: 4px;"><strong>In word TK:</strong> ${totalWords}</div>
    </div>

    <div style="font-size: 9pt; line-height: 1.45; text-align: justify;">
      <p style="margin: 3px 0;"><strong>(a)</strong> our Tender shall be valid for the period stated in the Tender Data Sheet (ITT Sub Clause 16.1)...</p>
      <p style="margin: 3px 0;"><strong>(b)</strong> a Tender Security is attached in the form of a [pay order/ bank draft/ bank guarantee]...</p>
      <p style="margin: 3px 0;"><strong>(c)</strong> if our Tender is accepted, we commit to furnishing a Performance Security...</p>
      <p style="margin: 3px 0;"><strong>(d)</strong> we have examined and have no reservations to the Tender Document...</p>
      <p style="margin: 3px 0;"><strong>(e)</strong> We, declare that we are eligible to participate in this Tender...</p>
      <p style="margin: 3px 0;"><strong>(f)</strong> furthermore, we are aware of ITT Clause 2.2 concerning corrupt practices...</p>
      <p style="margin: 3px 0;"><strong>(g)</strong> we are not participating as Tenderers in more than one Tender in this Tendering process...</p>
    </div>

    <table style="width: 70%; margin-top: 15px;">
      <tr><td style="width: 30%;">Signature:</td><td></td></tr>
      <tr><td>Name:</td><td>${project.contractorName}</td></tr>
      <tr><td>In the capacity of:</td><td>N.A</td></tr>
      <tr><td colspan="2">Duly authorised to sign the Tender for and on behalf of the Tenderer</td></tr>
    </table>

    <div class="page-footer-seal">
      <span>SIG SEAL OF TENDERER</span>
      <span>30</span>
    </div>
  </div>

  <!-- PAGE 8: SECTION 6 - GUIDANCE NOTES -->
  <div class="page-break">
    <div class="running-header">
      <span>Standard Tender Document PW-2</span>
      <span>CA NO. GSDCA/<span style="display: inline-block; width: 0.5in;">&nbsp;</span>OF ${project.fiscalYear || '2026-2027'}</span>
    </div>

    <div class="text-center font-bold underline" style="font-size: 13pt;">Section 6. Bill of Quantities</div>
    <div class="text-center font-bold" style="font-size: 11pt; margin-bottom: 10px;">Guidance Notes on the Bill of Quantities</div>
    <div style="font-size: 10pt; margin-bottom: 12px;"><strong>Name of Works:</strong> <u>${project.nameOfWork}</u></div>

    <div style="font-size: 9.5pt; line-height: 1.4; text-align: justify;">
      <p><strong>The objectives of the Bill of Quantities (BOQ) are;</strong></p>
      <p>(a) to provide sufficient information on the quantities of Works to be performed to enable Tenders to be prepared efficiently and accurately; and</p>
      <p>(b) when a Contract has been entered into, to provide a priced BOQ for use in the periodic valuation of Works executed.</p>
      <p>(c) a separate item for tests that may be required to be carried out to ensure the quality of materials and works.</p>

      <p><strong>Correction of Errors:</strong><br>
      If in preparing Bill of Quantities of its Tender, the Tenderer has made errors in the unit rates or prices or the total price, and wishes to correct such errors prior to submission of its Tender, it may do so, but shall ensure that each correction of error is properly initialled by the authorised person of the Tenderer...</p>

      <div class="box-bordered" style="text-align: left; padding: 10px; font-weight: bold; font-size: 10pt;">
        “This Bill of Quantities contains ${project.boqCorrectionsCount || 0} corrections duly initialled and signed by the authorised person of the Tenderer”.
      </div>
    </div>

    <div class="page-footer-seal">
      <span>SIG SEAL OF TENDERER</span>
      <span>31</span>
    </div>
  </div>

  <!-- PAGE 9: SECTION 6 - BOQ SCHEDULE (7 ITEMS) -->
  <div class="page-break">
    <div class="running-header">
      <span>Standard Tender Document PW-2</span>
      <span>CA NO. GSDCA/<span style="display: inline-block; width: 0.5in;">&nbsp;</span>OF ${project.fiscalYear || '2026-2027'}</span>
    </div>

    <div class="text-center font-bold underline" style="font-size: 13pt;">Section 6. Bill of Quantities</div>
    <div class="text-center font-bold" style="font-size: 10.5pt; margin-bottom: 4px;">Sec-6 Schedule of including Technical Specification</div>
    <div style="font-size: 10pt; margin-bottom: 10px;"><strong>Name of Works :</strong> <u>${project.nameOfWork}</u></div>

    <table>
      <thead>
        <tr>
          <th style="width: 5%;">Ser No</th>
          <th style="width: 10%;">Specification clause Number</th>
          <th style="width: 45%;">Brief Description of works</th>
          <th style="width: 8%;">Unit of works</th>
          <th style="width: 10%;">Quantity of works</th>
          <th style="width: 11%;">Unit rate (in TK)</th>
          <th style="width: 11%;">Amount (in TK)</th>
        </tr>
      </thead>
      <tbody>
        ${(project.boqItems || []).map(item => `
        <tr>
          <td class="text-center">${item.serialNo}</td>
          <td class="text-center">${item.specClauseNumber || ''}</td>
          <td style="font-size: 9pt;">${item.description}</td>
          <td class="text-center font-bold">${item.unit}</td>
          <td class="text-right">${formatBOQQuantity(item.quantity, item.unit === 'Cum' ? 3 : 2)}</td>
          <td class="text-right">${item.unitRate !== null ? item.unitRate.toFixed(2) : ''}</td>
          <td class="text-right font-bold">${item.amount > 0 ? item.amount.toFixed(2) : ''}</td>
        </tr>`).join('')}
        <tr>
          <td colspan="6" class="text-right font-bold" style="font-size: 10.5pt;">Total TK</td>
          <td class="text-right font-bold" style="font-size: 10.5pt;">${formatBangladeshiCurrency(project.totalContractPrice)}</td>
        </tr>
        <tr>
          <td colspan="6" class="text-right font-bold">Say Tk=</td>
          <td class="text-right font-bold">${Math.round(project.totalContractPrice).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="page-footer-seal">
      <span>SIG SEAL OF TENDERER</span>
      <span>9 of 12</span>
    </div>
  </div>

  <!-- PAGE 10: SECTION 7 - GENERAL SPECIFICATIONS -->
  <div class="page-break">
    <div class="running-header">
      <span>Standard Tender Document PW-2</span>
      <span>CA NO. GSDCA/<span style="display: inline-block; width: 0.5in;">&nbsp;</span>OF ${project.fiscalYear || '2026-2027'}</span>
    </div>

    <div class="text-center font-bold underline" style="font-size: 13pt; margin-bottom: 6px;">Section 7. General Specifications</div>
    <div style="font-size: 10pt; margin-bottom: 10px;"><strong>The Works consist :</strong> <u>${project.nameOfWork}</u></div>

    <div style="font-size: 8.5pt; line-height: 1.35; text-align: justify;">
      <p style="margin: 2px 0;">1. The work shall be executed in accordance with the specifications laid down in MES Schedule of Rates 2016 with amended to-date...</p>
      <p style="margin: 2px 0;">2. Contractors are obliged to make detailed inspection of sites and proposed works before tendering...</p>
      <p style="margin: 2px 0;">3. Contractor will take all kinds of Safety & Security measures at his own expense to avoid any accident as per National Building Code of Bangladesh...</p>
      <p style="margin: 2px 0;">4. The site will be cleared of all rubbish, spoils, over burden etc...</p>
      <p style="margin: 2px 0;">5. Demolition work wherever involves shall be carried out carefully without damage to the structure...</p>

      <div style="margin: 6px 0;">
        <strong>6. MES store issued to Contractor :</strong>
        <table style="width: 85%; margin: 4px 0;">
          <tr>
            <th style="width: 8%;">Ser</th>
            <th>Particulars</th>
            <th style="width: 12%;">Unit</th>
            <th style="width: 25%;">Rate at which stores etc will be issued</th>
            <th style="width: 25%;">Place of Issue</th>
          </tr>
          <tr>
            <td class="text-center">a.</td>
            <td>Cement Portland Composite paper bag rate inclusive cost of bags.</td>
            <td class="text-center font-bold">Kg</td>
            <td class="text-center"><strong>${project.cementRateOpc.toFixed(2)} (OPC)</strong><br><strong>${project.cementRatePcc.toFixed(2)} (PCC)</strong></td>
            <td>${project.storePlaceOfIssue}</td>
          </tr>
        </table>
      </div>

      <p style="margin: 2px 0;">7. Stores described in sl no 6 above are to be issued for actual incorporation in the works cover in the contract...</p>
      <p style="margin: 2px 0;">8. <strong>Water Charges :</strong> Water used on work when the contractor takes water supply from MES sources, it will be charged for @ 31 paisa for every 100 Taka...</p>
      <p style="margin: 2px 0;">9. <strong>Record & Measurement :</strong> All items having a financial value shall be entered in measurement book BAFW-2261.</p>
      <p style="margin: 2px 0;">10. Quantity mentioned in the attached Schedule of works are approximate. Variation beyond 10% requires prior permission...</p>
      <p style="margin: 2px 0;">11. The rates for non-schedule item of works shall be determined as per PPR-2008.</p>
      <p style="margin: 2px 0;">12. In a particular case, specification will be given by the Engineer as and when required.</p>
      <p style="margin: 2px 0;">13. Payment will be made as per existing MES Rules.</p>
      <p style="margin: 2px 0;">14. Items against which no rates or price is entered will not be paid for by employer and deemed covered by other items.</p>
      <p style="margin: 2px 0;">15. VAT & Income Tax will be recovered from Contractor’s bill as per existing rules.</p>
      <p style="margin: 2px 0;">16. Sample of all kinds material shall be produced to the Engineer for approval before incorporation in the works.</p>
    </div>

    <div class="page-footer-seal">
      <span>SIG SEAL OF TENDERER</span>
      <span>33</span>
    </div>
  </div>

  <!-- PAGE 11: SECTION 8 - PARTICULAR SPECIFICATIONS -->
  <div class="page-break">
    <div class="running-header">
      <span>Standard Tender Document PW-2</span>
      <span>CA NO. GSDCA/<span style="display: inline-block; width: 0.5in;">&nbsp;</span>OF ${project.fiscalYear || '2026-2027'}</span>
    </div>

    <div class="text-center font-bold underline" style="font-size: 13pt; margin-bottom: 25px;">
      Section 8. Particular Specifications
    </div>
    <div style="font-size: 10.5pt; margin-bottom: 60px;">
      <strong>Name of Works :</strong> <u>${project.nameOfWork}</u>
    </div>

    <div class="text-center font-bold" style="font-size: 13pt; margin-top: 100px;">
      As per Section 6, Bill of Quantities
    </div>

    <div class="page-footer-seal">
      <span>SIG SEAL OF TENDERER</span>
      <span>34</span>
    </div>
  </div>

  <!-- PAGE 12: SECTION 9 - DRAWINGS -->
  <div class="page-break">
    <div class="running-header">
      <span>Standard Tender Document PW-2</span>
      <span>CA NO. GSDCA/<span style="display: inline-block; width: 0.5in;">&nbsp;</span>OF ${project.fiscalYear || '2026-2027'}</span>
    </div>

    <div class="text-center font-bold underline" style="font-size: 13pt; margin-bottom: 25px;">
      Section 9. Drawings
    </div>
    <div style="font-size: 10.5pt; margin-bottom: 60px;">
      <strong>Name of Works :</strong> <u>${project.nameOfWork}</u>
    </div>

    <div class="text-center" style="font-size: 12pt; margin-top: 120px;">
      .....................................................................Nil......................................................................
    </div>

    <div class="page-footer-seal">
      <span>SIG SEAL OF TENDERER</span>
      <span>35</span>
    </div>
  </div>

</body>
</html>`;
  }
}
