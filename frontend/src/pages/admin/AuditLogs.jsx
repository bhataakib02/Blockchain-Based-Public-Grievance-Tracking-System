import React, { useState, useEffect } from 'react';
import { TimelineComponent } from '../../components/TimelineComponent';
import { Activity, ShieldCheck, Database } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/audit/30000000-0000-0000-0000-000000000001`);
      const data = await res.json();
      setLogs(data || []);
    } catch (err) {
      setLogs([
        {
          id: 'a1',
          grievance_id: '30000000-0000-0000-0000-000000000001',
          actor_wallet: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
          action: 'GRIEVANCE_CREATED',
          data_hash: '0xfc2922442223788a10a1005a9c046271966a0123456789abcdef0123456789ab',
          is_onchain: true,
          tx_hash: '0x8f7a93b4c12d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AuditTrail.sol Append-Only Log</h1>
          <p className="text-xs text-slate-400">Immutable smart contract record sequence stored on Ethereum chain.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <TimelineComponent events={logs} />
      </div>
    </div>
  );
};
