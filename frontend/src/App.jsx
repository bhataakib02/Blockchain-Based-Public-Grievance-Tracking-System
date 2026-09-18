import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Web3Provider } from './context/Web3Context';
import { Navbar } from './components/Navbar';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { About } from './pages/public/About';
import { HowItWorks } from './pages/public/HowItWorks';
import { PublicTrack } from './pages/public/PublicTrack';
import { BlockchainVerification } from './pages/public/BlockchainVerification';
import { PublicStats } from './pages/public/PublicStats';
import { FAQ } from './pages/public/FAQ';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { SubmitGrievance } from './pages/citizen/SubmitGrievance';
import { CitizenGrievanceList } from './pages/citizen/CitizenGrievanceList';
import { CitizenGrievanceDetail } from './pages/citizen/CitizenGrievanceDetail';
import { CitizenNotifications } from './pages/citizen/CitizenNotifications';
import { CitizenProfile } from './pages/citizen/CitizenProfile';

// Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { OfficerAssigned } from './pages/officer/OfficerAssigned';
import { OfficerGrievanceDetail } from './pages/officer/OfficerGrievanceDetail';
import { OfficerEscalated } from './pages/officer/OfficerEscalated';
import { OfficerNotifications } from './pages/officer/OfficerNotifications';
import { OfficerProfile } from './pages/officer/OfficerProfile';

// Department Admin Pages
import { DepartmentDashboard } from './pages/department/DepartmentDashboard';
import { DepartmentGrievances } from './pages/department/DepartmentGrievances';
import { AssignOfficer } from './pages/department/AssignOfficer';
import { OfficerWorkload } from './pages/department/OfficerWorkload';
import { DepartmentSLA } from './pages/department/DepartmentSLA';
import { DepartmentEscalations } from './pages/department/DepartmentEscalations';
import { DepartmentAnalytics } from './pages/department/DepartmentAnalytics';
import { DepartmentNotifications } from './pages/department/DepartmentNotifications';

// Super Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { RoleManagement } from './pages/admin/RoleManagement';
import { DepartmentManagement } from './pages/admin/DepartmentManagement';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { SLAManagement } from './pages/admin/SLAManagement';
import { EscalationRules } from './pages/admin/EscalationRules';
import { AllGrievances } from './pages/admin/AllGrievances';
import { SystemAnalytics } from './pages/admin/SystemAnalytics';
import { AuditLogs } from './pages/admin/AuditLogs';
import { BlockchainMonitor } from './pages/admin/BlockchainMonitor';
import { SystemSettings } from './pages/admin/SystemSettings';

export function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <Routes>
          {/* Public Routes with Top Navbar */}
          <Route path="/" element={
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <LandingPage />
              </main>
            </div>
          } />

          <Route path="/about" element={
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"><About /></main>
            </div>
          } />

          <Route path="/how-it-works" element={
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"><HowItWorks /></main>
            </div>
          } />

          <Route path="/track" element={
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"><PublicTrack /></main>
            </div>
          } />

          <Route path="/blockchain-verification" element={
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"><BlockchainVerification /></main>
            </div>
          } />

          <Route path="/public-statistics" element={
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"><PublicStats /></main>
            </div>
          } />

          <Route path="/faq" element={
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"><FAQ /></main>
            </div>
          } />

          <Route path="/contact" element={
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"><Contact /></main>
            </div>
          } />

          <Route path="/login" element={
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"><Login /></main>
            </div>
          } />

          <Route path="/register" element={
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"><Register /></main>
            </div>
          } />

          {/* Role Dashboard Layout Routes */}
          <Route element={<DashboardLayout />}>
            {/* Citizen Workspace */}
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
            <Route path="/citizen/submit" element={<SubmitGrievance />} />
            <Route path="/citizen/grievances" element={<CitizenGrievanceList />} />
            <Route path="/citizen/grievances/:id" element={<CitizenGrievanceDetail />} />
            <Route path="/citizen/notifications" element={<CitizenNotifications />} />
            <Route path="/citizen/profile" element={<CitizenProfile />} />

            {/* Officer Workspace */}
            <Route path="/officer/dashboard" element={<OfficerDashboard />} />
            <Route path="/officer/assigned" element={<OfficerAssigned />} />
            <Route path="/officer/grievances/:id" element={<OfficerGrievanceDetail />} />
            <Route path="/officer/escalated" element={<OfficerEscalated />} />
            <Route path="/officer/notifications" element={<OfficerNotifications />} />
            <Route path="/officer/profile" element={<OfficerProfile />} />

            {/* Department Admin Workspace */}
            <Route path="/department/dashboard" element={<DepartmentDashboard />} />
            <Route path="/department/grievances" element={<DepartmentGrievances />} />
            <Route path="/department/assign" element={<AssignOfficer />} />
            <Route path="/department/officers" element={<OfficerWorkload />} />
            <Route path="/department/sla" element={<DepartmentSLA />} />
            <Route path="/department/escalations" element={<DepartmentEscalations />} />
            <Route path="/department/analytics" element={<DepartmentAnalytics />} />
            <Route path="/department/notifications" element={<DepartmentNotifications />} />

            {/* Super Admin Workspace */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/roles" element={<RoleManagement />} />
            <Route path="/admin/departments" element={<DepartmentManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/sla" element={<SLAManagement />} />
            <Route path="/admin/escalations" element={<EscalationRules />} />
            <Route path="/admin/grievances" element={<AllGrievances />} />
            <Route path="/admin/analytics" element={<SystemAnalytics />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
            <Route path="/admin/blockchain" element={<BlockchainMonitor />} />
            <Route path="/admin/settings" element={<SystemSettings />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
