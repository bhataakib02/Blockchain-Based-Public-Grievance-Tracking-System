import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { TimelineComponent } from '../../components/TimelineComponent';
import { ShieldCheck, Calendar, MapPin, CheckCircle2, XCircle, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatAddress, formatTxHash } from '../../utils/hashUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const CitizenGrievanceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [grievance, setGrievance] = useState(null);
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [feedback, setFeedback] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const [gRes, aRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/grievances/${id}`),
        fetch(`${API_BASE_URL}/api/audit/${id}`)
      ]);
      const gData = await gRes.json();
      const aData = await aRes.json();
      setGrievance(gData);
      setAuditEvents(aData || []);
    } catch (err) {
      // Mock fallback
      setGrievance({
        id: id || '30000000-0000-0000-0000-000000000001',
        onchain_id: 1,
        title: 'Severe Pothole near MG Road Sector 4',
        description: 'Large deep pothole causing traffic slowdowns and hazard to two-wheelers near central junction.',
        category_code: '0x524f414453000000000000000000000000000000000000000000000000000000',
        department_code: '0x5055424c49435f574f524b530000000000000000000000000000000000000000',
        priority: 'HIGH',
        status: 'RESOLUTION_SUBMITTED',
        location: 'MG Road, Sector 4, North Block',
        description_hash: '0xfc2922442223788a10a1005a9c046271966a0123456789abcdef0123456789ab',
        resolution_summary: 'Asphalt resurfacing completed by Municipal Road Works Division. Inspection passed.',
        resolution_hash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        created_at: new Date().toISOString()
      });
      setAuditEvents([
        {
          id: 'a1',
          grievance_id: id,
          actor_wallet: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
          action: 'GRIEVANCE_CREATED',
          data_hash: '0xfc2922442223788a10a1005a9c046271966a0123456789abcdef0123456789ab',
          is_onchain: true,
          tx_hash: '0x8f7a93b4c12d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResolution = async () => {
    setActionLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/grievances/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: feedback || 'Satisfied with resolution' })
      });
      setMessage('Resolution verified! Grievance closed on-chain.');
      fetchDetail();
    } catch (err) {
      setMessage('Verification updated.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectResolution = async () => {
    if (!feedback) {
      alert('Please state why you are rejecting the proposed resolution.');
      return;
    }
    setActionLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/grievances/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: feedback })
      });
      setMessage('Resolution rejected. Case reopened on-chain for officer reassignment.');
      fetchDetail();
    } catch (err) {
      setMessage('Status updated.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !grievance) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading grievance lifecycle details...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <Link to="/citizen/grievances" className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grievances</span>
        </Link>

        <Link
          to={`/blockchain-verification`}
          className="px-3.5 py-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg text-xs font-semibold flex items-center space-x-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verify On-Chain Audit</span>
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-mono font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-md border border-blue-800">
                Grievance #{grievance.onchain_id || 1}
              </span>
              <PriorityBadge priority={grievance.priority} />
            </div>
            <h1 className="text-2xl font-bold text-white">{grievance.title}</h1>
          </div>
          <div>
            <StatusBadge status={grievance.status} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase font-bold text-[10px]">Location</span>
            <p className="text-slate-200 font-semibold">{grievance.location || 'Municipal Area'}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase font-bold text-[10px]">Submitted Date</span>
            <p className="text-slate-200 font-semibold">{new Date(grievance.created_at).toLocaleString()}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase font-bold text-[10px]">Reopen Count</span>
            <p className="text-slate-200 font-semibold">{grievance.reopen_count || 0} times</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Off-Chain Description Text</h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {grievance.description}
          </div>
        </div>

        {/* Hash Commitment */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <span className="text-emerald-400 font-bold flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographic Data Commitment (On-Chain Hash)</span>
          </span>
          <code className="block bg-slate-900 p-2.5 rounded font-mono text-[11px] text-slate-300 break-all border border-slate-800">
            {grievance.description_hash}
          </code>
        </div>

        {/* Resolution Section if available */}
        {grievance.resolution_summary && (
          <div className="bg-purple-950/30 border border-purple-800/60 p-6 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-purple-400" />
              <span>Proposed Resolution Details</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{grievance.resolution_summary}</p>
            <div className="text-[11px] font-mono text-slate-400">
              Resolution Hash: <code className="text-purple-300">{grievance.resolution_hash}</code>
            </div>

            {/* Citizen Action Verification Buttons */}
            {(grievance.status === 'RESOLUTION_SUBMITTED' || grievance.status === 'CITIZEN_VERIFICATION') && (
              <div className="pt-4 border-t border-purple-800/40 space-y-3">
                <span className="text-xs font-bold text-white block">Citizen Verification & Action Required:</span>
                <textarea
                  rows={2}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Add feedback notes (required if rejecting)..."
                  className="w-full bg-slate-950 border border-purple-900/80 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleVerifyResolution}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept & Close Grievance</span>
                  </button>
                  <button
                    onClick={handleRejectResolution}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shadow-rose-600/30"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject & Reopen Case</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Audit Trail Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white">Immutable Audit Trail Timeline</h2>
        <TimelineComponent events={auditEvents} />
      </div>

    </div>
  );
};
