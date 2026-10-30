import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  UserCheck,
  Send,
  Sparkles,
  HelpCircle,
  Lock,
  Unlock,
  ArrowUpRight
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';
import { QualityFlagItem } from '../types/admin';

export const QualityFlagsPage: React.FC = () => {
  const { qualityFlags, resolveQualityFlag, releasePayoutEarly } = useAdmin();

  const [selectedFlag, setSelectedFlag] = useState<QualityFlagItem | null>(null);
  const [resolutionDecision, setResolutionDecision] = useState<'correction_issued' | 'resolved_valid' | 'dismissed'>('dismissed');
  const [reviewNotes, setReviewNotes] = useState('');
  const [holdPayout, setHoldPayout] = useState(false);

  const pendingCount = qualityFlags.filter((f) => f.status === 'pending_review').length;
  const inProgressCount = qualityFlags.filter((f) => f.status === 'clarification_requested').length;
  const resolvedCount = qualityFlags.filter((f) => f.status === 'resolved_valid' || f.status === 'dismissed').length;

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlag) return;

    resolveQualityFlag(selectedFlag.id, resolutionDecision, reviewNotes || 'Resolution completed via QA desk', holdPayout);

    if (resolutionDecision === 'dismissed') {
      releasePayoutEarly(selectedFlag.bookingRef);
    }

    setSelectedFlag(null);
    setReviewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Quality Assurance & Flag Queue
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Automated checklist rules, customer escalations, defect accuracy audits, and 48-hour escrow holds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-3.5 py-1.5 rounded-full">
            {pendingCount} Pending Triage
          </span>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-donezo-green text-white rounded-3xl shadow-donezo relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-emerald-100">Pending Triage</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-extrabold">{pendingCount}</div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-emerald-200">
            <span>Requires urgent review</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl shadow-donezo">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Clarification Sent</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{inProgressCount}</div>
          <div className="mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Awaiting specialist reply
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl shadow-donezo">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Resolved Flags</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{resolvedCount}</div>
          <div className="mt-3 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            Passed verification
          </div>
        </div>
      </div>

      {/* Flag Queue List */}
      <div className="space-y-4">
        {qualityFlags.map((flag) => (
          <div
            key={flag.id}
            className="p-5 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder hover:shadow-donezo-hover rounded-3xl transition-all shadow-donezo"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-donezo-green dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {flag.bookingRef}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{flag.vehicle}</span>
                <span
                  className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                    flag.severity === 'critical'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      : flag.severity === 'high'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  {flag.severity}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Flagged {new Date(flag.flaggedAt).toLocaleDateString()}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full ${
                    flag.status === 'dismissed' || flag.status === 'resolved_valid'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                  }`}
                >
                  {flag.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Trigger Reason */}
            <div className="p-3.5 bg-slate-50 dark:bg-[#0E1318] rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-donezo-green dark:text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                Trigger Source: {flag.source === 'automated_rule' ? 'Automated QA Rule Engine' : 'Customer Support Escalation'}
              </strong>
              {flag.triggerReason}
            </div>

            {/* Reviewer Notes if present */}
            {flag.reviewerNotes && (
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                Notes: {flag.reviewerNotes}
              </div>
            )}

            {/* Footer with Specialist & Actions */}
            <div className="mt-4 pt-3 border-t border-donezo-lightBorder dark:border-donezo-darkBorder flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                <span>Specialist: <strong className="text-slate-900 dark:text-white">{flag.specialistName}</strong></span>
                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                  <Lock className="w-3.5 h-3.5" /> 48h Payout Locked: {flag.payoutHoldActive ? 'YES' : 'RELEASED'}
                </span>
              </div>

              {flag.status !== 'dismissed' && flag.status !== 'resolved_valid' && (
                <button
                  onClick={() => {
                    setSelectedFlag(flag);
                    setHoldPayout(flag.payoutHoldActive);
                  }}
                  className="px-4 py-2 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full font-bold text-xs transition-all shadow-sm"
                >
                  Triage & Decide Outcome
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Flag Triage & Decision Modal */}
      {selectedFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Triage Quality Flag</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Booking Ref: <strong className="text-donezo-green dark:text-emerald-400">{selectedFlag.bookingRef}</strong> •{' '}
              {selectedFlag.vehicle}
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  QA Decision
                </label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder bg-slate-50 dark:bg-[#0E1318] hover:border-donezo-green cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      checked={resolutionDecision === 'dismissed'}
                      onChange={() => {
                        setResolutionDecision('dismissed');
                        setHoldPayout(false);
                      }}
                      className="mt-1 text-donezo-green focus:ring-donezo-green"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Dismiss Flag (Valid Report)</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Specialist evidence is verified. Release 48-hour wallet payout lock immediately.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder bg-slate-50 dark:bg-[#0E1318] hover:border-donezo-green cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      checked={resolutionDecision === 'correction_issued'}
                      onChange={() => {
                        setResolutionDecision('correction_issued');
                        setHoldPayout(true);
                      }}
                      className="mt-1 text-donezo-green focus:ring-donezo-green"
                    />
                    <div>
                      <div className="text-xs font-bold text-amber-700 dark:text-amber-400">Request Specialist Correction (Issue v2.0)</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Prompt specialist to clarify remarks or upload clearer photo proof. Hold payout.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-donezo-lightBorder dark:border-donezo-darkBorder bg-slate-50 dark:bg-[#0E1318] hover:border-donezo-green cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      checked={resolutionDecision === 'resolved_valid'}
                      onChange={() => {
                        setResolutionDecision('resolved_valid');
                        setHoldPayout(true);
                      }}
                      className="mt-1 text-donezo-green focus:ring-donezo-green"
                    />
                    <div>
                      <div className="text-xs font-bold text-rose-700 dark:text-rose-400">Uphold Material Defect (Financial Penalty)</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Specialist committed material inspection error. Deduct payout and adjust rating.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Resolution Notes & Evidence Reference
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="State review findings and document reference..."
                  className="w-full bg-slate-50 dark:bg-[#0E1318] border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedFlag(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-xs font-bold transition-all shadow-sm"
                >
                  Apply QA Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
