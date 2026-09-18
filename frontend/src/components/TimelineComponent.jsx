import React from 'react';
import { Shield, Database, CheckCircle2, Clock, FileText, UserCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { formatAddress, formatTxHash } from '../utils/hashUtils';

const EVENT_ICONS = {
  GRIEVANCE_CREATED: Shield,
  GRIEVANCE_ASSIGNED: UserCheck,
  STATUS_UPDATED: RefreshCw,
  RESOLUTION_SUBMITTED: CheckCircle2,
  CITIZEN_VERIFIED: CheckCircle2,
  RESOLUTION_REJECTED: AlertTriangle,
  REOPENED: RefreshCw,
  ESCALATED: AlertTriangle
};

export const TimelineComponent = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-xs">
        No audit events recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {events.map((event, idx) => {
        const Icon = EVENT_ICONS[event.action] || Clock;
        const isOnChain = event.is_onchain !== false;

        return (
          <div key={event.id || idx} className="relative group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
              isOnChain 
                ? 'bg-emerald-950 text-emerald-400 border-emerald-700 shadow-md shadow-emerald-900/20' 
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}>
              <Icon className="w-3.5 h-3.5" />
            </div>

            {/* Event Box */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-slate-600 transition">
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                    {event.action.replace(/_/g, ' ')}
                  </span>
                  
                  {isOnChain ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <Shield className="w-3 h-3" />
                      <span>ON-CHAIN VERIFIED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                      <Database className="w-3 h-3" />
                      <span>OFF-CHAIN RECORD</span>
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(event.created_at).toLocaleString()}
                </span>
              </div>

              {/* Actor & Wallet */}
              <div className="text-xs text-slate-400 flex items-center space-x-4 mb-2">
                <span>Actor Wallet: <code className="font-mono text-blue-400">{formatAddress(event.actor_wallet || "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc")}</code></span>
              </div>

              {/* Data Hash */}
              {event.data_hash && (
                <div className="bg-slate-900/80 rounded p-2 text-[10px] font-mono text-slate-300 flex items-center justify-between border border-slate-800">
                  <span className="text-slate-500 truncate mr-2">Hash: {event.data_hash}</span>
                  {event.tx_hash && (
                    <a
                      href={`#`}
                      className="text-blue-400 hover:underline shrink-0"
                      title="View Transaction"
                    >
                      Tx: {formatTxHash(event.tx_hash)}
                    </a>
                  )}
                </div>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
};
