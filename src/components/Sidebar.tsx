import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  LayoutDashboard, Stethoscope, ClipboardList, 
  User, CreditCard, BookOpen, Bed, Users, 
  ChevronRight, Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, queue, hospitalMetrics } = useHospital();

  const navItems = [
    {
      id: 'admin' as const,
      label: 'Admin Executive',
      sublabel: 'KPIs, Staff & Capacity',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'doctor' as const,
      label: 'Doctor Workspace',
      sublabel: 'Consultation & Prescriptions',
      icon: Stethoscope,
      badge: 'Clinical'
    },
    {
      id: 'receptionist' as const,
      label: 'Reception & Triage',
      sublabel: 'Walk-ins & Live Queue',
      icon: ClipboardList,
      badge: `${queue.filter(q => q.status !== 'done').length} Active`
    },
    {
      id: 'patient' as const,
      label: 'Patient Portal',
      sublabel: 'Doctors & Appointments',
      icon: User,
      badge: null
    },
    {
      id: 'pharmacy' as const,
      label: 'Billing & Pharmacy',
      sublabel: 'Invoices & Medication Rx',
      icon: CreditCard,
      badge: null
    },
    {
      id: 'report' as const,
      label: '50-Page Project Dossier',
      sublabel: 'Full Technical & Architecture Report',
      icon: BookOpen,
      badge: '50 Pages',
      featured: true
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-16 left-0 z-45 w-72 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Section: Operational Portals */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Hospital Operations
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                MERN HMS
              </span>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all group ${
                      isActive 
                        ? 'bg-teal-50 text-teal-900 font-semibold shadow-xs border border-teal-200/60'
                        : item.featured
                          ? 'bg-linear-to-r from-amber-50/70 to-teal-50/50 text-slate-800 hover:bg-teal-50/40 border border-amber-200/60'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-teal-600 text-white shadow-2xs' 
                        : item.featured
                          ? 'bg-amber-100 text-amber-800 group-hover:bg-amber-200'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                            item.featured 
                              ? 'bg-amber-500 text-white' 
                              : isActive 
                                ? 'bg-teal-200 text-teal-900' 
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">
                        {item.sublabel}
                      </p>
                    </div>

                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-teal-600 translate-x-0.5' : 'text-slate-300 opacity-0 group-hover:opacity-100'
                    }`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Real-Time Capacity Telemetry */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-teal-600" />
                Bed Capacity
              </span>
              <span className="font-mono text-teal-700">
                {Math.round((hospitalMetrics.bedsOccupied / hospitalMetrics.bedTotal) * 100)}%
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-teal-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(hospitalMetrics.bedsOccupied / hospitalMetrics.bedTotal) * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{hospitalMetrics.bedsOccupied} Occupied</span>
              <span>{hospitalMetrics.bedTotal - hospitalMetrics.bedsOccupied} Free</span>
            </div>
          </div>
        </div>

        {/* Bottom Report Callout Card */}
        <div className="mt-4 p-3 bg-linear-to-br from-slate-900 to-teal-950 text-white rounded-xl shadow-md border border-teal-800/40">
          <div className="flex items-center gap-2 mb-1.5 text-amber-400 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Capstone Dossier</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            Complete 50-page academic report with Word (.docx) & PDF export options ready for submission.
          </p>
          <button
            onClick={() => {
              setActiveTab('report');
              onClose();
            }}
            className="w-full py-1.5 px-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs text-center transition-colors shadow-xs"
          >
            Open 50-Page Dossier
          </button>
        </div>
      </aside>
    </>
  );
};
