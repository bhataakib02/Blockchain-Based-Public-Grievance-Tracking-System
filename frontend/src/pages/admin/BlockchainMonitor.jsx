import React from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Cpu, Shield, Wallet, ExternalLink, CheckCircle2 } from 'lucide-react';
import { formatAddress } from '../../utils/hashUtils';

export const BlockchainMonitor = () => {
  const { account, chainId, contractAddresses } = useWeb3();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Smart Contract Architecture & Addresses</h1>
        <p className="text-xs text-slate-400">Deployed Solidity smart contract addresses and RPC node status.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-500 font-sans uppercase font-bold text-[10px] block">Network Chain ID</span>
          <span className="text-emerald-400 font-bold">{chainId || 31337} (Localhost / Hardhat / Sepolia)</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-500 font-sans uppercase font-bold text-[10px] block">Connected Wallet Account</span>
          <span className="text-blue-400 font-bold">{account ? formatAddress(account) : 'Not Connected'}</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Contract Address Directory</h2>
        <div className="space-y-3 font-mono text-xs">
          {Object.entries(contractAddresses).map(([name, addr]) => (
            <div key={name} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-sans font-bold block">{name}.sol</span>
                <span className="text-blue-400 break-all">{addr}</span>
              </div>
              <span className="px-2 py-1 bg-emerald-950 text-emerald-400 rounded text-[10px] font-sans font-bold border border-emerald-800 shrink-0">
                ACTIVE
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
