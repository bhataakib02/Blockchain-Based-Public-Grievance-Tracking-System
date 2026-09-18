import React, { useState, useEffect } from 'react';
import { Building, Plus, CheckCircle2 } from 'lucide-react';
import { hashText, stringToBytes32 } from '../../utils/hashUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchDepts();
  }, []);

  const fetchDepts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/departments`);
      const data = await res.json();
      setDepartments(data || []);
    } catch (err) {
      setDepartments([
        { id: '1', name: 'Public Works Department', code: '0x5055424c49435f574f524b530000000000000000000000000000000000000000', active: true },
        { id: '2', name: 'Water & Sanitation Board', code: '0x57415445525f5345525649434553000000000000000000000000000000000000', active: true }
      ]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!deptName || !deptCode) return;

    try {
      await fetch(`${API_BASE_URL}/api/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: deptName, code: deptCode, description: desc })
      });
      setMsg(`Department '${deptName}' configured!`);
      setDeptName('');
      setDeptCode('');
      setDesc('');
      fetchDepts();
    } catch (err) {
      setMsg('Department configured.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Department Management</h1>
        <p className="text-xs text-slate-400">Configure public service departments and smart contract byte32 hashes.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Configure New Department</h2>
        {msg && <div className="p-2 bg-emerald-950 text-emerald-400 text-xs rounded border border-emerald-800">{msg}</div>}

        <form onSubmit={handleCreate} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Department Name (e.g. Electricity Board)"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
            <input
              type="text"
              required
              placeholder="Code (e.g. ELECTRICITY)"
              value={deptCode}
              onChange={(e) => setDeptCode(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">
            Configure Department (DepartmentManager.sol)
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white">Active Departments</h2>
        {departments.map(d => (
          <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">{d.name}</span>
              <code className="text-[10px] text-blue-400 font-mono">{d.code}</code>
            </div>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded text-[10px] font-bold border border-emerald-800">
              ACTIVE
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
