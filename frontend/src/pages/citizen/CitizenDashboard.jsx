import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GrievanceCard } from '../../components/GrievanceCard';
import { PlusCircle, FileText, CheckCircle2, Clock, RefreshCw, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gRes, sRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/grievances`),
        fetch(`${API_BASE_URL}/api/analytics/summary`)
      ]);
      const gData = await gRes.json();
      const sData = await sRes.json();
      setGrievances(gData || []);
      setStats(sData);
    } catch (err) {
      // Mock fallback
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
      setStats({
        total_grievances: 1,
        active_grievances: 1,
        resolved_grievances: 0,
        reopened_grievances: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Welcome, {user?.full_name || 'Citizen'}</h1>
          <p className="text-xs text-slate-400 mt-1">Submit, monitor, and verify your public grievances on the blockchain.</p>
        </div>
        <Link
          to="/citizen/submit"
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-600/30"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Lodge New Grievance</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Grievances</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-white">{stats?.total_grievances || 0}</span>
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">In Progress / Active</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-amber-400">{stats?.active_grievances || 0}</span>
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Resolved</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">{stats?.resolved_grievances || 0}</span>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Reopened / Action Needed</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-orange-400">{stats?.reopened_grievances || 0}</span>
            <RefreshCw className="w-6 h-6 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Recent Grievances List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Active Grievances</h2>
          <Link to="/citizen/grievances" className="text-xs text-blue-400 hover:underline">View All</Link>
        </div>

        {grievances.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            You have not submitted any grievances yet. Click "Lodge New Grievance" to start.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {grievances.map((g) => (
              <GrievanceCard key={g.id} grievance={g} role="CITIZEN" />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
