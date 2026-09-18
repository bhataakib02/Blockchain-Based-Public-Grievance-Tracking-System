import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, PlusCircle, FileText, Clock, ShieldCheck, 
  UserCheck, Users, Building, Tag, Sliders, AlertTriangle, 
  BarChart2, Activity, Settings, Bell, User
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'CITIZEN';

  const navItems = {
    CITIZEN: [
      { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/citizen/submit', label: 'Submit Grievance', icon: PlusCircle },
      { to: '/citizen/grievances', label: 'My Grievances', icon: FileText },
      { to: '/citizen/notifications', label: 'Notifications', icon: Bell },
      { to: '/citizen/profile', label: 'My Profile', icon: User },
    ],
    OFFICER: [
      { to: '/officer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/officer/assigned', label: 'Assigned Cases', icon: UserCheck },
      { to: '/officer/escalated', label: 'Escalated Cases', icon: AlertTriangle },
      { to: '/officer/notifications', label: 'Notifications', icon: Bell },
      { to: '/officer/profile', label: 'Officer Profile', icon: User },
    ],
    DEPARTMENT_ADMIN: [
      { to: '/department/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/department/grievances', label: 'Dept Grievances', icon: FileText },
      { to: '/department/assign', label: 'Assign Officers', icon: UserCheck },
      { to: '/department/officers', label: 'Officer Workload', icon: Users },
      { to: '/department/sla', label: 'SLA Monitoring', icon: Clock },
      { to: '/department/escalations', label: 'Escalations', icon: AlertTriangle },
      { to: '/department/analytics', label: 'Dept Analytics', icon: BarChart2 },
      { to: '/department/notifications', label: 'Notifications', icon: Bell },
    ],
    SUPER_ADMIN: [
      { to: '/admin/dashboard', label: 'Admin Overview', icon: LayoutDashboard },
      { to: '/admin/users', label: 'User Directory', icon: Users },
      { to: '/admin/roles', label: 'Role Permissions', icon: ShieldCheck },
      { to: '/admin/departments', label: 'Departments', icon: Building },
      { to: '/admin/categories', label: 'Categories', icon: Tag },
      { to: '/admin/sla', label: 'SLA Policies', icon: Sliders },
      { to: '/admin/escalations', label: 'Escalation Rules', icon: AlertTriangle },
      { to: '/admin/grievances', label: 'All Grievances', icon: FileText },
      { to: '/admin/analytics', label: 'System Analytics', icon: BarChart2 },
      { to: '/admin/audit-logs', label: 'Audit Logs', icon: Activity },
      { to: '/admin/blockchain', label: 'Blockchain Monitor', icon: ShieldCheck },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ]
  };

  const items = navItems[role] || navItems.CITIZEN;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] p-4">
      {/* Role Header */}
      <div className="mb-6 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Active Workspace</span>
        <span className="text-sm font-bold text-blue-400 flex items-center space-x-1 mt-0.5">
          <span>{role.replace('_', ' ')}</span>
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
