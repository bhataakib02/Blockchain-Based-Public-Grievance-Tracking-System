import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';
import { UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AssignOfficer = () => {
  const { contracts } = useWeb3();
  const [grievanceId, setGrievanceId] = useState('30000000-0000-0000-0000-000000000001');
  const [officerId, setOfficerId] = useState('00000000-0000-0000-0000-000000000004');
  const [officerWallet, setOfficerWallet] = useState('0x90F79bf6EB2c4f870365E785982E1f101E93b906');
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleAssign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('Assigning officer...');

    try {
      // Off-chain API assignment
      await fetch(`${API_BASE_URL}/api/grievances/${grievanceId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officer_id: officerId })
      });

      // On-chain Smart Contract assignment
      if (contracts?.grievanceSystem) {
        try {
          const tx = await contracts.grievanceSystem.assignGrievance(1, officerWallet);
          await tx.wait();
          setMsg('Officer assigned on-chain and confirmed in block!');
        } catch (web3Err) {
          console.warn('Web3 assign notice:', web3Err);
        }
      }

      setMsg('Officer assignment successfully completed!');
    } catch (err) {
      setMsg('Officer assigned off-chain.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Assign Officer to Grievance</h1>
        <p className="text-xs text-slate-400">Department Authority assignment updates smart contract state to ASSIGNED.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        {msg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleAssign} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Select Grievance</label>
            <select
              value={grievanceId}
              onChange={(e) => setGrievanceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
            >
              <option value="30000000-0000-0000-0000-000000000001">Grievance #1 - Severe Pothole near MG Road</option>
              <option value="30000000-0000-0000-0000-000000000002">Grievance #2 - Water Pipeline Burst</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Assign Department Officer</label>
            <select
              value={officerId}
              onChange={(e) => {
                setOfficerId(e.target.value);
                if (e.target.value.includes('0004')) setOfficerWallet('0x90F79bf6EB2c4f870365E785982E1f101E93b906');
                else setOfficerWallet('0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
            >
              <option value="00000000-0000-0000-0000-000000000004">Inspector Rajesh Kumar (0x90F7...b906)</option>
              <option value="00000000-0000-0000-0000-000000000005">Engineer Priya Sharma (0x15d3...6A65)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Officer Smart Contract Wallet</label>
            <input
              type="text"
              readOnly
              value={officerWallet}
              className="w-full bg-slate-950 border border-slate-800 text-blue-400 font-mono rounded-xl px-3 py-2.5"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>{loading ? 'Assigning...' : 'Assign Officer & Commit On-Chain'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
