import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GrievanceCard } from '../../components/GrievanceCard';
import { UserCheck, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const OfficerDashboard = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssigned();
  }, []);

  const fetchAssigned = async () => {
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

  return (
    <div className="space-y-8">
      
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-extrabold text-white">Officer Workspace: {user?.full_name || 'Inspector'}</h1>
        <p className="text-xs text-slate-400 mt-1">Investigate assigned grievances, attach evidence, and submit on-chain resolutions.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Workload</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-white">{grievances.length}</span>
            <UserCheck className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Under Investigation</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-amber-400">1</span>
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Resolutions Submitted</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-purple-400">0</span>
            <CheckCircle2 className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Escalated Priority</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-rose-400">0</span>
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Assigned Cases Needing Attention</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {grievances.map(g => (
            <GrievanceCard key={g.id} grievance={g} role="OFFICER" />
          ))}
        </div>
      </div>

    </div>
  );
};
