import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';
import { User, Mail, Phone, Wallet, Shield } from 'lucide-react';
import { formatAddress } from '../../utils/hashUtils';

export const CitizenProfile = () => {
  const { user } = useAuth();
  const { account, connectWallet } = useWeb3();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Citizen Profile</h1>
        <p className="text-xs text-slate-400">Manage your profile details and bound Web3 MetaMask wallet.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/30 text-blue-400 font-extrabold text-2xl flex items-center justify-center border border-blue-500/40">
            {user?.full_name?.charAt(0) || 'C'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.full_name || 'Citizen User'}</h2>
            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 mt-1">
              CITIZEN ROLE
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-slate-400">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Email Address</span>
            </div>
            <span className="text-white font-mono">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-slate-400">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>Phone Number</span>
            </div>
            <span className="text-white">+91 9876543215</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-slate-400">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Bound Wallet Address</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">
              {account ? formatAddress(account) : formatAddress(user?.wallet_address || "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc")}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={connectWallet}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            Reconnect / Switch MetaMask Account
          </button>
        </div>
      </div>
    </div>
  );
};
