import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { Users, Volume2, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const RealtimeQueueBoard: React.FC = () => {
  const { queue, advanceQueue, callQueueToken, currentUser } = useHospital();

  const priorityStyles = {
    critical: {
      badge: 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse',
      label: 'Code Red / Critical'
    },
    urgent: {
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      label: 'Urgent'
    },
    standard: {
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      label: 'Standard'
    }
  };

  const statusStyles = {
    waiting: 'bg-slate-100 text-slate-700',
    called: 'bg-amber-500 text-white font-bold animate-pulse',
    'in-room': 'bg-teal-600 text-white font-bold',
    done: 'bg-slate-200 text-slate-500 line-through'
  };

  const activeQueue = queue.filter(q => q.status !== 'done');
  const canManageQueue = currentUser.role === 'admin' || currentUser.role === 'receptionist' || currentUser.role === 'doctor';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-linear-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold">Live Outpatient Queue Board</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-300">Synchronized real-time patient token display across waiting halls</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 font-mono text-teal-300">
            {activeQueue.length} Patients Waiting
          </span>
        </div>
      </div>

      {/* Queue List / Grid */}
      <div className="p-4 sm:p-6">
        {activeQueue.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-slate-700">Waiting Room Clear</p>
            <p className="text-xs">No patients currently in the triage queue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeQueue.map((item) => (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.status === 'called' 
                    ? 'border-amber-400 bg-amber-50/40 shadow-md ring-2 ring-amber-400/20' 
                    : item.priority === 'critical'
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg bg-slate-900 text-teal-400 font-mono font-extrabold text-sm flex items-center justify-center shadow-xs">
                      #{item.tokenNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.patientName}</h4>
                      <p className="text-[11px] text-slate-500">{item.department}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${priorityStyles[item.priority].badge}`}>
                    {priorityStyles[item.priority].label}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Assigned Physician</span>
                    <span className="font-semibold text-slate-800 text-[11px]">{item.doctorName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] uppercase block">Location</span>
                    <span className="font-semibold text-teal-700 text-[11px]">{item.room}</span>
                  </div>
                </div>

                {/* Status Bar & Action Controls */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${statusStyles[item.status]}`}>
                    {item.status.replace('-', ' ')}
                  </span>

                  {canManageQueue && (
                    <div className="flex items-center gap-1.5">
                      {item.status === 'waiting' && (
                        <button
                          onClick={() => callQueueToken(item.id)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded flex items-center gap-1 border border-amber-200 transition-colors"
                          title="Call Patient to Room"
                        >
                          <Volume2 className="w-3 h-3 text-amber-600" />
                          <span>Call</span>
                        </button>
                      )}
                      <button
                        onClick={() => advanceQueue(item.id)}
                        className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold rounded flex items-center gap-1 border border-teal-200 transition-colors"
                        title="Advance Queue State"
                      >
                        <span>Advance</span>
                        <ArrowRight className="w-3 h-3 text-teal-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
