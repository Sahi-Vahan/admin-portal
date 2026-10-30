import React, { useState } from 'react';
import {
  MessageSquareHeart,
  Star,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  MessageSquare,
  User,
  Wrench,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Plus,
  X,
  Send,
  Flag,
  ArrowRight,
  Tag,
  Check
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';
import { FeedbackItem, FeedbackType } from '../types/admin';
import { Link } from 'react-router-dom';

export const FeedbackPage: React.FC = () => {
  const { feedbacks, updateFeedbackStatus, convertFeedbackToQualityFlag, createFeedback } = useAdmin();

  const [activeTab, setActiveTab] = useState<'all' | FeedbackType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'acknowledged' | 'converted_to_flag' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Manual Log Modal State
  const [logType, setLogType] = useState<FeedbackType>('customer_review');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [category, setCategory] = useState<FeedbackItem['category']>('inspection_quality');
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');

  // Metrics
  const customerReviews = feedbacks.filter((f) => f.type === 'customer_review');
  const specialistNotes = feedbacks.filter((f) => f.type === 'specialist_feedback');
  const appBugs = feedbacks.filter((f) => f.type === 'app_bug_report');
  const pendingCount = feedbacks.filter((f) => f.status === 'pending').length;

  const avgRating = customerReviews.length > 0
    ? (customerReviews.reduce((sum, f) => sum + (f.rating || 5), 0) / customerReviews.length).toFixed(1)
    : '4.8';

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (activeTab !== 'all' && f.type !== activeTab) return false;
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.userName.toLowerCase().includes(q) ||
      f.message.toLowerCase().includes(q) ||
      (f.title && f.title.toLowerCase().includes(q)) ||
      (f.bookingRef && f.bookingRef.toLowerCase().includes(q)) ||
      (f.specialistName && f.specialistName.toLowerCase().includes(q))
    );
  });

  const handleEscalateToQA = (feedback: FeedbackItem) => {
    convertFeedbackToQualityFlag(feedback.id, {
      triggerReason: `Dispute originating from feedback by ${feedback.userName}: "${feedback.message}"`,
      source: 'customer_escalation',
      severity: 'high'
    });
    setActionSuccessMsg(`Feedback successfully converted into a Formal QA Flag. Operations notified.`);
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !message.trim()) return;

    createFeedback({
      type: logType,
      source: logType === 'customer_review' ? 'customer' : logType === 'specialist_feedback' ? 'specialist' : 'platform',
      userName: userName.trim(),
      userEmail: userEmail.trim() || 'operator.logged@sahivahan.com',
      bookingRef: bookingRef.trim() || undefined,
      rating: logType === 'customer_review' ? rating : undefined,
      category,
      title: title.trim() || `${logType.replace('_', ' ').toUpperCase()} Log`,
      message: message.trim(),
      status: 'pending',
    });

    setActionSuccessMsg(`Feedback successfully logged into central SahiVahan repository.`);
    setIsLogModalOpen(false);
    setUserName('');
    setUserEmail('');
    setBookingRef('');
    setTitle('');
    setMessage('');
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <MessageSquareHeart className="w-7 h-7 text-[#154D3F] dark:text-emerald-400" />
            <span>Feedback, CSAT & Field Voice</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Voice of customer inspection reviews, specialist on-site lot reports, and application quality tickets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsLogModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#154D3F] hover:bg-[#0F382E] text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Feedback / Issue</span>
          </button>
        </div>
      </div>

      {/* Action Success Toast */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ROW 1: 4 TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: CSAT Rating (Signature Forest Green) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F382E] via-[#154D3F] to-[#0A261F] text-white shadow-donezo relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Average CSAT</div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
              <Star className="w-4 h-4 fill-amber-300" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">{avgRating}</span>
            <span className="text-xs text-emerald-200/80">/ 5.0</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-100/70">
            Across {customerReviews.length} verified inspection reports
          </div>
        </div>

        {/* Card 2: Customer Reviews */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] shadow-donezo">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Reviews</div>
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            {customerReviews.length}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {customerReviews.filter((c) => (c.rating || 0) >= 4).length} Positive (4★ & 5★)
          </div>
        </div>

        {/* Card 3: Specialist Lot Notes */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] shadow-donezo">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specialist Notes</div>
            <div className="w-8 h-8 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            {specialistNotes.length}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            On-site seller delays & access notes
          </div>
        </div>

        {/* Card 4: Action Required */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] shadow-donezo">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Action</div>
            <div className="w-8 h-8 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-amber-600 dark:text-amber-400">
            {pendingCount}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Unreviewed complaints or tickets
          </div>
        </div>

      </div>

      {/* FILTER & CATEGORY TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'all', label: 'All Feedback', count: feedbacks.length },
            { key: 'customer_review', label: 'Customer Reviews', count: customerReviews.length },
            { key: 'specialist_feedback', label: 'Specialist Lot Notes', count: specialistNotes.length },
            { key: 'app_bug_report', label: 'App Bug & UI Reports', count: appBugs.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-[#154D3F] text-white shadow-xs'
                  : 'bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab.key
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Status Dropdown & Search */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Only</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="converted_to_flag">Converted to Flag</option>
            <option value="resolved">Resolved</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, remarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-48 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* FEEDBACK ITEMS STREAM */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] rounded-3xl p-8">
            <MessageSquareHeart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">
              No feedback records found
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Adjust your category filter or search query to view items.
            </div>
          </div>
        ) : (
          filteredFeedbacks.map((item) => {
            const isReview = item.type === 'customer_review';
            const isSpecialist = item.type === 'specialist_feedback';
            const isApp = item.type === 'app_bug_report';

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] rounded-3xl p-5 sm:p-6 shadow-donezo transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left: Author & Type Badge */}
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isReview
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#154D3F] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : isSpecialist
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    }`}>
                      {isReview && <User className="w-5 h-5" />}
                      {isSpecialist && <Wrench className="w-5 h-5" />}
                      {isApp && <Smartphone className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.userName}
                        </span>
                        
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          isReview
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200'
                            : isSpecialist
                            ? 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200'
                            : 'bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200'
                        }`}>
                          {item.type.replace('_', ' ')}
                        </span>

                        {item.rating && (
                          <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
                            {'★'.repeat(item.rating)}
                            <span className="text-[11px] text-slate-400 font-normal">({item.rating}/5)</span>
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex flex-wrap items-center gap-3">
                        <span>{item.userEmail || item.userPhone}</span>
                        {item.bookingRef && (
                          <span className="font-semibold text-slate-600 dark:text-slate-300">
                            Ref: {item.bookingRef}
                          </span>
                        )}
                        {item.specialistName && (
                          <span className="text-[#154D3F] dark:text-emerald-400 font-semibold">
                            Specialist: {item.specialistName}
                          </span>
                        )}
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Pill & QA Flag Escalation */}
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <select
                      value={item.status}
                      onChange={(e) => updateFeedbackStatus(item.id, e.target.value as any)}
                      className={`text-[11px] font-extrabold rounded-full px-2.5 py-1 border focus:outline-none ${
                        item.status === 'pending'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200'
                          : item.status === 'acknowledged'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200'
                          : item.status === 'converted_to_flag'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="acknowledged">Acknowledged</option>
                      <option value="converted_to_flag">Converted to Flag</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    {/* Escalate to QA Flag button (only for booking-related complaints) */}
                    {item.bookingRef && item.status !== 'converted_to_flag' && (
                      <button
                        type="button"
                        onClick={() => handleEscalateToQA(item)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold transition-colors border border-rose-200 dark:border-rose-800"
                        title="Escalate into an operational Quality Flag"
                      >
                        <Flag className="w-3 h-3 text-rose-500" />
                        <span>Escalate to QA</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Feedback Body Content */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0A0E12] border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  <div className="font-bold mb-1 text-slate-900 dark:text-white">{item.title}</div>
                  "{item.message}"
                </div>

                {/* Response / Notes if present */}
                {item.resolutionReply && (
                  <div className="mt-3 pl-4 border-l-2 border-[#154D3F] text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-[#154D3F] dark:text-emerald-400">Operations Response: </span>
                    <span>{item.resolutionReply}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* LOG MANUAL FEEDBACK MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8F5EE] dark:bg-[#154D3F]/40 text-[#154D3F] dark:text-emerald-400 flex items-center justify-center border border-[#CBEAD8]">
                  <MessageSquareHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Log Feedback or Bug Report
                  </h3>
                  <p className="text-xs text-slate-400">
                    Record offline feedback, customer call notes, or specialist escalations.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Feedback Type
                </label>
                <select
                  value={logType}
                  onChange={(e) => setLogType(e.target.value as FeedbackType)}
                  className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="customer_review">Customer Review (Inspection Post-Delivery)</option>
                  <option value="specialist_feedback">Specialist Field Note (Seller / Lot Delay)</option>
                  <option value="app_bug_report">Application Bug / Improvement Ticket</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Email / Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. rahul@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Booking Reference (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SV-2026-8812"
                    value={bookingRef}
                    onChange={(e) => setBookingRef(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {logType === 'customer_review' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Rating (1 to 5 Stars)
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                      <option value={3}>⭐⭐⭐ (3 - Average)</option>
                      <option value={2}>⭐⭐ (2 - Dissatisfied)</option>
                      <option value={1}>⭐ (1 - Unacceptable)</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title / Summary *
                </label>
                <input
                  type="text"
                  placeholder="e.g. In-depth report saved me from accident vehicle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Feedback Remarks & Details *
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide verbatim notes or issue description..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#154D3F] hover:bg-[#0F382E] text-white text-xs font-bold shadow-sm"
                >
                  Save Feedback
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
