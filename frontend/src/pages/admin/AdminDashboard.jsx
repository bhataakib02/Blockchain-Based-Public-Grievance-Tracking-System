import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GrievanceCard } from '../../components/GrievanceCard';
import { ShieldCheck, Users, Building, FileText, Activity, Sliders, Cpu } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/grievances`);
      const data = await res.json();
      setGrievances(data || []);
    } catch (err) {
      setGrievances([]);
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-extrabold text-blue-400 tracking-wider">Super Administrator Control Center</span>
          <h1 className="text-2xl font-extrabold text-white">System Governance & On-Chain Monitor</h1>
          <p className="text-xs text-slate-400 mt-1">Manage global role permissions, configure departments, tune SLA parameters, and inspect audit logs.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/departments" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition">
            <Building className="w-4 h-4" />
            <span>Departments</span>
          </Link>
          <Link to="/admin/audit-logs" className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs flex items-center space-x-2 transition">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Audit Trail</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total System Users</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-white">7</span>
            <Users className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Departments</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-indigo-400">4</span>
            <Building className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Grievances</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">{grievances.length}</span>
            <FileText className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Deployed Contracts</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-purple-400">5</span>
            <Cpu className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">System-Wide Grievance Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {grievances.map(g => (
            <GrievanceCard key={g.id} grievance={g} role="SUPER_ADMIN" />
          ))}
        </div>
      </div>

    </div>
  );
};
