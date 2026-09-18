import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';
import { User, Mail, Shield, Wallet } from 'lucide-react';
import { formatAddress } from '../../utils/hashUtils';

export const OfficerProfile = () => {
  const { user } = useAuth();
  const { account } = useWeb3();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Officer Profile</h1>
        <p className="text-xs text-slate-400">Government Officer Credentials & Smart Contract Authorization.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 text-indigo-400 font-extrabold text-2xl flex items-center justify-center border border-indigo-500/40">
            {user?.full_name?.charAt(0) || 'O'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.full_name || 'Inspector Rajesh Kumar'}</h2>
            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 mt-1">
              OFFICER ROLE
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400">Department</span>
            <span className="text-white font-semibold">Public Works Department</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400">Email Address</span>
            <span className="text-white font-mono">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400">Smart Contract Wallet</span>
            <span className="text-indigo-400 font-mono font-bold">
              {account ? formatAddress(account) : formatAddress(user?.wallet_address || "0x90F79bf6EB2c4f870365E785982E1f101E93b906")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
