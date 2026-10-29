import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Stethoscope, Clock, AlertTriangle, 
  Plus, Trash2, Printer, CheckCircle2, User,
  Heart, Activity, Thermometer, ShieldAlert, FileText, ChevronRight
} from 'lucide-react';
import { Appointment, PrescriptionItem, PatientVitals } from '../types/hms';

export const DoctorPortal: React.FC = () => {
  const { 
    doctors, appointments, patients, updateAppointmentStatus, 
    saveConsultation, consultations 
  } = useHospital();

  // Selected doctor workspace
  const [selectedDocId, setSelectedDocId] = useState<string>(doctors[0]?.id || 'doc-1');
  const activeDoctor = doctors.find(d => d.id === selectedDocId) || doctors[0];

  // Active consultation state
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [activePatientData, setActivePatientData] = useState<any>(null);

  // Consultation form fields
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [symptomsInput, setSymptomsInput] = useState('Chest tightness, shortness of breath upon exertion');
  const [vitals, setVitals] = useState<PatientVitals>({
    bloodPressure: '124/80',
    heartRate: 76,
    temperature: 98.6,
    spO2: 99,
    respiratoryRate: 16,
    weightKg: 78,
    heightCm: 178,
    recordedAt: 'Just now'
  });

  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      medicineName: 'Atorvastatin',
      dosage: '20 mg',
      frequency: 'Once daily at bedtime',
      durationDays: 30,
      instructions: 'Take after dinner. Monitor for muscle tenderness.'
    }
  ]);

  const [labTests, setLabTests] = useState<string[]>(['12-Lead Electrocardiogram (ECG)']);
  const [showSignedModal, setShowSignedModal] = useState(false);
  const [lastSavedRecord, setLastSavedRecord] = useState<any>(null);

  // Filter appointments for selected doctor
  const docAppointments = appointments.filter(a => a.doctorId === activeDoctor.id);

  const startConsultation = (appt: Appointment) => {
    setActiveAppointment(appt);
    const pat = patients.find(p => p.id === appt.patientId);
    setActivePatientData(pat || null);
    updateAppointmentStatus(appt.id, 'in-consultation');
    
    // Seed initial vitals from patient if available
    if (pat?.recentVitals) {
      setVitals(pat.recentVitals);
    }
  };

  const addPrescriptionRow = () => {
    setPrescriptions(prev => [
      ...prev,
      {
        medicineName: '',
        dosage: '10 mg',
        frequency: 'Once daily after breakfast',
        durationDays: 14,
        instructions: 'Take with plenty of water.'
      }
    ]);
  };

  const removePrescriptionRow = (index: number) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const toggleLabTest = (test: string) => {
    setLabTests(prev => 
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppointment) return;

    const recordData = {
      appointmentId: activeAppointment.id,
      patientId: activeAppointment.patientId,
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      symptoms: symptomsInput.split(',').map(s => s.trim()).filter(Boolean),
      diagnosis: diagnosis || 'Clinical evaluation and routine outpatient follow-up',
      clinicalNotes: clinicalNotes || 'Patient examined. Vitals within standard physiological limits.',
      vitals: vitals,
      prescriptions: prescriptions.filter(p => p.medicineName.trim().length > 0),
      labTestsOrdered: labTests,
      followUpDate: 'In 3 weeks'
    };

    saveConsultation(recordData);
    setLastSavedRecord(recordData);
    setShowSignedModal(true);
  };

  const availableLabTests = [
    '12-Lead Electrocardiogram (ECG)',
    'Comprehensive Metabolic Panel (CMP)',
    'Complete Blood Count (CBC)',
    'Lipid Profile & Atherosclerosis Risk',
    'HbA1c Glycated Hemoglobin',
    'Chest X-Ray (PA View)',
    'Brain MRI with Contrast'
  ];

  return (
    <div className="space-y-6">
      {/* Doctor Header / Selector */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={activeDoctor.avatar}
            alt={activeDoctor.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{activeDoctor.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                {activeDoctor.department}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {activeDoctor.specialization} • Room {activeDoctor.roomNumber} • Fee ${activeDoctor.consultationFee}
            </p>
          </div>
        </div>

        {/* Doctor Switcher for Testing */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Change Doctor View:</span>
          <select
            value={selectedDocId}
            onChange={(e) => {
              setSelectedDocId(e.target.value);
              setActiveAppointment(null);
            }}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-hidden focus:border-teal-500"
          >
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Assigned Patients (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                Today's Consultations ({docAppointments.length})
              </h3>
              <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">
                Room {activeDoctor.roomNumber}
              </span>
            </div>

            {docAppointments.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No appointments scheduled for this physician today.
              </div>
            ) : (
              <div className="space-y-2.5">
                {docAppointments.map((appt) => {
                  const isSelected = activeAppointment?.id === appt.id;
                  const isCritical = appt.triagePriority === 'critical';
                  return (
                    <div
                      key={appt.id}
                      onClick={() => startConsultation(appt)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-teal-500 bg-teal-50/70 shadow-xs ring-2 ring-teal-500/20' 
                          : isCritical
                            ? 'border-rose-300 bg-rose-50/40 hover:border-rose-400'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 text-teal-400 font-mono font-bold text-xs flex items-center justify-center">
                            #{appt.tokenNumber}
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-900">{appt.patientName}</h4>
                            <p className="text-[11px] text-slate-500">{appt.patientAge} yrs • {appt.patientGender}</p>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          appt.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                          appt.status === 'in-consultation' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          'bg-teal-100 text-teal-800'
                        }`}>
                          {appt.status.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="mt-2 text-slate-600 text-[11px] line-clamp-1">
                        <span className="font-medium text-slate-400">Chief Complaint:</span> {appt.reason}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-500">{appt.timeSlot}</span>
                        <span className="text-teal-700 font-bold flex items-center gap-1">
                          {isSelected ? 'Active File' : 'Open Workspace'}
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Clinical Examination Workspace (8 cols) */}
        <div className="lg:col-span-8">
          {activeAppointment ? (
            <form onSubmit={handleFinalize} className="space-y-5">
              {/* Patient Banner & Allergy Warning */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">
                        {activeAppointment.patientName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Patient ID: #{activeAppointment.patientId} • Age: {activeAppointment.patientAge} • Sex: {activeAppointment.patientGender}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-mono">Token #{activeAppointment.tokenNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                      In-Consultation
                    </span>
                  </div>
                </div>

                {/* Clinical Safety Alert: Allergies */}
                {activePatientData?.knownAllergies?.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">KNOWN DRUG ALLERGIES: </span>
                      <span className="font-semibold">{activePatientData.knownAllergies.join(', ')}</span>
                      <p className="text-[11px] text-rose-700 mt-0.5">
                        Exercise extreme caution when prescribing antibiotic or NSAID compounds.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Vitals Telemetry Input Cards */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Clinical Vitals Telemetry
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-slate-500 font-medium block mb-1">Blood Pressure</label>
                    <input
                      type="text"
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                      placeholder="120/80"
                      className="w-full font-mono font-bold text-sm bg-white px-2 py-1 border border-slate-200 rounded"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">mmHg</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-slate-500 font-medium block mb-1">Heart Rate</label>
                    <input
                      type="number"
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                      className="w-full font-mono font-bold text-sm bg-white px-2 py-1 border border-slate-200 rounded"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">bpm</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-slate-500 font-medium block mb-1">Temperature</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                      className="w-full font-mono font-bold text-sm bg-white px-2 py-1 border border-slate-200 rounded"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">°F</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-slate-500 font-medium block mb-1">Oxygen Saturation</label>
                    <input
                      type="number"
                      value={vitals.spO2}
                      onChange={(e) => setVitals({ ...vitals, spO2: Number(e.target.value) })}
                      className="w-full font-mono font-bold text-sm bg-white px-2 py-1 border border-slate-200 rounded"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">% SpO2</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis & Clinical Notes */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  Clinical Assessment & Diagnosis
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Presenting Symptoms</label>
                    <input
                      type="text"
                      value={symptomsInput}
                      onChange={(e) => setSymptomsInput(e.target.value)}
                      placeholder="Comma-separated symptoms..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Primary Clinical Diagnosis (ICD-10)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stage 1 Essential Hypertension (I10) with mild exertional angina"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-900 text-xs focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Clinical Evaluation Notes</label>
                    <textarea
                      rows={3}
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      placeholder="Cardiovascular exam normal S1/S2, no murmurs. Lungs clear to auscultation. Recommended dietary sodium restriction..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Digital Prescription Builder */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    Digital Prescription Builder (Rx)
                  </h4>
                  <button
                    type="button"
                    onClick={addPrescriptionRow}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {prescriptions.map((rx, idx) => (
                    <div key={idx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end text-xs">
                      <div className="sm:col-span-4">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Medicine & Salt</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Lisinopril or Amoxicillin"
                          value={rx.medicineName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPrescriptions(prev => prev.map((item, i) => i === idx ? { ...item, medicineName: val } : item));
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-semibold text-slate-800"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Dosage</label>
                        <input
                          type="text"
                          placeholder="e.g. 10 mg"
                          value={rx.dosage}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPrescriptions(prev => prev.map((item, i) => i === idx ? { ...item, dosage: val } : item));
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Frequency</label>
                        <select
                          value={rx.frequency}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPrescriptions(prev => prev.map((item, i) => i === idx ? { ...item, frequency: val } : item));
                          }}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded"
                        >
                          <option value="Once daily after breakfast">Once daily after breakfast</option>
                          <option value="Once daily at bedtime">Once daily at bedtime</option>
                          <option value="Twice daily after meals">Twice daily after meals</option>
                          <option value="Three times daily (TDS)">Three times daily (TDS)</option>
                          <option value="As needed for severe pain (PRN)">As needed for severe pain (PRN)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Days</label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={rx.durationDays}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPrescriptions(prev => prev.map((item, i) => i === idx ? { ...item, durationDays: val } : item));
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removePrescriptionRow(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Laboratory Diagnostic Test Orders */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Order Diagnostic Laboratory & Imaging Tests
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {availableLabTests.map(test => {
                    const checked = labTests.includes(test);
                    return (
                      <label 
                        key={test} 
                        className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          checked ? 'bg-teal-50/80 border-teal-300 text-teal-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleLabTest(test)}
                          className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                        />
                        <span>{test}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveAppointment(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close File
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalize Consultation & Sign Rx Slip</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
              <Stethoscope className="w-16 h-16 text-teal-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-slate-900">Clinical Consultation Room</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Select an outpatient from today's schedule on the left to review medical history, enter diagnostic findings, and issue signed digital prescriptions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Prescription Slip Modal / Print View */}
      {showSignedModal && lastSavedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header of Prescription */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  Rx
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">MediPulse Medical Center</h3>
                  <p className="text-xs text-slate-500">Official Clinical Electronic Prescription Record</p>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold text-teal-700 block">{lastSavedRecord.doctorName}</span>
                <span className="text-slate-400">Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Patient Details */}
            <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div><span className="text-slate-400">Diagnosis:</span> <p className="font-bold text-slate-900">{lastSavedRecord.diagnosis}</p></div>
              <div><span className="text-slate-400">BP / Heart Rate:</span> <p className="font-mono text-slate-800">{lastSavedRecord.vitals.bloodPressure} | {lastSavedRecord.vitals.heartRate} bpm</p></div>
              <div><span className="text-slate-400">SpO2 / Temp:</span> <p className="font-mono text-slate-800">{lastSavedRecord.vitals.spO2}% | {lastSavedRecord.vitals.temperature}°F</p></div>
            </div>

            {/* Prescriptions List */}
            <div className="my-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Prescribed Medications</h4>
              <div className="space-y-2">
                {lastSavedRecord.prescriptions.map((p: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{p.medicineName} ({p.dosage})</span>
                      <span className="text-teal-700">{p.durationDays} Days</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{p.frequency}</p>
                    {p.instructions && <p className="text-slate-400 text-[10px] italic mt-0.5">Note: {p.instructions}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Orders */}
            {lastSavedRecord.labTestsOrdered?.length > 0 && (
              <div className="my-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">Laboratory Orders</h4>
                <p className="text-xs text-slate-800 font-medium">{lastSavedRecord.labTestsOrdered.join(' • ')}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Digitally Signed & Saved to Hospital EHR
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSignedModal(false);
                    setActiveAppointment(null);
                  }}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
