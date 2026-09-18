import React from 'react';
import { Shield, ArrowRight, CheckCircle2, UserCheck, RefreshCw, Lock } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    { num: '1', title: 'Citizen Lodges Grievance', desc: 'Citizen submits grievance form. Details are saved in Supabase database, and a SHA-256 hash is signed and posted to GrievanceSystem.sol contract.' },
    { num: '2', title: 'Department Assignment', desc: 'Department Admin verifies category & priority, then invokes assignGrievance() to bind an active department officer.' },
    { num: '3', title: 'Investigation & Evidence', desc: 'Assigned officer updates status to IN_PROGRESS, performs site inspection, and logs evidence hashes.' },
    { num: '4', title: 'Resolution Proposal', desc: 'Officer submits resolution text. Hashes are logged on-chain. Status changes to RESOLUTION_SUBMITTED.' },
    { num: '5', title: 'Citizen Verification / Rejection', desc: 'Citizen reviews resolution. Accepting closes the case. Rejecting reopens the case on-chain, incrementing reopenCount.' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white">Grievance Lifecycle & Workflow</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Five-stage lifecycle enforced by smart contracts and backend authorization.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.num} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-blue-900/50 text-blue-400 font-bold flex items-center justify-center border border-blue-700/50 shrink-0">
              {s.num}
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
