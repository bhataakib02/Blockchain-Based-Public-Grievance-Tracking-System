import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { ShieldCheck, Calendar, MapPin, Hash, ArrowRight } from 'lucide-react';
import { formatTxHash } from '../utils/hashUtils';

export const GrievanceCard = ({ grievance, role = 'CITIZEN' }) => {
  const rolePrefix = role.toLowerCase().replace('_', '');
  const detailLink = `/${role === 'CITIZEN' ? 'citizen' : role === 'OFFICER' ? 'officer' : role === 'DEPARTMENT_ADMIN' ? 'department' : 'admin'}/grievances/${grievance.id}`;

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 hover:border-blue-500/50 transition-all shadow-lg group">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
            #{grievance.onchain_id || 1}
          </span>
          <PriorityBadge priority={grievance.priority} />
        </div>
        <StatusBadge status={grievance.status} />
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-100 group-hover:text-blue-300 transition-colors mb-2 line-clamp-1">
        {grievance.title}
      </h3>

      {/* Description Snippet */}
      <p className="text-xs text-slate-400 line-clamp-2 mb-4">
        {grievance.description}
      </p>

      {/* Details Row */}
      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 border-t border-slate-700/50 pt-3 mb-4">
        <div className="flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{grievance.location || 'Municipal Region'}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{new Date(grievance.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Hash Verification Pill */}
      <div className="bg-slate-900/60 rounded-lg p-2 flex items-center justify-between text-[10px] font-mono border border-slate-800 mb-4">
        <div className="flex items-center space-x-1.5 text-slate-400 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-slate-500">Hash:</span>
          <span className="text-slate-300 truncate">{formatTxHash(grievance.description_hash)}</span>
        </div>
        <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
          ON-CHAIN
        </span>
      </div>

      {/* Footer Link */}
      <Link
        to={detailLink}
        className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-700/50 hover:bg-blue-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition"
      >
        <span>View Grievance Lifecycle</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
