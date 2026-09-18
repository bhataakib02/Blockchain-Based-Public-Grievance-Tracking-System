import React from 'react';

const STATUS_COLORS = {
  SUBMITTED: 'bg-blue-900/60 text-blue-300 border-blue-700',
  UNDER_REVIEW: 'bg-indigo-900/60 text-indigo-300 border-indigo-700',
  VERIFIED: 'bg-teal-900/60 text-teal-300 border-teal-700',
  ASSIGNED: 'bg-cyan-900/60 text-cyan-300 border-cyan-700',
  IN_PROGRESS: 'bg-amber-900/60 text-amber-300 border-amber-700',
  RESOLUTION_SUBMITTED: 'bg-purple-900/60 text-purple-300 border-purple-700',
  CITIZEN_VERIFICATION: 'bg-violet-900/60 text-violet-300 border-violet-700',
  RESOLVED: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  CLOSED: 'bg-slate-800 text-slate-300 border-slate-600',
  REJECTED: 'bg-rose-900/60 text-rose-300 border-rose-700',
  ESCALATED: 'bg-red-950 text-red-400 border-red-800 animate-pulse',
  REOPENED: 'bg-orange-900/60 text-orange-300 border-orange-700'
};

export const StatusBadge = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-800 text-slate-300 border-slate-600';
  const displayStatus = status ? status.replace(/_/g, ' ') : 'UNKNOWN';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
      {displayStatus}
    </span>
  );
};
