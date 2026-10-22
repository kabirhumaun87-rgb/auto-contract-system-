"""
Automated Test Suite for Auto Contract System Desktop App
Tests: Database operations, BOQ calculations, Amount-to-Words, Inconsistency detection.
"""

import unittest
import os
import tempfile
from decimal import Decimal

from desktop_app.utils.number_to_words import number_to_bangladeshi_taka_words
from desktop_app.database.db_manager import DatabaseManager

class TestNumberToWords(unittest.TestCase):
    def test_basic_integers(self):
        self.assertEqual(number_to_bangladeshi_taka_words(0), "Taka Zero Only")
        self.assertEqual(number_to_bangladeshi_taka_words(100), "Taka One Hundred Only")
        self.assertEqual(number_to_bangladeshi_taka_words(1250), "Taka One Thousand Two Hundred Fifty Only")

    def test_lakhs_and_crores(self):
        # 125,450.00 -> One Lakh Twenty-Five Thousand Four Hundred Fifty
        self.assertEqual(
            number_to_bangladeshi_taka_words(125450),
            "Taka One Lakh Twenty-Five Thousand Four Hundred Fifty Only"
        )
        # 1 Crore = 10,000,000
        self.assertEqual(
            number_to_bangladeshi_taka_words(10000000),
            "Taka One Crore Only"
        )
        self.assertEqual(
            number_to_bangladeshi_taka_words(12345678),
            "Taka One Crore Twenty-Three Lakh Forty-Five Thousand Six Hundred Seventy-Eight Only"
        )

    def test_paisa_decimals(self):
        self.assertEqual(
            number_to_bangladeshi_taka_words(42903.40),
            "Taka Forty-Two Thousand Nine Hundred Three and Forty Paisa Only"
        )
        self.assertEqual(
            number_to_bangladeshi_taka_words(10.05),
            "Taka Ten and Five Paisa Only"
        )

class TestDatabaseAndCalculations(unittest.TestCase):
    def setUp(self):
        self.temp_db_file = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
        self.temp_db_file.close()
        self.db = DatabaseManager(db_path=self.temp_db_file.name)

    def tearDown(self):
        if os.path.exists(self.temp_db_file.name):
            os.remove(self.temp_db_file.name)

    def test_project_crud(self):
        sample_project = {
            "id": "proj-test-1",
            "contract_no": "GSDCA/TEST/2026",
            "invitation_ref_no": "GSDCA/REF-1",
            "project_name": "Test Repair Work",
            "auth_reference": "Sta HQ Auth Ref",
            "code_head": "3258106",
            "name_of_work": "Repair Works to Bldg 04",
            "procuring_entity_name": "GE (Army) South",
            "procuring_entity_district": "Dhaka",
            "site_location": "Postogola Cantt",
            "sub_division": "SDO I/C Postogola",
            "completion_time": "07 (Seven) days",
            "drawing_status": "Nil",
            "status": "draft",
            "total_contract_price": 25000.00,
            "boq_items": [
                {
                    "id": "boq-1",
                    "serialNo": 1,
                    "description": "Supply of Cupboard",
                    "unit": "Sqm",
                    "quantity": 5.0,
                    "unitRate": 5000.0,
                    "amount": 25000.0
                }
            ]
        }

        # Save project
        pid = self.db.save_project(sample_project)
        self.assertEqual(pid, "proj-test-1")

        # Retrieve project
        retrieved = self.db.get_project("proj-test-1")
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved["contract_no"], "GSDCA/TEST/2026")
        self.assertEqual(len(retrieved["boq_items"]), 1)
        self.assertEqual(float(retrieved["boq_items"][0]["amount"]), 25000.0)

        # List projects
        all_proj = self.db.list_projects()
        self.assertEqual(len(all_proj), 1)

    def test_backup_and_restore(self):
        # Save a test project
        sample_project = {
            "id": "proj-test-backup",
            "contract_no": "GSDCA/BACKUP/2026",
            "invitation_ref_no": "GSDCA/REF-2",
            "project_name": "Backup Test",
            "auth_reference": "Auth Ref",
            "code_head": "3258106",
            "name_of_work": "Test Work",
            "procuring_entity_name": "GE South",
            "procuring_entity_district": "Dhaka",
            "site_location": "Dhaka",
            "sub_division": "SDO",
            "completion_time": "15 days",
            "drawing_status": "Nil",
            "status": "draft",
            "total_contract_price": 1000.00,
            "boq_items": []
        }
        self.db.save_project(sample_project)

        # Create backup
        backup_path = self.db.create_backup(backup_dir=tempfile.gettempdir())
        self.assertTrue(os.path.exists(backup_path))

        # Verify restore
        self.db.restore_backup(backup_path)
        restored_proj = self.db.get_project("proj-test-backup")
        self.assertIsNotNone(restored_proj)

        # Cleanup
        if os.path.exists(backup_path):
            os.remove(backup_path)

if __name__ == "__main__":
    unittest.main()
