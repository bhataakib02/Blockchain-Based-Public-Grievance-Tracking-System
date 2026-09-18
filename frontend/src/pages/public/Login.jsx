import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('citizen.rahul@gmail.com');
  const [password, setPassword] = useState('DemoPassword123!');
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const loggedUser = await login(email, password);
      const role = loggedUser.role;
      if (role === 'SUPER_ADMIN') navigate('/admin/dashboard');
      else if (role === 'DEPARTMENT_ADMIN') navigate('/department/dashboard');
      else if (role === 'OFFICER') navigate('/officer/dashboard');
      else navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  const handleQuickDemoUser = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('DemoPassword123!');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/40">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sign In to Portal</h1>
          <p className="text-xs text-slate-400">Access your role-specific grievance dashboard</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Quick Demo Sign In Helpers */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Quick Demo Logins:</span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemoUser('citizen.rahul@gmail.com', 'CITIZEN')}
              className="py-1 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 text-left truncate"
            >
              👤 Citizen User
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoUser('officer.kumar@grievance.gov.in', 'OFFICER')}
              className="py-1 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 text-left truncate"
            >
              👮 Officer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoUser('deptadmin.pwd@grievance.gov.in', 'DEPARTMENT_ADMIN')}
              className="py-1 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 text-left truncate"
            >
              🏢 Dept Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoUser('superadmin@grievance.gov.in', 'SUPER_ADMIN')}
              className="py-1 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 text-left truncate"
            >
              ⚡ Super Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account? <Link to="/register" className="text-blue-400 font-semibold hover:underline">Register Citizen Account</Link>
        </p>

      </div>
    </div>
  );
};
