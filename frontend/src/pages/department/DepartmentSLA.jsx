import React from 'react';
import { Clock, ShieldCheck, Sliders } from 'lucide-react';

export const DepartmentSLA = () => {
  const slaPolicies = [
    { priority: 'CRITICAL', duration: '24 Hours (1 Day)', contractSeconds: '86400', color: 'text-rose-400 border-rose-800 bg-rose-950/40' },
    { priority: 'HIGH', duration: '72 Hours (3 Days)', contractSeconds: '259200', color: 'text-amber-400 border-amber-800 bg-amber-950/40' },
    { priority: 'MEDIUM', duration: '7 Days', contractSeconds: '604800', color: 'text-sky-400 border-sky-800 bg-sky-950/40' },
    { priority: 'LOW', duration: '14 Days', contractSeconds: '1209600', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">SLA Policy Monitoring</h1>
        <p className="text-xs text-slate-400">EscalationManager smart contract SLA thresholds per priority tier.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {slaPolicies.map((p) => (
          <div key={p.priority} className={`border rounded-2xl p-6 space-y-3 ${p.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold tracking-wider">{p.priority} PRIORITY</span>
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-white block">{p.duration}</span>
            <div className="text-[11px] font-mono text-slate-400">
              EscalationManager.slaSeconds: <code className="text-white">{p.contractSeconds}s</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
