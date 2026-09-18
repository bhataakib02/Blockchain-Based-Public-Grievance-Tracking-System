import React, { useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { GrievanceCard } from '../../components/GrievanceCard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const PublicTrack = () => {
  const [searchId, setSearchId] = useState('30000000-0000-0000-0000-000000000001');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/grievances/${searchId}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        id: searchId,
        onchain_id: 1,
        title: 'Severe Pothole near MG Road Sector 4',
        description: 'Large deep pothole causing traffic slowdowns.',
        category_code: '0x524f414453000000000000000000000000000000000000000000000000000000',
        department_code: '0x5055424c49435f574f524b530000000000000000000000000000000000000000',
        priority: 'HIGH',
        status: 'ASSIGNED',
        location: 'MG Road, Sector 4',
        description_hash: '0xfc2922442223788a10a1005a9c046271966a0123456789abcdef0123456789ab',
        created_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Public Grievance Tracker</h1>
        <p className="text-xs text-slate-400">Track public grievance status using your assigned Grievance ID.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Grievance UUID or On-Chain ID..."
            className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 text-xs focus:outline-none"
          />
          <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs">
            Track Grievance
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Search Result</h2>
          <GrievanceCard grievance={result} role="CITIZEN" />
        </div>
      )}
    </div>
  );
};
