import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Search,
  Filter,
  UserCheck,
  RefreshCw,
  XCircle,
  FileText,
  MapPin,
  Clock,
  Phone,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ReceiptIndianRupee
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';
import { BookingStatus, AdminBooking } from '../types/admin';

export const BookingsPage: React.FC = () => {
  const { bookings, specialists, assignSpecialist, reassignSpecialist, cancelBooking } = useAdmin();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Assignment Modal
  const [assignModalBooking, setAssignModalBooking] = useState<AdminBooking | null>(null);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState('');
  const [reassignReason, setReassignReason] = useState('');

  // Cancel & Refund Modal
  const [cancelModalBooking, setCancelModalBooking] = useState<AdminBooking | null>(null);
  const [cancelReason, setCancelReason] = useState('Customer requested schedule cancellation');
  const [refundPercentage, setRefundPercentage] = useState<number>(80);

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'unassigned') return b.status === 'paid';
    if (activeFilter === 'assigned') return b.status === 'assigned' || b.status === 'accepted';
    if (activeFilter === 'in_progress') return b.status === 'en_route' || b.status === 'arrived' || b.status === 'inspecting';
    if (activeFilter === 'submitted') return b.status === 'submitted' || b.status === 'completed';
    if (activeFilter === 'cancelled') return b.status === 'cancelled';
    return true;
  }).filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingRef.toLowerCase().includes(q) ||
      b.customer.name.toLowerCase().includes(q) ||
      b.vehicle.make.toLowerCase().includes(q) ||
      b.vehicle.model.toLowerCase().includes(q) ||
      b.location.area.toLowerCase().includes(q)
    );
  });

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalBooking || !selectedSpecialistId) return;

    if (assignModalBooking.assignedSpecialistId) {
      reassignSpecialist(assignModalBooking.id, selectedSpecialistId, reassignReason || 'Operational rebalancing');
    } else {
      assignSpecialist(assignModalBooking.id, selectedSpecialistId);
    }

    setAssignModalBooking(null);
    setSelectedSpecialistId('');
    setReassignReason('');
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalBooking) return;

    const refundAmount = Math.round((cancelModalBooking.pricing.total * refundPercentage) / 100);
    cancelBooking(cancelModalBooking.id, cancelReason, refundAmount);
    setCancelModalBooking(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-[#154D3F] dark:text-emerald-400" /> Bookings & Dispatch Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            End-to-end booking lifecycle, specialist assignment, SLA fulfillment, and cancellation processing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bookings, customers, vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 focus:border-[#154D3F] rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-64 sm:w-80 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { key: 'all', label: 'All Bookings', count: bookings.length },
          { key: 'unassigned', label: 'Unassigned Queue', count: bookings.filter((b) => b.status === 'paid').length, urgent: true },
          { key: 'assigned', label: 'Assigned / Dispatched', count: bookings.filter((b) => ['assigned', 'accepted'].includes(b.status)).length },
          { key: 'in_progress', label: 'On Site / Inspecting', count: bookings.filter((b) => ['en_route', 'arrived', 'inspecting'].includes(b.status)).length },
          { key: 'submitted', label: 'Report Delivered', count: bookings.filter((b) => ['submitted', 'completed'].includes(b.status)).length },
          { key: 'cancelled', label: 'Cancelled / Refunded', count: bookings.filter((b) => b.status === 'cancelled').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeFilter === tab.key
                ? 'bg-[#154D3F] text-white shadow-sm'
                : 'bg-white dark:bg-[#12181E] text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeFilter === tab.key
                  ? 'bg-white/20 text-white'
                  : tab.urgent && tab.count > 0
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] rounded-3xl overflow-hidden shadow-donezo">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-[#F4F6F8] dark:bg-slate-900/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 pl-6">Booking Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vehicle & Complexity</th>
                <th className="p-4">Appointment Slot</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Specialist</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Booking Ref */}
                    <td className="p-4 pl-6">
                      <div className="font-mono font-bold text-[#154D3F] dark:text-emerald-400">{b.bookingRef}</div>
                      <div className="text-[10px] text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</div>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{b.customer.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" /> {b.customer.phone}
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {b.vehicle.year} {b.vehicle.make} {b.vehicle.model}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{b.vehicle.variant}</div>
                      <span className="inline-block mt-1 text-[9px] uppercase font-extrabold bg-slate-100 dark:bg-slate-800 text-[#154D3F] dark:text-emerald-400 px-2 py-0.5 rounded-full">
                        {b.vehicle.complexity.replace('_', ' ')}
                      </span>
                      {b.location.askingPrice && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                          Asking: ₹{isNaN(Number(b.location.askingPrice)) ? b.location.askingPrice : Number(b.location.askingPrice).toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    {/* Slot */}
                    <td className="p-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{b.appointment.date}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{b.appointment.window}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{b.location.area}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Seller: {b.location.sellerName}</div>
                    </td>

                    {/* Amount */}
                    <td className="p-4">
                      <div className="font-bold text-[#154D3F] dark:text-emerald-400 font-mono text-sm">₹{b.pricing.total.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">Incl. 18% GST</div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'submitted'
                            ? 'bg-[#E8F5EE] text-[#154D3F] dark:bg-[#154D3F]/40 dark:text-emerald-300'
                            : b.status === 'assigned'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : b.status === 'paid'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                            : b.status === 'cancelled'
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                        }`}
                      >
                        {b.status}
                      </span>
                      {b.hasQualityFlag && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> QA Flagged
                        </div>
                      )}
                    </td>

                    {/* Assigned Specialist */}
                    <td className="p-4">
                      {b.assignedSpecialistName ? (
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{b.assignedSpecialistName}</div>
                          <div className="text-[10px] text-slate-400">
                            Assigned {b.assignedAt ? new Date(b.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </div>
                        </div>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-bold text-xs">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'paid' && (
                          <button
                            onClick={() => setAssignModalBooking(b)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Assign
                          </button>
                        )}

                        {b.status === 'assigned' && (
                          <button
                            onClick={() => setAssignModalBooking(b)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold text-[11px] flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" /> Reassign
                          </button>
                        )}

                        {b.status === 'submitted' && (
                          <Link
                            to={`/admin/reports/${b.bookingRef}`}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Report
                          </Link>
                        )}

                        {b.status !== 'cancelled' && b.status !== 'submitted' && (
                          <button
                            onClick={() => setCancelModalBooking(b)}
                            className="px-2 py-1 bg-slate-900 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-lg text-[11px] transition-colors"
                            title="Cancel booking"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment / Reassignment Modal */}
      {assignModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">
              {assignModalBooking.assignedSpecialistId ? 'Reassign Specialist' : 'Assign Specialist'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Booking Ref: <strong className="text-cyan-400">{assignModalBooking.bookingRef}</strong> —{' '}
              {assignModalBooking.vehicle.make} {assignModalBooking.vehicle.model} ({assignModalBooking.vehicle.complexity})
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Active Specialist
                </label>
                <select
                  value={selectedSpecialistId}
                  onChange={(e) => setSelectedSpecialistId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none"
                  required
                >
                  <option value="">-- Choose Specialist --</option>
                  {specialists
                    .filter((s) => s.status === 'active')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.badge}) — Rating: {s.rating} ★ | Zones: {s.zones.slice(0, 2).join(', ')}
                      </option>
                    ))}
                </select>
              </div>

              {assignModalBooking.assignedSpecialistId && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Reason for Reassignment
                  </label>
                  <input
                    type="text"
                    value={reassignReason}
                    onChange={(e) => setReassignReason(e.target.value)}
                    placeholder="e.g. Previous specialist delayed on prior site inspection"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalBooking(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSpecialistId}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation & Refund Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-1">Cancel Booking & Process Refund</h3>
            <p className="text-xs text-slate-400 mb-4">
              Booking Ref: <strong className="text-cyan-400">{cancelModalBooking.bookingRef}</strong> — Paid:{' '}
              <strong className="text-emerald-400">₹{cancelModalBooking.pricing.total.toLocaleString()}</strong>
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Cancellation Reason
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-2.5 text-xs text-white focus:outline-none mb-2"
                >
                  <option value="Customer requested schedule cancellation">Customer requested schedule cancellation</option>
                  <option value="Seller sold vehicle prior to inspection">Seller sold vehicle prior to inspection</option>
                  <option value="Specialist unable to access locked private premises">Specialist unable to access locked premises</option>
                  <option value="Operational exception / Vehicle unavailable">Operational exception / Vehicle unavailable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Refund Policy Schedule
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { pct: 100, label: '100% Full Refund', desc: '> 4h before slot' },
                    { pct: 80, label: '80% Partial Refund', desc: '2h - 4h before slot' },
                    { pct: 50, label: '50% Retained Fee', desc: '< 2h before slot' },
                  ].map((tier) => (
                    <button
                      type="button"
                      key={tier.pct}
                      onClick={() => setRefundPercentage(tier.pct)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        refundPercentage === tier.pct
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold">{tier.label}</div>
                      <div className="text-[10px] text-slate-500">{tier.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                <span className="text-slate-400">Total Refund Amount to Customer:</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  ₹{Math.round((cancelModalBooking.pricing.total * refundPercentage) / 100).toLocaleString()}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  Confirm Cancellation & Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
