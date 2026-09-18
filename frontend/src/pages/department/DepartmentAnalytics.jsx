import React from 'react';
import { BarChart2, CheckCircle2, Clock, Activity } from 'lucide-react';

export const DepartmentAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Department Analytics</h1>
        <p className="text-xs text-slate-400">Resolution throughput, average turnaround times, and citizen feedback scores.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Resolution Time</span>
          <span className="text-3xl font-extrabold text-blue-400 block">2.4 Days</span>
          <p className="text-[11px] text-slate-500">Well within 7-day medium SLA target.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">SLA Compliance Rate</span>
          <span className="text-3xl font-extrabold text-emerald-400 block">98.5%</span>
          <p className="text-[11px] text-slate-500">Verified by EscalationManager contracts.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Citizen Satisfaction</span>
          <span className="text-3xl font-extrabold text-purple-400 block">4.8 / 5.0</span>
          <p className="text-[11px] text-slate-500">Based on verified feedback hashes.</p>
        </div>
      </div>
    </div>
  );
};
