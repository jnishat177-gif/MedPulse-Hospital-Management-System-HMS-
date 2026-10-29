import React, { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Activity, Bell, UserCheck, AlertOctagon, 
  RefreshCw, Menu, X, ShieldAlert,
  ChevronDown, Stethoscope, User, Calendar
} from 'lucide-react';
import { UserRole } from '../types/hms';

interface NavbarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, sidebarOpen }) => {
  const { 
    currentUser, switchRole, notifications, 
    markNotificationAsRead, simulateLiveEmergency, resetAllHospitalData,
    activeTab, setActiveTab
  } = useHospital();

  const [time, setTime] = useState<string>('');
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.read);

  const roleLabels: Record<UserRole, { label: string; icon: typeof User; color: string }> = {
    admin: { label: 'Administrator', icon: ShieldAlert, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    doctor: { label: 'Physician', icon: Stethoscope, color: 'bg-teal-100 text-teal-800 border-teal-200' },
    receptionist: { label: 'Reception / Triage', icon: Calendar, color: 'bg-sky-100 text-sky-800 border-sky-200' },
    patient: { label: 'Patient Portal', icon: User, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => setActiveTab('admin')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">MediPulse</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-teal-50 text-teal-700 border border-teal-200/60">
                  HMS v4.2
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium -mt-0.5">
                Unified Clinical Operations & Real-Time Hospital Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Clock & Real-time Indicator (Hidden on small mobile) */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-700 font-semibold">Live System</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-slate-800">{time}</span>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Simulation: Code Red Emergency Button */}
          <button
            onClick={() => {
              simulateLiveEmergency();
              setActiveTab('doctor');
            }}
            title="Simulate Inbound Emergency Trauma Case"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span className="hidden sm:inline">Simulate</span> Code Red
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${roleLabels[currentUser.role].color} shadow-2xs hover:shadow-xs`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="font-semibold hidden md:inline">Role:</span>
              <span>{roleLabels[currentUser.role].label}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Switch Testing Role
                </div>
                {(['admin', 'doctor', 'receptionist', 'patient'] as UserRole[]).map((r) => {
                  const item = roleLabels[r];
                  const Icon = item.icon;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                        currentUser.role === r 
                          ? 'bg-teal-50 text-teal-800 font-semibold' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span>{item.label}</span>
                      {currentUser.role === r && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-xs text-slate-900">Hospital Notifications</span>
                  <span className="text-[11px] text-teal-600 font-medium">
                    {unreadNotifs.length} new
                  </span>
                </div>

                <div className="space-y-2">
                  {notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        notif.read ? 'bg-slate-50 text-slate-600' : 'bg-teal-50/70 border border-teal-100 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold ${notif.type === 'emergency' ? 'text-rose-600' : 'text-slate-900'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo appointments and queue data to initial factory state?')) {
                resetAllHospitalData();
              }
            }}
            title="Reset Hospital Data"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
