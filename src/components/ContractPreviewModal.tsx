import React, { useState } from 'react';
import { X, Printer, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { ContractProject } from '../types/contract';
import { 
  formatBangladeshiCurrency, 
  numberToBangladeshiTakaWords,
  getBengaliRank,
  getBengaliSignatoryName,
  formatBOQQuantity
} from '../utils/numberToWordsBangla';
import { DocumentGenerator } from '../services/documentGenerator';

interface ContractPreviewModalProps {
  project: ContractProject;
  onClose: () => void;
}

export const ContractPreviewModal: React.FC<ContractPreviewModalProps> = ({ project, onClose }) => {
  const [activePage, setActivePage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  const handlePrint = () => {
    const htmlContent = DocumentGenerator.generatePrintableHTML(project);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const totalWords = project.priceInWords || numberToBangladeshiTakaWords(project.totalContractPrice);

  const renderPage = (pageNum: number) => {
    return (
      <div 
        key={pageNum}
        className="w-[215.9mm] min-h-[355.6mm] bg-white text-black p-[20mm] shadow-md border border-slate-300 font-serif text-[13px] leading-relaxed relative mx-auto mb-8 flex flex-col justify-between"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <div>
          {/* Running Header for Pages 4-12 */}
          {pageNum >= 4 && (
            <div className="flex justify-between border-b border-black pb-1 mb-6 text-[12px] font-bold">
              <span>Standard Tender Document PW-2</span>
              <span>
                CA NO. GSDCA/<span style={{ display: 'inline-block', width: '0.5in' }}>&nbsp;</span>OF {project.fiscalYear || '2026-2027'}
              </span>
            </div>
          )}

          {/* PAGE 1: AUTOMATIC CONTRACT SYSTEM MASTER SHEET */}
          {pageNum === 1 && (
            <div>
              <div className="text-center font-bold underline text-[18px] mb-1">
                AUTOMATIC CONTRACT SYSTEM
              </div>
              <div className="text-center font-bold underline text-[14px] mb-1">
                Fill Up The Billow Information
              </div>
              <div className="text-center font-bold underline text-[14px] mb-4">
                Contract Sheet Will Be Automatic Generate
              </div>

              <div className="bg-red-600 text-white font-bold text-center py-1 mb-4 text-[13px] border border-black uppercase">
                Never Modify In Contract SHEET
              </div>

              <table className="w-full border-collapse border border-black text-[12px]">
                <tbody>
                  <tr><td className="border border-black p-1.5 font-bold w-1/3">Invitation Ref No</td><td className="border border-black p-1.5 text-blue-800 font-medium">{project.invitationRefNo}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Date</td><td className="border border-black p-1.5">{project.dateOfContract}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Project/Programmer Name</td><td className="border border-black p-1.5">{project.projectName}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Tender Publication Date</td><td className="border border-black p-1.5">{project.tenderPublicationDate}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Tender Last Selling Date and Time</td><td className="border border-black p-1.5">{project.tenderLastSellingDateTime}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Tender Closing Date and Time</td><td className="border border-black p-1.5">{project.tenderClosingDateTime}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Tender Opening Date and Time</td><td className="border border-black p-1.5">{project.tenderOpeningDateTime}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Price of Tender document (TK)</td><td className="border border-black p-1.5">{project.tenderDocumentPrice.toFixed(2)}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Completion Time</td><td className="border border-black p-1.5">{project.completionTime}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Name Of Work</td><td className="border border-black p-1.5 font-medium">{project.nameOfWork}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Auth</td><td className="border border-black p-1.5 text-[11px]">{project.authReference}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Sub-Division</td><td className="border border-black p-1.5">{project.subDivision}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Invitation for Tender No</td><td className="border border-black p-1.5">Invitation for Tender No: {project.invitationRefNo} dt. {project.issuedOnDate}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Issued on</td><td className="border border-black p-1.5">Issued on : {project.issuedOnDate}</td></tr>
                  <tr className="bg-yellow-200"><td className="border border-black p-1.5 font-bold">Code Head</td><td className="border border-black p-1.5 font-bold">Code Head : {project.codeHead}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Drg Attached/Nil</td><td className="border border-black p-1.5">{project.drawingStatus === 'Attached' ? "-Attached-'" : 'Nil'}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Cement Rate (Per KG)</td><td className="border border-black p-1.5">{project.cementRateOpc.toFixed(2)} (OPC)<br/>{project.cementRatePcc.toFixed(2)} (PCC)</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Place of Issue</td><td className="border border-black p-1.5">{project.storePlaceOfIssue}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Store</td><td className="border border-black p-1.5">{project.storeIssuanceDetails}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* PAGE 2: BENGALI FORWARDING LETTER */}
          {pageNum === 2 && (
            <div className="font-nikosh" style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}>
              <div 
                className="text-center font-bold text-[14px] mb-6 font-nikosh"
                style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}
              >
                সীমিত
              </div>
              <div 
                className="ml-auto w-fit text-left space-y-1 mb-6 text-[12px] font-nikosh"
                style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}
              >
                <div>{project.bnOffice || 'জিই (আর্মি) সাউথ ঢাকা'}</div>
                <div>{project.bnCantt || 'ঢাকা সেনানিবাস'}</div>
                <div>তারআলাপনী ঃ {project.bnTel || 'সামরিক ঃ ৪১৪৪'}</div>
                <div>{project.bnKartikYear || 'কার্তিক ১৪৩৩'}</div>
                <div>{project.bnMonthYear || 'অক্টোবর ২০২৬'}</div>
              </div>
              <div 
                className="font-bold mb-6 text-[12px] font-nikosh"
                style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}
              >
                {project.bnLetterRef || '৬০০১/     /ই-৬'}
              </div>
              <div 
                className="font-bold underline mb-8 text-[12px] font-nikosh"
                style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}
              >
                {project.nameOfWork}
              </div>
              <div 
                className="space-y-4 text-justify text-[12px] leading-relaxed mb-12 font-nikosh"
                style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}
              >
                <p>১। অত্র দপ্তরের আওতাধীন বিষয়োক্ত কাজের দরপত্র এতদসংগে প্রেরণ করা হলো। উক্ত দরপত্রে আপনাদের দর অংকে এবং কথায় লিখে নির্দিষ্ট স্থানে স্বাক্ষর করতঃ আগামী..... {project.bnMonthYear || 'অক্টোবর ২০২৬'} তারিখে সময় ১২০০ ঘটিকার মধ্যে অত্র দপ্তরে রক্ষিত টেন্ডার বাক্সে ফেলতে হবে।</p>
                <p>২। উল্লেখ্য দরপত্রে কোন রকম ওভাররাইটিং করা যাবে না এবং ঠিকাদারদের স্বাক্ষর না থাকলে উক্ত দরপত্র বাতিল বলে গণ্য হবে। তাছাড়া দরপত্র গ্রহণকারী কর্মকর্তা সর্বনিম্ন দরপত্র গ্রহণ অথবা বাতিল করতে পারবেন।</p>
                <p>৩। কোন কারণে যদি আপনাদের ঠিকাপ্রতিষ্ঠান কর্তৃক দর উল্লেখ করতে ব্যর্থ হন তাহলে খালি দরপত্র অবশ্যই অত্র দপ্তরে দাখিল করতে হবে। অন্যথায় আপনাদের প্রতিষ্ঠান এমইএস এর ঠিকাদারী তালিকা হতে বাতিল বলে গণ্য হতে পারে।</p>
                <p>৪। বিষয়টি আপনাদের পরবর্তী কার্যক্রমের জন্য প্রেরণ করা হলো।</p>
              </div>
              <div 
                className="ml-auto w-fit text-left space-y-1 mb-8 text-[12px] font-nikosh"
                style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}
              >
                <div 
                  className="font-normal font-nikosh" 
                  style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}
                >
                  {getBengaliSignatoryName(project.bnSignatoryName, project.signatoryName)}
                </div>
                <div 
                  className="font-nikosh" 
                  style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}
                >
                  {getBengaliRank(project.bnSignatoryRank || project.signatoryRank)}
                </div>
                <div 
                  className="font-nikosh"
                  style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}
                >
                  {project.bnOffice || 'জিই (আর্মি) সাউথ ঢাকা'}
                </div>
              </div>
              <div 
                className="text-[12px] space-y-1 font-nikosh"
                style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}
              >
                <div><strong className="font-normal">সংযুক্ত :</strong> ১। দরপত্র = ০১ সেট।</div>
                <div><strong className="font-normal">বিতরণ :</strong></div>
                <div>বাহ্যিক : কার্যক্রম :</div>
                <div>মেসার্স {project.contractorName}</div>
              </div>
              <div 
                className="text-center font-normal text-[14px] mt-10 font-nikosh" 
                style={{ fontFamily: "'Nikosh', 'NikoshBAN', 'SolaimanLipi', 'Kalpurush', 'Noto Serif Bengali', serif" }}
              >
                সীমিত
              </div>
            </div>
          )}

          {/* PAGE 3: INVITATION FOR TENDERS */}
          {pageNum === 3 && (
            <div>
              <div className="text-center font-bold text-[12px] mb-3 leading-tight">
                GOVERNMENT OF THE PEOPLE’S REPUBLIC OF BANGLADESH<br/>
                MILITARY ENGINEER SERVICES<br/>
                {project.procuringEntityName.toUpperCase()}<br/>
                DHAKA CANTT<br/>
                <span className="underline">INVITATION FOR TENDERS</span>
              </div>

              <table className="w-full border-collapse border border-black text-[11px] mb-4">
                <tbody>
                  <tr><td className="border border-black p-1 w-6 text-center">1</td><td className="border border-black p-1 w-1/3">Ministry/Division</td><td className="border border-black p-1">{project.ministryDivision}</td></tr>
                  <tr><td className="border border-black p-1 text-center">2</td><td className="border border-black p-1">Agency</td><td className="border border-black p-1">{project.agency}</td></tr>
                  <tr><td className="border border-black p-1 text-center">3</td><td className="border border-black p-1">Procuring Entity Name</td><td className="border border-black p-1">{project.procuringEntityName}</td></tr>
                  <tr><td className="border border-black p-1 text-center">4</td><td className="border border-black p-1">Procuring Entity District</td><td className="border border-black p-1">{project.procuringEntityDistrict}</td></tr>
                  <tr><td className="border border-black p-1 text-center">5</td><td className="border border-black p-1">Invitation for</td><td className="border border-black p-1">Procurement of Works</td></tr>
                  <tr><td className="border border-black p-1 text-center">6</td><td className="border border-black p-1">Invitation Ref No</td><td className="border border-black p-1">{project.invitationRefNo}</td></tr>
                  <tr><td className="border border-black p-1 text-center">7</td><td className="border border-black p-1">Date</td><td className="border border-black p-1">{project.dateOfContract}</td></tr>
                  <tr><td className="border border-black p-1 text-center">8</td><td className="border border-black p-1">Procurement Method</td><td className="border border-black p-1">{project.procurementMethod}</td></tr>
                  <tr><td className="border border-black p-1 text-center">9</td><td className="border border-black p-1">Budget and Source of Funds</td><td className="border border-black p-1">Government of Bangladesh</td></tr>
                  <tr><td className="border border-black p-1 text-center">10</td><td className="border border-black p-1">Project/Programmer Code</td><td className="border border-black p-1 text-[10px]">{project.authReference}</td></tr>
                  <tr><td className="border border-black p-1 text-center">11</td><td className="border border-black p-1">Project/Programmer Name</td><td className="border border-black p-1">{project.projectName}</td></tr>
                  <tr><td className="border border-black p-1 text-center">12</td><td className="border border-black p-1">Tender Publication Date</td><td className="border border-black p-1">{project.tenderPublicationDate}</td></tr>
                  <tr><td className="border border-black p-1 text-center">13</td><td className="border border-black p-1">Tender Last Selling Date and Time</td><td className="border border-black p-1">{project.tenderLastSellingDateTime}</td></tr>
                  <tr><td className="border border-black p-1 text-center">14</td><td className="border border-black p-1">Tender Closing Date and Time</td><td className="border border-black p-1">{project.tenderClosingDateTime}</td></tr>
                  <tr><td className="border border-black p-1 text-center">15</td><td className="border border-black p-1">Tender Opening Date and Time</td><td className="border border-black p-1">{project.tenderOpeningDateTime}</td></tr>
                  <tr><td className="border border-black p-1 text-center">16</td><td className="border border-black p-1">Name and Address of the Office (S)</td><td className="border border-black p-1">Selling, Receiving & Opening: {project.procuringEntityName}</td></tr>
                  <tr><td className="border border-black p-1 text-center">17</td><td className="border border-black p-1">Eligibility of Tender</td><td className="border border-black p-1">{project.eligibilityText}</td></tr>
                  <tr><td className="border border-black p-1 text-center">18</td><td className="border border-black p-1">Brief Description of Works</td><td className="border border-black p-1 font-bold">{project.nameOfWork}</td></tr>
                  <tr><td className="border border-black p-1 text-center">19</td><td className="border border-black p-1">Price of Tender document (TK)</td><td className="border border-black p-1 font-bold">{project.tenderDocumentPrice.toFixed(2)}</td></tr>
                  <tr><td className="border border-black p-1 text-center">20</td><td className="border border-black p-1">Lot Details</td><td className="border border-black p-1">Location: {project.procuringEntityDistrict} | Completion Time: {project.completionTime}</td></tr>
                  <tr><td className="border border-black p-1 text-center">21</td><td className="border border-black p-1">Name of Official Inviting Tender</td><td className="border border-black p-1">{project.officialInvitingName}</td></tr>
                  <tr><td className="border border-black p-1 text-center">22</td><td className="border border-black p-1">Designation of Official Inviting</td><td className="border border-black p-1">{project.officialInvitingDesignation}</td></tr>
                  <tr><td className="border border-black p-1 text-center">23</td><td className="border border-black p-1">Address of Official Inviting</td><td className="border border-black p-1">{project.officialInvitingAddress}</td></tr>
                  <tr><td className="border border-black p-1 text-center">24</td><td className="border border-black p-1">Contact Details</td><td className="border border-black p-1">{project.officialInvitingContact}</td></tr>
                  <tr><td className="border border-black p-1 text-center">25</td><td colSpan={2} className="border border-black p-1">The Procuring entity reserves the right to accept or reject all tenders</td></tr>
                </tbody>
              </table>

              <div className="flex justify-between text-[11px] mt-4">
                <div>
                  <strong>{project.procuringEntityName}</strong><br/>
                  Dhaka Cantonment<br/>
                  Tel : {project.militaryExchangeTel}<br/>
                  No. {project.invitationRefNo}
                </div>
                <div className="text-right">
                  <strong>{project.signatoryName}</strong><br/>
                  {project.signatoryRank}<br/>
                  {project.procuringEntityName}
                </div>
              </div>
            </div>
          )}

          {/* PAGE 4: PW-2 COVER */}
          {pageNum === 4 && (
            <div className="text-center pt-8">
              <div className="border border-black py-4 px-6 max-w-sm mx-auto mb-16">
                <div className="font-bold text-[14px]">{project.procuringEntityName.toUpperCase()}</div>
                <div className="text-[12px]">DHAKA CANTONMENT, DHAKA - 1206</div>
              </div>

              <div className="font-bold text-[16px] mb-1">TENDER DOCUMENT (NATIONAL)</div>
              <div className="font-bold text-[14px] mb-16">FOR THE PROCUREMENT OF WORKS</div>

              <div className="border border-black p-4 text-left mb-12">
                <div className="font-bold underline text-[13px]">{project.nameOfWork}</div>
              </div>

              <div className="text-left text-[11px] mb-12">
                <strong>Auth:</strong> {project.authReference}
              </div>

              <div className="text-left text-[12px] space-y-1">
                <div><strong>Issued on :</strong> {project.issuedOnDate}</div>
                <div><strong>Tender Package No:</strong> {project.tenderPackageNo}</div>
                <div><strong>Code Head :</strong> {project.codeHead}</div>
              </div>
            </div>
          )}

          {/* PAGE 5: SECTION 2 - TENDER DATA SHEET */}
          {pageNum === 5 && (
            <div>
              <div className="text-center font-bold underline text-[15px] mb-4">
                Section 2. Tender Data Sheet
              </div>
              <table className="w-full border-collapse border border-black text-[12px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-black p-1.5 w-1/5 text-left">ITT Clause</th>
                    <th className="border border-black p-1.5 text-left">Amendments of, and Supplements to, Clauses in Instructions to Tenderers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-slate-50"><td colSpan={2} className="border border-black p-1 font-bold">A. General</td></tr>
                  <tr>
                    <td className="border border-black p-1.5 font-bold">ITT 1.1</td>
                    <td className="border border-black p-1.5">
                      The Procuring Entity is: <strong>{project.procuringEntityName} represented by {project.subDivision}</strong><br/><br/>
                      <strong>{project.nameOfWork}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1.5 font-bold">ITT 3.1</td>
                    <td className="border border-black p-1.5">
                      i) Only MES Enlisted Contractor of the Categories ' D' & 'E' are eligible.<br/>
                      ii) Non-enlisted in MES but enlisted in other Dept. having Security clearance from DGFI are also eligible.<br/>
                      <strong>Option : Limited Tendering method (LTM)</strong>
                    </td>
                  </tr>
                  <tr className="bg-slate-50"><td colSpan={2} className="border border-black p-1 font-bold">B. Tender Document</td></tr>
                  <tr>
                    <td className="border border-black p-1.5 font-bold">ITT 4.1</td>
                    <td className="border border-black p-1.5">
                      For clarification of Tender Document purposes only, the Procuring Entity's address is:<br/>
                      <strong>Attention:</strong> {project.signatoryName}<br/>
                      <strong>Address:</strong> {project.procuringEntityName}, Dhaka Cantt.Dhaka-1206.<br/>
                      <strong>Telephone:</strong> {project.officialInvitingContact}<br/>
                      <strong>e-mail address:</strong> Not Applicable
                    </td>
                  </tr>
                  <tr className="bg-slate-50"><td colSpan={2} className="border border-black p-1 font-bold">C. Qualification Criteria</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">ITT 7.1</td><td className="border border-black p-1.5">A satisfactory completion of similar works: <strong>N.A.</strong></td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">ITT 8.1(a)</td><td className="border border-black p-1.5">The required average annual construction turnover shall be greater than Tk 6.00 lac over the last 05 (Five) years.: <strong>NA</strong></td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">ITT 8.1(b)</td><td className="border border-black p-1.5">The minimum amount of liquid assets or working capital or credit facilities of the Tenderer shall be Tk 2.00 lac. <strong>NA</strong></td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* PAGE 6: SECTION 4 - PCC */}
          {pageNum === 6 && (
            <div>
              <div className="text-center font-bold underline text-[15px] mb-1">
                Section 4. Particular Conditions of Contract
              </div>
              <div className="text-[11px] italic mb-3">
                Instructions for completing the Particular Conditions of Contract are provided in italics in parenthesis for the relevant GCC Clauses.
              </div>
              <table className="w-full border-collapse border border-black text-[12px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-black p-1.5 w-1/4 text-left">GCC Clause</th>
                    <th className="border border-black p-1.5 text-left">Amendments of, and Supplements to, Clauses in GCC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-black p-1.5 font-bold">GCC 1.1(d)</td><td className="border border-black p-1.5">The Contractor is<br/><strong>Name of Firm :</strong> {project.contractorName}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">GCC 1.1(t)</td><td className="border border-black p-1.5"><strong>The Procuring Entity :</strong><br/>other documents forming part of the Contract are : NA<br/><strong>Address :</strong> Dhaka Cantt.Dhaka-1206<br/><strong>Name of Authorised representative:</strong> {project.authorizedRepresentative}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">GCC 1.1(u)</td><td className="border border-black p-1.5"><strong>The Project Manager :</strong> {project.projectManager}<br/><strong>Address :</strong> {project.projectManagerAddress}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">GCC 1.1(v)</td><td className="border border-black p-1.5"><strong>The Work Consists of :</strong><br/>{project.nameOfWork}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">GCC 1.1(aa)</td><td className="border border-black p-1.5"><strong>The Site Location :</strong><br/>{project.siteLocation}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">GCC 3.1 (j)</td><td className="border border-black p-1.5">other documents forming part of the Contract are : <strong>NA</strong></td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">GCC 5.1</td><td className="border border-black p-1.5">Possession of the Site to Contractor: <strong>{project.possessionDays}</strong></td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">GCC 10.1</td><td className="border border-black p-1.5">The Start Date shall be the date of <strong>{project.commencementClause}</strong></td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">GCC 11.1</td><td className="border border-black p-1.5">The Intended Completion Date for whole of Works: <strong>{project.pccCompletionPeriod}</strong></td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">GCC 12.1</td><td className="border border-black p-1.5">The Contractor shall submit a Programme: <strong>{project.workProgrammeDays}</strong></td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">GCC 19.2</td><td className="border border-black p-1.5">The Defects Liability Period is <strong>{project.defectsLiabilityPeriod}</strong></td></tr>
                </tbody>
              </table>
              <div className="mt-4 font-bold text-[12px]">
                <u>Special note :</u> {project.specialNote}
              </div>
            </div>
          )}

          {/* PAGE 7: FORM PW2-1 */}
          {pageNum === 7 && (
            <div>
              <div className="text-center font-bold text-[15px]">Tender Submission Letter (Form PW2-1)</div>
              <div className="text-center italic text-[11px] mb-4">
                [This letter should be completed and signed by the Authorised Signatory preferably on the Letter-Head Pad of the Tenderer]
              </div>

              <div className="flex justify-between text-[12px] mb-2">
                <div><strong>To:</strong><br/>{project.procuringEntityName}<br/>Dhaka-1206</div>
                <div><strong>Date :</strong> {project.dateOfContract}</div>
              </div>
              <div className="text-[12px] mb-1"><strong>Invitation for Tender No:</strong> {project.invitationRefNo} dt. {project.issuedOnDate}</div>
              <div className="text-[12px] mb-1"><strong>Tender Package No:</strong> {project.tenderPackageNo} &nbsp;&nbsp;&nbsp; <strong>Lot No:</strong> {project.lotNo}</div>
              <div className="text-[12px] mb-3"><strong>Name of Works:</strong> <u>{project.nameOfWork}</u></div>

              <div className="text-[12px] mb-2">In accordance with ITT Clauses 13, the following prices apply to our Tender:</div>
              <div className="border border-black p-2.5 mb-4 text-[12px]">
                <div><strong>The Tender Price is:</strong> Tk. {formatBangladeshiCurrency(project.totalContractPrice)}</div>
                <div className="mt-1"><strong>In word TK:</strong> {totalWords}</div>
              </div>

              <div className="text-[11px] space-y-1.5 text-justify leading-relaxed">
                <p>(a) our Tender shall be valid for the period stated in the Tender Data Sheet (ITT Sub Clause 16.1)...</p>
                <p>(b) a Tender Security is attached in the form of a [pay order/ bank draft/ bank guarantee]...</p>
                <p>(c) if our Tender is accepted, we commit to furnishing a Performance Security...</p>
                <p>(d) we have examined and have no reservations to the Tender Document...</p>
                <p>(e) We, declare that we are eligible to participate in this Tender...</p>
                <p>(f) furthermore, we are aware of ITT Clause 2.2 concerning corrupt practices...</p>
                <p>(g) we are not participating as Tenderers in more than one Tender...</p>
              </div>

              <table className="w-2/3 border border-black mt-6 text-[12px]">
                <tbody>
                  <tr><td className="border border-black p-1.5 font-bold w-1/3">Signature:</td><td className="border border-black p-1.5"></td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">Name:</td><td className="border border-black p-1.5">{project.contractorName}</td></tr>
                  <tr><td className="border border-black p-1.5 font-bold">In the capacity of:</td><td className="border border-black p-1.5">N.A</td></tr>
                  <tr><td colSpan={2} className="border border-black p-1.5 text-[11px]">Duly authorised to sign the Tender for and on behalf of the Tenderer</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* PAGE 8: SECTION 6 - GUIDANCE NOTES */}
          {pageNum === 8 && (
            <div>
              <div className="text-center font-bold underline text-[15px]">Section 6. Bill of Quantities</div>
              <div className="text-center font-bold text-[13px] mb-3">Guidance Notes on the Bill of Quantities</div>
              <div className="text-[12px] mb-4"><strong>Name of Works:</strong> <u>{project.nameOfWork}</u></div>

              <div className="text-[12px] space-y-3 text-justify leading-relaxed">
                <p><strong>The objectives of the Bill of Quantities (BOQ) are;</strong></p>
                <p>(a) to provide sufficient information on the quantities of Works to be performed to enable Tenders to be prepared efficiently and accurately; and</p>
                <p>(b) when a Contract has been entered into, to provide a priced BOQ for use in the periodic valuation of Works executed.</p>
                <p>(c) a separate item for tests that may be required to be carried out to ensure the quality of materials and works.</p>

                <p className="mt-4"><strong>Correction of Errors</strong><br/>
                If in preparing Bill of Quantities of its Tender, the Tenderer has made errors in the unit rates or prices or the total price, and wishes to correct such errors prior to submission of its Tender, it may do so, but shall ensure that each correction of error is properly initialled by the authorised person of the Tenderer...</p>

                <div className="border border-black p-3 font-bold text-[12px] my-4">
                  “This Bill of Quantities contains {project.boqCorrectionsCount || 0} corrections duly initialled and signed by the authorised person of the Tenderer”.
                </div>
              </div>
            </div>
          )}

          {/* PAGE 9: SECTION 6 - SCHEDULE OF WORKS (7 ITEMS) */}
          {pageNum === 9 && (
            <div>
              <div className="text-center font-bold underline text-[15px]">Section 6. Bill of Quantities</div>
              <div className="text-center font-bold text-[13px] mb-1">Sec-6 Schedule of including Technical Specification</div>
              <div className="text-[12px] mb-3"><strong>Name of Works :</strong> <u>{project.nameOfWork}</u></div>

              <table className="w-full border-collapse border border-black text-[11px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-black p-1 text-center w-8">Ser</th>
                    <th className="border border-black p-1 text-center w-16">Clause</th>
                    <th className="border border-black p-1 text-left">Brief Description of works</th>
                    <th className="border border-black p-1 text-center w-12">Unit</th>
                    <th className="border border-black p-1 text-right w-14">Quantity</th>
                    <th className="border border-black p-1 text-right w-16">Unit Rate</th>
                    <th className="border border-black p-1 text-right w-20">Amount (Tk)</th>
                  </tr>
                </thead>
                <tbody>
                  {(project.boqItems || []).map(item => (
                    <tr key={item.id}>
                      <td className="border border-black p-1 text-center font-mono">{item.serialNo}</td>
                      <td className="border border-black p-1 text-center">{item.specClauseNumber || ''}</td>
                      <td className="border border-black p-1 text-[10px] leading-tight">{item.description}</td>
                      <td className="border border-black p-1 text-center font-bold">{item.unit}</td>
                      <td className="border border-black p-1 text-right font-mono">{formatBOQQuantity(item.quantity, item.unit === 'Cum' ? 3 : 2)}</td>
                      <td className="border border-black p-1 text-right font-mono">{item.unitRate !== null ? item.unitRate.toFixed(2) : ''}</td>
                      <td className="border border-black p-1 text-right font-mono font-bold">{item.amount > 0 ? item.amount.toFixed(2) : ''}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={6} className="border border-black p-1 text-right">Total TK</td>
                    <td className="border border-black p-1 text-right font-mono">{formatBangladeshiCurrency(project.totalContractPrice)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={6} className="border border-black p-1 text-right">Say Tk=</td>
                    <td className="border border-black p-1 text-right font-mono">{Math.round(project.totalContractPrice).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* PAGE 10: SECTION 7 - GENERAL SPECIFICATIONS */}
          {pageNum === 10 && (
            <div>
              <div className="text-center font-bold underline text-[15px] mb-1">Section 7. General Specifications</div>
              <div className="text-[12px] mb-2"><strong>The Works consist :</strong> <u>{project.nameOfWork}</u></div>

              <div className="text-[10px] space-y-1.5 text-justify leading-snug">
                <p>1. The work shall be executed in accordance with the specifications laid down in MES Schedule of Rates 2016 with amended to-date...</p>
                <p>2. Contractors are obliged to make detailed inspection of sites and proposed works before tendering...</p>
                <p>3. Contractor will take all kinds of Safety & Security measures as per National Building Code of Bangladesh...</p>
                <p>4. The site will be cleared of all rubbish, spoils, over burden etc...</p>
                <p>5. Demolition work wherever involves shall be carried out carefully without damage to the structure...</p>

                <div className="my-2">
                  <strong>6. MES store issued to Contractor :</strong>
                  <table className="w-full border-collapse border border-black text-[10px] my-1">
                    <thead>
                      <tr>
                        <th className="border border-black p-1 w-8">Ser</th>
                        <th className="border border-black p-1">Particulars</th>
                        <th className="border border-black p-1 w-10">Unit</th>
                        <th className="border border-black p-1 w-28">Issue Rate</th>
                        <th className="border border-black p-1 w-28">Place of Issue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-1 text-center">a.</td>
                        <td className="border border-black p-1">Cement Portland Composite paper bag rate inclusive bags.</td>
                        <td className="border border-black p-1 text-center font-bold">Kg</td>
                        <td className="border border-black p-1 text-center"><strong>{project.cementRateOpc.toFixed(2)} (OPC)</strong><br/><strong>{project.cementRatePcc.toFixed(2)} (PCC)</strong></td>
                        <td className="border border-black p-1">{project.storePlaceOfIssue}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>7. Stores described in sl no 6 above are to be issued for actual incorporation in the works...</p>
                <p>8. <strong>Water Charges :</strong> Water used on work charged @ 31 paisa for every 100 Taka whole cost...</p>
                <p>9. <strong>Record & Measurement :</strong> All items having a financial value shall be entered in measurement book BAFW-2261.</p>
                <p>10. Quantity mentioned in attached Schedule of works are approximate. Variation beyond 10% requires permission...</p>
                <p>11. Non-schedule item rates determined as per PPR-2008.</p>
                <p>12. In a particular case, specification will be given by Engineer as required.</p>
                <p>13. Payment made as per existing MES Rules.</p>
                <p>14. Items against which no rates entered deemed covered by other items.</p>
                <p>15. VAT & Income Tax will be recovered from Contractor’s bill as per existing rules.</p>
                <p>16. Samples produced to Engineer for approval before incorporation.</p>
              </div>
            </div>
          )}

          {/* PAGE 11: SECTION 8 - PARTICULAR SPECIFICATIONS */}
          {pageNum === 11 && (
            <div className="pt-6">
              <div className="text-center font-bold underline text-[15px] mb-8">
                Section 8. Particular Specifications
              </div>
              <div className="text-[12px] mb-24">
                <strong>Name of Works :</strong> <u>{project.nameOfWork}</u>
              </div>
              <div className="text-center font-bold text-[14px]">
                As per Section 6, Bill of Quantities
              </div>
            </div>
          )}

          {/* PAGE 12: SECTION 9 - DRAWINGS */}
          {pageNum === 12 && (
            <div className="pt-6">
              <div className="text-center font-bold underline text-[15px] mb-8">
                Section 9. Drawings
              </div>
              <div className="text-[12px] mb-32">
                <strong>Name of Works :</strong> <u>{project.nameOfWork}</u>
              </div>
              <div className="text-center text-[13px]">
                .....................................................................Nil......................................................................
              </div>
            </div>
          )}
        </div>

        {/* Bottom Seal for Pages 4-12 */}
        {pageNum >= 4 ? (
          <div className="flex justify-between items-center text-[11px] font-bold border-t border-black pt-1">
            <span>SIG SEAL OF TENDERER</span>
            <span>
              {pageNum === 4 && '4'}
              {pageNum === 5 && '15'}
              {pageNum === 6 && '27'}
              {pageNum === 7 && '30'}
              {pageNum === 8 && '31'}
              {pageNum === 9 && '9 of 12'}
              {pageNum === 10 && '33'}
              {pageNum === 11 && '34'}
              {pageNum === 12 && '35'}
            </span>
          </div>
        ) : pageNum === 3 ? (
          <div className="text-center text-[11px] font-bold">
            - 01 -
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-between p-4 overflow-hidden">
      {/* Top Preview Controls */}
      <div className="w-full max-w-5xl bg-slate-900 text-white px-4 py-2.5 rounded-t-lg flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold font-mono text-blue-400">{project.contractNo}</span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-medium truncate max-w-xs">{project.nameOfWork}</span>
          <span className="text-[10px] font-mono font-bold bg-slate-800 text-blue-300 border border-slate-700 px-1.5 py-0.5 rounded">
            Legal 8.5"×14"
          </span>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'single' && (
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
              <button
                onClick={() => setActivePage(p => Math.max(1, p - 1))}
                disabled={activePage === 1}
                className="p-1 hover:text-blue-400 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono font-medium px-2">Page {activePage} of 12</span>
              <button
                onClick={() => setActivePage(p => Math.min(12, p + 1))}
                disabled={activePage === 12}
                className="p-1 hover:text-blue-400 disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded text-xs">
            <button
              onClick={() => setViewMode('single')}
              className={`px-2.5 py-1 rounded ${viewMode === 'single' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
            >
              Single Page
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 rounded ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
            >
              All 12 Pages
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Contract</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Document Viewer Canvas */}
      <div className="w-full max-w-5xl flex-1 bg-slate-700 p-6 overflow-y-auto rounded-b-lg flex flex-col items-center">
        {viewMode === 'single' ? (
          renderPage(activePage)
        ) : (
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => renderPage(num))
        )}
      </div>
    </div>
  );
};
