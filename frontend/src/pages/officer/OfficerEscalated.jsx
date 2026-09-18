import React, { useState, useEffect } from 'react';
import { GrievanceCard } from '../../components/GrievanceCard';
import { AlertTriangle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const OfficerEscalated = () => {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    fetchEscalated();
  }, []);

  const fetchEscalated = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/grievances?status=ESCALATED`);
      const data = await res.json();
      setGrievances(data || []);
    } catch (err) {
      setGrievances([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-rose-950 text-rose-400 rounded-xl border border-rose-800">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Escalated Grievances</h1>
          <p className="text-xs text-slate-400">High priority cases where SLA deadlines expired or manual escalation occurred.</p>
        </div>
      </div>

      {grievances.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No escalated cases currently active.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {grievances.map(g => (
            <GrievanceCard key={g.id} grievance={g} role="OFFICER" />
          ))}
        </div>
      )}
    </div>
  );
};
