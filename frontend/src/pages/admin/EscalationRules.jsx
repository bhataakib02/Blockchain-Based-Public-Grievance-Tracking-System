import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const EscalationRules = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Escalation Policy & Rules</h1>
        <p className="text-xs text-slate-400">EscalationManager logic for deadline tracking and force escalations.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
        <h2 className="text-sm font-bold text-white">Automated SLA Breach Trigger</h2>
        <p className="text-slate-300 leading-relaxed">
          When <code className="text-emerald-400 font-mono">block.timestamp &gt; deadline[id]</code>, any authorized user or cron worker can call <code className="text-blue-400 font-mono">recordEscalation(id, priority, false)</code> to increment <code className="text-purple-400 font-mono">escalationLevel[id]</code> on-chain.
        </p>
      </div>
    </div>
  );
};
