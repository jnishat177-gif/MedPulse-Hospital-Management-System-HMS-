export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string;
  department: string;
  consultationFee: number;
  availableDays: string[];
  availableSlots: string[];
  experienceYears: number;
  rating: number;
  roomNumber: string;
  status: 'available' | 'in-consultation' | 'off-duty';
  avatar: string;
}

export interface PatientVitals {
  bloodPressure: string; // e.g. "120/80"
  heartRate: number; // bpm
  temperature: number; // °F
  spO2: number; // %
  respiratoryRate: number; // breaths/min
  weightKg: number;
  heightCm: number;
  recordedAt: string;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string; // "Once daily", "Twice daily after meals", etc.
  durationDays: number;
  instructions: string;
}

export interface ConsultationRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  symptoms: string[];
  diagnosis: string;
  clinicalNotes: string;
  vitals: PatientVitals;
  prescriptions: PrescriptionItem[];
  labTestsOrdered: string[];
  followUpDate?: string;
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  email: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  contactNumber: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  knownAllergies: string[];
  chronicConditions: string[];
  recentVitals?: PatientVitals;
}

export type AppointmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'checked-in'
  | 'in-consultation'
  | 'completed'
  | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  reason: string;
  triagePriority: 'low' | 'medium' | 'high' | 'critical';
  status: AppointmentStatus;
  tokenNumber: number;
  notes?: string;
  consultationId?: string;
  fee: number;
  paymentStatus: 'paid' | 'unpaid' | 'insurance-pending';
}

export interface TriageQueueItem {
  id: string;
  tokenNumber: number;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  department: string;
  priority: 'critical' | 'urgent' | 'standard';
  status: 'waiting' | 'called' | 'in-room' | 'done';
  arrivalTime: string;
  room: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'appointment' | 'queue' | 'system' | 'lab';
  timestamp: string;
  read: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  date: string;
  services: {
    description: string;
    amount: number;
  }[];
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'pending';
  paymentMethod?: string;
}
