import React from 'react';
import { Bell } from 'lucide-react';

export const DepartmentNotifications = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Department Notifications</h1>
        <p className="text-xs text-slate-400">Department administrative alerts and SLA notifications.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-blue-950 text-blue-400 shrink-0 mt-0.5 border border-blue-800">
          <Bell className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Department Assigned</span>
            <span className="text-[10px] text-slate-500">Today</span>
          </div>
          <p className="text-xs text-slate-300">New grievance #2 logged for Water & Sanitation Board.</p>
        </div>
      </div>
    </div>
  );
};
