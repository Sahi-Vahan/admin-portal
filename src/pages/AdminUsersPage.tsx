import React, { useState } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Mail,
  Phone,
  Building,
  Key,
  Lock,
  Calendar,
  Sparkles,
  AlertCircle,
  X,
  Check
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';
import { AdminRole, AdminUser } from '../types/admin';

export const AdminUsersPage: React.FC = () => {
  const { adminUsers, createAdminUser, updateAdminUserStatus, updateAdminUserRole, deleteAdminUser, currentUser } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | AdminRole>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Central Operations');
  const [role, setRole] = useState<AdminRole>('operations');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Role metadata definitions
  const ROLE_DETAILS: Record<AdminRole, { label: string; desc: string; badge: string; count: number; permissions: string[] }> = {
    super_admin: {
      label: 'Super Admin',
      desc: 'Unrestricted master access across all dispatch, fleet, finance, pricing, audit and RBAC controls.',
      badge: 'bg-emerald-100 text-[#154D3F] dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
      count: adminUsers.filter((u) => u.role === 'super_admin').length,
      permissions: ['All System Permissions', 'RBAC User Creation', 'Pricing Overrides', 'Refund Authorization']
    },
    operations: {
      label: 'Operations Dispatch',
      desc: 'Controls live inspection queues, emergency reassignments, customer booking modifications, and specialist KYC vetting.',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      count: adminUsers.filter((u) => u.role === 'operations').length,
      permissions: ['Booking Dispatch & Reassignment', 'Specialist KYC Verification', 'Slot Management', 'Customer Directory']
    },
    quality_reviewer: {
      label: 'Quality Reviewer',
      desc: 'Audits vehicle inspection reports, verifies paint depth readings & OBD faults, handles customer flags and dispute escalations.',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      count: adminUsers.filter((u) => u.role === 'quality_reviewer').length,
      permissions: ['Inspection Audit & Approval', 'QA Flag Creation & Resolution', 'Checklist Scoring', 'Customer Feedback']
    },
    finance_controller: {
      label: 'Finance Controller',
      desc: 'Manages batch payouts to specialist fleet, customer refund processing, revenue reconciliation, and ledger compliance.',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      count: adminUsers.filter((u) => u.role === 'finance_controller').length,
      permissions: ['Fleet Payout Approvals', 'Customer Refund Processing', 'Razorpay Ledger Auditing', 'Financial Reports']
    }
  };

  const filteredUsers = adminUsers.filter((u) => {
    if (selectedRoleFilter !== 'all' && u.role !== selectedRoleFilter) return false;
    if (selectedStatusFilter !== 'all' && u.status !== selectedStatusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q))
    );
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !email.trim()) {
      setFormError('Please enter a valid full name and work email.');
      return;
    }

    // Email check
    if (!email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (adminUsers.some((u) => u.email.toLowerCase() === email.toLowerCase().trim())) {
      setFormError('A team member with this email address already exists.');
      return;
    }

    try {
      createAdminUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '+91 98765 00000',
        department: department.trim(),
        role,
        status: 'active',
        permissions: ROLE_DETAILS[role].permissions,
      });

      setSuccessMsg(`Successfully invited and provisioned ${name} as ${ROLE_DETAILS[role].label}.`);
      setIsCreateModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setDepartment('Central Operations');
      setRole('operations');

      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      setFormError(err.message || 'Error creating user');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & New Admin Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#154D3F] dark:text-emerald-400" />
            <span>Admin Team & Role Access Control</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Manage administrative team members, grant departmental role permissions, and control operational access levels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#154D3F] hover:bg-[#0F382E] text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Admin User</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ROW 1: 4 RBAC ROLE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(ROLE_DETAILS) as AdminRole[]).map((rKey) => {
          const r = ROLE_DETAILS[rKey];
          const isCurrentActive = currentUser.role === rKey;
          return (
            <div
              key={rKey}
              onClick={() => setSelectedRoleFilter(selectedRoleFilter === rKey ? 'all' : rKey)}
              className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                selectedRoleFilter === rKey
                  ? 'bg-[#E8F5EE] dark:bg-[#154D3F]/30 border-[#154D3F] dark:border-emerald-500 ring-2 ring-[#154D3F]/20'
                  : 'bg-white dark:bg-[#12181E] border-[#E5E9EB] dark:border-[#1E262E] hover:border-slate-300 dark:hover:border-slate-700 shadow-donezo'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${r.badge}`}>
                  {r.label}
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {r.count}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                {r.desc}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Access Tier</span>
                {isCurrentActive ? (
                  <span className="text-[#154D3F] dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Your Active Role
                  </span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {r.permissions.length} Scopes
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] rounded-3xl p-4 shadow-donezo flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search team member name, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] focus:border-[#154D3F] dark:focus:border-emerald-500 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {/* Role and Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value as any)}
            className="bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Roles ({adminUsers.length})</option>
            <option value="super_admin">Super Admins</option>
            <option value="operations">Operations</option>
            <option value="quality_reviewer">Quality Reviewers</option>
            <option value="finance_controller">Finance Controllers</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
            className="bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* TEAM USERS TABLE */}
      <div className="bg-white dark:bg-[#12181E] border border-[#E5E9EB] dark:border-[#1E262E] rounded-3xl overflow-hidden shadow-donezo">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E9EB] dark:border-[#1E262E] bg-slate-50/70 dark:bg-[#0A0E12] text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3.5 px-6">User / Operator</th>
                <th className="py-3.5 px-4">Role & Permissions</th>
                <th className="py-3.5 px-4">Department & Phone</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9EB] dark:divide-[#1E262E] text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No team members found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleMeta = ROLE_DETAILS[u.role] || ROLE_DETAILS.operations;
                  const isCurrent = u.id === currentUser.id;

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#E8F5EE] dark:bg-[#154D3F] border border-[#CBEAD8] dark:border-emerald-600/40 text-[#154D3F] dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                            {u.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#E8F5EE] dark:bg-emerald-950 text-[#154D3F] dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Access Tier */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${roleMeta.badge}`}>
                            <Shield className="w-3 h-3" />
                            {roleMeta.label}
                          </span>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">
                            {u.permissions?.length || 4} permission scopes active
                          </div>
                        </div>
                      </td>

                      {/* Department & Phone */}
                      <td className="py-4 px-4">
                        <div className="text-slate-700 dark:text-slate-300 font-medium">
                          {u.department || 'Operations Team'}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{u.phone || '+91 98765 43210'}</span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => updateAdminUserStatus(u.id, u.status === 'active' ? 'inactive' : 'active')}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                            u.status === 'active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span className="capitalize">{u.status}</span>
                        </button>
                      </td>

                      {/* Last Activity */}
                      <td className="py-4 px-4">
                        <div className="text-slate-600 dark:text-slate-300 font-medium">
                          {u.lastLogin || 'Recent'}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          Joined {u.createdAt || '2026-01-10'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <select
                            value={u.role}
                            onChange={(e) => updateAdminUserRole(u.id, e.target.value as AdminRole)}
                            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 focus:outline-none"
                            title="Reassign role"
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="operations">Operations</option>
                            <option value="quality_reviewer">Quality Reviewer</option>
                            <option value="finance_controller">Finance Controller</option>
                          </select>

                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${u.name} from the administrative team?`)) {
                                  deleteAdminUser(u.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              title="Delete admin account"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ADMIN USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8F5EE] dark:bg-[#154D3F]/40 text-[#154D3F] dark:text-emerald-400 flex items-center justify-center border border-[#CBEAD8] dark:border-emerald-600/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Create Admin Team Member
                  </h3>
                  <p className="text-xs text-slate-400">
                    Grant role-based access control to the SahiVahan Admin Portal.
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

            {/* Error Message */}
            {formError && (
              <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] focus:border-[#154D3F] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ananya@sahivahan.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] focus:border-[#154D3F] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] focus:border-[#154D3F] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] focus:border-[#154D3F] rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-medium"
                  >
                    <option value="Central Operations">Central Operations</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Executive Office">Executive Office</option>
                    <option value="Fleet Management">Fleet Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Access Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminRole)}
                    className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] focus:border-[#154D3F] rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-medium"
                  >
                    <option value="operations">Operations Dispatch</option>
                    <option value="quality_reviewer">Quality Reviewer</option>
                    <option value="finance_controller">Finance Controller</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Role Scope Preview */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#154D3F] dark:text-emerald-400" />
                  <span>Granted Permissions for {ROLE_DETAILS[role].label}:</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ROLE_DETAILS[role].permissions.map((p, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                    >
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#154D3F] hover:bg-[#0F382E] text-white text-xs font-bold transition-all shadow-sm"
                >
                  Provision User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
