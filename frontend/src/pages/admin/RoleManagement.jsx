import React from 'react';
import { Shield, Key } from 'lucide-react';
import { ethers } from 'ethers';

export const RoleManagement = () => {
  const roles = [
    { name: 'SUPER_ADMIN_ROLE', hash: ethers.id('SUPER_ADMIN_ROLE'), desc: 'Full administration of contract system and role assignments.' },
    { name: 'DEPARTMENT_ADMIN_ROLE', hash: ethers.id('DEPARTMENT_ADMIN_ROLE'), desc: 'Department management and officer assignment authority.' },
    { name: 'OFFICER_ROLE', hash: ethers.id('OFFICER_ROLE'), desc: 'Investigation notes, evidence logging, and resolution submission.' },
    { name: 'CITIZEN_ROLE', hash: ethers.id('CITIZEN_ROLE'), desc: 'Public grievance logging and resolution verification/rejection.' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Smart Contract Role Architecture</h1>
        <p className="text-xs text-slate-400">Role identifiers as defined in RoleManager.sol (OpenZeppelin AccessControl).</p>
      </div>

      <div className="space-y-4">
        {roles.map((r) => (
          <div key={r.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-400 font-mono">{r.name}</span>
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-xs text-slate-300">{r.desc}</p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 break-all">
              keccak256("{r.name}") = <span className="text-emerald-400">{r.hash}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
