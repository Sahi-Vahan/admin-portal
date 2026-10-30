import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
  TrendingUp,
  ReceiptIndianRupee,
  AlertTriangle,
  CheckCircle2,
  Car,
  Bike,
  UserCheck,
  ShieldCheck,
  Sparkles,
  MapPin,
  ExternalLink,
  ArrowUpRight,
  Plus,
  Play,
  Pause,
  Square,
  Video,
  FileText,
  Calendar,
  Layers,
  Check,
  User,
  Phone,
  Star,
  Shield,
  MessageSquare
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, specialists, qualityFlags, financialLedger, assignSpecialist, currentUser, feedbacks } = useAdmin();

  // Quick Assignment Modal State
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>('');

  // Dynamic Time-of-Day Greeting
  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  // Latest customer feedback & CSAT calculation
  const customerFeedbacks = (feedbacks || []).filter((f) => f.type === 'customer_review');
  const latestCustomerFeedback = customerFeedbacks[0] || (feedbacks && feedbacks[0]);
  const avgCsatRating = customerFeedbacks.length > 0
    ? (customerFeedbacks.reduce((sum, f) => sum + (f.rating || 5), 0) / customerFeedbacks.length).toFixed(1)
    : '4.9';

  // Metrics from actual SahiVahan state
  const totalBookingsCount = bookings.length;
  const completedCount = bookings.filter((b) => b.status === 'completed' || b.status === 'submitted').length;
  const runningCount = bookings.filter((b) => ['assigned', 'accepted', 'en_route', 'arrived', 'inspecting'].includes(b.status)).length;
  const pendingCount = bookings.filter((b) => b.status === 'paid').length;
  const flaggedCount = qualityFlags.filter((f) => f.status === 'pending_review').length;

  // Next upcoming booking for the Reminders card
  const upcomingBooking = bookings.find((b) => ['assigned', 'accepted', 'en_route', 'arrived', 'inspecting'].includes(b.status)) || bookings[0];

  const handleQuickAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookingId && selectedSpecialistId) {
      assignSpecialist(selectedBookingId, selectedSpecialistId);
      setSelectedBookingId(null);
      setSelectedSpecialistId('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Dynamic Time-of-Day Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {timeGreeting}, {currentUser.name} 👋
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F5EE] dark:bg-[#154D3F]/40 text-[#154D3F] dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-[#CBEAD8] dark:border-emerald-600/30">
              <Shield className="w-3 h-3" />
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Inspection operations pulse, dispatch queues, QA flags, and customer feedback across all active metro zones.
          </p>
        </div>

        {/* Donezo Style Top Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-donezo-green hover:bg-donezo-greenHover text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Booking</span>
          </Link>

          <Link
            to="/admin/feedback"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-donezo transition-all hover:scale-[1.02]"
          >
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span>Customer CSAT</span>
          </Link>
        </div>
      </div>

      {/* ROW 1: 4 TOP KPI CARDS (Donezo Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Inspections (Signature Donezo Forest Green) */}
        <div className="rounded-3xl p-6 bg-[#154D3F] text-white shadow-donezo flex flex-col justify-between h-44 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-100">Total Inspections</span>
            <Link
              to="/admin/bookings"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform group-hover:scale-110"
              title="View all bookings"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div>
            <div className="text-4xl font-extrabold tracking-tight">{totalBookingsCount}</div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-medium text-emerald-100">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400/30 text-emerald-100 flex items-center justify-center text-[9px] font-bold">↗</span>
              <span>Increased from last month</span>
            </span>
          </div>
        </div>

        {/* Card 2: Completed Inspections (Crisp White Card) */}
        <div className="rounded-3xl p-6 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder shadow-donezo flex flex-col justify-between h-44 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Ended Projects</span>
            <Link
              to="/admin/bookings"
              className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center justify-center transition-transform group-hover:scale-110 border border-donezo-lightBorder dark:border-donezo-darkBorder"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{completedCount}</div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-donezo-greenLight dark:bg-emerald-950/40 text-[11px] font-semibold text-donezo-green dark:text-emerald-300">
              <span className="text-[10px] font-bold">▲</span>
              <span>Increased from last month</span>
            </span>
          </div>
        </div>

        {/* Card 3: Running Inspections / On Field (Crisp White Card) */}
        <div className="rounded-3xl p-6 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder shadow-donezo flex flex-col justify-between h-44 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Running Projects</span>
            <Link
              to="/admin/bookings"
              className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center justify-center transition-transform group-hover:scale-110 border border-donezo-lightBorder dark:border-donezo-darkBorder"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{runningCount}</div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-donezo-greenLight dark:bg-emerald-950/40 text-[11px] font-semibold text-donezo-green dark:text-emerald-300">
              <span className="text-[10px] font-bold">▲</span>
              <span>Increased from last month</span>
            </span>
          </div>
        </div>

        {/* Card 4: Pending / Needs Attention (Crisp White Card) */}
        <div className="rounded-3xl p-6 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder shadow-donezo flex flex-col justify-between h-44 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pending Project</span>
            <Link
              to="/admin/quality"
              className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center justify-center transition-transform group-hover:scale-110 border border-donezo-lightBorder dark:border-donezo-darkBorder"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{pendingCount + flaggedCount}</div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <span>On Discuss</span>
            </span>
          </div>
        </div>

      </div>

      {/* ROW 2: MIDDLE SECTION (Analytics Chart + Reminders + Project Queue) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Widget 1: Project Analytics / Inspection Volume (Donezo Striped Bar Chart) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder shadow-donezo flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Project Analytics</h3>
            <span className="text-[11px] font-bold text-slate-400">This Week</span>
          </div>

          {/* Donezo Style Pill Bars with Striped Pattern */}
          <div className="flex items-end justify-between h-40 pt-4 px-2">
            {[
              { day: 'S', height: '65%', striped: true },
              { day: 'M', height: '85%', striped: false, solidColor: 'bg-donezo-green' },
              { day: 'T', height: '74%', striped: false, solidColor: 'bg-emerald-500', showBadge: true },
              { day: 'W', height: '95%', striped: false, solidColor: 'bg-[#0D382E]' },
              { day: 'T', height: '70%', striped: true },
              { day: 'F', height: '60%', striped: true },
              { day: 'S', height: '75%', striped: true },
            ].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center justify-end h-full gap-2 group relative">
                {/* 74% Tooltip Pill (Donezo Style) */}
                {bar.showBadge && (
                  <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-sm whitespace-nowrap animate-bounce">
                    74%
                  </div>
                )}

                {/* Pill Bar */}
                <div
                  style={{ height: bar.height }}
                  className={`w-9 sm:w-10 rounded-full transition-all duration-300 ${
                    bar.striped
                      ? 'striped-bar-pattern border border-slate-200 dark:border-slate-700/60'
                      : `${bar.solidColor} shadow-xs`
                  }`}
                />

                {/* Day Label */}
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Reminders / Next Appointment (Donezo Style) */}
        <div className="lg:col-span-3 rounded-3xl p-6 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder shadow-donezo flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Reminders
            </div>
            <h3 className="text-base font-bold text-donezo-green dark:text-emerald-400 leading-snug">
              Meeting with Arc Company
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Time : 02.00 pm - 04.00 pm
            </p>
            {upcomingBooking && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1318] border border-donezo-lightBorder dark:border-donezo-darkBorder text-[11px] text-slate-600 dark:text-slate-300">
                <div className="font-bold text-slate-900 dark:text-white">
                  {upcomingBooking.vehicle.year} {upcomingBooking.vehicle.make} {upcomingBooking.vehicle.model}
                </div>
                <div className="text-slate-400 mt-0.5 font-mono">{upcomingBooking.bookingRef} • {upcomingBooking.location.area}</div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Link
              to={upcomingBooking ? `/admin/reports/${upcomingBooking.bookingRef}` : '/admin/bookings'}
              className="w-full py-2.5 px-4 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
            >
              <Video className="w-4 h-4" />
              <span>Start Meeting</span>
            </Link>
          </div>
        </div>

        {/* Widget 3: Project / Active Tasks Queue (Donezo Style with + New) */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder shadow-donezo">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Project</h3>
            <Link
              to="/admin/bookings"
              className="px-3 py-1 rounded-full border border-donezo-lightBorder dark:border-donezo-darkBorder bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-donezo"
            >
              + New
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 5).map((b, idx) => {
              const colors = ['bg-blue-500', 'bg-teal-500', 'bg-amber-500', 'bg-orange-500', 'bg-purple-500'];
              return (
                <div key={b.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`} />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {b.vehicle.make} {b.vehicle.model} ({b.bookingRef})
                      </div>
                      <div className="text-[10px] text-slate-400">Due date: {b.appointment.date}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{b.status}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ROW 3: BOTTOM SECTION (Team Collaboration + Progress Gauge + Time Tracker) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Widget 4: Team Collaboration (Donezo Style with Real Specialist Roster) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder shadow-donezo">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Team Collaboration</h3>
            <button
              type="button"
              onClick={() => navigate('/admin/specialists')}
              className="px-3 py-1 rounded-full border border-donezo-lightBorder dark:border-donezo-darkBorder bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-donezo"
            >
              + Add Member
            </button>
          </div>

          <div className="space-y-3.5">
            {specialists.slice(0, 4).map((spec, idx) => {
              const bgColors = ['bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700', 'bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700'];
              const statusPill = spec.status === 'active'
                ? { label: 'Active', class: 'bg-donezo-greenLight text-donezo-green border border-emerald-200' }
                : spec.status === 'pending_verification'
                ? { label: 'Pending', class: 'bg-rose-50 text-rose-800 border border-rose-200' }
                : { label: 'Offline', class: 'bg-slate-100 text-slate-700 border border-slate-200' };

              return (
                <div key={spec.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${bgColors[idx % bgColors.length]} font-bold text-xs flex items-center justify-center shrink-0`}>
                      {spec.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{spec.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                        {spec.city} • Rating {spec.rating}★ ({spec.completedJobsCount} done)
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${statusPill.class}`}>
                    {statusPill.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 5: Project Progress / Semi-Circle Gauge (Donezo Style) */}
        <div className="lg:col-span-3 rounded-3xl p-6 bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder shadow-donezo flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Project Progress</h3>
          </div>

          {/* Donezo Semi-Circular SVG Donut Gauge */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
              {/* Semi circle arc track */}
              <svg className="w-44 h-44 absolute -top-1" viewBox="0 0 100 100">
                <path
                  d="M 15 50 A 35 35 0 0 1 85 50"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 15 50 A 35 35 0 0 1 50 15"
                  fill="none"
                  stroke="#154D3F"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Center percentage label */}
              <div className="text-center z-10 -mb-1">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">41%</div>
                <div className="text-[10px] font-bold text-slate-400 mt-0.5">Project Ended</div>
              </div>
            </div>

            {/* Legend Pills below gauge */}
            <div className="flex items-center gap-3 mt-4 text-[11px] font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-donezo-green" /> In Progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" /> Pending
              </span>
            </div>
          </div>
        </div>

        {/* Widget 6: Customer Voice & CSAT Stream (Donezo Forest Green Card) */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-gradient-to-br from-[#0D2E26] via-[#154D3F] to-[#0A1F1A] text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(52,211,153,0.18),transparent_60%)] pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-emerald-200/90 tracking-wide flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Customer Voice & CSAT</span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                ⭐ {avgCsatRating} / 5.0
              </span>
            </div>

            {latestCustomerFeedback && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
                <div className="flex items-center justify-between text-[11px] text-emerald-200 font-semibold mb-1">
                  <span className="font-bold text-white">{latestCustomerFeedback.userName}</span>
                  <span className="text-amber-300 font-bold">
                    {'★'.repeat(latestCustomerFeedback.rating || 5)}
                  </span>
                </div>
                <p className="text-xs text-white/95 line-clamp-2 leading-relaxed italic">
                  "{latestCustomerFeedback.message}"
                </p>
                <div className="mt-2 text-[10px] text-emerald-200/70 flex items-center justify-between">
                  <span>Ref: {latestCustomerFeedback.bookingRef || 'General'}</span>
                  <span>{latestCustomerFeedback.createdAt}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-emerald-800/60 mt-3 flex items-center justify-between relative z-10">
            <span className="text-[11px] text-emerald-200/80">
              {feedbacks?.length || 5} Total Feedbacks Logged
            </span>
            <Link
              to="/admin/feedback"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-[#154D3F] hover:bg-emerald-50 text-xs font-bold shadow-sm transition-all hover:scale-105"
            >
              <span>View Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* SahiVahan Quick Dispatch Desk Section */}
      <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl p-6 shadow-donezo">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-donezo-lightBorder dark:border-donezo-darkBorder">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-donezo-green dark:text-emerald-400" /> Live Inspection Dispatch Desk
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instant assignment of unassigned paid customer bookings to field specialists.
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs text-donezo-green dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            View All ({bookings.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0E1318] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-donezo-lightBorder dark:border-donezo-darkBorder">
              <tr>
                <th className="p-3.5">Ref</th>
                <th className="p-3.5">Customer & City</th>
                <th className="p-3.5">Vehicle</th>
                <th className="p-3.5">Slot</th>
                <th className="p-3.5">Specialist</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-donezo-darkBorder">
              {bookings.slice(0, 6).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-donezo-green dark:text-emerald-400">{b.bookingRef}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-white">{b.customer.name}</div>
                    <div className="text-[11px] text-slate-400">{b.location.city} • {b.location.area}</div>
                  </td>
                  <td className="p-3.5 font-medium">
                    {b.vehicle.year} {b.vehicle.make} {b.vehicle.model}
                  </td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {b.appointment.date}
                  </td>
                  <td className="p-3.5">
                    {b.assignedSpecialistName ? (
                      <span className="font-medium text-slate-900 dark:text-white">{b.assignedSpecialistName}</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">Unassigned</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : b.status === 'paid'
                          ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {!b.assignedSpecialistId ? (
                      <button
                        onClick={() => setSelectedBookingId(b.id)}
                        className="px-3 py-1 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-[11px] font-bold shadow-sm"
                      >
                        Assign
                      </button>
                    ) : (
                      <Link
                        to={`/admin/reports/${b.bookingRef}`}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-[11px] font-bold"
                      >
                        Report
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Assignment Modal */}
      {selectedBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Assign Field Specialist</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Select an available verified specialist for this inspection.
            </p>

            <form onSubmit={handleQuickAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Available Specialists
                </label>
                <select
                  value={selectedSpecialistId}
                  onChange={(e) => setSelectedSpecialistId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0E1318] border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-donezo-green"
                  required
                >
                  <option value="">Choose a specialist...</option>
                  {specialists.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city}) • Rating {s.rating}★
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingId(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSpecialistId}
                  className="flex-1 py-2.5 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
