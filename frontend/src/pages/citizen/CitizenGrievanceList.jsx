import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GrievanceCard } from '../../components/GrievanceCard';
import { FileText, Search, Filter } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const CitizenGrievanceList = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/grievances`);
      const data = await res.json();
      setGrievances(data || []);
    } catch (err) {
      setGrievances([
        {
          id: '30000000-0000-0000-0000-000000000001',
          onchain_id: 1,
          title: 'Severe Pothole near MG Road Sector 4',
          description: 'Large deep pothole causing traffic slowdowns and hazard to two-wheelers near central junction.',
          category_code: '0x524f414453000000000000000000000000000000000000000000000000000000',
          department_code: '0x5055424c49435f574f524b530000000000000000000000000000000000000000',
          priority: 'HIGH',
          status: 'ASSIGNED',
          location: 'MG Road, Sector 4, North Block',
          description_hash: '0xfc2922442223788a10a1005a9c046271966a0123456789abcdef0123456789ab',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterStatus === 'ALL' ? grievances : grievances.filter(g => g.status === filterStatus);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Submitted Grievances</h1>
          <p className="text-xs text-slate-400">Track state transitions and smart contract verification for your grievances.</p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 text-white border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLUTION_SUBMITTED">Resolution Submitted</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REOPENED">Reopened</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No grievances found matching selected status filter.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(g => (
            <GrievanceCard key={g.id} grievance={g} role="CITIZEN" />
          ))}
        </div>
      )}

    </div>
  );
};
