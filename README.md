# Auto Contract System (Auto Contract System.exe)

Automated Bangladesh Government & Military Engineer Services (MES) Works Contract Generation System.
Compliant with **Public Procurement Act (PPA 2006)**, **Public Procurement Rules (PPR-2008)**, and the **Standard Tender Document PW-2 (National)** format.

---

## 1. Project Overview & Reference Document

This application was engineered based on the official 12-page reference document:
**`PW-2 Contract 2026–2027(1).pdf`** from Military Engineer Services (MES), Bangladesh / Ministry of Defence.

The system automates the preparation of all 12 contractual sections:
1. **Cover & Master Input Sheet:** 19 master parameters, contract references, budget heads, and store issue rates.
2. **Tender Forwarding Letter (সীমিত):** Official Bengali correspondence with Kartik 1433 / Gregorian dates, Memo 6001, and mandatory PPA instructions.
3. **Invitation for Tenders (IFT):** Standardized 25-point government procurement table and official dispatch list.
4. **PW-2 Contract Cover:** CA Number, Procuring Entity box, Work description, and authority letters.
5. **Section 2 (Tender Data Sheet):** Clauses ITT 1.1, 3.1 (MES Category D/E and DGFI clearance), 4.1, 7.1, 8.1(a), 8.1(b).
6. **Section 4 (Particular Conditions of Contract):** Clauses GCC 1.1, 3.1, 5.1 (3 days site possession), 10.1 (Work Order commencement), 11.1 (Completion period), 12.1, 19.2 (Defects liability), and statutory VAT/Tax notice.
7. **Form PW2-1 (Tender Submission Letter):** Taka in figures (`Tk.`) and words (`In word TK`), legal clauses (a)–(g), and authorized signatory block.
8. **Section 6 (BOQ Guidance Notes):** Statutory objectives, measurement rules, and mandatory error correction declaration.
9. **Section 6 (BOQ & Technical Specification Schedule):** 7-column spreadsheet schedule, unit rate calculations, total sum, and `Say Tk=`.
10. **Section 7 (General Specifications):** 16 mandatory clauses, MES Schedule of Rates 2016, Store table (Cement OPC/PCC), Water Charges (31 paisa/100 Tk), and MB BAFW-2261.
11. **Section 8 (Particular Specifications):** Cross-reference to Section 6 Schedule of Works.
12. **Section 9 (Drawings):** Formal drawing declaration (`Nil` or attached schedule).

---

## 2. Inconsistency Detection & Pre-Generation Audit Engine

The application includes an automated discrepancy engine that audits contracts against known anomalies observed in procurement files:
* **Fiscal Year Mismatch:** Verifies agreement numbers against running headers.
* **Completion Time Conflict:** Alerts if Cover/IFT period (7 days) conflicts with GCC Clause 11.1 (15 days), allowing authorized override with reason logging.
* **Drawing Status Sync:** Cross-checks Page 1 status (`-Attached-'`) against Section 9 declaration (`Nil`).
* **Bangladeshi Taka in Words:** Automatically converts numeric totals to English South Asian format (Crore, Lakh, Thousand, Hundred, Taka, and Paisa) using exact decimal arithmetic.

---

## 3. Technology Architecture

* **Web Preview & Interactive Station:** React 19, TypeScript, Tailwind CSS, Lucide icons, and Client-Side Persistent Storage (IndexedDB/localStorage).
* **Desktop Application (Windows):** Python 3.12, PySide6 GUI, SQLite local database, `python-docx` for Word documents, and `reportlab` for PDF generation.
* **Packaging:** PyInstaller configuration producing standalone `Auto Contract System.exe`.

---

## 4. Building the Windows Executable (`Auto Contract System.exe`)

To package the standalone Windows `.exe`:

1. Open Windows Command Prompt or PowerShell in the `desktop_app` directory:
   ```cmd
   cd desktop_app
   ```

2. Install dependencies:
   ```cmd
   pip install -r requirements.txt
   pip install pyinstaller
   ```

3. Run the automated Windows build script:
   ```cmd
   build_windows.bat
   ```
   Or execute PyInstaller directly:
   ```cmd
   pyinstaller --noconfirm --clean auto_contract.spec
   ```

4. The packaged standalone executable will be created at:
   ```
   desktop_app\dist\Auto Contract System.exe
   ```

---

## 5. Running Automated Tests

Run the comprehensive unit test suite:
```bash
python3 -m unittest discover -s desktop_app/tests
```

Coverage includes:
* Database schema initialization, migrations, and CRUD transactions.
* Bangladeshi Taka amount-in-words conversion (integers, Lakhs, Crores, and Paisa).
* Decimal arithmetic and financial rounding.
* Database snapshot backup and integrity restoration.
