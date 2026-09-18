# Data Privacy & Security Architecture

## 1. Off-Chain Data Privacy Rule

> [!CAUTION]
> **Zero PII On-Chain**: Personal Identifiable Information (PII) including names, email addresses, phone numbers, exact residential locations, raw grievance description text, uploaded evidence documents, and officer notes are NEVER written directly to the Ethereum blockchain.

### Hashing Workflow:
```
Raw Sensitive Text / Data
          │
          ▼
SHA-256 / Keccak-256 Hashing Algorithm
          │
          ▼
32-Byte Hash Output (0x...)
          │
          ▼
Supabase Off-Chain Storage (Encrypted) & On-Chain Audit Log
```

---

## 2. Multi-Layer Access Control

Permission enforcement occurs at 3 independent layers:

1. **Frontend (React UI)**: Navigation guards and role-specific views.
2. **FastAPI Backend (Middleware & Dependencies)**: OAuth2 JWT bearer token validation and `require_role([...])` checks.
3. **Smart Contracts (Solidity Modifiers)**: `onlySuperAdmin`, `onlyDepartmentAuthority`, `onlyOfficer`, and role modifiers (`isCitizen`, `isOfficer`, `isDepartmentAdmin`, `isSuperAdmin`).

---

## 3. Supabase Row Level Security (RLS)

PostgreSQL RLS policies are enabled on all production tables:
- Citizens can SELECT only their own created grievances.
- Officers can SELECT grievances assigned to their department or account.
- Department Admins can SELECT/UPDATE department records.
- Super Admins hold overall administrative authority.
