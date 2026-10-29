import React from 'react';
import { Database, Server, Smartphone, Shield, Clock, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface DiagramProps {
  type: 'mern-architecture' | 'erd' | 'rbac' | 'triage-lifecycle' | 'jwt-flow' | 'queue-state' | 'sprint-timeline' | 'rest-pipeline';
}

export const ArchitecturalDiagrams: React.FC<DiagramProps> = ({ type }) => {
  if (type === 'mern-architecture') {
    return (
      <div className="my-6 p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h4 className="text-lg font-bold text-teal-400 flex items-center gap-2">
              <Server className="w-5 h-5 text-teal-400" />
              Figure 1.1: MERN 3-Tier Architecture & Communication Pipeline
            </h4>
            <p className="text-xs text-slate-400">Decoupled presentation, API middleware gateway, and document persistence</p>
          </div>
          <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-semibold rounded-full border border-teal-500/30">
            TLS 1.3 / JSON / BSON
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Tier 1: Presentation */}
          <div className="p-5 bg-slate-800/90 rounded-lg border border-teal-500/40 relative group">
            <div className="flex items-center gap-2 text-teal-300 font-bold mb-3">
              <Smartphone className="w-5 h-5" />
              <span>TIER 1: PRESENTATION</span>
            </div>
            <div className="text-xs text-slate-300 space-y-2">
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700">
                <span className="font-semibold text-white">React 19 SPA</span>
                <p className="text-slate-400 text-[11px]">Concurrent Mode & VDOM</p>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700">
                <span className="font-semibold text-white">Vite 8 & Tailwind v4</span>
                <p className="text-slate-400 text-[11px]">Instant HMR & Utility Styles</p>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700">
                <span className="font-semibold text-white">HospitalContext Bus</span>
                <p className="text-slate-400 text-[11px]">Multi-role state & BroadcastSync</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-teal-200">
              Output: HTTPS JSON Payloads + Bearer JWT
            </div>
          </div>

          {/* Tier 2: Application API */}
          <div className="p-5 bg-slate-800/90 rounded-lg border border-sky-500/40 relative">
            <div className="flex items-center gap-2 text-sky-300 font-bold mb-3">
              <Server className="w-5 h-5" />
              <span>TIER 2: APPLICATION API</span>
            </div>
            <div className="text-xs text-slate-300 space-y-2">
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700">
                <span className="font-semibold text-white">Node.js 22 + Express 4</span>
                <p className="text-slate-400 text-[11px]">Non-blocking Event Loop</p>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700">
                <span className="font-semibold text-white">Middleware Pipeline</span>
                <p className="text-slate-400 text-[11px]">CORS, Helmet, RateLimit, AuthGuard</p>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700">
                <span className="font-semibold text-white">Business Logic Controllers</span>
                <p className="text-slate-400 text-[11px]">Slot reservation & Triage engine</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-sky-200">
              Output: Mongoose Wire Protocol Queries
            </div>
          </div>

          {/* Tier 3: Persistence */}
          <div className="p-5 bg-slate-800/90 rounded-lg border border-emerald-500/40 relative">
            <div className="flex items-center gap-2 text-emerald-300 font-bold mb-3">
              <Database className="w-5 h-5" />
              <span>TIER 3: PERSISTENCE</span>
            </div>
            <div className="text-xs text-slate-300 space-y-2">
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700">
                <span className="font-semibold text-white">MongoDB Atlas 3-Node</span>
                <p className="text-slate-400 text-[11px]">1 Primary, 2 Secondary Replicas</p>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700">
                <span className="font-semibold text-white">BSON Document Store</span>
                <p className="text-slate-400 text-[11px]">Users, Doctors, Patients, Appointments</p>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-700">
                <span className="font-semibold text-white">Compound Unique Indexes</span>
                <p className="text-slate-400 text-[11px]">Zero race conditions on doctor slots</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-emerald-200">
              Storage: AES-256 Encrypted at Rest
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'erd') {
    return (
      <div className="my-6 p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h4 className="text-lg font-bold text-teal-400 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-400" />
              Figure 2.1: Entity-Relationship Diagram (ERD) & Schema Cardinality
            </h4>
            <p className="text-xs text-slate-400">Foreign key references, subdocument arrays, and indexing strategy</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
            Relational Integrity in NoSQL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* User Collection */}
          <div className="p-4 bg-slate-800/90 rounded border border-slate-700">
            <div className="font-bold text-teal-300 pb-2 border-b border-slate-700 mb-2 flex justify-between">
              <span>Collection: User</span>
              <span className="text-[10px] text-slate-400">[Identity]</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <div><span className="text-amber-400">PK _id</span>: ObjectId</div>
              <div>name: String</div>
              <div>email: String (UNIQUE)</div>
              <div>password: String (bcrypt)</div>
              <div>role: Enum ('admin'|'doctor'...)</div>
              <div>isActive: Boolean</div>
              <div>timestamps: Date</div>
            </div>
          </div>

          {/* Doctor Collection */}
          <div className="p-4 bg-slate-800/90 rounded border border-slate-700">
            <div className="font-bold text-sky-300 pb-2 border-b border-slate-700 mb-2 flex justify-between">
              <span>Collection: Doctor</span>
              <span className="text-[10px] text-slate-400">[1:1 with User]</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <div><span className="text-amber-400">PK _id</span>: ObjectId</div>
              <div><span className="text-sky-400">FK user</span>: ObjectId -&gt; User</div>
              <div>specialization: String</div>
              <div>department: String (INDEX)</div>
              <div>consultationFee: Number</div>
              <div>availableSlots: [String]</div>
              <div>roomNumber: String</div>
              <div>status: Enum ('available'...)</div>
            </div>
          </div>

          {/* Patient Collection */}
          <div className="p-4 bg-slate-800/90 rounded border border-slate-700">
            <div className="font-bold text-emerald-300 pb-2 border-b border-slate-700 mb-2 flex justify-between">
              <span>Collection: Patient</span>
              <span className="text-[10px] text-slate-400">[1:1 with User]</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <div><span className="text-amber-400">PK _id</span>: ObjectId</div>
              <div><span className="text-sky-400">FK user</span>: ObjectId -&gt; User</div>
              <div>dateOfBirth: Date</div>
              <div>bloodGroup: String</div>
              <div>contactNumber: String</div>
              <div>knownAllergies: [String]</div>
              <div>chronicConditions: [String]</div>
              <div>recentVitals: SubDocument</div>
            </div>
          </div>

          {/* Appointment Collection */}
          <div className="p-4 bg-slate-800/90 rounded border border-teal-500/50 md:col-span-2">
            <div className="font-bold text-teal-300 pb-2 border-b border-slate-700 mb-2 flex justify-between">
              <span>Collection: Appointment (Central Junction)</span>
              <span className="text-[10px] text-teal-400">[Compound Index: doctor+date+slot]</span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300">
              <div><span className="text-amber-400">PK _id</span>: ObjectId</div>
              <div><span className="text-sky-400">FK patient</span>: ObjectId -&gt; Patient</div>
              <div><span className="text-sky-400">FK doctor</span>: ObjectId -&gt; Doctor</div>
              <div>appointmentDate: Date</div>
              <div>timeSlot: String</div>
              <div>tokenNumber: Number</div>
              <div>triagePriority: Enum ('low'|'critical')</div>
              <div>status: Enum ('confirmed'|'in-consult'...)</div>
              <div>fee: Number</div>
              <div>paymentStatus: Enum ('paid'|'pending')</div>
            </div>
          </div>

          {/* Consultation Record */}
          <div className="p-4 bg-slate-800/90 rounded border border-slate-700">
            <div className="font-bold text-indigo-300 pb-2 border-b border-slate-700 mb-2 flex justify-between">
              <span>Collection: Consultation</span>
              <span className="text-[10px] text-slate-400">[1:1 Appointment]</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <div><span className="text-amber-400">PK _id</span>: ObjectId</div>
              <div><span className="text-sky-400">FK appointment</span>: ObjectId</div>
              <div>diagnosis: String</div>
              <div>clinicalNotes: String</div>
              <div>prescriptions: [RxItem]</div>
              <div>labTestsOrdered: [String]</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'rbac') {
    return (
      <div className="my-6 p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <h4 className="text-lg font-bold text-teal-400 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-400" />
              Figure 3.1: Role-Based Access Control (RBAC) Permission Matrix
            </h4>
            <p className="text-xs text-slate-400">Granular authorization enforced across endpoints and UI routes</p>
          </div>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-500/30">
            Least-Privilege Enforcement
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="py-2 px-3">System Module / Resource</th>
              <th className="py-2 px-3 text-center">Administrator</th>
              <th className="py-2 px-3 text-center">Doctor</th>
              <th className="py-2 px-3 text-center">Receptionist</th>
              <th className="py-2 px-3 text-center">Patient (Self)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium">
            <tr>
              <td className="py-2 px-3 text-slate-300">Manage Doctors & Roster</td>
              <td className="py-2 px-3 text-center text-emerald-400 font-bold">FULL (CRUD)</td>
              <td className="py-2 px-3 text-center text-amber-400">READ / SELF-EDIT</td>
              <td className="py-2 px-3 text-center text-slate-400">READ ONLY</td>
              <td className="py-2 px-3 text-center text-slate-400">READ ONLY</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-slate-300">Patient Electronic Health Records</td>
              <td className="py-2 px-3 text-center text-emerald-400">FULL READ</td>
              <td className="py-2 px-3 text-center text-emerald-400 font-bold">FULL (READ/WRITE)</td>
              <td className="py-2 px-3 text-center text-amber-400">DEMOGRAPHICS ONLY</td>
              <td className="py-2 px-3 text-center text-sky-400">OWN RECORD ONLY</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-slate-300">Clinical Diagnosis & Prescriptions</td>
              <td className="py-2 px-3 text-center text-rose-400">RESTRICTED</td>
              <td className="py-2 px-3 text-center text-emerald-400 font-bold">AUTHOR (CREATE/SIGN)</td>
              <td className="py-2 px-3 text-center text-rose-400">NO ACCESS</td>
              <td className="py-2 px-3 text-center text-sky-400">READ OWN RX</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-slate-300">Triage Queue & Walk-In Intake</td>
              <td className="py-2 px-3 text-center text-emerald-400">READ ONLY</td>
              <td className="py-2 px-3 text-center text-sky-400">CALL / ATTEND</td>
              <td className="py-2 px-3 text-center text-emerald-400 font-bold">MANAGE & INTAKE</td>
              <td className="py-2 px-3 text-center text-slate-400">VIEW OWN TOKEN</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-slate-300">Hospital Billing & Invoicing</td>
              <td className="py-2 px-3 text-center text-emerald-400 font-bold">AUDIT / FULL</td>
              <td className="py-2 px-3 text-center text-slate-400">VIEW FEE</td>
              <td className="py-2 px-3 text-center text-emerald-400 font-bold">COLLECT / PROCESS</td>
              <td className="py-2 px-3 text-center text-sky-400">PAY OWN BILL</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'triage-lifecycle') {
    return (
      <div className="my-6 p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h4 className="text-lg font-bold text-teal-400 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-400" />
              Figure 4.1: Outpatient Clinical Lifecycle & State Machine
            </h4>
            <p className="text-xs text-slate-400">Deterministic progression from pre-booking to pharmacy checkout</p>
          </div>
          <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-semibold rounded-full border border-teal-500/30">
            6 Finite States
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="w-full md:w-36 p-3 bg-slate-800 rounded-lg border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Step 1</span>
            <div className="font-bold text-slate-200 mt-1">Scheduled</div>
            <div className="text-[10px] text-slate-400">Online or Phone</div>
          </div>
          <ArrowRight className="w-4 h-4 text-teal-400 hidden md:block shrink-0" />

          <div className="w-full md:w-36 p-3 bg-amber-950/40 rounded-lg border border-amber-600/50 text-center">
            <span className="text-[10px] text-amber-400 uppercase font-mono">Step 2</span>
            <div className="font-bold text-amber-300 mt-1">Checked-In</div>
            <div className="text-[10px] text-amber-200/70">Triage Priority Set</div>
          </div>
          <ArrowRight className="w-4 h-4 text-teal-400 hidden md:block shrink-0" />

          <div className="w-full md:w-36 p-3 bg-sky-950/40 rounded-lg border border-sky-600/50 text-center">
            <span className="text-[10px] text-sky-400 uppercase font-mono">Step 3</span>
            <div className="font-bold text-sky-300 mt-1">Waiting Queue</div>
            <div className="text-[10px] text-sky-200/70">Token On Display</div>
          </div>
          <ArrowRight className="w-4 h-4 text-teal-400 hidden md:block shrink-0" />

          <div className="w-full md:w-36 p-3 bg-teal-950/40 rounded-lg border border-teal-500 text-center shadow-lg shadow-teal-950/50">
            <span className="text-[10px] text-teal-400 uppercase font-mono">Step 4</span>
            <div className="font-bold text-teal-300 mt-1">In-Consultation</div>
            <div className="text-[10px] text-teal-200/70">Vitals & Diagnosis</div>
          </div>
          <ArrowRight className="w-4 h-4 text-teal-400 hidden md:block shrink-0" />

          <div className="w-full md:w-36 p-3 bg-emerald-950/40 rounded-lg border border-emerald-600/50 text-center">
            <span className="text-[10px] text-emerald-400 uppercase font-mono">Step 5</span>
            <div className="font-bold text-emerald-300 mt-1">Completed</div>
            <div className="text-[10px] text-emerald-200/70">Rx Generated</div>
          </div>
          <ArrowRight className="w-4 h-4 text-teal-400 hidden md:block shrink-0" />

          <div className="w-full md:w-36 p-3 bg-slate-800 rounded-lg border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Step 6</span>
            <div className="font-bold text-slate-200 mt-1">Billed & Archive</div>
            <div className="text-[10px] text-slate-400">Pharmacy Pick-Up</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'sprint-timeline') {
    return (
      <div className="my-6 p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <h4 className="text-lg font-bold text-teal-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              Figure 5.1: 14-Day Agile Development Sprint Timeline
            </h4>
            <p className="text-xs text-slate-400">Structured milestone delivery tracking for capstone implementation</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
            100% On-Schedule Delivery
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-20 font-mono text-teal-400 font-bold shrink-0">Days 1-2</span>
            <div className="h-6 flex-1 bg-teal-600/30 rounded border border-teal-500/50 flex items-center px-3 text-slate-200">
              Project initialization, Express.js server setup, MongoDB Atlas cluster provisioning
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 font-mono text-teal-400 font-bold shrink-0">Days 3-4</span>
            <div className="h-6 flex-1 bg-teal-600/30 rounded border border-teal-500/50 flex items-center px-3 text-slate-200">
              User schema, bcrypt password hashing, JWT authentication middleware & routes
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 font-mono text-sky-400 font-bold shrink-0">Days 5-6</span>
            <div className="h-6 flex-1 bg-sky-600/30 rounded border border-sky-500/50 flex items-center px-3 text-slate-200">
              Doctor roster & Patient demographic schemas, CRUD REST endpoints, validation
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 font-mono text-sky-400 font-bold shrink-0">Days 7-8</span>
            <div className="h-6 flex-1 bg-sky-600/30 rounded border border-sky-500/50 flex items-center px-3 text-slate-200">
              Appointment scheduling engine, atomic double-booking conflict mitigation
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 font-mono text-indigo-400 font-bold shrink-0">Days 9-10</span>
            <div className="h-6 flex-1 bg-indigo-600/30 rounded border border-indigo-500/50 flex items-center px-3 text-slate-200">
              React 19 frontend bootstrap, Tailwind v4 design system, HospitalContext bus
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 font-mono text-indigo-400 font-bold shrink-0">Days 11-12</span>
            <div className="h-6 flex-1 bg-indigo-600/30 rounded border border-indigo-500/50 flex items-center px-3 text-slate-200">
              Role portals: Admin Dashboard, Doctor Consultation Room, Reception Queue Board
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 font-mono text-emerald-400 font-bold shrink-0">Days 13-14</span>
            <div className="h-6 flex-1 bg-emerald-600/40 rounded border border-emerald-500/60 flex items-center px-3 text-slate-200 font-semibold">
              Testing suites, 50-page dossier compilation, Word/PDF export & production deployment
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback generic diagram representation
  return (
    <div className="my-4 p-4 bg-slate-900 text-teal-300 rounded border border-slate-800 text-xs">
      <FileText className="w-4 h-4 inline mr-2 text-teal-400" />
      Interactive Architecture Diagram ({type}) embedded in dossier.
    </div>
  );
};
