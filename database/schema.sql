-- ============================================================
-- BLOCKCHAIN-BASED PUBLIC GRIEVANCE TRACKING SYSTEM
-- DATABASE SCHEMA (Supabase PostgreSQL)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. ROLES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. PROFILES TABLE (Extends Supabase Auth users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN')),
    wallet_address VARCHAR(42),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_wallet ON public.profiles(wallet_address);

-- ------------------------------------------------------------
-- 3. DEPARTMENTS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL, -- Keccak256 hash or code identifier
    name VARCHAR(255) NOT NULL,
    description TEXT,
    administrator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    metadata_hash VARCHAR(66) NOT NULL, -- Bytes32 hex hash
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_departments_code ON public.departments(code);
CREATE INDEX IF NOT EXISTS idx_departments_admin ON public.departments(administrator_id);

-- ------------------------------------------------------------
-- 4. CATEGORIES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_dept ON public.categories(department_id);

-- ------------------------------------------------------------
-- 5. DEPARTMENT OFFICERS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.department_officers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    officer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, officer_id)
);

CREATE INDEX IF NOT EXISTS idx_dept_officers_dept ON public.department_officers(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_officers_officer ON public.department_officers(officer_id);

-- ------------------------------------------------------------
-- 6. GRIEVANCES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.grievances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onchain_id BIGINT UNIQUE, -- Smart contract uint256 grievance ID
    title VARCHAR(255) NOT NULL,
    title_hash VARCHAR(66) NOT NULL, -- Bytes32 hash
    description TEXT NOT NULL,
    description_hash VARCHAR(66) NOT NULL, -- Bytes32 hash
    category_code VARCHAR(64) NOT NULL,
    department_code VARCHAR(64) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN (
        'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'ASSIGNED', 
        'IN_PROGRESS', 'RESOLUTION_SUBMITTED', 'CITIZEN_VERIFICATION', 
        'RESOLVED', 'CLOSED', 'REJECTED', 'ESCALATED', 'REOPENED'
    )),
    citizen_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    location TEXT,
    resolution_summary TEXT,
    resolution_hash VARCHAR(66),
    feedback_comments TEXT,
    feedback_hash VARCHAR(66),
    rejection_reason TEXT,
    rejection_hash VARCHAR(66),
    reopen_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_grievances_citizen ON public.grievances(citizen_id);
CREATE INDEX IF NOT EXISTS idx_grievances_officer ON public.grievances(assigned_officer_id);
CREATE INDEX IF NOT EXISTS idx_grievances_dept ON public.grievances(department_code);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON public.grievances(status);
CREATE INDEX IF NOT EXISTS idx_grievances_onchain_id ON public.grievances(onchain_id);

-- ------------------------------------------------------------
-- 7. INVESTIGATION NOTES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.investigation_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id UUID NOT NULL REFERENCES public.grievances(id) ON DELETE CASCADE,
    officer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    evidence_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_investigation_grievance ON public.investigation_notes(grievance_id);

-- ------------------------------------------------------------
-- 8. EVIDENCE TABLE (Storage Metadata)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id UUID NOT NULL REFERENCES public.grievances(id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(66) NOT NULL, -- SHA-256 hash of document
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evidence_grievance ON public.evidence(grievance_id);

-- ------------------------------------------------------------
-- 9. RESOLUTIONS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resolutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id UUID NOT NULL REFERENCES public.grievances(id) ON DELETE CASCADE,
    officer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resolution_text TEXT NOT NULL,
    resolution_hash VARCHAR(66) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resolutions_grievance ON public.resolutions(grievance_id);

-- ------------------------------------------------------------
-- 10. FEEDBACK TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id UUID NOT NULL REFERENCES public.grievances(id) ON DELETE CASCADE,
    citizen_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    feedback_hash VARCHAR(66) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedback_grievance ON public.feedback(grievance_id);

-- ------------------------------------------------------------
-- 11. SLA CONFIGURATIONS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sla_configurations (
    priority VARCHAR(20) PRIMARY KEY CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    seconds_allowed BIGINT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 12. ESCALATIONS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id UUID NOT NULL REFERENCES public.grievances(id) ON DELETE CASCADE,
    level INT NOT NULL DEFAULT 1,
    reason TEXT NOT NULL,
    reason_hash VARCHAR(66) NOT NULL,
    next_deadline TIMESTAMP WITH TIME ZONE,
    escalated_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_escalations_grievance ON public.escalations(grievance_id);

-- ------------------------------------------------------------
-- 13. BLOCKCHAIN TRANSACTIONS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blockchain_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id UUID REFERENCES public.grievances(id) ON DELETE CASCADE,
    tx_hash VARCHAR(66) NOT NULL,
    action VARCHAR(100) NOT NULL,
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42),
    block_number BIGINT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'FAILED')),
    raw_event JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blockchain_tx_hash ON public.blockchain_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_tx_grievance ON public.blockchain_transactions(grievance_id);

-- ------------------------------------------------------------
-- 14. AUDIT EVENTS TABLE (Unified timeline)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id UUID REFERENCES public.grievances(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_wallet VARCHAR(42),
    action VARCHAR(100) NOT NULL,
    data_hash VARCHAR(66),
    is_onchain BOOLEAN DEFAULT FALSE,
    tx_hash VARCHAR(66),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_grievance ON public.audit_events(grievance_id);

-- ------------------------------------------------------------
-- 15. NOTIFICATIONS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO',
    related_grievance_id UUID REFERENCES public.grievances(id) ON DELETE SET NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigation_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated profiles
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Departments and categories are viewable by all authenticated users
CREATE POLICY "Departments viewable by authenticated users" 
ON public.departments FOR SELECT USING (true);

CREATE POLICY "Categories viewable by authenticated users" 
ON public.categories FOR SELECT USING (true);

-- Grievances: Citizens view their own grievances; Officers view assigned/dept grievances; Admins view all/dept grievances
CREATE POLICY "Citizens can view own grievances" 
ON public.grievances FOR SELECT USING (
    citizen_id = auth.uid() OR 
    assigned_officer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('DEPARTMENT_ADMIN', 'SUPER_ADMIN'))
);

CREATE POLICY "Citizens can insert grievances" 
ON public.grievances FOR INSERT WITH CHECK (citizen_id = auth.uid());

CREATE POLICY "Notifications viewable by recipient" 
ON public.notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Notifications updateable by recipient" 
ON public.notifications FOR UPDATE USING (user_id = auth.uid());
