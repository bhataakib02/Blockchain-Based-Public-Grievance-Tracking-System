import React from 'react';
import { BarChart2, TrendingUp, Users, ShieldCheck } from 'lucide-react';

export const SystemAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Analytics & Blockchain Metrics</h1>
        <p className="text-xs text-slate-400">Global grievance statistics, on-chain transaction volume, and performance indicators.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">On-Chain Audit Records</span>
          <span className="text-3xl font-extrabold text-blue-400 block">12</span>
          <p className="text-[11px] text-slate-500">Appended to AuditTrail.sol</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Registered Citizens</span>
          <span className="text-3xl font-extrabold text-emerald-400 block">450+</span>
          <p className="text-[11px] text-slate-500">Supabase Auth Profiles</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Average Response Time</span>
          <span className="text-3xl font-extrabold text-purple-400 block">1.8 Days</span>
          <p className="text-[11px] text-slate-500">Across all 4 active departments</p>
        </div>
      </div>
    </div>
  );
};
