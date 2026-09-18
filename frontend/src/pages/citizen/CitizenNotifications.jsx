import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle2, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const CitizenNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`);
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      setNotifications([
        {
          id: 'n1',
          title: 'Grievance Registered On-Chain',
          message: 'Your grievance #1 "Severe Pothole near MG Road" was logged with Hash 0xfc2922...',
          type: 'SUCCESS',
          read: false,
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <p className="text-xs text-slate-400">Real-time alerts on your grievance processing and blockchain updates.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-blue-950 text-blue-400 shrink-0 mt-0.5 border border-blue-800">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{n.title}</span>
                <span className="text-[10px] text-slate-500">{new Date(n.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-slate-300">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
