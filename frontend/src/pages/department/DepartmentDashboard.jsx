import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GrievanceCard } from '../../components/GrievanceCard';
import { Building, UserCheck, Users, Clock, AlertTriangle, FileText } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const DepartmentDashboard = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    fetchDeptGrievances();
  }, []);

  const fetchDeptGrievances = async () => {
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
      
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Department Administration</span>
          <h1 className="text-2xl font-extrabold text-white">Public Works Administration</h1>
          <p className="text-xs text-slate-400 mt-1">Manage department officers, assign cases, enforce SLA deadlines, and monitor escalations.</p>
        </div>
        <Link
          to="/department/assign"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-600/30"
        >
          <UserCheck className="w-4 h-4" />
          <span>Assign Officer</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Department Cases</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-white">{grievances.length}</span>
            <Building className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Officers</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">2</span>
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Unassigned Cases</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-amber-400">
              {grievances.filter(g => g.status === 'SUBMITTED' || !g.assigned_officer_id).length}
            </span>
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">SLA Overdue</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-rose-400">0</span>
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Department Grievances</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {grievances.map(g => (
            <GrievanceCard key={g.id} grievance={g} role="DEPARTMENT_ADMIN" />
          ))}
        </div>
      </div>

    </div>
  );
};
