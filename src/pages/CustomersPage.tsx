import React, { useState } from 'react';
import {
  User,
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  ReceiptIndianRupee,
  FileText,
  Star,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  ArrowUpRight,
  Plus,
  UserPlus,
  X,
  CheckCircle2
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';
import { AdminCustomer } from '../types/admin';
import { Link } from 'react-router-dom';

export const CustomersPage: React.FC = () => {
  const { customers, bookings, addCustomerNote, createCustomer } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'vip' | 'active'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [newNote, setNewNote] = useState('');

  // Create Customer Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custCity, setCustCity] = useState('Bengaluru');
  const [custAddress, setCustAddress] = useState('');
  const [custStatus, setCustStatus] = useState<'active' | 'vip'>('active');
  const [custNotes, setCustNotes] = useState('');
  const [createSuccessMsg, setCreateSuccessMsg] = useState('');

  // Metrics
  const totalSpend = customers.reduce((sum, c) => sum + c.lifetimeSpend, 0);
  const totalBookingsCount = customers.reduce((sum, c) => sum + c.totalBookings, 0);
  const vipCount = customers.filter((c) => c.status === 'vip').length;

  const filteredCustomers = customers.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newNote.trim()) return;

    addCustomerNote(selectedCustomer.id, newNote.trim());
    setSelectedCustomer((prev) =>
      prev ? { ...prev, notes: prev.notes ? `${prev.notes} | ${newNote.trim()}` : newNote.trim() } : null
    );
    setNewNote('');
  };

  const getCustomerBookings = (bookingRefs: string[]) => {
    return bookings.filter((b) => bookingRefs.includes(b.bookingRef));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-[#154D3F] dark:text-emerald-400" /> Customer Directory & Accounts
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Complete customer profiles, booking history, lifetime platform spend, and vehicle inspection dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#154D3F] hover:bg-[#0F382E] text-white text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Customer</span>
          </button>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer name, phone, email, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 focus:border-[#154D3F] rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-56 sm:w-72 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {createSuccessMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{createSuccessMsg}</span>
        </div>
      )}

      {/* Donezo Style KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] rounded-3xl shadow-donezo flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Registered Buyers</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{customers.length}</div>
          </div>
          <div className="w-11 h-11 bg-[#E8F5EE] dark:bg-[#154D3F]/30 text-[#154D3F] dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] rounded-3xl shadow-donezo flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Inspections Booked</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalBookingsCount}</div>
          </div>
          <div className="w-11 h-11 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] rounded-3xl shadow-donezo flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cumulative Lifetime Spend</div>
            <div className="text-3xl font-black text-[#154D3F] dark:text-emerald-400 mt-1 font-mono">₹{totalSpend.toLocaleString()}</div>
          </div>
          <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <ReceiptIndianRupee className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] rounded-3xl shadow-donezo flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">VIP Power Buyers</div>
            <div className="text-3xl font-black text-amber-500 mt-1">{vipCount}</div>
          </div>
          <div className="w-11 h-11 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Donezo Style Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { key: 'all', label: 'All Customers', count: customers.length },
          { key: 'vip', label: 'VIP Repeat Buyers', count: vipCount },
          { key: 'active', label: 'Active Buyers', count: customers.filter((c) => c.status === 'active').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              statusFilter === tab.key
                ? 'bg-[#154D3F] text-white shadow-sm'
                : 'bg-white dark:bg-[#12181E] text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Customers Table (Donezo Style Clean Card) */}
      <div className="bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] rounded-3xl overflow-hidden shadow-donezo">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-[#F4F6F8] dark:bg-slate-900/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 pl-6">Customer Name</th>
                <th className="p-4">Contact Channels</th>
                <th className="p-4">Location</th>
                <th className="p-4">Inspections</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4">Tier Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No customers found matching search filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {c.id}</div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.email}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#154D3F] dark:text-emerald-400" /> {c.city}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{c.totalBookings} Completed</div>
                      {c.activeBookingsCount > 0 && (
                        <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
                          {c.activeBookingsCount} Active Slot
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-[#154D3F] dark:text-emerald-400 font-mono text-sm">
                        ₹{c.lifetimeSpend.toLocaleString()}
                      </div>
                    </td>

                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      <div>{c.lastBookingDate}</div>
                      <div className="text-[10px] text-slate-400">Joined {c.registeredDate}</div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          c.status === 'vip'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-[#E8F5EE] text-[#154D3F] dark:bg-[#154D3F]/40 dark:text-emerald-300'
                        }`}
                      >
                        {c.status === 'vip' ? <Sparkles className="w-3 h-3 text-amber-500" /> : <ShieldCheck className="w-3 h-3 text-[#154D3F]" />}
                        {c.status} Buyer
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-[#154D3F] text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-[#154D3F] rounded-full text-xs font-bold transition-all shadow-2xs"
                      >
                        View Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Dossier Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedCustomer.name}</h3>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      selectedCustomer.status === 'vip'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-[#E8F5EE] text-[#154D3F] dark:bg-[#154D3F]/40 dark:text-emerald-300'
                    }`}
                  >
                    {selectedCustomer.status} Tier
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customer ID: {selectedCustomer.id} • Registered {selectedCustomer.registeredDate}
                </p>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Contact & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Primary Phone</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">{selectedCustomer.phone}</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Email Address</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 truncate">{selectedCustomer.email}</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">City / Location</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">{selectedCustomer.city}</div>
              </div>
            </div>

            {/* Address */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mb-6">
              <span className="font-bold text-slate-900 dark:text-white">Registered Address: </span>
              {selectedCustomer.address}
            </div>

            {/* Booking History for this Customer */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Associated Vehicle Bookings</span>
                <span className="text-[#154D3F] dark:text-emerald-400">{getCustomerBookings(selectedCustomer.bookingRefs).length} Records</span>
              </h4>

              <div className="space-y-2">
                {getCustomerBookings(selectedCustomer.bookingRefs).map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-[#154D3F] dark:text-emerald-400">{b.bookingRef}</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                        {b.vehicle.year} {b.vehicle.make} {b.vehicle.model}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Slot: {b.appointment?.date || 'N/A'} ({b.appointment?.window || 'N/A'}) • {b.location?.area || ''}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">₹{b.pricing.total.toLocaleString()}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {b.status}
                      </span>
                      {b.status === 'submitted' && (
                        <div className="mt-1">
                          <Link
                            to={`/admin/reports/${b.bookingRef}`}
                            className="text-[10px] font-bold text-[#154D3F] dark:text-emerald-400 hover:underline flex items-center gap-1 justify-end"
                          >
                            <FileText className="w-3 h-3" /> View Report
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Notes on Customer */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Internal Operational Notes
              </label>
              {selectedCustomer.notes && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                  {selectedCustomer.notes}
                </div>
              )}

              <form onSubmit={handleAddNote} className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add confidential customer note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#154D3F]"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-4 py-2 bg-[#154D3F] hover:bg-[#0F382E] text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Save Note
                </button>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold hover:bg-slate-200"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CUSTOMER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8F5EE] dark:bg-[#154D3F]/40 text-[#154D3F] dark:text-emerald-400 flex items-center justify-center border border-[#CBEAD8]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Create Customer Account
                  </h3>
                  <p className="text-xs text-slate-400">
                    Register a new vehicle buyer directly into central SahiVahan database.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!custName.trim() || !custPhone.trim()) return;
                const newC = createCustomer({
                  name: custName.trim(),
                  phone: custPhone.trim(),
                  email: custEmail.trim() || `${custName.toLowerCase().replace(/\s+/g, '')}@buyer.sahivahan.com`,
                  city: custCity.trim(),
                  address: custAddress.trim() || 'Central Metro Hub',
                  status: custStatus,
                  notes: custNotes.trim() || 'Directly registered by Central Admin Ops',
                });
                setCreateSuccessMsg(`Customer ${newC.name} (${newC.id}) created successfully.`);
                setIsCreateModalOpen(false);
                setCustName('');
                setCustPhone('');
                setCustEmail('');
                setCustAddress('');
                setCustNotes('');
                setTimeout(() => setCreateSuccessMsg(''), 5000);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Customer Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Iyer"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="ramesh@example.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City Metro
                  </label>
                  <select
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Account Status
                  </label>
                  <select
                    value={custStatus}
                    onChange={(e) => setCustStatus(e.target.value as any)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="active">Active Customer</option>
                    <option value="vip">VIP Buyer / High Net Worth</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Address Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indiranagar 100ft Rd, Bengaluru"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Onboarding Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead received via corporate dealer channel"
                  value={custNotes}
                  onChange={(e) => setCustNotes(e.target.value)}
                  className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#154D3F] hover:bg-[#0F382E] text-white text-xs font-bold shadow-sm"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
