import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  User, Calendar, Stethoscope, Search, 
  Clock, CheckCircle2, AlertCircle, FileText, 
  Pill, ArrowRight, Star
} from 'lucide-react';
import { Doctor } from '../types/hms';

export const PatientPortal: React.FC = () => {
  const { doctors, appointments, patients, bookAppointment, consultations } = useHospital();

  // Active patient profile (Alexander Rivera by default)
  const activePatient = patients[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [targetDoctor, setTargetDoctor] = useState<Doctor | null>(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('2026-10-30');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [bookingFeedback, setBookingFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // My appointments
  const myAppointments = appointments.filter(a => a.patientId === activePatient.id);
  const myConsultations = consultations.filter(c => c.patientId === activePatient.id);

  const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const openBooking = (doc: Doctor) => {
    setTargetDoctor(doc);
    setSelectedSlot(doc.availableSlots[0] || '09:00 AM');
    setBookingFeedback(null);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDoctor || !selectedSlot) return;

    const result = bookAppointment({
      patientId: activePatient.id,
      patientName: activePatient.name,
      patientAge: activePatient.age,
      patientGender: activePatient.gender,
      patientPhone: activePatient.contactNumber,
      doctorId: targetDoctor.id,
      doctorName: targetDoctor.name,
      department: targetDoctor.department,
      appointmentDate: bookingDate,
      timeSlot: selectedSlot,
      reason: reason || 'Routine specialist consultation',
      triagePriority: 'low',
      fee: targetDoctor.consultationFee,
      paymentStatus: 'paid'
    });

    setBookingFeedback(result);
    if (result.success) {
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingFeedback(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Welcome Card */}
      <div className="p-6 bg-linear-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            Patient Self-Service Portal
          </span>
          <h1 className="text-2xl font-extrabold mt-2">Welcome back, {activePatient.name}</h1>
          <p className="text-xs text-emerald-100/80 mt-1">
            MRN: #{activePatient.id} • Blood Group: {activePatient.bloodGroup} • Age: {activePatient.age}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs text-xs text-center border border-white/10">
            <span className="block font-bold text-lg text-emerald-300">{myAppointments.length}</span>
            <span className="text-[11px] text-slate-300">Total Visits</span>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs text-xs text-center border border-white/10">
            <span className="block font-bold text-lg text-emerald-300">{myAppointments.filter(a => a.status === 'confirmed').length}</span>
            <span className="text-[11px] text-slate-300">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Main Tabs / Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Doctor Catalog & Booking (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  Find a Doctor & Book Appointment
                </h3>
                <p className="text-xs text-slate-400">Real-time schedule availability and slot booking</p>
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">All Specialties</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Doctor Cards */}
            <div className="space-y-3">
              {filteredDoctors.map(doc => (
                <div key={doc.id} className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{doc.name}</h4>
                        <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" /> {doc.rating}
                        </span>
                      </div>
                      <p className="text-xs text-teal-700 font-semibold">{doc.specialization}</p>
                      <p className="text-[11px] text-slate-400">{doc.department} • Room {doc.roomNumber} • Fee ${doc.consultationFee}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openBooking(doc)}
                    className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Visit</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: My Personal Health Records (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* My Scheduled Visits */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              My Appointments ({myAppointments.length})
            </h3>

            <div className="space-y-2.5">
              {myAppointments.map(appt => (
                <div key={appt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 block">{appt.doctorName}</span>
                      <span className="text-[11px] text-teal-700 font-medium">{appt.department}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      appt.status === 'confirmed' ? 'bg-sky-100 text-sky-800' :
                      appt.status === 'in-consultation' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                      appt.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {appt.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{appt.appointmentDate} @ {appt.timeSlot}</span>
                    <span className="font-bold text-slate-900">Token #{appt.tokenNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vitals Summary Card */}
          {activePatient.recentVitals && (
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Latest Vitals Reading
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                  <span className="font-bold text-sm text-slate-900">{activePatient.recentVitals.bloodPressure} mmHg</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                  <span className="font-bold text-sm text-slate-900">{activePatient.recentVitals.heartRate} bpm</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">SpO2 Oxygen</span>
                  <span className="font-bold text-sm text-teal-700">{activePatient.recentVitals.spO2}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Temperature</span>
                  <span className="font-bold text-sm text-slate-900">{activePatient.recentVitals.temperature}°F</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Booking Modal with Slot Conflict Guard */}
      {showBookingModal && targetDoctor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Schedule Appointment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Booking with <span className="font-bold text-teal-700">{targetDoctor.name}</span> ({targetDoctor.department})
            </p>

            {bookingFeedback && (
              <div className={`p-3 rounded-xl mb-4 text-xs flex items-start gap-2 border ${
                bookingFeedback.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {bookingFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{bookingFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  min="2026-10-29"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Available 30-Min Time Interval</label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                  {targetDoctor.availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-1.5 px-2.5 rounded-lg border font-mono text-xs font-semibold transition-all ${
                        selectedSlot === slot 
                          ? 'bg-teal-600 text-white border-teal-600 shadow-2xs' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Visit / Symptoms</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Follow up on cholesterol, seasonal chest cough..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-600">Specialist Consultation Fee</span>
                <span className="font-extrabold text-slate-900 text-sm">${targetDoctor.consultationFee}</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Confirm & Reserve Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
