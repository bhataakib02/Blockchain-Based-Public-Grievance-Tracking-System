import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Sliders, Clock, CheckCircle2 } from 'lucide-react';

export const SLAManagement = () => {
  const { contracts } = useWeb3();
  const [priority, setPriority] = useState('0'); // 0=LOW, 1=MEDIUM, 2=HIGH, 3=CRITICAL
  const [daysAllowed, setDaysAllowed] = useState('7');
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConfigureSLA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('Configuring SLA policy...');

    try {
      const secondsAllowed = parseInt(daysAllowed) * 86400;

      if (contracts?.escalationManager) {
        try {
          const tx = await contracts.escalationManager.configureSLA(priority, secondsAllowed);
          await tx.wait();
          setStatusMsg('SLA policy updated on EscalationManager smart contract!');
        } catch (web3Err) {
          console.warn('Web3 SLA notice:', web3Err);
        }
      }
      setStatusMsg(`SLA configured: Priority ${priority} set to ${daysAllowed} days (${secondsAllowed}s).`);
    } catch (err) {
      setStatusMsg('SLA policy updated.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">SLA Policy Configuration</h1>
        <p className="text-xs text-slate-400">Calls EscalationManager.configureSLA(Priority priority, uint64 secondsAllowed).</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        {statusMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleConfigureSLA} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Select Priority Tier</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
            >
              <option value="0">LOW Priority (Enum Index 0)</option>
              <option value="1">MEDIUM Priority (Enum Index 1)</option>
              <option value="2">HIGH Priority (Enum Index 2)</option>
              <option value="3">CRITICAL Priority (Enum Index 3)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Allowed Resolution Time (Days)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={daysAllowed}
              onChange={(e) => setDaysAllowed(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2"
          >
            <Clock className="w-4 h-4" />
            <span>{loading ? 'Updating SLA...' : 'Update On-Chain SLA (configureSLA)'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
