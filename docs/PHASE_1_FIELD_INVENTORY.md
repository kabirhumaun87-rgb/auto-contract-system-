# PHASE 1: PAGE-BY-PAGE FIELD INVENTORY & DOCUMENT TEMPLATE SPECIFICATION
**Document Reference:** `PW-2 Contract 2026–2027(1).pdf` (12 Pages)
**Application:** Auto Contract System (Auto Contract System.exe)
**Authority:** Military Engineer Services (MES), Bangladesh / Ministry of Defence

---

## 1. Overview & Document Architecture

The reference document is a 12-page national competitive / limited tendering works contract package standardly used by the Military Engineer Services (Army), Bangladesh under Public Procurement Act (PPA) / Public Procurement Rules (PPR-2008) PW-2 format.

| Page # | Section Title / Purpose | Document Nature | Key Elements |
|---|---|---|---|
| **Page 1** | Automatic Contract System Master Input Sheet | Data Entry / Control Sheet | 19 Master variables, project parameters, rates |
| **Page 2** | Tender Invitation Forwarding Letter (সীমিত) | Official Bengali Correspondence | Bengali date/year (Kartik 1433), Ref 6001, Instructions to tenderers, Signatory |
| **Page 3** | Form IFT: Invitation for Tenders | Standard 25-Point IFT Notice | 25 standardized procurement items, dispatch list |
| **Page 4** | Standard Tender Document PW-2 Cover Page | Official Contract Cover | CA Number, Procuring Entity, Auth references, Code Head |
| **Page 5** | Section 2: Tender Data Sheet (TDS) | Instructions to Tenderers (ITT) | ITT 1.1, 3.1, 4.1, 7.1, 8.1(a), 8.1(b) criteria |
| **Page 6** | Section 4: Particular Conditions of Contract (PCC) | Contract Clauses (GCC amendments) | GCC 1.1(d,t,u,v,aa), 3.1(j), 5.1, 10.1, 11.1, 12.1, 19.2 |
| **Page 7** | Tender Submission Letter (Form PW2-1) | Tenderer Legal Declaration | Tender price in figures & words, 7 legal clauses, Signatory block |
| **Page 8** | Section 6: Bill of Quantities - Guidance Notes | Official Guidance & Correction Rule | BOQ objectives, measurement rules, correction clause |
| **Page 9** | Section 6: Bill of Quantities & Technical Specifications | Priced Schedule of Works | 7-column schedule with 7 line items, Total & Say Tk |
| **Page 10** | Section 7: General Specifications | Mandatory Contract Conditions | 16 General clauses, MES Schedule of Rates 2016, Water charges, Store table |
| **Page 11** | Section 8: Particular Specifications | Technical Cross-Reference | Cross reference to Section 6 Schedule |
| **Page 12** | Section 9: Drawings | Drawing Schedule / Status | Drawing list or explicit Nil confirmation |

---

## 2. Detailed Page-by-Page Field Inventory

### Page 1: Automatic Contract System Master Sheet
- **Header:** `AUTOMATIC CONTRACT SYSTEM` / `Fill Up The Billow Information` / `Contract Sheet Will Be Automatic Generate` / `Never Modify In Contract SHEET`
- **Fields (19 Items):**
  1. `invitation_ref_no`: `GSDCA/XY of 2026-2027/1/E-6` (String, required)
  2. `date`: `10-2026` (Date string, MM-YYYY or DD-MM-YYYY)
  3. `project_name`: `Maint Work` (String)
  4. `tender_publication_date`: `10-2026` (Date string)
  5. `tender_last_selling_datetime`: `10-2026 at 1400 hrs` (Date + time string)
  6. `tender_closing_datetime`: `10-2026 at 1200 hrs` (Date + time string)
  7. `tender_opening_datetime`: `10-2026 at 1230 hrs` (Date + time string)
  8. `tender_document_price`: `100.00` (Decimal BDT)
  9. `completion_time`: `07 (Seven) days` (Period string)
  10. `name_of_work`: `Repair/Maint of Internal Decoration Works to Bldg No 04 Office Bldg for 05 RE BN Area at Postogola Cantt.` (Text)
  11. `auth_reference`: `Auth: Sta HQ Dhaka Ltr No-23.01.901.661.07. 026. 01. 01. 07. 2026/Board/Q-3 Dt. 01 July 2026 & CMES (Army) Dhaka Ltr No.6005/DCA/South/Part-04/08/E-6 Dt. 20 September 2026` (Multi-line text)
  12. `sub_division`: `SDO I/C Postogola` (String)
  13. `invitation_for_tender_no`: `Invitation for Tender No: GSDCA/xy of 2026-2027/01/E-6 dt. -10-2026` (String)
  14. `issued_on`: `Issued on : -10-2026` (Date string)
  15. `code_head`: `3258106` (Budget classification string)
  16. `drawing_status`: `-Attached-'` or `Nil` (String)
  17. `cement_rate_opc`: `12.20` BDT/KG (Decimal)
  18. `cement_rate_pcc`: `11.80` BDT/KG (Decimal)
  19. `place_of_issue`: `Contractor Own supply.` (String)
  20. `store_issuance`: `Any MES store at GE (Army) South / Contractor Own supply.` (String)

---

### Page 2: Official Forwarding Letter (Bengali - সীমিত)
- **Classification:** `সীমিত` (Restricted)
- **Issuing Authority:**
  - Office: `জিই (আর্মি) সাউথ ঢাকা` (GE (Army) South Dhaka)
  - Location: `ঢাকা সেনানিবাস` (Dhaka Cantonment)
  - Telephone: `তারআলাপনী ঃ সামরিক ঃ ৪১৪৪` (Military Tel: 4144)
  - Bengali Date: `কার্তিক ১৪৩৩` (Kartik 1433)
  - Gregorian Date: `অক্টোবর ২০২৬` (October 2026)
  - Memo Ref: `৬০০১/     /ই-৬` (6001/    /E-6)
- **Subject:** `Repair/Maint of Internal Decoration Works to Bldg No 04 Office Bldg for 05 RE BN Area at Postogola Cantt.`
- **Body Clauses (Fixed Official Text):**
  - ১। দরপত্র প্রেরণের বিবরণ এবং জমাদানের শেষ সময় (১২০০ ঘটিকা, অক্টোবর ২০২৬).
  - ২। ওভাররাইটিং নিষিদ্ধ ও বাতিলের শর্তাবলী.
  - ৩। দর উল্লেখ না করতে পারলে খালি দরপত্র দাখিলের বাধ্যবাধকতা.
  - ৪। পরবর্তী কার্যক্রমের নির্দেশ.
- **Signatory:**
  - `signatory_name`: `আব্দুল্লাহ আল মামুন বিল্লাহ` (Abdullah Al Mamun Billah)
  - `signatory_rank`: `লে. কর্নেল` (Lt Col)
  - `signatory_designation`: `জিই (আর্মি) সাউথ ঢাকা` (GE (Army) South Dhaka)
- **Recipients / Distribution:**
  - `contractor_name`: `মেসার্স .................` (M/S ...)

---

### Page 3: Invitation For Tenders (25-Point IFT Form)
- **Header:** `GOVERNMENT OF THE PEOPLE’S REPUBLIC OF BANGLADESH / MILITARY ENGINEER SERVICES / GE (ARMY) SOUTH / DHAKA CANTT`
- **Fields 1-25:**
  1. `ministry`: `Ministry of Defence`
  2. `agency`: `Military Engineer Services (Army)`
  3. `procuring_entity_name`: `GE (Army) South, Dhaka`
  4. `procuring_entity_district`: `Dhaka`
  5. `invitation_for`: `Procurement of Works`
  6. `invitation_ref_no`: `GSDCA/XY of 2026-2027/1/E-6`
  7. `ift_date`: `- 10-2026`
  8. `procurement_method`: `Limited Tendering Method (LTM)`
  9. `budget_source`: `Government of Bangladesh`
  10. `project_code`: Combined Auth string
  11. `project_name`: `Maint Work`
  12. `tender_publication_date`: `- 10-2026`
  13. `tender_selling_datetime`: `- 10-2026 at 1400 hrs`
  14. `tender_closing_datetime`: `- 10-2026 at 1200 hrs`
  15. `tender_opening_datetime`: `- 10-2026 at 1230 hrs`
  16. `office_addresses`: Selling, Receiving, Opening at `GE (Army) South, Dhaka`
  17. `eligibility`: `MES Enlisted Contractors Only`
  18. `brief_description`: Work description text
  19. `tender_doc_price`: `100.00` BDT
  20. `lot_details`:
      - Lot No: `-`
      - Identification: `-`
      - Location: `Dhaka`
      - Tender Security: `-`
      - Completion Time: `07 (Seven) days`
  21. `official_inviting_name`: `GE (Army) South Dhaka`
  22. `official_inviting_designation`: `Lt Col`
  23. `official_inviting_address`: `GE (Army) South, Dhaka Cantt`
  24. `official_inviting_contact`: `Tel No : 9834144`
  25. `reservation_clause`: `The Procuring entity reserves the right to accept or reject all tenders`
- **Bottom Dispatch:**
  - Official Sign: Abdullah Al Mamun Billah, Lt Col, GE (Army) South Dhaka
  - Phone: `Tel : Mil : 4144`
  - Distribution: 1. CMES (Army) Dhaka; 2. GE (Army) Central/North/Mirpur/CMH; 3. Notice Board.
  - Page footer: `- 01 -`

---

### Page 4: Standard Tender Document PW-2 Cover Page
- **Running Header:** `Standard Tender Document PW-2` | `CA NO. GSDCA/     OF 2025-2026`
- **Procuring Box:** `GE (ARMY) SOUTH / DHAKA CANTONMENT, DHAKA - 1206`
- **Document Title:** `TENDER DOCUMENT (NATIONAL) / FOR THE PROCUREMENT OF WORKS`
- **Work Box:** `Repair/Maint of Internal Decoration Works to Bldg No 04 Office Bldg for 05 RE BN Area at Postogola Cantt.`
- **Auth Box:** Authority reference string
- **Footer Metadata:**
  - `Issued on :   -10-2026`
  - `Tender Package No: NA`
  - `Code Head : 3258106`
- **Signatory Placeholder:** `SIG SEAL OF TENDERER` | Page `4`

---

### Page 5: Section 2. Tender Data Sheet (TDS)
- **Running Header:** `Standard Tender Document PW-2` | `CA NO. GSDCA/     OF 2025-2026`
- **Clauses:**
  - `ITT 1.1`: The Procuring Entity is: `GE (Army) south Dhaka represented by SDO I/C Postogola`
  - `ITT 3.1`: Eligibility: i) Only MES Enlisted Contractor of Categories 'D' & 'E'; ii) DGFI clearance for non-MES; Option: LTM.
  - `ITT 4.1`: Clarification Address: Attention: `Abdullah Al Mamun Billah`, Address: `GE (Army) South Dhaka, Dhaka Cantt.Dhaka-1206`, Tel: `8754144`, Email: `Not Applicable`.
  - `ITT 7.1`: Satisfactory completion of similar works: `N.A.`
  - `ITT 8.1(a)`: Required turnover: `greater than Tk 6.00 lac over the last 05 (Five) years.: NA`
  - `ITT 8.1(b)`: Minimum liquid assets: `Tk 2.00 lac. NA`
- **Footer:** `SIG SEAL OF TENDERER` | Page `15`

---

### Page 6: Section 4. Particular Conditions of Contract (PCC)
- **Running Header:** `Standard Tender Document PW-2` | `CA NO. GSDCA/     OF 2025-2026`
- **Clauses:**
  - `GCC 1.1(d)`: The Contractor is / `Name of Firm : ...................................................................................`
  - `GCC 1.1(t)`: The Procuring Entity: other documents: NA / Address: `Dhaka Cantt.Dhaka-1206` / Authorised representative: `GE (Army) Dhaka Cantt.`
  - `GCC 1.1(u)`: The Project Manager: `SDO I/C Postogola` / Address: `GE (Army) South, Dhaka Cantonment, Dhaka-1206`
  - `GCC 1.1(v)`: The Work Consists of: Full description
  - `GCC 1.1(aa)`: The Site Location: Full description
  - `GCC 3.1(j)`: Other documents forming part of the Contract: `NA`
  - `GCC 5.1`: Possession of the Site: `Within 03 days after signing the Contract Agreement.`
  - `GCC 10.1`: Start Date: `commencement shown in 1st written Work Orders (WO) by the Project Manager i.e. SDO.`
  - `GCC 11.1`: Intended Completion Date: `15 (Fifteen) days`
  - `GCC 12.1`: Programme for Works: `within 03 days of signing the Contract. NA`
  - `GCC 19.2`: Defects Liability Period: `03 (Three) month.`
- **Special note:** `(1) Recovery of VAT, Income tax and other charges will be applicable as per latest Government order.`
- **Footer:** `SIG SEAL OF TENDERER` | Page `27`

---

### Page 7: Tender Submission Letter (Form PW2-1)
- **Running Header:** `Standard Tender Document PW-2` | `CA NO. GSDCA/     OF 2025-2026`
- **Addressee:** `To: GE (Army) south, Dhaka Cantt, Dhaka-1206` | `Date :`
- **Reference:** `Invitation for Tender No: GSDCA/xy of 2026-2027/01/E-6 dt.   -10-2026`
- **Tender Price:**
  - `Tk........................................................................................`
  - `In word TK`
- **Clauses (a) to (g):** Legal declarations (TDS validity, Tender Security, Performance Security, no reservations, eligibility, anti-corruption, single bid).
- **Signature Table:**
  - Signature
  - Name
  - In the capacity of: `N.A`
  - Duly authorised to sign the Tender for and on behalf of the Tenderer
- **Attachment 1:** Written confirmation authorising signatory
- **Footer:** `SIG SEAL OF TENDERER` | Page `30`

---

### Page 8: Section 6. Bill of Quantities - Guidance Notes
- **Running Header:** `Standard Tender Document PW-2` | `CA NO. GSDCA/     OF 2025-2026`
- **Title:** `Section 6. Bill of Quantities / Guidance Notes on the Bill of Quantities`
- **Work Name:** Included at top.
- **Guidance Objectives:** (a) sufficient quantity info, (b) priced BOQ for valuation, (c) test items.
- **Mandatory Error Note Requirement:**
  - `“This Bill of Quantities contains [state number] corrections duly initialled and signed by the authorised person of the Tenderer”.`
- **Footer:** `SIG SEAL OF TENDERER` | Page `31`

---

### Page 9: Section 6. Bill of Quantities & Technical Specifications
- **Running Header:** `Standard Tender Document PW-2` | `CA NO. GSDCA/     OF 2025-2026`
- **Title:** `Sec-6 Schedule of including Technical Specification`
- **Work Name:** Stated at top.
- **7-Column Table:**
  1. `Ser No`
  2. `Specification clause Number`
  3. `Brief Description of works`
  4. `Unit of works`
  5. `Quantity of works`
  6. `Unit rate (in TK)`
  7. `Amount (in TK)`
- **7 Sample Items:**
  - Item 1: Cupboard 625mm depth (both side melamine coated 19mm, 2x drawer, shelf, plastic board liner, steel channels/hinges/handle/lock, OTOBI/NAVANA/PARTEX) -> `Sqm` | `5.00`
  - Item 2: Plastic Cat Door incl hanging with chowkat and SS mongeries -> `Sqm` | `0.45`
  - Item 3: Chowkat for doors gates incl holdfast (Silkorai Ctg) -> `Cum` | `0.043`
  - Item 4: 36mm thick flush door shutter both side Chapalish veneered -> `Sqm` | `2.252`
  - Item 5: SS mongeries for single leaf door -> `Each` | `1.000`
  - Item 6: 300mm long 15mm dia SS sliding & locking bolt -> `Each` | `1.000`
  - Item 7: Spirit polishing to new Wood Surface -> `Sqm` | `5.040`
- **Summary Rows:**
  - `Total TK`
  - `Say Tk=`
- **Footer:** `SIG SEAL OF TENDERER` | Page `9 of 12`

---

### Page 10: Section 7. General Specifications
- **Running Header:** `Standard Tender Document PW-2` | `CA NO. GSDCA/     OF 2025-2026`
- **Title:** `Section 7. General Specifications`
- **Work Consist:** Description
- **Clauses 1 to 16:**
  - 1: MES Schedule of Rates 2016 amended to-date.
  - 2: Inspection of sites & non-compensation for misunderstanding.
  - 3: Safety & security (NBC of Bangladesh, nylon nets, helmets, safety belts, scaffolding).
  - 4: Site clearance.
  - 5: Demolition precautions.
  - 6: `MES store issued to Contractor`:
    - a. Cement Portland Composite paper bag inclusive bags: Unit `Kg`, Taka `12.20 (OPC)` / `11.80 (PCC)`, Place: `Contractor Own supply.`
  - 7: Actual incorporation only.
  - 8: `Water Charges`: 31 paisa per 100 Taka of whole work cost; or 14 paisa per thousand litre if metered.
  - 9: `Record & Measurement`: entered in measurement book BAFW-2261.
  - 10: Variation beyond 10% requires prior permission.
  - 11: Non-schedule items determined as per PPR-2008.
  - 12: Engineer specifications.
  - 13: MES payment rules.
  - 14: Unpriced items deemed covered by other rates.
  - 15: VAT & Income Tax recovery.
  - 16: Material samples approval.
- **Footer:** `SIG SEAL OF TENDERER` | Page `33`

---

### Page 11: Section 8. Particular Specifications
- **Running Header:** `Standard Tender Document PW-2` | `CA NO. GSDCA/     OF 2025-2026`
- **Title:** `Section 8. Particular Specifications`
- **Work Name:** Stated at top.
- **Fixed Clause:** `As per Section 6, Bill of Quantities`
- **Footer:** `SIG SEAL OF TENDERER` | Page `34`

---

### Page 12: Section 9. Drawings
- **Running Header:** `Standard Tender Document PW-2` | `CA NO. GSDCA/     OF 2025-2026`
- **Title:** `Section 9. Drawings`
- **Work Name:** Stated at top.
- **Content:** `.....................................................................Nil......................................................................`
- **Footer:** `SIG SEAL OF TENDERER` | Page `35`

---

## 3. Reference Discrepancy & Conflict Analysis (Critical for Validation Engine)

The validation engine must flag these 4 documented anomalies present in the reference PDF:

| Conflict Item | Location A | Location B | Conflict Severity | Resolution Rule in Software |
|---|---|---|---|---|
| **Contract Agreement Year** | Page 1 & 3: `2026-2027` | Pages 4–12 Headers: `OF 2025-2026` | **WARNING** | Allow user to choose active fiscal year; ensure consistency across all pages. |
| **Completion Period** | Page 1 & Page 3 Item 20: `07 (Seven) days` | Page 6 (GCC 11.1): `15 (Fifteen) days` | **WARNING** | Flag mismatch. Require user confirmation of whether contract is 7 days or 15 days. |
| **Drawing Schedule Status** | Page 1: `-Attached-'` | Page 12: `Nil` | **WARNING** | Synchronize status or alert if Page 1 claims attached while Section 9 declares Nil. |
| **Official Contact Number** | Page 2 & 3 Dispatch: `Tel : Mil : 4144` | Page 3 Item 24: `Tel No : 9834144`, Page 5 ITT 4.1: `8754144` | **INFORMATION** | Clarify whether Mil Exchange or PABX/Direct Landline should be displayed. |

This concludes Phase 1 field inventory and structural mapping.
