import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { StatCard } from '../components/StatCard';
import { RealtimeQueueBoard } from '../components/RealtimeQueueBoard';
import { 
  Users, Stethoscope, Calendar, DollarSign, 
  Bed, Plus, Search, CheckCircle, 
  Clock, Activity, Sparkles, Building2
} from 'lucide-react';
import { Doctor } from '../types/hms';

export const AdminDashboard: React.FC = () => {
  const { doctors, patients, appointments, hospitalMetrics } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);

  // New Doctor Form State
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocDept, setNewDocDept] = useState('Cardiology');
  const [newDocFee, setNewDocFee] = useState(150);
  const [newDocRoom, setNewDocRoom] = useState('Suite 201');

  const todayStr = '2026-10-29';
  const todayAppointments = appointments.filter(a => a.appointmentDate === todayStr || a.appointmentDate.startsWith('2026-10-29'));
  const completedToday = todayAppointments.filter(a => a.status === 'completed').length;
  const inConsultation = todayAppointments.filter(a => a.status === 'in-consultation').length;
  const totalRevenue = appointments.filter(a => a.paymentStatus === 'paid').reduce((acc, a) => acc + a.fee, 2840);

  const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      userId: `u-${Date.now()}`,
      name: newDocName.startsWith('Dr.') ? newDocName : `Dr. ${newDocName}`,
      email: `${newDocName.toLowerCase().replace(/[^a-z]/g, '')}@hospital.org`,
      specialization: newDocSpecialty || 'General Practice',
      department: newDocDept,
      consultationFee: Number(newDocFee),
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
      experienceYears: 5,
      rating: 5.0,
      roomNumber: newDocRoom,
      status: 'available',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
    };
    doctors.push(newDoc);
    setShowAddDoctorModal(false);
    setNewDocName('');
    setNewDocSpecialty('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-teal-800 via-teal-900 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hospital Operations & Clinical Analytics
          </h1>
          <p className="mt-2 text-sm text-teal-100/90 leading-relaxed">
            Real-time multi-department monitoring: bed telemetry, daily outpatient surge, doctor rostering, and revenue reconciliation.
          </p>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Patients"
          value={patients.length + 1240}
          subtitle="42 new outpatient intake today"
          trend="+8.4%"
          trendUp={true}
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Active Doctors on Duty"
          value={doctors.filter(d => d.status !== 'off-duty').length}
          subtitle={`Across ${departments.length} clinical specialties`}
          trend="100% on duty"
          trendUp={true}
          icon={Stethoscope}
          color="sky"
        />
        <StatCard
          title="Today's Outpatient Visits"
          value={todayAppointments.length}
          subtitle={`${completedToday} completed, ${inConsultation} in progress`}
          trend="+14%"
          trendUp={true}
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title="Daily Billed Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle="Consultations & diagnostics"
          trend="+11.2%"
          trendUp={true}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Real-time Outpatient Queue Board Section */}
      <RealtimeQueueBoard />

      {/* Hospital Capacity & Department Load Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bed Occupancy Card */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Bed className="w-4 h-4 text-teal-600" />
              Inpatient Bed Occupancy
            </h3>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              {hospitalMetrics.bedsOccupied} / {hospitalMetrics.bedTotal} Beds
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>General Wards</span>
                <span className="font-bold">85% Occupied</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Intensive Care Unit (ICU)</span>
                <span className="font-bold text-rose-600">
                  {hospitalMetrics.icuBedsTotal - hospitalMetrics.icuBedsAvailable} / {hospitalMetrics.icuBedsTotal} Beds
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '83%' }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {hospitalMetrics.icuBedsAvailable} critical ICU beds currently available.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Pediatrics Ward</span>
                <span className="font-bold text-sky-600">62% Occupied</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              Department Patient Load (Today)
            </h3>
            <span className="text-xs text-slate-400 font-medium">Outpatient & Referrals</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'Cardiology', count: 18, doctors: 2, color: 'border-l-rose-500' },
              { name: 'Neurology', count: 12, doctors: 1, color: 'border-l-indigo-500' },
              { name: 'Pediatrics', count: 15, doctors: 1, color: 'border-l-amber-500' },
              { name: 'Orthopedics', count: 9, doctors: 1, color: 'border-l-teal-500' },
              { name: 'General Medicine', count: 24, doctors: 2, color: 'border-l-sky-500' },
              { name: 'Emergency Trauma', count: 7, doctors: 3, color: 'border-l-red-600' }
            ].map((dept) => (
              <div key={dept.name} className={`p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 border-l-4 ${dept.color}`}>
                <span className="text-xs font-bold text-slate-800 block truncate">{dept.name}</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-slate-900">{dept.count}</span>
                  <span className="text-[11px] text-slate-500">{dept.doctors} MDs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Roster & Staff Directory */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Doctor Roster & Availability Directory
            </h3>
            <p className="text-xs text-slate-500">Manage clinical specialists, consultation fees, and suite rooms</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search physician..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-700"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Add Doctor Button */}
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Doctor</span>
            </button>
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-xs transition-all bg-white">
              <div className="flex items-start gap-3">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{doc.name}</h4>
                    <span className="text-[11px] font-bold text-amber-500">★ {doc.rating}</span>
                  </div>
                  <p className="text-xs text-teal-700 font-medium truncate">{doc.specialization}</p>
                  <p className="text-[11px] text-slate-400">{doc.department} • {doc.roomNumber}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Consultation Fee</span>
                  <span className="font-bold text-slate-800">${doc.consultationFee}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase block">Experience</span>
                  <span className="font-medium text-slate-700">{doc.experienceYears} Years</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  doc.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                  doc.status === 'in-consultation' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {doc.status.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-500">
                  {doc.availableSlots.length} Slots / Day
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Onboard New Medical Specialist</h3>
            <p className="text-xs text-slate-500 mb-4">Add a physician to the outpatient roster and slot scheduler.</p>

            <form onSubmit={handleAddDoctor} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Physician Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Miller"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Specialty</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical Electrophysiology"
                  value={newDocSpecialty}
                  onChange={(e) => setNewDocSpecialty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newDocDept}
                    onChange={(e) => setNewDocDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden text-slate-700"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    min="50"
                    max="500"
                    value={newDocFee}
                    onChange={(e) => setNewDocFee(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinic Room Number</label>
                <input
                  type="text"
                  placeholder="e.g. Suite 305"
                  value={newDocRoom}
                  onChange={(e) => setNewDocRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors shadow-xs"
                >
                  Save to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
