"""
Auto Contract System (Auto Contract System.exe)
Main GUI Application using PySide6 (Windows Desktop)
Compliant with Military Engineer Services (MES) PW-2 Works Contract Specifications
"""

import sys
import os
import json
from decimal import Decimal
from datetime import datetime

try:
    from PySide6.QtWidgets import (
        QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
        QStackedWidget, QPushButton, QLabel, QTableWidget, QTableWidgetItem,
        QLineEdit, QTextEdit, QComboBox, QDoubleSpinBox, QSpinBox,
        QFileDialog, QMessageBox, QTabWidget, QHeaderView, QGroupBox, QFormLayout
    )
    from PySide6.QtCore import Qt, QSize
    from PySide6.QtGui import QFont, QIcon, QColor
    PYSIDE_AVAILABLE = True
except ImportError:
    PYSIDE_AVAILABLE = False

from desktop_app.database.db_manager import DatabaseManager
from desktop_app.utils.number_to_words import number_to_bangladeshi_taka_words
from desktop_app.generator.doc_builder import ContractDocumentBuilder

class AutoContractSystemWindow(QMainWindow if PYSIDE_AVAILABLE else object):
    def __init__(self):
        if not PYSIDE_AVAILABLE:
            print("PySide6 is required to run the desktop graphical interface.")
            print("Please run: pip install -r requirements.txt")
            return

        super().__init__()
        self.setWindowTitle("Auto Contract System.exe - Military Engineer Services PW-2 Automation")
        self.resize(1280, 800)

        # Initialize local database
        self.db = DatabaseManager()
        self.doc_builder = ContractDocumentBuilder(output_dir=os.path.join(os.path.expanduser("~"), "Documents", "AutoContractSystem", "Generated"))

        self.init_ui()

    def init_ui(self):
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QHBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # 1. Sidebar Navigation
        sidebar = QWidget()
        sidebar.setFixedWidth(240)
        sidebar.setStyleSheet("background-color: #0f172a; color: #f8fafc;")
        sidebar_layout = QVBoxLayout(sidebar)
        sidebar_layout.setContentsMargins(12, 16, 12, 16)
        sidebar_layout.setSpacing(6)

        brand_label = QLabel("Auto Contract System\nMES PW-2 Automation")
        brand_font = QFont("Segoe UI", 11, QFont.Bold)
        brand_label.setFont(brand_font)
        brand_label.setStyleSheet("color: #38bdf8; padding-bottom: 12px; border-bottom: 1px solid #1e293b;")
        sidebar_layout.addWidget(brand_label)

        # Navigation buttons
        self.nav_buttons = {}
        pages = [
            ("dashboard", "Dashboard"),
            ("create", "Create Contract"),
            ("contracts", "All Contracts"),
            ("contractors", "Contractor Database"),
            ("boq", "Bill of Quantities"),
            ("backup", "Backup & Restore"),
            ("about", "Help & About")
        ]

        for page_id, label in pages:
            btn = QPushButton(f"  {label}")
            btn.setFixedHeight(38)
            btn.setStyleSheet("""
                QPushButton {
                    background-color: transparent;
                    color: #cbd5e1;
                    text-align: left;
                    padding-left: 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                }
                QPushButton:hover {
                    background-color: #1e293b;
                    color: #ffffff;
                }
                QPushButton:checked {
                    background-color: #2563eb;
                    color: #ffffff;
                    font-weight: bold;
                }
            """)
            btn.setCheckable(True)
            btn.clicked.connect(lambda checked=False, pid=page_id: self.switch_page(pid))
            sidebar_layout.addWidget(btn)
            self.nav_buttons[page_id] = btn

        sidebar_layout.addStretch()

        offline_status = QLabel("● Offline Local Ready\nPPA 2006 / PPR 2008")
        offline_status.setStyleSheet("color: #10b981; font-size: 11px;")
        sidebar_layout.addWidget(offline_status)

        main_layout.addWidget(sidebar)

        # 2. Main Content Area
        self.stack = QStackedWidget()
        self.stack.setStyleSheet("background-color: #f8fafc;")

        # Create Views
        self.view_dashboard = self.create_dashboard_view()
        self.view_contracts = self.create_contracts_view()
        self.view_about = self.create_about_view()

        self.stack.addWidget(self.view_dashboard) # 0
        self.stack.addWidget(self.view_contracts) # 1
        self.stack.addWidget(self.view_about)     # 2

        main_layout.addWidget(self.stack)

        # Select Dashboard by default
        self.switch_page("dashboard")

    def switch_page(self, page_id: str):
        for pid, btn in self.nav_buttons.items():
            btn.setChecked(pid == page_id)

        if page_id == "dashboard":
            self.stack.setCurrentIndex(0)
            self.refresh_dashboard()
        elif page_id in ["create", "contracts"]:
            self.stack.setCurrentIndex(1)
            self.refresh_contracts_table()
        elif page_id == "about":
            self.stack.setCurrentIndex(2)

    def create_dashboard_view(self) -> QWidget:
        widget = QWidget()
        layout = QVBoxLayout(widget)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(16)

        header = QLabel("Procurement Dashboard - MES Works Contracts")
        header.setFont(QFont("Segoe UI", 16, QFont.Bold))
        header.setStyleSheet("color: #0f172a;")
        layout.addWidget(header)

        # KPI stats
        kpi_layout = QHBoxLayout()
        self.kpi_total = QLabel("Total Contracts: 0")
        self.kpi_total.setStyleSheet("background-color: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; font-weight: bold;")
        kpi_layout.addWidget(self.kpi_total)
        layout.addLayout(kpi_layout)

        layout.addStretch()
        return widget

    def refresh_dashboard(self):
        projects = self.db.list_projects()
        self.kpi_total.setText(f"Total Contracts: {len(projects)}")

    def create_contracts_view(self) -> QWidget:
        widget = QWidget()
        layout = QVBoxLayout(widget)
        layout.setContentsMargins(24, 24, 24, 24)

        title = QLabel("Contracts Management & Generation")
        title.setFont(QFont("Segoe UI", 14, QFont.Bold))
        layout.addWidget(title)

        self.contracts_table = QTableWidget(0, 5)
        self.contracts_table.setHorizontalHeaderLabels(["CA No", "Name of Work", "Procuring Entity", "BOQ Total (Tk)", "Status"])
        self.contracts_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        layout.addWidget(self.contracts_table)

        return widget

    def refresh_contracts_table(self):
        projects = self.db.list_projects()
        self.contracts_table.setRowCount(len(projects))
        for r, p in enumerate(projects):
            self.contracts_table.setItem(r, 0, QTableWidgetItem(str(p.get("contract_no", ""))))
            self.contracts_table.setItem(r, 1, QTableWidgetItem(str(p.get("name_of_work", ""))))
            self.contracts_table.setItem(r, 2, QTableWidgetItem(str(p.get("procuring_entity_name", ""))))
            self.contracts_table.setItem(r, 3, QTableWidgetItem(f"{float(p.get('total_contract_price', 0)):.2f}"))
            self.contracts_table.setItem(r, 4, QTableWidgetItem(str(p.get("status", "draft"))))

    def create_about_view(self) -> QWidget:
        widget = QWidget()
        layout = QVBoxLayout(widget)
        layout.setContentsMargins(24, 24, 24, 24)

        about_text = QLabel(
            "Auto Contract System (Auto Contract System.exe)\n\n"
            "Official Military Engineer Services (MES) PW-2 Works Contract Generator.\n"
            "Builds all 12 sections matching PW-2 Contract 2026-2027(1).pdf with complete\n"
            "inconsistency detection, Bengali tender forwarding letter, 25-point IFT form, TDS,\n"
            "PCC clauses, Form PW2-1, BOQ schedule, and General Specifications.\n\n"
            "Compliant with PPA 2006 & PPR 2008."
        )
        about_text.setFont(QFont("Segoe UI", 11))
        layout.addWidget(about_text)
        layout.addStretch()
        return widget

def main():
    if not PYSIDE_AVAILABLE:
        print("Starting Auto Contract System in headless mode...")
        db = DatabaseManager()
        print(f"Database initialized at: {db.db_path}")
        return

    app = QApplication(sys.argv)
    window = AutoContractSystemWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
