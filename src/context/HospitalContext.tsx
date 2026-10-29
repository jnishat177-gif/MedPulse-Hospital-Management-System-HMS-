import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, Doctor, Patient, Appointment, TriageQueueItem, 
  Invoice, Notification, ConsultationRecord, UserRole, AppointmentStatus 
} from '../types/hms';
import { 
  INITIAL_USERS, INITIAL_DOCTORS, INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, INITIAL_QUEUE, INITIAL_NOTIFICATIONS, 
  INITIAL_INVOICES, HOSPITAL_METRICS 
} from '../data/mockData';

interface HospitalContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  queue: TriageQueueItem[];
  notifications: Notification[];
  invoices: Invoice[];
  consultations: ConsultationRecord[];
  hospitalMetrics: typeof HOSPITAL_METRICS;
  bookAppointment: (data: Omit<Appointment, 'id' | 'tokenNumber' | 'status'>) => { success: boolean; message: string; appointment?: Appointment };
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  advanceQueue: (queueId: string) => void;
  callQueueToken: (queueId: string) => void;
  saveConsultation: (record: Omit<ConsultationRecord, 'id' | 'date'>) => void;
  registerWalkIn: (patientData: Omit<Patient, 'id' | 'userId'>, appointmentData: { doctorId: string; reason: string; triagePriority: 'low' | 'medium' | 'high' | 'critical' }) => Appointment;
  simulateLiveEmergency: () => void;
  markNotificationAsRead: (id: string) => void;
  resetAllHospitalData: () => void;
  activeTab: 'admin' | 'doctor' | 'receptionist' | 'patient' | 'pharmacy' | 'report';
  setActiveTab: (tab: 'admin' | 'doctor' | 'receptionist' | 'patient' | 'pharmacy' | 'report') => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEY = 'medipulse_hms_state_v1';

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial seed
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return INITIAL_USERS[0]; // Admin by default
  });

  const [activeTab, setActiveTab] = useState<'admin' | 'doctor' | 'receptionist' | 'patient' | 'pharmacy' | 'report'>('admin');

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_doctors`);
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_patients`);
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_appointments`);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [queue, setQueue] = useState<TriageQueueItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_queue`);
    return saved ? JSON.parse(saved) : INITIAL_QUEUE;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [consultations, setConsultations] = useState<ConsultationRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_consultations`);
    return saved ? JSON.parse(saved) : [];
  });

  const [hospitalMetrics] = useState(HOSPITAL_METRICS);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_doctors`, JSON.stringify(doctors));
      localStorage.setItem(`${STORAGE_KEY}_patients`, JSON.stringify(patients));
      localStorage.setItem(`${STORAGE_KEY}_appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY}_queue`, JSON.stringify(queue));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY}_consultations`, JSON.stringify(consultations));
    } catch {
      // storage full fallback
    }
  }, [doctors, patients, appointments, queue, notifications, invoices, consultations]);

  // Multi-tab BroadcastChannel listener
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('medipulse_realtime_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'STATE_REFRESH') {
          // reload from storage
          const savedAppts = localStorage.getItem(`${STORAGE_KEY}_appointments`);
          if (savedAppts) setAppointments(JSON.parse(savedAppts));
          const savedQueue = localStorage.getItem(`${STORAGE_KEY}_queue`);
          if (savedQueue) setQueue(JSON.parse(savedQueue));
          const savedNotifs = localStorage.getItem(`${STORAGE_KEY}_notifications`);
          if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
        }
      };
      return () => channel.close();
    }
  }, []);

  const broadcastStateChange = () => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('medipulse_realtime_channel');
      channel.postMessage({ type: 'STATE_REFRESH', timestamp: Date.now() });
      channel.close();
    }
  };

  const switchRole = (role: UserRole) => {
    const targetUser = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(targetUser);
    if (role === 'admin') setActiveTab('admin');
    else if (role === 'doctor') setActiveTab('doctor');
    else if (role === 'receptionist') setActiveTab('receptionist');
    else if (role === 'patient') setActiveTab('patient');
  };

  // Appointment booking with slot conflict detection
  const bookAppointment = (data: Omit<Appointment, 'id' | 'tokenNumber' | 'status'>) => {
    // 1. Conflict check: doctor + date + slot
    const existingConflict = appointments.find(
      a => a.doctorId === data.doctorId &&
           a.appointmentDate === data.appointmentDate &&
           a.timeSlot === data.timeSlot &&
           a.status !== 'cancelled'
    );

    if (existingConflict) {
      return {
        success: false,
        message: `Dr. ${data.doctorName} is already booked for ${data.timeSlot} on ${data.appointmentDate}. Please choose another interval.`
      };
    }

    const nextToken = appointments.filter(a => a.appointmentDate === data.appointmentDate).length + 1;
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      tokenNumber: nextToken,
      status: 'confirmed'
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Push notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'New Appointment Booked',
      message: `${data.patientName} scheduled with ${data.doctorName} for ${data.timeSlot}.`,
      type: 'appointment',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    broadcastStateChange();
    return { success: true, message: 'Appointment successfully confirmed!', appointment: newAppointment };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status };
      }
      return a;
    }));

    // If checked in, ensure queue item exists
    if (status === 'checked-in') {
      const targetAppt = appointments.find(a => a.id === id);
      if (targetAppt && !queue.some(q => q.patientId === targetAppt.patientId && q.status !== 'done')) {
        const queuePriority = targetAppt.triagePriority === 'critical' ? 'critical' : targetAppt.triagePriority === 'high' ? 'urgent' : 'standard';
        const newQueueItem: TriageQueueItem = {
          id: `q-${Date.now()}`,
          tokenNumber: targetAppt.tokenNumber,
          patientName: targetAppt.patientName,
          patientId: targetAppt.patientId,
          doctorName: targetAppt.doctorName,
          doctorId: targetAppt.doctorId,
          department: targetAppt.department,
          priority: queuePriority,
          status: 'waiting',
          arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          room: doctors.find(d => d.id === targetAppt.doctorId)?.roomNumber || 'Waiting Hall A'
        };
        setQueue(prev => [...prev, newQueueItem]);
      }
    }

    broadcastStateChange();
  };

  const advanceQueue = (queueId: string) => {
    setQueue(prev => prev.map(item => {
      if (item.id === queueId) {
        const nextStatus = item.status === 'waiting' ? 'called' : item.status === 'called' ? 'in-room' : 'done';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
    broadcastStateChange();
  };

  const callQueueToken = (queueId: string) => {
    const item = queue.find(q => q.id === queueId);
    if (item) {
      setQueue(prev => prev.map(q => q.id === queueId ? { ...q, status: 'called' } : q));
      const notif: Notification = {
        id: `call-${Date.now()}`,
        title: `Calling Token #${item.tokenNumber}`,
        message: `Patient ${item.patientName} please proceed to ${item.room} (${item.doctorName})`,
        type: 'queue',
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
      broadcastStateChange();
    }
  };

  const saveConsultation = (record: Omit<ConsultationRecord, 'id' | 'date'>) => {
    const consultationId = `cn-${Date.now()}`;
    const newRecord: ConsultationRecord = {
      ...record,
      id: consultationId,
      date: new Date().toISOString()
    };

    setConsultations(prev => [newRecord, ...prev]);

    // Update appointment status to completed
    setAppointments(prev => prev.map(a => {
      if (a.id === record.appointmentId) {
        return { ...a, status: 'completed', consultationId };
      }
      return a;
    }));

    // Update queue status to done
    setQueue(prev => prev.map(q => {
      if (q.patientId === record.patientId) {
        return { ...q, status: 'done' };
      }
      return q;
    }));

    // Generate pharmacy / billing invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: record.patientId,
      patientName: patients.find(p => p.id === record.patientId)?.name || 'Patient',
      date: new Date().toISOString().split('T')[0],
      services: [
        { description: `Consultation (${record.doctorName})`, amount: 150 },
        ...(record.prescriptions.map(p => ({ description: `Rx: ${p.medicineName} (${p.dosage})`, amount: 25 }))),
        ...(record.labTestsOrdered.map(t => ({ description: `Lab Order: ${t}`, amount: 60 })))
      ],
      totalAmount: 150 + (record.prescriptions.length * 25) + (record.labTestsOrdered.length * 60),
      status: 'paid',
      paymentMethod: 'Direct Health System Account'
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Update patient recent vitals
    setPatients(prev => prev.map(p => {
      if (p.id === record.patientId) {
        return { ...p, recentVitals: record.vitals };
      }
      return p;
    }));

    broadcastStateChange();
  };

  const registerWalkIn = (
    patientData: Omit<Patient, 'id' | 'userId'>,
    appointmentData: { doctorId: string; reason: string; triagePriority: 'low' | 'medium' | 'high' | 'critical' }
  ) => {
    const patientId = `pat-${Date.now()}`;
    const newPatient: Patient = {
      ...patientData,
      id: patientId,
      userId: `u-walkin-${Date.now()}`
    };

    setPatients(prev => [...prev, newPatient]);

    const targetDoc = doctors.find(d => d.id === appointmentData.doctorId) || doctors[0];
    const todayStr = new Date().toISOString().split('T')[0];
    const nextToken = appointments.filter(a => a.appointmentDate === todayStr).length + 1;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: patientId,
      patientName: patientData.name,
      patientAge: patientData.age,
      patientGender: patientData.gender,
      patientPhone: patientData.contactNumber,
      doctorId: targetDoc.id,
      doctorName: targetDoc.name,
      department: targetDoc.department,
      appointmentDate: todayStr,
      timeSlot: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reason: appointmentData.reason,
      triagePriority: appointmentData.triagePriority,
      status: 'checked-in',
      tokenNumber: nextToken,
      fee: targetDoc.consultationFee,
      paymentStatus: 'paid'
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Add to queue
    const queuePriority = appointmentData.triagePriority === 'critical' ? 'critical' : appointmentData.triagePriority === 'high' ? 'urgent' : 'standard';
    const newQueueItem: TriageQueueItem = {
      id: `q-${Date.now()}`,
      tokenNumber: nextToken,
      patientName: patientData.name,
      patientId: patientId,
      doctorName: targetDoc.name,
      doctorId: targetDoc.id,
      department: targetDoc.department,
      priority: queuePriority,
      status: 'waiting',
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: targetDoc.roomNumber
    };

    setQueue(prev => [...prev, newQueueItem]);

    const notif: Notification = {
      id: `walkin-${Date.now()}`,
      title: 'Walk-In Patient Registered',
      message: `${patientData.name} assigned Token #${nextToken} for ${targetDoc.name}`,
      type: 'queue',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    broadcastStateChange();
    return newAppointment;
  };

  const simulateLiveEmergency = () => {
    const emergencyPatient: Patient = {
      id: `pat-emg-${Date.now()}`,
      userId: `u-emg-${Date.now()}`,
      name: 'James O’Connor (Trauma Inbound)',
      email: 'emergency@hospital.org',
      dateOfBirth: '1984-06-12',
      age: 42,
      gender: 'Male',
      bloodGroup: 'O-',
      contactNumber: '+1 (555) 911-0001',
      address: 'Route 101 Motorway Crash Site',
      emergencyContact: {
        name: 'Paramedic Squad 4',
        relationship: 'First Responder',
        phone: '+1 (555) 911-0002'
      },
      knownAllergies: ['None Disclosed'],
      chronicConditions: ['Acute Blunt Chest Trauma'],
      recentVitals: {
        bloodPressure: '88/50',
        heartRate: 124,
        temperature: 97.9,
        spO2: 91,
        respiratoryRate: 28,
        weightKg: 82,
        heightCm: 182,
        recordedAt: 'Just now'
      }
    };

    setPatients(prev => [emergencyPatient, ...prev]);

    const token = appointments.length + 1;
    const emergencyAppt: Appointment = {
      id: `apt-emg-${Date.now()}`,
      patientId: emergencyPatient.id,
      patientName: emergencyPatient.name,
      patientAge: emergencyPatient.age,
      patientGender: emergencyPatient.gender,
      patientPhone: emergencyPatient.contactNumber,
      doctorId: 'doc-1',
      doctorName: 'Dr. Marcus Vance',
      department: 'Cardiology & Trauma',
      appointmentDate: new Date().toISOString().split('T')[0],
      timeSlot: 'STAT Emergency',
      reason: 'Motor vehicle accident, tachycardic, hypotensive, acute chest contusion',
      triagePriority: 'critical',
      status: 'in-consultation',
      tokenNumber: token,
      fee: 300,
      paymentStatus: 'insurance-pending'
    };

    setAppointments(prev => [emergencyAppt, ...prev]);

    const emergencyQueueItem: TriageQueueItem = {
      id: `q-emg-${Date.now()}`,
      tokenNumber: token,
      patientName: emergencyPatient.name,
      patientId: emergencyPatient.id,
      doctorName: 'Dr. Marcus Vance',
      doctorId: 'doc-1',
      department: 'Emergency & Cardiology',
      priority: 'critical',
      status: 'in-room',
      arrivalTime: 'STAT Now',
      room: 'Emergency Resus Bay 1'
    };

    setQueue(prev => [emergencyQueueItem, ...prev]);

    const notif: Notification = {
      id: `notif-emg-${Date.now()}`,
      title: '🚨 CODE RED: Inbound Trauma Patient',
      message: 'Critical trauma admission in Resus Bay 1. Cardiology team paged STAT.',
      type: 'emergency',
      timestamp: 'Just now',
      read: false
    };

    setNotifications(prev => [notif, ...prev]);
    broadcastStateChange();
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const resetAllHospitalData = () => {
    localStorage.clear();
    setDoctors(INITIAL_DOCTORS);
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setQueue(INITIAL_QUEUE);
    setNotifications(INITIAL_NOTIFICATIONS);
    setInvoices(INITIAL_INVOICES);
    setConsultations([]);
    setCurrentUser(INITIAL_USERS[0]);
    setActiveTab('admin');
  };

  return (
    <HospitalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        doctors,
        patients,
        appointments,
        queue,
        notifications,
        invoices,
        consultations,
        hospitalMetrics,
        bookAppointment,
        updateAppointmentStatus,
        advanceQueue,
        callQueueToken,
        saveConsultation,
        registerWalkIn,
        simulateLiveEmergency,
        markNotificationAsRead,
        resetAllHospitalData,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
