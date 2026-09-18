import React from 'react';

const PRIORITY_COLORS = {
  LOW: 'bg-emerald-950/60 text-emerald-400 border-emerald-800',
  MEDIUM: 'bg-sky-950/60 text-sky-400 border-sky-800',
  HIGH: 'bg-amber-950/60 text-amber-400 border-amber-800',
  CRITICAL: 'bg-rose-950/80 text-rose-400 border-rose-800 font-bold'
};

export const PriorityBadge = ({ priority }) => {
  const colorClass = PRIORITY_COLORS[priority] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
      {priority || 'MEDIUM'}
    </span>
  );
};
