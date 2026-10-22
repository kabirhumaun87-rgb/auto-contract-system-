"""
Document Builder for Auto Contract System (Python Desktop App)
Generates completed PW-2 Works Contract DOCX and PDF documents from database records.
"""

import os
from decimal import Decimal
from typing import Dict, Any

try:
    from docx import Document
    from docx.shared import Inches, Pt, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.enum.table import WD_TABLE_ALIGNMENT
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False

try:
    from reportlab.lib.pagesizes import legal
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False

from desktop_app.utils.number_to_words import number_to_bangladeshi_taka_words

class ContractDocumentBuilder:
    def __init__(self, output_dir: str):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_docx(self, project: Dict[str, Any]) -> str:
        """Builds an authentic 12-section PW-2 Contract DOCX file on Legal 8.5x14 paper."""
        if not DOCX_AVAILABLE:
            raise RuntimeError("python-docx is not installed. Run 'pip install python-docx'.")

        doc = Document()
        # Set all sections to Legal size 8.5" x 14"
        for section in doc.sections:
            section.page_width = Inches(8.5)
            section.page_height = Inches(14.0)
            section.top_margin = Inches(0.75)
            section.bottom_margin = Inches(0.75)
            section.left_margin = Inches(0.75)
            section.right_margin = Inches(0.75)

        ca_safe = project.get("contract_no", "Contract").replace("/", "_").replace(" ", "_")
        file_path = os.path.join(self.output_dir, f"Completed_Contract_{ca_safe}.docx")

        # Page 1: Master Summary Sheet
        p_title = doc.add_paragraph()
        r1 = p_title.add_run("AUTOMATIC CONTRACT SYSTEM\nFill Up The Billow Information\nContract Sheet Will Be Automatic Generate")
        r1.bold = True
        r1.underline = True
        p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER

        t1 = doc.add_table(rows=1, cols=2)
        t1.alignment = WD_TABLE_ALIGNMENT.CENTER
        fields = [
            ("Invitation Ref No", project.get("invitation_ref_no", "")),
            ("Date", project.get("date_of_contract", "")),
            ("Project/Programmer Name", project.get("project_name", "")),
            ("Tender Publication Date", project.get("tender_publication_date", "")),
            ("Tender Last Selling Date and Time", project.get("tender_last_selling_datetime", "")),
            ("Tender Closing Date and Time", project.get("tender_closing_datetime", "")),
            ("Tender Opening Date and Time", project.get("tender_opening_datetime", "")),
            ("Price of Tender document (TK)", f"{project.get('tender_document_price', 100):.2f}"),
            ("Completion Time", project.get("completion_time", "")),
            ("Name Of Work", project.get("name_of_work", "")),
            ("Auth", project.get("auth_reference", "")),
            ("Sub-Division", project.get("sub_division", "")),
            ("Code Head", project.get("code_head", "")),
            ("Drg Attached/Nil", project.get("drawing_status", "Nil")),
            ("Cement Rate (Per KG)", f"{project.get('cement_rate_opc', 12.20):.2f} (OPC) / {project.get('cement_rate_pcc', 11.80):.2f} (PCC)"),
            ("Place of Issue", project.get("store_place_of_issue", "Contractor Own supply.")),
        ]
        for label, val in fields:
            row_cells = t1.add_row().cells
            row_cells[0].text = label
            row_cells[1].text = str(val)

        doc.add_page_break()

        # Page 2: Tender Invitation Forwarding Letter (Bengali - সীমিত)
        p_bn_top = doc.add_paragraph("সীমিত")
        p_bn_top.alignment = WD_ALIGN_PARAGRAPH.CENTER
        doc.add_paragraph(f"{project.get('bn_office', 'জিই (আর্মি) সাউথ ঢাকা')}\n{project.get('bn_cantt', 'ঢাকা সেনানিবাস')}\nতারআলাপনী ঃ {project.get('bn_tel', 'সামরিক ঃ ৪১৪৪')}\n{project.get('bn_month_year', 'অক্টোবর ২০২৬')}")
        doc.add_paragraph(f"স্মারক নং: {project.get('bn_letter_ref', '৬০০১/     /ই-৬')}")
        p_work = doc.add_paragraph(project.get("name_of_work", ""))
        p_work.runs[0].underline = True
        doc.add_paragraph("১। অত্র দপ্তরের আওতাধীন বিষয়োক্ত কাজের দরপত্র এতদসংগে প্রেরণ করা হলো। উক্ত দরপত্রে আপনাদের দর অংকে এবং কথায় লিখে নির্দিষ্ট স্থানে স্বাক্ষর করতঃ নির্ধারিত তারিখে অত্র দপ্তরে রক্ষিত টেন্ডার বাক্সে ফেলতে হবে।\n২। উল্লেখ্য দরপত্রে কোন রকম ওভাররাইটিং করা যাবে না এবং ঠিকাদারদের স্বাক্ষর না থাকলে উক্ত দরপত্র বাতিল বলে গণ্য হবে।\n৩। কোন কারণে যদি আপনাদের ঠিকাপ্রতিষ্ঠান কর্তৃক দর উল্লেখ করতে ব্যর্থ হন তাহলে খালি দরপত্র অবশ্যই অত্র দপ্তরে দাখিল করতে হবে।")
        p_sig = doc.add_paragraph(f"{project.get('bn_signatory_name', 'আব্দুল্লাহ আল মামুন বিল্লাহ')}\n{project.get('bn_signatory_rank', 'লে. কর্নেল')}\n{project.get('bn_office', 'জিই (আর্মি) সাউথ ঢাকা')}")
        p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        doc.add_paragraph(f"সংযুক্ত : ১। দরপত্র = ০১ সেট।\nবিতরণ :\nবাহ্যিক : কার্যক্রম :\nমেসার্স {project.get('contractor_name', '')}")
        p_bn_bot = doc.add_paragraph("সীমিত")
        p_bn_bot.alignment = WD_ALIGN_PARAGRAPH.CENTER

        doc.add_page_break()

        # Page 3: IFT Notice (25 Points)
        p_ift = doc.add_paragraph("GOVERNMENT OF THE PEOPLE’S REPUBLIC OF BANGLADESH\nMILITARY ENGINEER SERVICES\nINVITATION FOR TENDERS")
        p_ift.alignment = WD_ALIGN_PARAGRAPH.CENTER

        # Page 4: PW-2 Cover
        doc.add_page_break()
        doc.add_paragraph(f"Standard Tender Document PW-2                 CA NO. {project.get('contract_no', '')}")
        doc.add_paragraph(f"TENDER DOCUMENT (NATIONAL)\nFOR THE PROCUREMENT OF WORKS\n\n{project.get('name_of_work', '')}")

        # Page 6: Section 4 PCC
        doc.add_page_break()
        doc.add_paragraph(f"Section 4. Particular Conditions of Contract\nCA NO. {project.get('contract_no', '')}")
        doc.add_paragraph(f"The Contractor: {project.get('contractor_name', '')}")
        doc.add_paragraph(f"The Project Manager: {project.get('project_manager', '')}")
        doc.add_paragraph(f"Intended Completion Date: {project.get('pcc_completion_period', '')}")

        # Page 7: Form PW2-1
        doc.add_page_break()
        doc.add_paragraph(f"Tender Submission Letter (Form PW2-1)\nThe Tender Price is: Tk. {project.get('total_contract_price', 0):.2f}\nIn words: {project.get('price_in_words', '')}")

        # Page 9: Section 6 BOQ
        doc.add_page_break()
        doc.add_paragraph(f"Section 6. Bill of Quantities\nName of Works: {project.get('name_of_work', '')}")
        boq_table = doc.add_table(rows=1, cols=7)
        hdr = boq_table.rows[0].cells
        hdr[0].text = "Ser"
        hdr[1].text = "Clause"
        hdr[2].text = "Description"
        hdr[3].text = "Unit"
        hdr[4].text = "Qty"
        hdr[5].text = "Rate (TK)"
        hdr[6].text = "Amount (TK)"

        for item in project.get("boq_items", []):
            row = boq_table.add_row().cells
            row[0].text = str(item.get("serial_no", ""))
            row[1].text = str(item.get("spec_clause_number", ""))
            row[2].text = str(item.get("description", ""))
            row[3].text = str(item.get("unit", ""))
            row[4].text = f"{float(item.get('quantity', 0)):.3f}"
            rate = item.get("unit_rate")
            row[5].text = f"{float(rate):.2f}" if rate is not None else ""
            row[6].text = f"{float(item.get('amount', 0)):.2f}"

        # Page 10: Section 7 General Specifications
        doc.add_page_break()
        doc.add_paragraph(f"Section 7. General Specifications\nMES Schedule of Rates 2016 amended to-date\nWater Charges: 31 paisa per 100 Taka\nRecord & Measurement: MB BAFW-2261")

        # Page 11 & 12
        doc.add_page_break()
        doc.add_paragraph(f"Section 8. Particular Specifications\nAs per Section 6, Bill of Quantities")

        doc.add_page_break()
        doc.add_paragraph(f"Section 9. Drawings\nNil")

        doc.save(file_path)
        return file_path
