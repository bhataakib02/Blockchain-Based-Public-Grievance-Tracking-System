import React from 'react';
import { Shield, Lock, FileCheck, Cpu } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white">About The System</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          A modern hybrid architecture combining off-chain privacy with on-chain Ethereum smart contract immutability.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-sm text-slate-300 leading-relaxed">
        <h2 className="text-lg font-bold text-white">Project Objective</h2>
        <p>
          Traditional public grievance tracking systems often suffer from lack of transparency, record manipulation, and unilateral closure by officers without citizen verification. This system solves these vulnerabilities using a 5-contract Solidity architecture paired with Supabase off-chain storage and FastAPI backend APIs.
        </p>

        <h2 className="text-lg font-bold text-white">Privacy Guarantee</h2>
        <p>
          No citizen names, email addresses, phone numbers, complete text descriptions, or evidence media files are ever published directly on the public blockchain. Instead, canonical SHA-256 hashes are recorded, guaranteeing tamper-evident auditability without violating data privacy laws.
        </p>
      </div>
    </div>
  );
};
