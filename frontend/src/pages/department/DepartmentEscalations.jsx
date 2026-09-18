import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DepartmentEscalations = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-rose-950 text-rose-400 rounded-xl border border-rose-800">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Department Escalation Monitoring</h1>
          <p className="text-xs text-slate-400">Recorded SLA breaches and manual escalations.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
        No active department escalations currently pending.
      </div>
    </div>
  );
};
