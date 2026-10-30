import React from 'react';
import {
  ReceiptIndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  RefreshCw,
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';

export const FinancePage: React.FC = () => {
  const { financialLedger, bookings, releasePayoutEarly, currentUser } = useAdmin();

  // Metrics
  const collections = financialLedger
    .filter((f) => f.category === 'customer_collection')
    .reduce((sum, curr) => sum + curr.amount, 0);

  const disbursements = financialLedger
    .filter((f) => f.category === 'specialist_payout' && f.status === 'completed')
    .reduce((sum, curr) => sum + Math.abs(curr.amount), 0);

  const refunds = financialLedger
    .filter((f) => f.category === 'customer_refund')
    .reduce((sum, curr) => sum + Math.abs(curr.amount), 0);

  const gstCollected = Math.round((collections * 0.18) / 1.18);

  const submittedBookings = bookings.filter((b) => b.status === 'submitted');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Financial Settlement & Payout Escrow
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          Escrow reserve monitoring, 48-hour dispute holding timers, IMPS specialist disbursements, and GST compliance.
        </p>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Signature Donezo Green Card */}
        <div className="p-5 bg-donezo-green text-white rounded-3xl shadow-donezo relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-emerald-100">Gross Collections</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-extrabold tracking-tight">₹{collections.toLocaleString()}</div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
            Razorpay 100% Captured
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl shadow-donezo">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Specialist IMPS Disbursed</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-donezo-green dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{disbursements.toLocaleString()}</div>
          <div className="mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Direct bank IMPS transfers
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl shadow-donezo">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">GST Statutory Pool (18%)</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{gstCollected.toLocaleString()}</div>
          <div className="mt-3 text-[11px] font-medium text-cyan-600 dark:text-cyan-400">
            Monthly GSTR-3B Provision
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl shadow-donezo">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Processed Refunds</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{refunds.toLocaleString()}</div>
          <div className="mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Stage-based policy cancellations
          </div>
        </div>
      </div>

      {/* 48-Hour Payout Release Control Desk */}
      <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl p-6 shadow-donezo">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-donezo-lightBorder dark:border-donezo-darkBorder">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-donezo-green dark:text-emerald-400" /> 48-Hour Payout Hold & Early Release Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Per BRD business rules, specialist inspection earnings are held in escrow for exactly 48 hours post-report submission to safeguard customer review.
            </p>
          </div>
          <span className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-donezo-green dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1 rounded-full font-bold">
            Escrow Guard Active
          </span>
        </div>

        <div className="space-y-3">
          {submittedBookings.map((b) => {
            const hasQualityHold = b.hasQualityFlag;
            return (
              <div
                key={b.id}
                className="p-4 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-donezo-green dark:text-emerald-400 text-xs">{b.bookingRef}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {b.vehicle.make} {b.vehicle.model}
                    </span>
                    <span className="text-xs text-slate-400">• Specialist: {b.assignedSpecialistName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>
                      Submitted:{' '}
                      <strong className="text-slate-700 dark:text-slate-300">
                        {b.reportSubmittedAt ? new Date(b.reportSubmittedAt).toLocaleString() : 'Recent'}
                      </strong>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-donezo-green dark:text-emerald-400">
                      <Clock className="w-3.5 h-3.5" /> 48-Hr Timer Ends:{' '}
                      {b.payoutEligibilityAt ? new Date(b.payoutEligibilityAt).toLocaleTimeString() : 'Pending'}
                    </span>
                    {hasQualityHold ? (
                      <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Quality Hold Active
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Report Clean
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <span className="text-base font-black text-slate-900 dark:text-white font-mono">₹1,750</span>
                  <button
                    onClick={() => releasePayoutEarly(b.bookingRef)}
                    className="px-4 py-2 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Unlock className="w-3.5 h-3.5" /> Release to Wallet Early
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Financial Ledger Table */}
      <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl overflow-hidden shadow-donezo">
        <div className="p-5 border-b border-donezo-lightBorder dark:border-donezo-darkBorder">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Immutable Platform Transaction Ledger</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Idempotent gateway and escrow ledger records with unique transaction references.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0E1318] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-donezo-lightBorder dark:border-donezo-darkBorder">
              <tr>
                <th className="p-4">Txn Ref</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Settlement State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-donezo-darkBorder">
              {financialLedger.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-donezo-green dark:text-emerald-400">{row.reference}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(row.timestamp).toLocaleString()}</td>
                  <td className="p-4 uppercase text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {row.category.replace('_', ' ')}
                  </td>
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{row.description}</td>
                  <td className="p-4 font-mono font-bold">
                    <span className={row.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}>
                      {row.amount > 0 ? `+₹${row.amount.toLocaleString()}` : `-₹${Math.abs(row.amount).toLocaleString()}`}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        row.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : row.status === 'held_in_escrow'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-donezo-lightBorder dark:border-donezo-darkBorder'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
