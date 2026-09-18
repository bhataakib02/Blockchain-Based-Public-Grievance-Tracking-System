import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileCheck, Cpu, ArrowRight, CheckCircle2, Activity, Users, AlertCircle } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-950/60 via-slate-900 to-slate-950 border border-slate-800 p-8 md:p-14 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold mb-6">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>Tamper-Evident Blockchain Audit Trail</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Transparent, Accountable & Decentralized <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Public Grievance Tracking</span>
        </h1>

        <p className="mt-4 text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Empowering citizens with immutable cryptographic proof of grievance registration and resolution. Personal data stays secure off-chain while action hashes are verified on the Ethereum blockchain.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
          >
            <span>Submit a Grievance</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/blockchain-verification"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Verify Blockchain Record</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80 text-xs font-semibold text-slate-400">
          <div className="flex items-center justify-center space-x-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Off-Chain PII Privacy</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Solidity Smart Contracts</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>SHA-256 Data Hashes</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Strict SLA Escalation</span>
          </div>
        </div>
      </section>

      {/* Workflow Features */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">How The System Works</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Combining off-chain database efficiency with on-chain cryptographic auditability.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
            <div className="w-12 h-12 rounded-xl bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold text-lg mb-4 border border-blue-700/50">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Citizen Submission</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Citizens submit grievances with category, location, and evidence. Detailed description text is saved off-chain in Supabase, and a SHA-256 hash is submitted on-chain.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
            <div className="w-12 h-12 rounded-xl bg-indigo-900/50 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4 border border-indigo-700/50">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Departmental Resolution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Department admins assign cases to officers. Officers investigate, attach evidence, and log resolution proposals on-chain with automated SLA monitoring.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/50 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4 border border-emerald-700/50">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Citizen Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Citizens review resolution proof and accept or reject. Rejections reopen the case on-chain, ensuring officers cannot unilaterally close grievances without citizen consent.
            </p>
          </div>
        </div>
      </section>

      {/* Role Access Matrix Callout */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Multi-Layer Role-Based Access Control</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Strict permissions enforced simultaneously across React Frontend, FastAPI Backend, and Solidity Smart Contracts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700">
              Login to Workspace
            </Link>
            <Link to="/public-statistics" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20">
              View Analytics
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
