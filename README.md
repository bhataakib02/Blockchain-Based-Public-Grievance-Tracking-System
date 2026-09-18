# Blockchain-Based Public Grievance Tracking System

A full-stack, enterprise-grade public grievance tracking platform integrating **React + Vite + Tailwind CSS**, **FastAPI**, **Supabase PostgreSQL**, **Ethers.js**, **MetaMask**, and **Ethereum Solidity Smart Contracts**.

---

## 🌟 Executive Summary & Key Highlights

- **Decentralized Auditability**: Critical grievance events (registration, officer assignment, status transitions, resolution proposals, citizen verifications, rejections, escalations) are immutably logged on the Ethereum blockchain.
- **Strict Data Privacy**: Personal Identifiable Information (PII) including names, emails, phone numbers, complete description text, and evidence files are kept **100% off-chain** in Supabase. Only SHA-256 cryptographic hashes (`bytes32`) are committed on-chain.
- **Multi-Layer Permission Enforcement**: Permissions are validated simultaneously across Frontend navigation guards, FastAPI backend dependencies, and Solidity smart contract modifiers.
- **Citizen Empowerment**: Citizens have exclusive rights to Accept or Reject proposed resolutions. Rejecting a resolution automatically reopens the case on-chain (`reopenCount++`), preventing unilateral closure by officers.
- **Automated SLA Monitoring**: Smart contracts track deadline timestamps for Low (14d), Medium (7d), High (3d), and Critical (24h) priority tiers, triggering escalations when exceeded.

---

## 🏛️ System Architecture

```
                    PUBLIC GRIEVANCE SYSTEM
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
             FRONTEND                  BACKEND
                 │                         │
       React + Vite + Tailwind          FastAPI
                 │                         │
                 │                    ┌────┴────┐
                 │                    │         │
                 │                    ▼         ▼
                 │                Supabase   Blockchain
                 │                PostgreSQL   Layer
                 │                    │         │
                 │                    │      Solidity
                 │                    │      Contracts
                 │                    │
                 └─────────┬──────────┘
                           │
                       Ethers.js
                           │
                       MetaMask
                           │
                       Blockchain
```

---

## 👥 Role Permissions Matrix

| Capability | CITIZEN | OFFICER | DEPT ADMIN | SUPER ADMIN |
|------------|:-------:|:-------:|:----------:|:-----------:|
| Register & Login | ✅ | ✅ | ✅ | ✅ |
| Connect MetaMask Wallet | ✅ | ✅ | ✅ | ✅ |
| Submit New Grievance | ✅ | ❌ | ❌ | ✅ |
| View Own Grievances | ✅ | ✅ | ✅ | ✅ |
| Accept / Reject Resolution | ✅ | ❌ | ❌ | ❌ |
| Reopen Case | ✅ | ❌ | ✅ | ✅ |
| Start Investigation & Field Notes | ❌ | ✅ | ❌ | ✅ |
| Submit Resolution Proposal | ❌ | ✅ | ❌ | ✅ |
| Assign / Reassign Officers | ❌ | ❌ | ✅ | ✅ |
| Configure Department Metadata | ❌ | ❌ | ❌ | ✅ |
| Configure SLA Policy | ❌ | ❌ | ❌ | ✅ |
| Inspect Global Audit Logs | ✅ | ✅ | ✅ | ✅ |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Ethers.js v6.
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, PyJWT, Passlib, Uvicorn.
- **Database**: Supabase PostgreSQL, Row Level Security (RLS) policies.
- **Blockchain**: Solidity ^0.8.20 (`RoleManager.sol`, `DepartmentManager.sol`, `EscalationManager.sol`, `AuditTrail.sol`, `GrievanceSystem.sol`).
- **Wallet & Development**: MetaMask, Remix IDE, Ethers.js.

---

## 📁 Repository Structure

```
Grievance/
├── contracts/                  # Solidity Smart Contracts
│   ├── GrievanceTypes.sol
│   ├── RoleManager.sol
│   ├── DepartmentManager.sol
│   ├── EscalationManager.sol
│   ├── AuditTrail.sol
│   └── GrievanceSystem.sol
├── interfaces/                 # Smart Contract Interfaces
│   ├── IRoleManager.sol
│   └── IGrievanceSystem.sol
├── libraries/                  # Smart Contract Libraries
│   ├── GrievanceLib.sol
│   └── ValidationLib.sol
├── tests/                      # Solidity Contract Unit Tests
│   └── GrievanceSystemTest.sol
├── frontend/                   # React + Vite + Tailwind CSS App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
├── backend/                    # FastAPI REST API Backend
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   └── requirements.txt
├── database/                   # Database DDL & Seed Scripts
│   ├── schema.sql
│   └── seed.sql
├── blockchain/                 # Compiled ABIs & Address Config
│   ├── abi/
│   ├── deployments.json
│   └── README.md
├── docs/                       # Architecture & Integration Guides
│   ├── architecture.md
│   ├── api.md
│   ├── security.md
│   └── blockchain-integration.md
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🚀 Installation & Running Instructions

### 1. Database Setup (Supabase)
1. Log in to [Supabase Console](https://supabase.com) and create a new PostgreSQL project.
2. Open the SQL Editor in Supabase.
3. Execute `database/schema.sql` to generate PostgreSQL tables, constraints, indexes, and RLS policies.
4. Execute `database/seed.sql` to populate initial demo departments, categories, and test user profiles.

---

### 2. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI dev server
uvicorn app.main:app --reload --port 8000
```
FastAPI interactive documentation will be live at: `http://localhost:8000/docs`

---

### 3. Frontend Setup (React + Vite)
```bash
# Navigate to frontend directory
cd frontend

# Install node dependencies
npm install

# Run Vite development server
npm run dev
```
Frontend web application will be live at: `http://localhost:3000`

---

### 4. Smart Contract Compilation & Deployment (Remix IDE)
1. Open Remix IDE (`https://remix.ethereum.org`).
2. Load contracts from `contracts/`, `interfaces/`, and `libraries/`.
3. Select Solidity compiler `0.8.20` and compile all contracts.
4. Deploy contracts in exact sequential order:
   - **Step 1**: `RoleManager(initialSuperAdminAddress)`
   - **Step 2**: `DepartmentManager(RoleManagerAddress)`
   - **Step 3**: `EscalationManager(RoleManagerAddress)`
   - **Step 4**: `AuditTrail(initialSuperAdminAddress)`
   - **Step 5**: `GrievanceSystem(RoleManagerAddress, DepartmentManagerAddress, EscalationManagerAddress, AuditTrailAddress)`
5. Execute Mandatory Trust Bindings:
   - Call `EscalationManager.bindGrievanceSystem(GrievanceSystemAddress)`
   - Call `AuditTrail.authorizeWriter(GrievanceSystemAddress)`
6. Copy compiled ABIs to `blockchain/abi/*.json` and update `blockchain/deployments.json`.

---

## 🧪 Testing & Verification Commands

### Backend Verification
```bash
python -c "import sys; sys.path.append('backend'); from app.main import app; print('Backend healthy:', app.title)"
```

### Frontend Production Build
```bash
cd frontend
npm run build
```

---

## 📜 License
MIT License. Prepared for Public Grievance Tracking System.
