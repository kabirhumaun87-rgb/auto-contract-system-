"""
Database Manager for Auto Contract System Desktop App (PySide6 / Windows)
Handles SQLite connection, schema initialization, CRUD operations, transactions, and backups.
"""

import sqlite3
import os
import shutil
import json
from decimal import Decimal
from datetime import datetime
from typing import List, Dict, Any, Optional

DEFAULT_DB_FILENAME = "auto_contract_system.db"

class DatabaseManager:
    def __init__(self, db_path: Optional[str] = None):
        if db_path is None:
            # Locate in user AppData / local data directory or project root
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_dir = os.path.join(base_dir, "data")
            os.makedirs(data_dir, exist_ok=True)
            self.db_path = os.path.join(data_dir, DEFAULT_DB_FILENAME)
        else:
            self.db_path = db_path

        self.schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
        self.init_database()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def init_database(self):
        """Initializes tables using schema.sql if they do not exist."""
        if os.path.exists(self.schema_path):
            with open(self.schema_path, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            with self.get_connection() as conn:
                conn.executescript(schema_sql)
                conn.commit()

    # --- Project CRUD ---
    def save_project(self, project: Dict[str, Any]) -> str:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            now = datetime.now().isoformat()
            project_id = project.get("id")

            cursor.execute("SELECT id FROM contract_projects WHERE id = ?", (project_id,))
            exists = cursor.fetchone()

            if exists:
                cursor.execute("""
                    UPDATE contract_projects SET
                        contract_no = ?, invitation_ref_no = ?, project_name = ?, auth_reference = ?,
                        code_head = ?, name_of_work = ?, procuring_entity_name = ?, procuring_entity_district = ?,
                        site_location = ?, sub_division = ?, procurement_method = ?, ministry_division = ?,
                        agency = ?, tender_package_no = ?, lot_no = ?, tender_document_price = ?,
                        completion_time = ?, drawing_status = ?, date_of_contract = ?, issued_on_date = ?,
                        fiscal_year = ?, internal_remarks = ?, status = ?, tender_publication_date = ?,
                        tender_last_selling_datetime = ?, tender_closing_datetime = ?, tender_opening_datetime = ?,
                        tender_validity_period = ?, tender_security_amount = ?, performance_security_percentage = ?,
                        selling_office = ?, receiving_office = ?, opening_office = ?, eligibility_text = ?,
                        official_inviting_name = ?, official_inviting_designation = ?, official_inviting_address = ?,
                        official_inviting_contact = ?, military_exchange_tel = ?, project_manager = ?,
                        project_manager_address = ?, authorized_representative = ?, signatory_name = ?,
                        signatory_rank = ?, bn_office = ?, bn_cantt = ?, bn_tel = ?, bn_month_year = ?,
                        bn_kartik_year = ?, bn_letter_ref = ?, contractor_id = ?, contractor_name = ?,
                        contractor_address = ?, possession_days = ?, commencement_clause = ?,
                        pcc_completion_period = ?, work_programme_days = ?, defects_liability_period = ?,
                        other_contract_docs = ?, special_note = ?, cement_rate_opc = ?, cement_rate_pcc = ?,
                        store_place_of_issue = ?, store_issuance_details = ?, water_charges_note = ?,
                        measurement_book_no = ?, total_contract_price = ?, price_in_words = ?,
                        boq_corrections_count = ?, updated_at = ?
                    WHERE id = ?
                """, (
                    project.get("contract_no"), project.get("invitation_ref_no"), project.get("project_name"),
                    project.get("auth_reference"), project.get("code_head"), project.get("name_of_work"),
                    project.get("procuring_entity_name"), project.get("procuring_entity_district"),
                    project.get("site_location"), project.get("sub_division"), project.get("procurement_method"),
                    project.get("ministry_division"), project.get("agency"), project.get("tender_package_no"),
                    project.get("lot_no"), float(project.get("tender_document_price", 100.0)),
                    project.get("completion_time"), project.get("drawing_status"), project.get("date_of_contract"),
                    project.get("issued_on_date"), project.get("fiscal_year"), project.get("internal_remarks"),
                    project.get("status", "draft"), project.get("tender_publication_date"),
                    project.get("tender_last_selling_datetime"), project.get("tender_closing_datetime"),
                    project.get("tender_opening_datetime"), project.get("tender_validity_period"),
                    project.get("tender_security_amount"), float(project.get("performance_security_percentage", 5.0)),
                    project.get("selling_office"), project.get("receiving_office"), project.get("opening_office"),
                    project.get("eligibility_text"), project.get("official_inviting_name"),
                    project.get("official_inviting_designation"), project.get("official_inviting_address"),
                    project.get("official_inviting_contact"), project.get("military_exchange_tel"),
                    project.get("project_manager"), project.get("project_manager_address"),
                    project.get("authorized_representative"), project.get("signatory_name"),
                    project.get("signatory_rank"), project.get("bn_office"), project.get("bn_cantt"),
                    project.get("bn_tel"), project.get("bn_month_year"), project.get("bn_kartik_year"),
                    project.get("bn_letter_ref"), project.get("contractor_id"), project.get("contractor_name"),
                    project.get("contractor_address"), project.get("possession_days"),
                    project.get("commencement_clause"), project.get("pcc_completion_period"),
                    project.get("work_programme_days"), project.get("defects_liability_period"),
                    project.get("other_contract_docs"), project.get("special_note"),
                    float(project.get("cement_rate_opc", 12.20)), float(project.get("cement_rate_pcc", 11.80)),
                    project.get("store_place_of_issue"), project.get("store_issuance_details"),
                    project.get("water_charges_note"), project.get("measurement_book_no", "BAFW-2261"),
                    float(project.get("total_contract_price", 0.0)), project.get("price_in_words"),
                    int(project.get("boq_corrections_count", 0)), now, project_id
                ))
            else:
                cursor.execute("""
                    INSERT INTO contract_projects (
                        id, contract_no, invitation_ref_no, project_name, auth_reference, code_head,
                        name_of_work, procuring_entity_name, procuring_entity_district, site_location,
                        sub_division, procurement_method, ministry_division, agency, tender_package_no,
                        lot_no, tender_document_price, completion_time, drawing_status, date_of_contract,
                        issued_on_date, fiscal_year, internal_remarks, status, tender_publication_date,
                        tender_last_selling_datetime, tender_closing_datetime, tender_opening_datetime,
                        tender_validity_period, tender_security_amount, performance_security_percentage,
                        selling_office, receiving_office, opening_office, eligibility_text, official_inviting_name,
                        official_inviting_designation, official_inviting_address, official_inviting_contact,
                        military_exchange_tel, project_manager, project_manager_address, authorized_representative,
                        signatory_name, signatory_rank, bn_office, bn_cantt, bn_tel, bn_month_year,
                        bn_kartik_year, bn_letter_ref, contractor_id, contractor_name, contractor_address,
                        possession_days, commencement_clause, pcc_completion_period, work_programme_days,
                        defects_liability_period, other_contract_docs, special_note, cement_rate_opc,
                        cement_rate_pcc, store_place_of_issue, store_issuance_details, water_charges_note,
                        measurement_book_no, total_contract_price, price_in_words, boq_corrections_count,
                        created_at, updated_at
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                    )
                """, (
                    project_id,
                    project.get("contract_no", "DRAFT/01"),
                    project.get("invitation_ref_no", "DRAFT/REF"),
                    project.get("project_name", "Maint Work"),
                    project.get("auth_reference", "Auth: Sta HQ Dhaka"),
                    project.get("code_head", "3258106"),
                    project.get("name_of_work", "Works"),
                    project.get("procuring_entity_name", "GE (Army) South, Dhaka"),
                    project.get("procuring_entity_district", "Dhaka"),
                    project.get("site_location", "Dhaka"),
                    project.get("sub_division", "SDO I/C Postogola"),
                    project.get("procurement_method", "Limited Tendering Method (LTM)"),
                    project.get("ministry_division", "Ministry of Defence"),
                    project.get("agency", "Military Engineer Services (Army)"),
                    project.get("tender_package_no", "NA"),
                    project.get("lot_no", "-"),
                    float(project.get("tender_document_price", 100.0)),
                    project.get("completion_time", "07 (Seven) days"),
                    project.get("drawing_status", "Nil"),
                    project.get("date_of_contract", "10-2026"),
                    project.get("issued_on_date", "-10-2026"),
                    project.get("fiscal_year", "2026-2027"),
                    project.get("internal_remarks", ""),
                    project.get("status", "draft"),
                    project.get("tender_publication_date", "- 10-2026"),
                    project.get("tender_last_selling_datetime", "- 10-2026 at 1400 hrs"),
                    project.get("tender_closing_datetime", "- 10-2026 at 1200 hrs"),
                    project.get("tender_opening_datetime", "- 10-2026 at 1230 hrs"),
                    project.get("tender_validity_period", "60 (Sixty) days"),
                    project.get("tender_security_amount", "-"),
                    float(project.get("performance_security_percentage", 5.0)),
                    project.get("selling_office", "GE (Army) South, Dhaka"),
                    project.get("receiving_office", "GE (Army) South, Dhaka"),
                    project.get("opening_office", "GE (Army) South, Dhaka"),
                    project.get("eligibility_text", "MES Enlisted Contractors Only"),
                    project.get("official_inviting_name", "GE (Army) South Dhaka"),
                    project.get("official_inviting_designation", "Lt Col"),
                    project.get("official_inviting_address", "GE (Army) South, Dhaka Cantt"),
                    project.get("official_inviting_contact", "Tel No : 9834144"),
                    project.get("military_exchange_tel", "Mil : 4144"),
                    project.get("project_manager", "SDO I/C Postogola"),
                    project.get("project_manager_address", "GE (Army) South, Dhaka Cantonment"),
                    project.get("authorized_representative", "GE (Army) Dhaka Cantt."),
                    project.get("signatory_name", "Abdullah Al Mamun Billah"),
                    project.get("signatory_rank", "Lt Col"),
                    project.get("bn_office", "জিই (আর্মি) সাউথ ঢাকা"),
                    project.get("bn_cantt", "ঢাকা সেনানিবাস"),
                    project.get("bn_tel", "সামরিক ঃ ৪১৪৪"),
                    project.get("bn_month_year", "অক্টোবর ২০২৬"),
                    project.get("bn_kartik_year", "কার্তিক ১৪৩৩"),
                    project.get("bn_letter_ref", "৬০০১/     /ই-৬"),
                    project.get("contractor_id"),
                    project.get("contractor_name", ""),
                    project.get("contractor_address", ""),
                    project.get("possession_days", "Within 03 days"),
                    project.get("commencement_clause", "Work Orders"),
                    project.get("pcc_completion_period", "15 (Fifteen) days"),
                    project.get("work_programme_days", "within 03 days"),
                    project.get("defects_liability_period", "03 (Three) month."),
                    project.get("other_contract_docs", "NA"),
                    project.get("special_note", "Recovery of VAT, Income tax and other charges"),
                    float(project.get("cement_rate_opc", 12.20)),
                    float(project.get("cement_rate_pcc", 11.80)),
                    project.get("store_place_of_issue", "Contractor Own supply."),
                    project.get("store_issuance_details", "Any MES store / Contractor Own supply."),
                    project.get("water_charges_note", "Water used charged @ 31 paisa per 100 Taka"),
                    project.get("measurement_book_no", "BAFW-2261"),
                    float(project.get("total_contract_price", 0.0)),
                    project.get("price_in_words", ""),
                    int(project.get("boq_corrections_count", 0)),
                    now,
                    now
                ))

            # Replace BOQ items
            cursor.execute("DELETE FROM boq_items WHERE project_id = ?", (project_id,))
            for idx, item in enumerate(project.get("boq_items", [])):
                unit_rate = float(item["unitRate"]) if item.get("unitRate") is not None else None
                qty = float(item.get("quantity", 0.0))
                amount = float(item.get("amount", (qty * (unit_rate or 0.0))))
                cursor.execute("""
                    INSERT INTO boq_items (
                        id, project_id, serial_no, spec_clause_number, description, unit, quantity, unit_rate, amount, sort_order
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    item.get("id"), project_id, item.get("serialNo", idx + 1),
                    item.get("specClauseNumber", ""), item.get("description", ""),
                    item.get("unit", ""), qty, unit_rate, amount, idx
                ))

            conn.commit()
            return project_id

    def get_project(self, project_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM contract_projects WHERE id = ?", (project_id,))
            row = cursor.fetchone()
            if not row:
                return None
            project = dict(row)
            cursor.execute("SELECT * FROM boq_items WHERE project_id = ? ORDER BY sort_order ASC", (project_id,))
            project["boq_items"] = [dict(b) for b in cursor.fetchall()]
            return project

    def list_projects(self, search: str = "") -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if search:
                cursor.execute("""
                    SELECT * FROM contract_projects
                    WHERE contract_no LIKE ? OR name_of_work LIKE ? OR project_name LIKE ?
                    ORDER BY updated_at DESC
                """, (f"%{search}%", f"%{search}%", f"%{search}%"))
            else:
                cursor.execute("SELECT * FROM contract_projects ORDER BY updated_at DESC")
            return [dict(r) for r in cursor.fetchall()]

    # --- Backup and Restore ---
    def create_backup(self, backup_dir: Optional[str] = None) -> str:
        if backup_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            backup_dir = os.path.join(base_dir, "backups")
        os.makedirs(backup_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = os.path.join(backup_dir, f"backup_auto_contract_{timestamp}.db")
        shutil.copy2(self.db_path, backup_file)
        return backup_file

    def restore_backup(self, backup_file_path: str):
        if not os.path.exists(backup_file_path):
            raise FileNotFoundError(f"Backup file not found: {backup_file_path}")
        # Verify SQLite file integrity
        test_conn = sqlite3.connect(backup_file_path)
        cur = test_conn.cursor()
        cur.execute("PRAGMA integrity_check;")
        res = cur.fetchone()
        test_conn.close()
        if not res or res[0] != "ok":
            raise ValueError("Corrupt backup file failed integrity check.")
        shutil.copy2(backup_file_path, self.db_path)
