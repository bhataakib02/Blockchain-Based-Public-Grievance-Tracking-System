import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Mail, Wallet } from 'lucide-react';
import { formatAddress } from '../../utils/hashUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      setUsers([
        { id: '1', email: 'superadmin@grievance.gov.in', full_name: 'Super Admin User', role: 'SUPER_ADMIN', wallet_address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
        { id: '2', email: 'deptadmin.pwd@grievance.gov.in', full_name: 'Public Works Admin', role: 'DEPARTMENT_ADMIN', wallet_address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' },
        { id: '4', email: 'officer.kumar@grievance.gov.in', full_name: 'Inspector Rajesh Kumar', role: 'OFFICER', wallet_address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' },
        { id: '6', email: 'citizen.rahul@gmail.com', full_name: 'Rahul Verma', role: 'CITIZEN', wallet_address: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc' }
      ]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Users & Access Control</h1>
        <p className="text-xs text-slate-400">View registered profiles and synchronize smart contract roles.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">User Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">System Role</th>
              <th className="p-4">Wallet Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition">
                <td className="p-4 font-bold text-white">{u.full_name}</td>
                <td className="p-4 text-slate-400">{u.email}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    {u.role}
                  </span>
                </td>
                <td className="p-4 font-mono text-indigo-400">{formatAddress(u.wallet_address)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
