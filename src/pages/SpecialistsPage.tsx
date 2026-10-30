import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Award,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  FileText,
  CreditCard,
  Building2,
  MapPin,
  ChevronRight,
  ExternalLink,
  Plus,
  UserPlus,
  X
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';
import { AdminSpecialist } from '../types/admin';

export const SpecialistsPage: React.FC = () => {
  const { specialists, verifySpecialistDoc, updateSpecialistStatus, createSpecialist } = useAdmin();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<AdminSpecialist | null>(null);

  // Onboard Specialist Modal State
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [specName, setSpecName] = useState('');
  const [specBadge, setSpecBadge] = useState('Senior Diagnostic Specialist');
  const [specPhone, setSpecPhone] = useState('');
  const [specEmail, setSpecEmail] = useState('');
  const [specCity, setSpecCity] = useState('Bengaluru');
  const [specZones, setSpecZones] = useState('Indiranagar, Koramangala, Whitefield');
  const [specLicense, setSpecLicense] = useState('');
  const [specBankName, setSpecBankName] = useState('HDFC Bank');
  const [specAccountNum, setSpecAccountNum] = useState('');
  const [specIfsc, setSpecIfsc] = useState('HDFC0001234');
  const [specStatus, setSpecStatus] = useState<'active' | 'pending_verification'>('active');
  const [onboardSuccessMsg, setOnboardSuccessMsg] = useState('');

  const filtered = specialists.filter((s) => {
    if (activeTab === 'pending') return s.status === 'pending_verification';
    if (activeTab === 'active') return s.status === 'active';
    if (activeTab === 'suspended') return s.status === 'suspended';
    return true;
  }).filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.badge.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
  });

  const handleDocAction = (
    specialistId: string,
    docKey: 'aadhaar' | 'policeClearance' | 'license' | 'certifications',
    status: 'verified' | 'rejected'
  ) => {
    verifySpecialistDoc(specialistId, docKey, status);
    if (selectedSpecialist && selectedSpecialist.id === specialistId) {
      setSelectedSpecialist((prev) =>
        prev
          ? {
              ...prev,
              documents: {
                ...prev.documents,
                [docKey]: { ...prev.documents[docKey], status },
              },
            }
          : null
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-[#154D3F] dark:text-emerald-400" /> Specialist Fleet & KYC Verification
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Empanelment vetting, government background verification, calibrated tool audit, and fleet status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsOnboardModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#154D3F] hover:bg-[#0F382E] text-white text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Specialist</span>
          </button>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, badge, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 focus:border-[#154D3F] rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-56 sm:w-72 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {onboardSuccessMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{onboardSuccessMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { key: 'all', label: 'All Fleet', count: specialists.length },
          {
            key: 'pending',
            label: 'Pending KYC Vetting',
            count: specialists.filter((s) => s.status === 'pending_verification').length,
            urgent: true,
          },
          { key: 'active', label: 'Active Specialists', count: specialists.filter((s) => s.status === 'active').length },
          { key: 'suspended', label: 'Suspended', count: specialists.filter((s) => s.status === 'suspended').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-[#154D3F] text-white shadow-sm'
                : 'bg-white dark:bg-[#12181E] text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : tab.urgent && tab.count > 0 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Specialists Table */}
      <div className="bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] rounded-3xl overflow-hidden shadow-donezo">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-[#F4F6F8] dark:bg-slate-900/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 pl-6">Specialist</th>
                <th className="p-4">Badge ID</th>
                <th className="p-4">Assigned Service Zones</th>
                <th className="p-4">Performance Rating</th>
                <th className="p-4">KYC Vetting Status</th>
                <th className="p-4">Hardware Tools</th>
                <th className="p-4">Fleet Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map((s) => {
                const verifiedDocsCount = Object.values(s.documents).filter((d) => d.status === 'verified').length;
                const totalDocs = Object.keys(s.documents).length;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Specialist Name & Phone */}
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{s.name}</div>
                      <div className="text-[11px] text-slate-400">{s.phone}</div>
                    </td>

                    {/* Badge */}
                    <td className="p-4">
                      <span className="font-mono font-bold text-cyan-400 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                        {s.badge}
                      </span>
                    </td>

                    {/* Zones */}
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{s.city}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{s.zones.join(', ')}</div>
                    </td>

                    {/* Rating & Jobs */}
                    <td className="p-4">
                      {s.rating > 0 ? (
                        <div>
                          <div className="font-bold text-amber-400">★ {s.rating} / 5.0</div>
                          <div className="text-[10px] text-slate-400">{s.completedJobsCount} inspections completed</div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">No ratings yet</span>
                      )}
                    </td>

                    {/* KYC Vetting */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            verifiedDocsCount === totalDocs
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {verifiedDocsCount} / {totalDocs} Docs Verified
                        </span>
                      </div>
                    </td>

                    {/* Hardware Tools */}
                    <td className="p-4">
                      <span className="text-[11px] font-semibold text-slate-300">
                        {s.tools.length} Calibrated Devices
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          s.status === 'active'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : s.status === 'pending_verification'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedSpecialist(s)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Specialist KYC Dossier Modal */}
      {selectedSpecialist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-white">{selectedSpecialist.name}</h3>
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {selectedSpecialist.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Joined {selectedSpecialist.joinedDate} • Operating Zone: {selectedSpecialist.city}
                </p>
              </div>

              <button
                onClick={() => setSelectedSpecialist(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Document Verification Cards */}
            <div className="my-6 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Government & Background Verification Records
              </h4>

              {/* Aadhaar */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Government ID (Aadhaar / UIDAI)</div>
                  <div className="text-xs text-slate-400">Ref: {selectedSpecialist.documents.aadhaar.ref}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      selectedSpecialist.documents.aadhaar.status === 'verified'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {selectedSpecialist.documents.aadhaar.status}
                  </span>
                  {selectedSpecialist.documents.aadhaar.status !== 'verified' && (
                    <button
                      onClick={() => handleDocAction(selectedSpecialist.id, 'aadhaar', 'verified')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>

              {/* Police Clearance */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Police Clearance Certificate</div>
                  <div className="text-xs text-slate-400">Expiry: {selectedSpecialist.documents.policeClearance.expiry}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      selectedSpecialist.documents.policeClearance.status === 'verified'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {selectedSpecialist.documents.policeClearance.status}
                  </span>
                  {selectedSpecialist.documents.policeClearance.status !== 'verified' && (
                    <button
                      onClick={() => handleDocAction(selectedSpecialist.id, 'policeClearance', 'verified')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>

              {/* Driving License */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Commercial Driving License (LMV / Transport)</div>
                  <div className="text-xs text-slate-400">Number: {selectedSpecialist.documents.license.number}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      selectedSpecialist.documents.license.status === 'verified'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {selectedSpecialist.documents.license.status}
                  </span>
                  {selectedSpecialist.documents.license.status !== 'verified' && (
                    <button
                      onClick={() => handleDocAction(selectedSpecialist.id, 'license', 'verified')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{selectedSpecialist.documents.certifications.title}</div>
                  <div className="text-xs text-slate-400">Issuer: {selectedSpecialist.documents.certifications.issuer}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {selectedSpecialist.documents.certifications.status}
                  </span>
                </div>
              </div>

              {/* Bank Details */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-400" /> Penny-Drop Bank Account
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      selectedSpecialist.bankDetails.isVerified
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {selectedSpecialist.bankDetails.isVerified ? 'Penny-Drop Match' : 'Unverified'}
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-2 font-mono">
                  {selectedSpecialist.bankDetails.bankName} • {selectedSpecialist.bankDetails.accountMasked}
                </div>
                <div className="text-[11px] text-slate-400">
                  IFSC: {selectedSpecialist.bankDetails.ifsc} • Beneficiary: {selectedSpecialist.bankDetails.accountHolder}
                </div>
              </div>
            </div>

            {/* Fleet Status Management Controls */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Current Status: <strong className="text-white uppercase">{selectedSpecialist.status}</strong>
              </div>

              <div className="flex items-center gap-2">
                {selectedSpecialist.status !== 'active' && (
                  <button
                    onClick={() => {
                      updateSpecialistStatus(selectedSpecialist.id, 'active');
                      setSelectedSpecialist((prev) => (prev ? { ...prev, status: 'active' } : null));
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Approve & Activate Fleet ID
                  </button>
                )}

                {selectedSpecialist.status === 'active' && (
                  <button
                    onClick={() => {
                      updateSpecialistStatus(selectedSpecialist.id, 'suspended');
                      setSelectedSpecialist((prev) => (prev ? { ...prev, status: 'suspended' } : null));
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Suspend Specialist
                  </button>
                )}

                <button
                  onClick={() => setSelectedSpecialist(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ONBOARD SPECIALIST MODAL */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8F5EE] dark:bg-[#154D3F]/40 text-[#154D3F] dark:text-emerald-400 flex items-center justify-center border border-[#CBEAD8]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Onboard Fleet Specialist
                  </h3>
                  <p className="text-xs text-slate-400">
                    Register an automotive diagnostic specialist to the SahiVahan field network.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOnboardModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!specName.trim() || !specPhone.trim()) return;
                const newS = createSpecialist({
                  name: specName.trim(),
                  badge: specBadge,
                  phone: specPhone.trim(),
                  email: specEmail.trim() || `${specName.toLowerCase().replace(/\s+/g, '')}@fleet.sahivahan.com`,
                  city: specCity.trim(),
                  zones: specZones.split(',').map((z) => z.trim()).filter(Boolean),
                  licenseNumber: specLicense.trim() || `DL-${Math.floor(10000000 + Math.random() * 90000000)}`,
                  tools: ['Elcometer Paint Gauge', 'OBD-II Bluetooth Scanner', 'Tread Depth Gauge', 'Digital Multimeter'],
                  bankName: specBankName,
                  accountNumber: specAccountNum.trim() || '987654321012',
                  ifsc: specIfsc.trim(),
                  status: specStatus,
                });
                setOnboardSuccessMsg(`Specialist ${newS.name} (${newS.id}) onboarded successfully.`);
                setIsOnboardModalOpen(false);
                setSpecName('');
                setSpecPhone('');
                setSpecEmail('');
                setSpecLicense('');
                setSpecAccountNum('');
                setTimeout(() => setOnboardSuccessMsg(''), 5000);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Specialist Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anand Mahindra"
                  value={specName}
                  onChange={(e) => setSpecName(e.target.value)}
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
                    placeholder="+91 98765 11223"
                    value={specPhone}
                    onChange={(e) => setSpecPhone(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    placeholder="anand@fleet.sahivahan.com"
                    value={specEmail}
                    onChange={(e) => setSpecEmail(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary City Metro
                  </label>
                  <select
                    value={specCity}
                    onChange={(e) => setSpecCity(e.target.value)}
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
                    Specialist Tier
                  </label>
                  <select
                    value={specBadge}
                    onChange={(e) => setSpecBadge(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Senior Diagnostic Specialist">Senior Diagnostic Specialist (Tier 1)</option>
                    <option value="Certified Powertrain Specialist">Certified Powertrain Specialist (Tier 2)</option>
                    <option value="Electric Vehicle Inspector">Electric Vehicle Inspector (EV Specialist)</option>
                    <option value="Junior Vehicle Inspector">Junior Field Inspector (Probation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Geographic Zones (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indiranagar, Whitefield, Koramangala"
                  value={specZones}
                  onChange={(e) => setSpecZones(e.target.value)}
                  className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Driving License / Badge No.
                  </label>
                  <input
                    type="text"
                    placeholder="KA01 20200012345"
                    value={specLicense}
                    onChange={(e) => setSpecLicense(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Fleet Status
                  </label>
                  <select
                    value={specStatus}
                    onChange={(e) => setSpecStatus(e.target.value as any)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="active">Active (Verified & Dispatachable)</option>
                    <option value="pending_verification">Pending KYC Verification</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#154D3F] hover:bg-[#0F382E] text-white text-xs font-bold shadow-sm"
                >
                  Onboard Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
