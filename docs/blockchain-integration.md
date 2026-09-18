# Smart Contract Integration Guide

## 1. Smart Contracts

| Contract Name | Function |
|---------------|----------|
| `RoleManager.sol` | Role registry for CITIZEN, OFFICER, DEPARTMENT_ADMIN, SUPER_ADMIN |
| `DepartmentManager.sol` | Department registration, officer binding, metadata hashes |
| `EscalationManager.sol` | Priority SLA policy thresholds and deadline tracking |
| `AuditTrail.sol` | Immutable append-only audit record sequence |
| `GrievanceSystem.sol` | Central grievance state machine and frontend entrypoint |

---

## 2. ABI & Address Setup

Contract ABIs are stored in `blockchain/abi/*.json`.
Contract addresses are specified in `blockchain/deployments.json` and loaded into Vite frontend via environment variables:
```env
VITE_ROLE_MANAGER_ADDRESS=0x...
VITE_DEPARTMENT_MANAGER_ADDRESS=0x...
VITE_ESCALATION_MANAGER_ADDRESS=0x...
VITE_AUDIT_TRAIL_ADDRESS=0x...
VITE_GRIEVANCE_SYSTEM_ADDRESS=0x...
```

---

## 3. Mandatory Post-Deployment Binding Steps

After deploying the 5 contracts in order:
1. Call `EscalationManager.bindGrievanceSystem(GRIEVANCE_SYSTEM_ADDRESS)` from SuperAdmin.
2. Call `AuditTrail.authorizeWriter(GRIEVANCE_SYSTEM_ADDRESS)` from AuditTrail owner.
