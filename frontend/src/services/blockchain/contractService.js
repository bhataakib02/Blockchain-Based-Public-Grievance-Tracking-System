import { ethers } from 'ethers';
import RoleManagerABI from '../../../../blockchain/abi/RoleManager.json';
import DepartmentManagerABI from '../../../../blockchain/abi/DepartmentManager.json';
import EscalationManagerABI from '../../../../blockchain/abi/EscalationManager.json';
import AuditTrailABI from '../../../../blockchain/abi/AuditTrail.json';
import GrievanceSystemABI from '../../../../blockchain/abi/GrievanceSystem.json';

export const CONTRACT_ADDRESSES = {
  RoleManager: import.meta.env.VITE_ROLE_MANAGER_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  DepartmentManager: import.meta.env.VITE_DEPARTMENT_MANAGER_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  EscalationManager: import.meta.env.VITE_ESCALATION_MANAGER_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  AuditTrail: import.meta.env.VITE_AUDIT_TRAIL_ADDRESS || "0xCf7Ed3AccA5a467e9e75457124372915801570B7",
  GrievanceSystem: import.meta.env.VITE_GRIEVANCE_SYSTEM_ADDRESS || "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
};

export const getContractInstances = (signerOrProvider) => {
  return {
    roleManager: new ethers.Contract(CONTRACT_ADDRESSES.RoleManager, RoleManagerABI, signerOrProvider),
    departmentManager: new ethers.Contract(CONTRACT_ADDRESSES.DepartmentManager, DepartmentManagerABI, signerOrProvider),
    escalationManager: new ethers.Contract(CONTRACT_ADDRESSES.EscalationManager, EscalationManagerABI, signerOrProvider),
    auditTrail: new ethers.Contract(CONTRACT_ADDRESSES.AuditTrail, AuditTrailABI, signerOrProvider),
    grievanceSystem: new ethers.Contract(CONTRACT_ADDRESSES.GrievanceSystem, GrievanceSystemABI, signerOrProvider)
  };
};
