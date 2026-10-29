import { Doctor, Patient, Appointment, TriageQueueItem, Invoice, Notification, User } from '../types/hms';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'Dr. Evelyn Reed (Chief of Hospital)',
    email: 'admin@hospital.org',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 'u-doc-1',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@hospital.org',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    phone: '+1 (555) 345-6789'
  },
  {
    id: 'u-doc-2',
    name: 'Dr. Sophia Chen',
    email: 'sophia.chen@hospital.org',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1594824813511-067b8a74e54a?auto=format&fit=crop&q=80&w=200',
    phone: '+1 (555) 456-7890'
  },
  {
    id: 'u-recep',
    name: 'Emily Watson (Head Receptionist)',
    email: 'reception@hospital.org',
    role: 'receptionist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    phone: '+1 (555) 567-8901'
  },
  {
    id: 'u-pat-1',
    name: 'Alexander Rivera',
    email: 'alex.rivera@gmail.com',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    phone: '+1 (555) 678-9012'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    userId: 'u-doc-1',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@hospital.org',
    specialization: 'Interventional Cardiology',
    department: 'Cardiology',
    consultationFee: 150,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:15 AM', '02:00 PM', '02:30 PM', '03:15 PM'],
    experienceYears: 14,
    rating: 4.9,
    roomNumber: 'Cardio Suite 302',
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'doc-2',
    userId: 'u-doc-2',
    name: 'Dr. Sophia Chen',
    email: 'sophia.chen@hospital.org',
    specialization: 'Neurology & Neurophysiology',
    department: 'Neurology',
    consultationFee: 160,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    availableSlots: ['09:30 AM', '10:00 AM', '11:00 AM', '01:30 PM', '02:30 PM', '04:00 PM'],
    experienceYears: 11,
    rating: 4.8,
    roomNumber: 'Neuro Suite 405',
    status: 'in-consultation',
    avatar: 'https://images.unsplash.com/photo-1594824813511-067b8a74e54a?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'doc-3',
    userId: 'u-doc-3',
    name: 'Dr. Tariq Al-Mansoor',
    email: 'tariq.mansoor@hospital.org',
    specialization: 'Pediatric Care & Neonatology',
    department: 'Pediatrics',
    consultationFee: 120,
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    availableSlots: ['08:30 AM', '09:15 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:00 PM'],
    experienceYears: 9,
    rating: 4.95,
    roomNumber: 'Pediatrics Wing 110',
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'doc-4',
    userId: 'u-doc-4',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@hospital.org',
    specialization: 'Orthopedics & Joint Reconstruction',
    department: 'Orthopedics',
    consultationFee: 140,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['10:00 AM', '10:45 AM', '11:30 AM', '02:15 PM', '03:30 PM'],
    experienceYears: 16,
    rating: 4.7,
    roomNumber: 'Orthopedic Clinic 215',
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'doc-5',
    userId: 'u-doc-5',
    name: 'Dr. James Mitchell',
    email: 'james.mitchell@hospital.org',
    specialization: 'Internal Medicine & Critical Care',
    department: 'General Medicine',
    consultationFee: 110,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
    experienceYears: 18,
    rating: 4.85,
    roomNumber: 'OPD Hall A-12',
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    userId: 'u-pat-1',
    name: 'Alexander Rivera',
    email: 'alex.rivera@gmail.com',
    dateOfBirth: '1988-04-14',
    age: 38,
    gender: 'Male',
    bloodGroup: 'O+',
    contactNumber: '+1 (555) 678-9012',
    address: '742 Evergreen Terrace, Springfield, OR',
    emergencyContact: {
      name: 'Maria Rivera',
      relationship: 'Spouse',
      phone: '+1 (555) 678-9013'
    },
    knownAllergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Hypertension stage 1', 'Mild asthma'],
    recentVitals: {
      bloodPressure: '128/82',
      heartRate: 74,
      temperature: 98.6,
      spO2: 99,
      respiratoryRate: 16,
      weightKg: 78.5,
      heightCm: 178,
      recordedAt: '2026-10-28 10:15 AM'
    }
  },
  {
    id: 'pat-2',
    userId: 'u-pat-2',
    name: 'Beatriz Santos',
    email: 'beatriz.santos@outlook.com',
    dateOfBirth: '1995-11-20',
    age: 30,
    gender: 'Female',
    bloodGroup: 'A+',
    contactNumber: '+1 (555) 789-0123',
    address: '144 Maple Avenue, Apt 4B, Seattle, WA',
    emergencyContact: {
      name: 'Carlos Santos',
      relationship: 'Brother',
      phone: '+1 (555) 789-0124'
    },
    knownAllergies: ['Aspirin'],
    chronicConditions: ['Migraine with aura'],
    recentVitals: {
      bloodPressure: '115/75',
      heartRate: 68,
      temperature: 98.4,
      spO2: 100,
      respiratoryRate: 14,
      weightKg: 62.0,
      heightCm: 165,
      recordedAt: '2026-10-29 08:45 AM'
    }
  },
  {
    id: 'pat-3',
    userId: 'u-pat-3',
    name: 'David Kim',
    email: 'david.kim@gmail.com',
    dateOfBirth: '1976-02-18',
    age: 50,
    gender: 'Male',
    bloodGroup: 'B+',
    contactNumber: '+1 (555) 890-1234',
    address: '88 Riverfront Blvd, Austin, TX',
    emergencyContact: {
      name: 'Grace Kim',
      relationship: 'Daughter',
      phone: '+1 (555) 890-1235'
    },
    knownAllergies: ['Latex'],
    chronicConditions: ['Type 2 Diabetes', 'Hyperlipidemia'],
    recentVitals: {
      bloodPressure: '135/88',
      heartRate: 82,
      temperature: 99.1,
      spO2: 97,
      respiratoryRate: 18,
      weightKg: 85.0,
      heightCm: 172,
      recordedAt: '2026-10-29 09:10 AM'
    }
  },
  {
    id: 'pat-4',
    userId: 'u-pat-4',
    name: 'Charlotte Dubois',
    email: 'charlotte.d@yahoo.com',
    dateOfBirth: '2019-07-03',
    age: 7,
    gender: 'Female',
    bloodGroup: 'AB+',
    contactNumber: '+1 (555) 901-2345',
    address: '32 Pinecrest Way, Denver, CO',
    emergencyContact: {
      name: 'Jean-Luc Dubois',
      relationship: 'Father',
      phone: '+1 (555) 901-2346'
    },
    knownAllergies: ['Peanuts'],
    chronicConditions: ['None'],
    recentVitals: {
      bloodPressure: '100/65',
      heartRate: 92,
      temperature: 101.2,
      spO2: 98,
      respiratoryRate: 22,
      weightKg: 24.5,
      heightCm: 122,
      recordedAt: '2026-10-29 09:30 AM'
    }
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patientId: 'pat-1',
    patientName: 'Alexander Rivera',
    patientAge: 38,
    patientGender: 'Male',
    patientPhone: '+1 (555) 678-9012',
    doctorId: 'doc-1',
    doctorName: 'Dr. Marcus Vance',
    department: 'Cardiology',
    appointmentDate: '2026-10-29',
    timeSlot: '09:30 AM',
    reason: 'Follow-up for chest tightness and routine ECG review',
    triagePriority: 'medium',
    status: 'in-consultation',
    tokenNumber: 1,
    fee: 150,
    paymentStatus: 'paid'
  },
  {
    id: 'apt-102',
    patientId: 'pat-2',
    patientName: 'Beatriz Santos',
    patientAge: 30,
    patientGender: 'Female',
    patientPhone: '+1 (555) 789-0123',
    doctorId: 'doc-2',
    doctorName: 'Dr. Sophia Chen',
    department: 'Neurology',
    appointmentDate: '2026-10-29',
    timeSlot: '10:00 AM',
    reason: 'Recurring hemiplegic migraine episodes and aura symptoms',
    triagePriority: 'high',
    status: 'checked-in',
    tokenNumber: 2,
    fee: 160,
    paymentStatus: 'paid'
  },
  {
    id: 'apt-103',
    patientId: 'pat-3',
    patientName: 'David Kim',
    patientAge: 50,
    patientGender: 'Male',
    patientPhone: '+1 (555) 890-1234',
    doctorId: 'doc-5',
    doctorName: 'Dr. James Mitchell',
    department: 'General Medicine',
    appointmentDate: '2026-10-29',
    timeSlot: '11:00 AM',
    reason: 'Quarterly diabetic lipid checkup & fasting glucose review',
    triagePriority: 'low',
    status: 'confirmed',
    tokenNumber: 3,
    fee: 110,
    paymentStatus: 'insurance-pending'
  },
  {
    id: 'apt-104',
    patientId: 'pat-4',
    patientName: 'Charlotte Dubois',
    patientAge: 7,
    patientGender: 'Female',
    patientPhone: '+1 (555) 901-2345',
    doctorId: 'doc-3',
    doctorName: 'Dr. Tariq Al-Mansoor',
    department: 'Pediatrics',
    appointmentDate: '2026-10-29',
    timeSlot: '11:30 AM',
    reason: 'Acute fever (101.2°F), dry barking cough, and fatigue for 2 days',
    triagePriority: 'high',
    status: 'checked-in',
    tokenNumber: 4,
    fee: 120,
    paymentStatus: 'paid'
  },
  {
    id: 'apt-105',
    patientId: 'pat-1',
    patientName: 'Alexander Rivera',
    patientAge: 38,
    patientGender: 'Male',
    patientPhone: '+1 (555) 678-9012',
    doctorId: 'doc-4',
    doctorName: 'Dr. Elena Rostova',
    department: 'Orthopedics',
    appointmentDate: '2026-10-31',
    timeSlot: '02:15 PM',
    reason: 'Right knee arthroscopy follow-up examination',
    triagePriority: 'low',
    status: 'confirmed',
    tokenNumber: 8,
    fee: 140,
    paymentStatus: 'unpaid'
  }
];

export const INITIAL_QUEUE: TriageQueueItem[] = [
  {
    id: 'q-1',
    tokenNumber: 1,
    patientName: 'Alexander Rivera',
    patientId: 'pat-1',
    doctorName: 'Dr. Marcus Vance',
    doctorId: 'doc-1',
    department: 'Cardiology',
    priority: 'urgent',
    status: 'in-room',
    arrivalTime: '09:12 AM',
    room: 'Room 302'
  },
  {
    id: 'q-2',
    tokenNumber: 2,
    patientName: 'Beatriz Santos',
    patientId: 'pat-2',
    doctorName: 'Dr. Sophia Chen',
    doctorId: 'doc-2',
    department: 'Neurology',
    priority: 'critical',
    status: 'called',
    arrivalTime: '09:25 AM',
    room: 'Room 405'
  },
  {
    id: 'q-3',
    tokenNumber: 3,
    patientName: 'David Kim',
    patientId: 'pat-3',
    doctorName: 'Dr. James Mitchell',
    doctorId: 'doc-5',
    department: 'General Medicine',
    priority: 'standard',
    status: 'waiting',
    arrivalTime: '09:40 AM',
    room: 'Waiting Hall A'
  },
  {
    id: 'q-4',
    tokenNumber: 4,
    patientName: 'Charlotte Dubois',
    patientId: 'pat-4',
    doctorName: 'Dr. Tariq Al-Mansoor',
    doctorId: 'doc-3',
    department: 'Pediatrics',
    priority: 'urgent',
    status: 'waiting',
    arrivalTime: '09:48 AM',
    room: 'Pediatrics Wing'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Emergency Triage Alert',
    message: 'Patient Beatriz Santos arrived with severe migraine aura; triage code Yellow.',
    type: 'emergency',
    timestamp: '10 min ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Appointment Checked In',
    message: 'Alexander Rivera has checked in for Dr. Marcus Vance in Cardio Suite 302.',
    type: 'appointment',
    timestamp: '25 min ago',
    read: true
  },
  {
    id: 'notif-3',
    title: 'Lab Results Ready',
    message: 'Lipid panel & HbA1c for David Kim processed by Central Pathology Lab.',
    type: 'lab',
    timestamp: '1 hour ago',
    read: true
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'INV-2026-0089',
    patientId: 'pat-1',
    patientName: 'Alexander Rivera',
    date: '2026-10-29',
    services: [
      { description: 'Cardiology Specialist Consultation', amount: 150 },
      { description: '12-Lead Electrocardiogram (ECG)', amount: 65 },
      { description: 'Blood Pressure Monitoring Profile', amount: 25 }
    ],
    totalAmount: 240,
    status: 'paid',
    paymentMethod: 'Credit Card (Visa ending in 4092)'
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'INV-2026-0090',
    patientId: 'pat-2',
    patientName: 'Beatriz Santos',
    date: '2026-10-29',
    services: [
      { description: 'Neurology Consultation', amount: 160 },
      { description: 'Ophthalmic Neurological Exam', amount: 75 }
    ],
    totalAmount: 235,
    status: 'paid',
    paymentMethod: 'Insurance Co-pay (Aetna Health)'
  },
  {
    id: 'inv-1003',
    invoiceNumber: 'INV-2026-0091',
    patientId: 'pat-3',
    patientName: 'David Kim',
    date: '2026-10-29',
    services: [
      { description: 'Comprehensive Metabolic Panel (CMP)', amount: 80 },
      { description: 'HbA1c Glycated Hemoglobin Test', amount: 45 },
      { description: 'General Practice Consultation', amount: 110 }
    ],
    totalAmount: 235,
    status: 'pending',
    paymentMethod: 'BlueCross Direct Billing'
  }
];

export const HOSPITAL_METRICS = {
  bedTotal: 250,
  bedsOccupied: 212,
  icuBedsAvailable: 4,
  icuBedsTotal: 24,
  dailyAdmissions: 28,
  dailyDischarges: 19,
  emergencySurgeriesActive: 3,
  pharmacyStockStatus: '98.4% In Stock',
  averageWaitTimeMinutes: 14
};
