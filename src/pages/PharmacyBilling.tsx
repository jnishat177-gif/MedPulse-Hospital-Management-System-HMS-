import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  CreditCard, Pill, CheckCircle2, Clock, 
  Printer, DollarSign, Search, FileText 
} from 'lucide-react';

export const PharmacyBilling: React.FC = () => {
  const { invoices } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const filteredInvoices = invoices.filter(inv =>
    inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((acc, i) => acc + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Hospital Billing & Pharmacy Dispensary</h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              Accounts & Rx
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Itemized consultation billing, insurance co-pay tracking, and prescription medication fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase">Collected</span>
            <span className="font-extrabold text-emerald-700 text-sm">${totalPaid.toLocaleString()}</span>
          </div>
          <div className="px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase">Pending Insurance</span>
            <span className="font-extrabold text-amber-700 text-sm">${totalPending.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-teal-600" />
            Itemized Invoices & Billing Records
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice # or patient..."
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
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Billed Services</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-teal-700">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {inv.patientName}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {inv.date}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {inv.services.map(s => s.description).join(', ')}
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 font-mono">
                    ${inv.totalAmount}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-semibold inline-flex items-center gap-1 border border-slate-200"
                    >
                      <FileText className="w-3 h-3 text-teal-600" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">MediPulse Clinical Center</h4>
                <p className="text-xs text-slate-500 font-mono">Invoice: {selectedInvoice.invoiceNumber}</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {selectedInvoice.status.toUpperCase()}
              </span>
            </div>

            <div className="my-4 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-slate-400">Patient:</span> <span className="font-bold text-slate-800">{selectedInvoice.patientName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Date:</span> <span className="font-mono text-slate-700">{selectedInvoice.date}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Payment:</span> <span className="text-slate-700">{selectedInvoice.paymentMethod || 'Hospital Account'}</span></div>
            </div>

            <div className="my-4 border-t border-b border-slate-100 py-3 text-xs space-y-2">
              <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Itemized Services</span>
              {selectedInvoice.services.map((s: any, idx: number) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>{s.description}</span>
                  <span className="font-mono font-bold">${s.amount}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 pb-4">
              <span>Total Amount</span>
              <span className="font-mono text-lg text-teal-700">${selectedInvoice.totalAmount}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
