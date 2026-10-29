import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './pages/AdminDashboard';
import { DoctorPortal } from './pages/DoctorPortal';
import { ReceptionistDesk } from './pages/ReceptionistDesk';
import { PatientPortal } from './pages/PatientPortal';
import { PharmacyBilling } from './pages/PharmacyBilling';
import { ReportViewer } from './pages/ReportViewer';

const MainContent: React.FC = () => {
  const { activeTab } = useHospital();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      {/* Main Body Grid */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Responsive Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'admin' && <AdminDashboard />}
          {activeTab === 'doctor' && <DoctorPortal />}
          {activeTab === 'receptionist' && <ReceptionistDesk />}
          {activeTab === 'patient' && <PatientPortal />}
          {activeTab === 'pharmacy' && <PharmacyBilling />}
          {activeTab === 'report' && <ReportViewer />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainContent />
    </HospitalProvider>
  );
}
