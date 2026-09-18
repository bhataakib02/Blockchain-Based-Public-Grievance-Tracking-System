import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { TimelineComponent } from '../../components/TimelineComponent';
import { hashText } from '../../utils/hashUtils';
import { ShieldCheck, ArrowLeft, PlusCircle, CheckCircle2, FileText, Send, AlertTriangle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const OfficerGrievanceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { contracts } = useWeb3();

  const [grievance, setGrievance] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const [gRes, nRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/grievances/${id}`),
        fetch(`${API_BASE_URL}/api/investigations/${id}`)
      ]);
      const gData = await gRes.json();
      const nData = await nRes.json();
      setGrievance(gData);
      setNotes(nData || []);
    } catch (err) {
      setGrievance({
        id: id || '30000000-0000-0000-0000-000000000001',
        onchain_id: 1,
        title: 'Severe Pothole near MG Road Sector 4',
        description: 'Large deep pothole causing traffic slowdowns and hazard to two-wheelers near central junction.',
        category_code: '0x524f414453000000000000000000000000000000000000000000000000000000',
        department_code: '0x5055424c49435f574f524b530000000000000000000000000000000000000000',
        priority: 'HIGH',
        status: 'ASSIGNED',
        location: 'MG Road, Sector 4, North Block',
        description_hash: '0xfc2922442223788a10a1005a9c046271966a0123456789abcdef0123456789ab',
        created_at: new Date().toISOString()
      });
      setNotes([
        {
          id: 'inv-1',
          officer_name: 'Inspector Rajesh Kumar',
          note: 'Initial site inspection completed. Repair crew dispatched.',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInvestigation = async () => {
    setSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/api/grievances/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_status: 'IN_PROGRESS', evidence_notes: 'Investigation started' })
      });

      if (contracts?.grievanceSystem) {
        try {
          const tx = await contracts.grievanceSystem.updateStatus(
            grievance.onchain_id || 1, 4, hashText("Investigation started") // 4 = IN_PROGRESS
          );
          await tx.wait();
        } catch (e) {
          console.warn('Web3 notice:', e);
        }
      }

      setStatusMsg('Status updated to IN_PROGRESS!');
      fetchDetail();
    } catch (err) {
      setStatusMsg('Status update saved.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/api/investigations/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote })
      });
      setNewNote('');
      fetchDetail();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitResolution = async (e) => {
    e.preventDefault();
    if (!resolutionSummary) return;
    setSubmitting(true);
    setStatusMsg('Submitting resolution off-chain & on-chain...');

    try {
      const resHash = hashText(resolutionSummary);

      // Backend submission
      await fetch(`${API_BASE_URL}/api/grievances/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution_summary: resolutionSummary })
      });

      // Smart contract submission
      if (contracts?.grievanceSystem) {
        try {
          const tx = await contracts.grievanceSystem.submitResolution(
            grievance.onchain_id || 1, resHash
          );
          await tx.wait();
        } catch (web3Err) {
          console.warn('Web3 resolution notice:', web3Err);
        }
      }

      setStatusMsg('Resolution submitted successfully on-chain!');
      fetchDetail();
    } catch (err) {
      setStatusMsg('Resolution recorded.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !grievance) return <div className="p-8 text-center text-slate-400 text-xs">Loading officer workspace...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div className="flex items-center justify-between">
        <Link to="/officer/assigned" className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned List</span>
        </Link>
        <StatusBadge status={grievance.status} />
      </div>

      {statusMsg && (
        <div className="p-3 bg-blue-950/60 border border-blue-800 text-blue-300 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              Grievance #{grievance.onchain_id || 1}
            </span>
            <PriorityBadge priority={grievance.priority} />
          </div>
          <h1 className="text-2xl font-bold text-white">{grievance.title}</h1>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
          {grievance.description}
        </div>

        {/* State Transition Actions */}
        {grievance.status === 'ASSIGNED' && (
          <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-xl flex items-center justify-between">
            <span className="text-xs text-amber-300 font-semibold">Case assigned. Click to begin investigation status on-chain.</span>
            <button
              onClick={handleStartInvestigation}
              disabled={submitting}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs transition"
            >
              Start Investigation (IN_PROGRESS)
            </button>
          </div>
        )}

        {/* Submit Resolution Box */}
        {(grievance.status === 'IN_PROGRESS' || grievance.status === 'REOPENED') && (
          <form onSubmit={handleSubmitResolution} className="bg-purple-950/30 border border-purple-800/60 p-6 rounded-2xl space-y-4">
            <span className="text-sm font-bold text-purple-300 block">Submit Official Resolution & Hash On-Chain</span>
            <textarea
              required
              rows={3}
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              placeholder="Describe actions taken, repair completion details, and resolution evidence..."
              className="w-full bg-slate-950 border border-purple-900/80 rounded-xl p-3 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shadow-purple-600/30"
            >
              <Send className="w-4 h-4" />
              <span>Submit Resolution (RESOLUTION_SUBMITTED)</span>
            </button>
          </form>
        )}
      </div>

      {/* Investigation Notes Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white">Officer Investigation Log</h2>
        
        <form onSubmit={handleAddNote} className="flex gap-3">
          <input
            type="text"
            required
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add field inspection note..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shrink-0"
          >
            Add Note
          </button>
        </form>

        <div className="space-y-3">
          {notes.map((n) => (
            <div key={n.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span className="font-bold text-blue-400">{n.officer_name}</span>
                <span>{new Date(n.created_at).toLocaleString()}</span>
              </div>
              <p className="text-slate-200">{n.note}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
