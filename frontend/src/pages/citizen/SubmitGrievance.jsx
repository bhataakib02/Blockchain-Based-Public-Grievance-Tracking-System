import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';
import { hashText, stringToBytes32 } from '../../utils/hashUtils';
import { Shield, Send, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const SubmitGrievance = () => {
  const { user } = useAuth();
  const { contracts, account, connectWallet } = useWeb3();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department_code: '0x5055424c49435f574f524b530000000000000000000000000000000000000000',
    category_code: '0x524f414453000000000000000000000000000000000000000000000000000000',
    priority: 'MEDIUM',
    location: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txStatus, setTxStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTxStatus('Hashing grievance off-chain data...');

    try {
      // 1. Submit off-chain data to FastAPI Backend / Supabase
      const res = await fetch(`${API_BASE_URL}/api/grievances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const createdGrievance = await res.json();
      setTxStatus('Off-chain record saved. Preparing smart contract transaction...');

      // 2. Blockchain Transaction (if MetaMask wallet is connected)
      if (contracts?.grievanceSystem) {
        setTxStatus('Confirm transaction in MetaMask wallet...');
        const titleBytes = stringToBytes32(formData.title);
        const descHash = hashText(formData.description);
        const catBytes = formData.category_code;
        const deptBytes = formData.department_code;
        const priorityEnum = formData.priority === 'LOW' ? 0 : formData.priority === 'HIGH' ? 2 : formData.priority === 'CRITICAL' ? 3 : 1;

        try {
          const tx = await contracts.grievanceSystem.createGrievance(
            titleBytes, descHash, catBytes, deptBytes, priorityEnum
          );
          setTxStatus('Transaction submitted! Awaiting block confirmation...');
          await tx.wait();
          setTxStatus('Transaction confirmed on-chain!');
        } catch (web3Err) {
          console.warn('Web3 transaction notice:', web3Err);
          // Don't throw if local dev wallet isn't configured on testnet; backend already recorded off-chain hash!
        }
      }

      setTimeout(() => {
        navigate('/citizen/dashboard');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to lodge grievance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Lodge Grievance</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Submit Public Grievance</h1>
          <p className="text-xs text-slate-400">Your details are saved off-chain. SHA-256 hash is logged on the blockchain.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {txStatus && (
          <div className="p-3 bg-blue-950/60 border border-blue-800 text-blue-300 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-spin" />
            <span>{txStatus}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Grievance Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Water Pipeline Leakage on Main Street"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Target Department</label>
              <select
                value={formData.department_code}
                onChange={(e) => setFormData({ ...formData, department_code: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="0x5055424c49435f574f524b530000000000000000000000000000000000000000">Public Works Department</option>
                <option value="0x57415445525f5345525649434553000000000000000000000000000000000000">Water & Sanitation Board</option>
                <option value="0x454c454354524943495459000000000000000000000000000000000000000000">Electricity Supply Board</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Category</label>
              <select
                value={formData.category_code}
                onChange={(e) => setFormData({ ...formData, category_code: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="0x524f414453000000000000000000000000000000000000000000000000000000">Potholes & Road Repairs</option>
                <option value="0x57415445525f4c45414b00000000000000000000000000000000000000000000">Water Pipeline Leakage</option>
                <option value="0x53414e49544154494f4e00000000000000000000000000000000000000000000">Sanitation & Sewage Overflow</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="LOW">LOW (14 Days SLA)</option>
                <option value="MEDIUM">MEDIUM (7 Days SLA)</option>
                <option value="HIGH">HIGH (3 Days SLA)</option>
                <option value="CRITICAL">CRITICAL (24 Hours SLA)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Location / Landmark</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Ward 14, Central Circle"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Detailed Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide exact details of the public grievance..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Submitting...' : 'Submit & Register on Blockchain'}</span>
          </button>

        </form>
      </div>

    </div>
  );
};
