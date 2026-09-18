import React, { useState, useEffect } from 'react';
import { GrievanceCard } from '../../components/GrievanceCard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AllGrievances = () => {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/grievances`);
      const data = await res.json();
      setGrievances(data || []);
    } catch (err) {
      setGrievances([]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All System Grievances</h1>
        <p className="text-xs text-slate-400">Complete listing of public grievances across all departments.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {grievances.map(g => (
          <GrievanceCard key={g.id} grievance={g} role="SUPER_ADMIN" />
        ))}
      </div>
    </div>
  );
};
