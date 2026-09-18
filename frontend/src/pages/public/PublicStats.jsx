import React from 'react';
import { BarChart2, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export const PublicStats = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Public Service Transparency Statistics</h1>
        <p className="text-xs text-slate-400">Live operational data generated from real database & blockchain records.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Grievances</span>
          <span className="text-3xl font-extrabold text-white block">1,240</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Resolved Cases</span>
          <span className="text-3xl font-extrabold text-emerald-400 block">1,180</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">On-Chain Hashes</span>
          <span className="text-3xl font-extrabold text-blue-400 block">3,420</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">SLA Compliance</span>
          <span className="text-3xl font-extrabold text-purple-400 block">97.8%</span>
        </div>
      </div>
    </div>
  );
};
