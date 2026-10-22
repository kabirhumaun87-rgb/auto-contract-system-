-- =========================================================================
-- AUTO CONTRACT SYSTEM (MES PW-2 CONTRACT AUTOMATION)
-- SQLite Database Schema v1.0.0
-- =========================================================================

PRAGMA foreign_keys = ON;

-- 1. CONTRACTORS TABLE
CREATE TABLE IF NOT EXISTS contractors (
    id TEXT PRIMARY KEY,
    firm_name TEXT NOT NULL,
    proprietor_name TEXT,
    address TEXT,
    contact_person TEXT,
    mobile_number TEXT,
    email TEXT,
    registration_number TEXT,
    mes_enlistment_category TEXT CHECK(mes_enlistment_category IN ('A', 'B', 'C', 'D', 'E')),
    other_department_details TEXT,
    security_clearance_ref TEXT,
    tin_number TEXT,
    vat_bin_number TEXT,
    bank_security_ref TEXT,
    authorized_signatory_name TEXT,
    authorized_signatory_designation TEXT,
    remarks TEXT,
    is_archived INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROJECTS & CONTRACTS TABLE
CREATE TABLE IF NOT EXISTS contract_projects (
    id TEXT PRIMARY KEY,
    contract_no TEXT NOT NULL UNIQUE,
    invitation_ref_no TEXT NOT NULL,
    project_name TEXT NOT NULL,
    auth_reference TEXT NOT NULL,
    code_head TEXT NOT NULL,
    name_of_work TEXT NOT NULL,
    procuring_entity_name TEXT NOT NULL,
    procuring_entity_district TEXT NOT NULL,
    site_location TEXT NOT NULL,
    sub_division TEXT NOT NULL,
    procurement_method TEXT NOT NULL DEFAULT 'Limited Tendering Method (LTM)',
    ministry_division TEXT NOT NULL DEFAULT 'Ministry of Defence',
    agency TEXT NOT NULL DEFAULT 'Military Engineer Services (Army)',
    tender_package_no TEXT DEFAULT 'NA',
    lot_no TEXT DEFAULT '-',
    tender_document_price DECIMAL(10, 2) NOT NULL DEFAULT 100.00,
    completion_time TEXT NOT NULL,
    drawing_status TEXT NOT NULL DEFAULT 'Nil',
    date_of_contract TEXT,
    issued_on_date TEXT,
    fiscal_year TEXT NOT NULL DEFAULT '2026-2027',
    internal_remarks TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'in_review', 'approved', 'generated', 'archived')),

    -- Tender specifics
    tender_publication_date TEXT,
    tender_last_selling_datetime TEXT,
    tender_closing_datetime TEXT,
    tender_opening_datetime TEXT,
    tender_validity_period TEXT DEFAULT '60 days',
    tender_security_amount TEXT DEFAULT '-',
    performance_security_percentage DECIMAL(5, 2) DEFAULT 5.00,
    selling_office TEXT,
    receiving_office TEXT,
    opening_office TEXT,
    eligibility_text TEXT,

    -- Authorities & Officials
    official_inviting_name TEXT,
    official_inviting_designation TEXT,
    official_inviting_address TEXT,
    official_inviting_contact TEXT,
    military_exchange_tel TEXT,
    project_manager TEXT,
    project_manager_address TEXT,
    authorized_representative TEXT,
    signatory_name TEXT,
    signatory_rank TEXT,

    -- Bengali Letter Fields
    bn_office TEXT,
    bn_cantt TEXT,
    bn_tel TEXT,
    bn_month_year TEXT,
    bn_kartik_year TEXT,
    bn_letter_ref TEXT,

    -- Contractor Link
    contractor_id TEXT,
    contractor_name TEXT,
    contractor_address TEXT,

    -- PCC Section 4 Conditions
    possession_days TEXT,
    commencement_clause TEXT,
    pcc_completion_period TEXT,
    work_programme_days TEXT,
    defects_liability_period TEXT,
    other_contract_docs TEXT,
    special_note TEXT,

    -- General Specifications (Section 7)
    cement_rate_opc DECIMAL(10, 2) DEFAULT 12.20,
    cement_rate_pcc DECIMAL(10, 2) DEFAULT 11.80,
    store_place_of_issue TEXT,
    store_issuance_details TEXT,
    water_charges_note TEXT,
    measurement_book_no TEXT DEFAULT 'BAFW-2261',

    -- Financials & BOQ Summary
    total_contract_price DECIMAL(15, 2) DEFAULT 0.00,
    price_in_words TEXT,
    boq_corrections_count INTEGER DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contractor_id) REFERENCES contractors(id) ON DELETE SET NULL
);

-- 3. BILL OF QUANTITIES (BOQ) ITEMS TABLE
CREATE TABLE IF NOT EXISTS boq_items (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    serial_no INTEGER NOT NULL,
    spec_clause_number TEXT,
    description TEXT NOT NULL,
    unit TEXT NOT NULL,
    quantity DECIMAL(12, 4) NOT NULL,
    unit_rate DECIMAL(15, 2), -- Can be NULL for unpriced items
    amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES contract_projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_boq_project_id ON boq_items(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON contract_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_contract_no ON contract_projects(contract_no);

-- 4. GENERATED DOCUMENTS LOG TABLE
CREATE TABLE IF NOT EXISTS generated_documents (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    contract_no TEXT NOT NULL,
    project_name TEXT NOT NULL,
    contractor_name TEXT,
    file_name TEXT NOT NULL,
    file_format TEXT NOT NULL CHECK(file_format IN ('DOCX', 'PDF', 'CSV', 'XLSX')),
    file_path TEXT,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    template_version TEXT NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('SUCCESS', 'WARNING_OVERRIDDEN', 'FAILED')),
    FOREIGN KEY (project_id) REFERENCES contract_projects(id) ON DELETE CASCADE
);

-- 5. AUDIT & ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    entity_id TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. SYSTEM CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
