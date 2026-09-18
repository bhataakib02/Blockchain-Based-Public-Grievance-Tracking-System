-- ============================================================
-- BLOCKCHAIN-BASED PUBLIC GRIEVANCE TRACKING SYSTEM
-- DEMO SEED DATA (Supabase PostgreSQL)
-- ALL DATA IN THIS FILE IS FICTIONAL DEMO DATA FOR TESTING
-- ============================================================

-- Insert Roles
INSERT INTO public.roles (name, description) VALUES
('CITIZEN', 'Public citizen submitting and tracking personal grievances'),
('OFFICER', 'Government official assigned to investigate and resolve grievances'),
('DEPARTMENT_ADMIN', 'Department administrator managing officers and SLA SLAs'),
('SUPER_ADMIN', 'System administrator with overall configuration rights')
ON CONFLICT (name) DO NOTHING;

-- Insert Demo Profiles
-- Passwords should be managed through Supabase Auth (e.g. Password: DemoPassword123!)
INSERT INTO public.profiles (id, email, full_name, phone_number, role, wallet_address) VALUES
('00000000-0000-0000-0000-000000000001', 'superadmin@grievance.gov.in', 'Super Admin User', '+91 9876543210', 'SUPER_ADMIN', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
('00000000-0000-0000-0000-000000000002', 'deptadmin.pwd@grievance.gov.in', 'Public Works Admin', '+91 9876543211', 'DEPARTMENT_ADMIN', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'),
('00000000-0000-0000-0000-000000000003', 'deptadmin.water@grievance.gov.in', 'Water Services Admin', '+91 9876543212', 'DEPARTMENT_ADMIN', '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
('00000000-0000-0000-0000-000000000004', 'officer.kumar@grievance.gov.in', 'Inspector Rajesh Kumar', '+91 9876543213', 'OFFICER', '0x90F79bf6EB2c4f870365E785982E1f101E93b906'),
('00000000-0000-0000-0000-000000000005', 'officer.sharma@grievance.gov.in', 'Engineer Priya Sharma', '+91 9876543214', 'OFFICER', '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'),
('00000000-0000-0000-0000-000000000006', 'citizen.rahul@gmail.com', 'Rahul Verma (Citizen)', '+91 9876543215', 'CITIZEN', '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc'),
('00000000-0000-0000-0000-000000000007', 'citizen.anita@gmail.com', 'Anita Desai (Citizen)', '+91 9876543216', 'CITIZEN', '0x976EA74026E726554dB657fA54763abd0C3a0aa9')
ON CONFLICT (id) DO UPDATE SET
email = EXCLUDED.email,
full_name = EXCLUDED.full_name,
role = EXCLUDED.role,
wallet_address = EXCLUDED.wallet_address;

-- Insert Departments
-- Bytes32 hashes calculated deterministically using keccak256
-- PUBLIC_WORKS: 0x5055424c49435f574f524b530000000000000000000000000000000000000000
-- WATER_SERVICES: 0x57415445525f5345525649434553000000000000000000000000000000000000
INSERT INTO public.departments (id, code, name, description, administrator_id, active, metadata_hash) VALUES
('10000000-0000-0000-0000-000000000001', '0x5055424c49435f574f524b530000000000000000000000000000000000000000', 'Public Works Department', 'Responsible for roads, bridges, streetlights, and public infrastructure maintenance.', '00000000-0000-0000-0000-000000000002', TRUE, '0xe88a8d11e5f8bc874a7b73e8fa9f20e4e5e4e5e4e5e4e5e4e5e4e5e4e5e4e5e4'),
('10000000-0000-0000-0000-000000000002', '0x57415445525f5345525649434553000000000000000000000000000000000000', 'Water & Sanitation Board', 'Handles municipal water supply, pipeline leaks, drainage, and sewage management.', '00000000-0000-0000-0000-000000000003', TRUE, '0xf99b9e22f6f9cd985b8c84f9fb0f31f5f6f5f6f5f6f5f6f5f6f5f6f5f6f5f6f5'),
('10000000-0000-0000-0000-000000000003', '0x454c454354524943495459000000000000000000000000000000000000000000', 'Electricity Supply Board', 'Manages power distribution, transformer faults, street lighting power, and billing issues.', '00000000-0000-0000-0000-000000000001', TRUE, '0xa11c1f33a7a0de096c9d95a0ac1a42a6a7a6a7a6a7a6a7a6a7a6a7a6a7a6a7a6'),
('10000000-0000-0000-0000-000000000004', '0x4d554e49434950414c0000000000000000000000000000000000000000000000', 'Municipal Services', 'Civic administration, garbage collection, parks, and local licensing.', '00000000-0000-0000-0000-000000000001', TRUE, '0xb22d2a44b8b1ef1a7daea6b1bd2b53b7b8b7b8b7b8b7b8b7b8b7b8b7b8b7b8b7')
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
administrator_id = EXCLUDED.administrator_id;

-- Insert Department Officers mapping
INSERT INTO public.department_officers (department_id, officer_id, enabled) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', TRUE), -- Rajesh Kumar in Public Works
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', TRUE)  -- Priya Sharma in Water Board
ON CONFLICT (department_id, officer_id) DO UPDATE SET enabled = EXCLUDED.enabled;

-- Insert Categories
INSERT INTO public.categories (id, code, name, description, department_id) VALUES
('20000000-0000-0000-0000-000000000001', '0x524f414453000000000000000000000000000000000000000000000000000000', 'Potholes & Road Repairs', 'Issues related to road damage, missing asphalt, open manholes.', '10000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000002', '0x5354524545544c49474854530000000000000000000000000000000000000000', 'Streetlights Fault', 'Broken streetlights, unlit stretches, flickering bulbs.', '10000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000003', '0x57415445525f4c45414b00000000000000000000000000000000000000000000', 'Water Pipeline Leakage', 'Burst water main, low water pressure, contaminated water supply.', '10000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000004', '0x53414e49544154494f4e00000000000000000000000000000000000000000000', 'Sanitation & Sewage Overflow', 'Clogged drainage, uncollected waste, sewage blockage.', '10000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Insert SLA Configurations matching EscalationManager.sol defaults
INSERT INTO public.sla_configurations (priority, seconds_allowed) VALUES
('LOW', 1209600),     -- 14 days
('MEDIUM', 604800),   -- 7 days
('HIGH', 259200),     -- 3 days
('CRITICAL', 86400)   -- 1 day
ON CONFLICT (priority) DO UPDATE SET seconds_allowed = EXCLUDED.seconds_allowed;

-- Insert Sample Grievances (Demonstration)
INSERT INTO public.grievances (
    id, onchain_id, title, title_hash, description, description_hash, 
    category_code, department_code, priority, status, citizen_id, assigned_officer_id, location, reopen_count
) VALUES
(
    '30000000-0000-0000-0000-000000000001', 1, 
    'Severe Pothole near MG Road Sector 4', 
    '0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae', 
    'Large deep pothole causing traffic slowdowns and hazard to two-wheelers near the central junction.',
    '0xfc2922442223788a10a1005a9c046271966a0123456789abcdef0123456789ab',
    '0x524f414453000000000000000000000000000000000000000000000000000000',
    '0x5055424c49435f574f524b530000000000000000000000000000000000000000',
    'HIGH', 'ASSIGNED',
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000004',
    'MG Road, Sector 4, North Block', 0
),
(
    '30000000-0000-0000-0000-000000000002', 2, 
    'Clean Water Pipeline Burst in Lake View Colony', 
    '0x3d37c57c7900d7900aa0564d2e41524524533e817594cfb10a9b6f997377f8bf', 
    'Water pipe leaking heavily on the main road since early morning, wasting clean drinking water.',
    '0xed3033553334899b21b2116ba0157382077b123456789abcdef0123456789abc',
    '0x57415445525f4c45414b00000000000000000000000000000000000000000000',
    '0x57415445525f5345525649434553000000000000000000000000000000000000',
    'CRITICAL', 'SUBMITTED',
    '00000000-0000-0000-0000-000000000007',
    NULL,
    'Lake View Colony, Ward 12', 0
)
ON CONFLICT (id) DO NOTHING;

-- Insert Initial Notifications
INSERT INTO public.notifications (user_id, title, message, type, related_grievance_id, read) VALUES
('00000000-0000-0000-0000-000000000006', 'Grievance Registered', 'Your grievance #1 "Severe Pothole near MG Road" has been successfully logged on the blockchain.', 'SUCCESS', '30000000-0000-0000-0000-000000000001', TRUE),
('00000000-0000-0000-0000-000000000004', 'New Grievance Assigned', 'You have been assigned to investigate grievance #1.', 'INFO', '30000000-0000-0000-0000-000000000001', FALSE);
