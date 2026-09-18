# Smart Contract Deployment & Remix Integration Guide

This directory contains the compiled contract ABIs (`blockchain/abi/`) and contract deployment mapping (`blockchain/deployments.json`).

## 1. Deployment Order

When deploying the smart contracts (via Remix, Hardhat, Anvil, or Sepolia Testnet), adhere strictly to this deployment sequence:

1. **Deploy `RoleManager.sol`**:
   - Constructor argument: `initialSuperAdmin` (e.g. `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` or deployer address).
   - Save deployed address as `ROLE_MANAGER_ADDRESS`.

2. **Deploy `DepartmentManager.sol`**:
   - Constructor argument: `roleManager` = `ROLE_MANAGER_ADDRESS`.
   - Save deployed address as `DEPARTMENT_MANAGER_ADDRESS`.

3. **Deploy `EscalationManager.sol`**:
   - Constructor argument: `roleManager` = `ROLE_MANAGER_ADDRESS`.
   - Save deployed address as `ESCALATION_MANAGER_ADDRESS`.

4. **Deploy `AuditTrail.sol`**:
   - Constructor argument: `initialOwner` = `initialSuperAdmin` address.
   - Save deployed address as `AUDIT_TRAIL_ADDRESS`.

5. **Deploy `GrievanceSystem.sol`**:
   - Constructor arguments:
     - `roleManager`: `ROLE_MANAGER_ADDRESS`
     - `departmentManager`: `DEPARTMENT_MANAGER_ADDRESS`
     - `escalationManager`: `ESCALATION_MANAGER_ADDRESS`
     - `trail`: `AUDIT_TRAIL_ADDRESS`
   - Save deployed address as `GRIEVANCE_SYSTEM_ADDRESS`.

6. **Execute One-Time Trust Bindings** (Mandatory):
   - Call `EscalationManager.bindGrievanceSystem(GRIEVANCE_SYSTEM_ADDRESS)` from SuperAdmin account.
   - Call `AuditTrail.authorizeWriter(GRIEVANCE_SYSTEM_ADDRESS)` from AuditTrail owner account.

---

## 2. Exporting ABIs from Remix

1. Open Remix IDE (https://remix.ethereum.org).
2. Load files from `contracts/`, `interfaces/`, and `libraries/`.
3. Select Solidity compiler version `0.8.20`.
4. Compile all contracts.
5. In the Compilation Details tab, click **ABI** copy button for each contract.
6. Replace or verify JSON files in `blockchain/abi/*.json`.

---

## 3. Updating Application Addresses

After deploying contracts in Remix VM or Sepolia:

1. Update `blockchain/deployments.json` with the deployed addresses.
2. Update `.env` / `frontend/.env` with:
   ```env
   VITE_ROLE_MANAGER_ADDRESS=0x...
   VITE_DEPARTMENT_MANAGER_ADDRESS=0x...
   VITE_ESCALATION_MANAGER_ADDRESS=0x...
   VITE_AUDIT_TRAIL_ADDRESS=0x...
   VITE_GRIEVANCE_SYSTEM_ADDRESS=0x...
   ```
