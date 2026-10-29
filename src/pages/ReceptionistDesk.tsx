import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { RealtimeQueueBoard } from '../components/RealtimeQueueBoard';
import { 
  ClipboardList, UserPlus, CheckCircle2, Search, 
  Clock, ShieldAlert, ArrowRight, User
} from 'lucide-react';

export const ReceptionistDesk: React.FC = () => {
  const { doctors, appointments, updateAppointmentStatus, registerWalkIn } = useHospital();

  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Walk-in form state
  const [name, setName] = useState('');
  const [age, setAge] = useState(32);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('+1 (555) ');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const [reason, setReason] = useState('');
  const [triagePriority, setTriagePriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [allergies, setAllergies] = useState('');

  const handleRegisterWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !doctorId) return;

    registerWalkIn(
      {
        name,
        email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
        dateOfBirth: '1994-05-10',
        age: Number(age),
        gender,
        bloodGroup,
        contactNumber: phone,
        address: 'Walk-In Registration, Metro Area',
        emergencyContact: {
          name: 'Next of Kin',
          relationship: 'Family',
          phone: phone
        },
        knownAllergies: allergies ? allergies.split(',').map(a => a.trim()) : [],
        chronicConditions: []
      },
      {
        doctorId,
        reason: reason || 'Walk-in general consultation',
        triagePriority
      }
    );

    setShowWalkInModal(false);
    setName('');
    setReason('');
    setAllergies('');
  };

  const filteredAppointments = appointments.filter(a => 
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Front Desk & Triage Reception</h2>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
              Check-In Desk
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Rapid walk-in intake, triage priority assignment, queue token generation, and patient check-in.
          </p>
        </div>

        <button
          onClick={() => setShowWalkInModal(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Walk-In Patient</span>
        </button>
      </div>

      {/* Live Outpatient Queue Monitor Component */}
      <RealtimeQueueBoard />

      {/* Scheduled Appointments Check-In Table */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-teal-600" />
              Scheduled Intake Directory
            </h3>
            <p className="text-xs text-slate-400">Click Check-In when patient arrives at the front desk</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Token</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Doctor & Specialty</th>
                <th className="py-2.5 px-3">Slot Time</th>
                <th className="py-2.5 px-3">Triage Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    #{appt.tokenNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{appt.patientName}</span>
                    <span className="text-[11px] text-slate-400">{appt.patientPhone}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block">{appt.doctorName}</span>
                    <span className="text-[11px] text-teal-700">{appt.department}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {appt.timeSlot}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      appt.triagePriority === 'critical' ? 'bg-rose-100 text-rose-800' :
                      appt.triagePriority === 'high' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {appt.triagePriority.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      appt.status === 'confirmed' ? 'bg-sky-100 text-sky-800' :
                      appt.status === 'checked-in' ? 'bg-amber-100 text-amber-800' :
                      appt.status === 'in-consultation' ? 'bg-teal-100 text-teal-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {appt.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {appt.status === 'confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(appt.id, 'checked-in')}
                        className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] rounded-lg border border-teal-200 transition-colors"
                      >
                        Check-In Patient
                      </button>
                    )}
                    {appt.status === 'checked-in' && (
                      <span className="text-slate-400 text-[11px] italic">In Queue</span>
                    )}
                    {appt.status === 'completed' && (
                      <span className="text-emerald-600 text-[11px] font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Walk-in Registration Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Walk-In Patient Registration</h3>
            <p className="text-xs text-slate-500 mb-4">Immediate triage intake and instant token issuance.</p>

            <form onSubmit={handleRegisterWalkIn} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Gonzalez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assign Doctor & Department</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-800"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.department} (Fee: ${d.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Triage Priority Assessment</label>
                <select
                  value={triagePriority}
                  onChange={(e) => setTriagePriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900"
                >
                  <option value="low">Standard / Low (Green Code)</option>
                  <option value="medium">Medium Urgency (Yellow Code)</option>
                  <option value="high">High Urgency (Orange Code)</option>
                  <option value="critical">Critical / Severe (Red Code)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Chief Presenting Complaint</label>
                <input
                  type="text"
                  placeholder="e.g. Acute abdominal pain for 4 hours"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Known Drug Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa (or None)"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Issue Token & Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
