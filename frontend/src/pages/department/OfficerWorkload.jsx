import React from 'react';
import { Users, UserCheck, ShieldCheck } from 'lucide-react';

export const OfficerWorkload = () => {
  const officers = [
    {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Inspector Rajesh Kumar',
      email: 'officer.kumar@grievance.gov.in',
      wallet: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      assignedCount: 1,
      inProgressCount: 1,
      resolvedCount: 4,
      onchainOfficer: true
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      name: 'Engineer Priya Sharma',
      email: 'officer.sharma@grievance.gov.in',
      wallet: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
      assignedCount: 0,
      inProgressCount: 0,
      resolvedCount: 6,
      onchainOfficer: true
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Department Officer Workload</h1>
        <p className="text-xs text-slate-400">Monitor active officer case allocations and smart contract membership.</p>
      </div>

      <div className="space-y-4">
        {officers.map(off => (
          <div key={off.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-900/50 text-indigo-400 font-bold flex items-center justify-center border border-indigo-700/50">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{off.name}</h3>
                <span className="text-xs text-slate-400 block">{off.email}</span>
                <code className="text-[10px] font-mono text-indigo-400">{off.wallet}</code>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned</span>
                <span className="text-lg font-bold text-amber-400">{off.assignedCount}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Resolved</span>
                <span className="text-lg font-bold text-emerald-400">{off.resolvedCount}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg text-[10px] font-bold">
                ON-CHAIN OFFICER
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
