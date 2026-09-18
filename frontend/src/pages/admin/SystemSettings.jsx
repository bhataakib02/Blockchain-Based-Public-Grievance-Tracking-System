import React from 'react';
import { Settings, ShieldCheck, Database, Cpu } from 'lucide-react';

export const SystemSettings = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Settings & Configuration</h1>
        <p className="text-xs text-slate-400">Environment variables, RPC connection, and database configuration.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs font-mono">
        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 font-sans">FastAPI Backend API</span>
          <span className="text-blue-400 font-bold">http://localhost:8000</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 font-sans">Ethereum RPC Node</span>
          <span className="text-emerald-400 font-bold">http://127.0.0.1:8545 (Chain ID 31337)</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 font-sans">Supabase Database Platform</span>
          <span className="text-purple-400 font-bold">PostgreSQL / RLS Enabled</span>
        </div>
      </div>
    </div>
  );
};
