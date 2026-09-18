# FastAPI REST API Endpoint Reference

## Base URL
`http://localhost:8000/api`

---

## Authentication & Profiles (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new Citizen profile | Public |
| POST | `/api/auth/login` | Authenticate user & issue JWT | Public |
| GET | `/api/auth/me` | Fetch active user profile | Bearer Token |

---

## Grievance Lifecycle (`/grievances`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/grievances` | List permitted grievances | Yes |
| GET | `/api/grievances/{id}` | Retrieve grievance details & status | Yes |
| POST | `/api/grievances` | Lodge new public grievance | Citizen / Super Admin |
| POST | `/api/grievances/{id}/assign` | Assign officer to grievance | Dept Admin / Super Admin |
| PATCH | `/api/grievances/{id}/status` | Update administrative status | Officer / Admin |
| POST | `/api/grievances/{id}/resolve` | Submit proposed resolution | Assigned Officer |
| POST | `/api/grievances/{id}/verify` | Citizen accepts resolution | Owner Citizen |
| POST | `/api/grievances/{id}/reject` | Citizen rejects resolution (Reopen) | Owner Citizen |
| POST | `/api/grievances/{id}/reopen` | Reopen resolved/closed grievance | Citizen / Dept Admin |
| POST | `/api/grievances/{id}/escalate` | Escalate grievance priority | Authorized user |

---

## Blockchain Verification (`/blockchain`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blockchain/verify/{id}` | Compare off-chain data hash against smart contract | Public |

---

## Audit Logs (`/audit`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/audit/{grievance_id}` | Retrieve combined on-chain/off-chain audit timeline | Public |
