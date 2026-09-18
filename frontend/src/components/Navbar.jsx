import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { Shield, Wallet, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { formatAddress } from '../utils/hashUtils';

export const Navbar = () => {
  const { user, logout, switchRoleDemo } = useAuth();
  const { account, connectWallet, connecting } = useWeb3();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Public Grievance
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-blue-400 uppercase">
              Blockchain Verified
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <Link to="/about" className="hover:text-blue-400 transition-colors">About</Link>
          <Link to="/how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link>
          <Link to="/track" className="hover:text-blue-400 transition-colors">Public Track</Link>
          <Link to="/blockchain-verification" className="hover:text-blue-400 transition-colors">Blockchain Verify</Link>
          <Link to="/public-statistics" className="hover:text-blue-400 transition-colors">Statistics</Link>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-4">
          
          {/* Wallet Button */}
          <button
            onClick={connectWallet}
            disabled={connecting}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>{account ? formatAddress(account) : (connecting ? 'Connecting...' : 'Connect Wallet')}</span>
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Role Switcher Demo Dropdown */}
              <select
                value={user.role}
                onChange={(e) => switchRoleDemo(e.target.value)}
                className="bg-slate-800 text-xs font-semibold text-blue-300 border border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
                title="Switch Role for Demo"
              >
                <option value="CITIZEN">Role: Citizen</option>
                <option value="OFFICER">Role: Officer</option>
                <option value="DEPARTMENT_ADMIN">Role: Dept Admin</option>
                <option value="SUPER_ADMIN">Role: Super Admin</option>
              </select>

              {/* Notification icon */}
              <Link to={`/${user.role.toLowerCase()}/notifications`} className="p-2 text-slate-400 hover:text-slate-200 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              </Link>

              {/* User Avatar */}
              <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center border border-blue-500/40 text-xs">
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-rose-400 transition" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition">Login</Link>
              <Link to="/register" className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition shadow-md shadow-blue-600/20">Register</Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
