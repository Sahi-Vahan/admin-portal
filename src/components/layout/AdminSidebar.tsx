import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  ShieldAlert,
  Tag,
  ReceiptIndianRupee,
  History,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
  Car,
  UserCheck,
  X,
  LogOut,
  Smartphone,
  ExternalLink,
  Sliders,
  Settings,
  HelpCircle,
  FileCheck2,
  MessageSquareHeart,
  UserCog
} from 'lucide-react';
import { useAdmin } from '../../store/AdminContext';
import { AdminRole } from '../../types/admin';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { bookings, specialists, qualityFlags, customers, adminUsers, feedbacks, currentUser, switchRole, logout } = useAdmin();

  const unassignedCount = bookings.filter((b) => b.status === 'paid').length;
  const pendingSpecsCount = specialists.filter((s) => s.status === 'pending_verification').length;
  const activeFlagsCount = qualityFlags.filter((f) => f.status === 'pending_review' || f.status === 'clarification_requested').length;
  const pendingFeedbackCount = (feedbacks || []).filter((f) => f.status === 'pending').length;

  const menuNavLinks = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-[18px] h-[18px]" />,
    },
    {
      to: '/admin/bookings',
      label: 'Bookings & Dispatch',
      icon: <CalendarCheck className="w-[18px] h-[18px]" />,
      badge: unassignedCount > 0 ? `${unassignedCount}` : undefined,
      badgeColor: 'bg-[#154D3F] text-white dark:bg-emerald-500 dark:text-slate-950',
    },
    {
      to: '/admin/customers',
      label: 'Customer Accounts',
      icon: <Users className="w-[18px] h-[18px]" />,
      badge: customers.length > 0 ? `${customers.length}` : undefined,
      badgeColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      to: '/admin/specialists',
      label: 'Specialist Fleet & KYC',
      icon: <UserCheck className="w-[18px] h-[18px]" />,
      badge: pendingSpecsCount > 0 ? `${pendingSpecsCount}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold',
    },
    {
      to: '/admin/quality',
      label: 'QA & Quality Flags',
      icon: <ShieldAlert className="w-[18px] h-[18px]" />,
      badge: activeFlagsCount > 0 ? `${activeFlagsCount}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold',
    },
    {
      to: '/admin/feedback',
      label: 'Feedback & Reviews',
      icon: <MessageSquareHeart className="w-[18px] h-[18px]" />,
      badge: pendingFeedbackCount > 0 ? `${pendingFeedbackCount}` : undefined,
      badgeColor: 'bg-emerald-100 text-[#154D3F] dark:bg-emerald-950 dark:text-emerald-300 font-bold',
    },
    {
      to: '/admin/pricing',
      label: 'Pricing & Catalog',
      icon: <Tag className="w-[18px] h-[18px]" />,
    },
    {
      to: '/admin/finance',
      label: 'Finance & Payouts',
      icon: <ReceiptIndianRupee className="w-[18px] h-[18px]" />,
    },
  ];

  const generalNavLinks = [
    {
      to: '/admin/users',
      label: 'Team & Admin Roles',
      icon: <UserCog className="w-[18px] h-[18px]" />,
      badge: adminUsers?.length ? `${adminUsers.length}` : undefined,
      badgeColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      to: '/admin/audit',
      label: 'Audit Trail',
      icon: <History className="w-[18px] h-[18px]" />,
    },
  ];

  const handleSignOut = () => {
    onClose();
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Donezo Style Floating / Integrated Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#12181E] border-r border-[#E5E9EB] dark:border-[#1E262E] flex flex-col justify-between overflow-y-auto transition-all duration-300 ease-in-out lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="p-4 sm:p-5">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 pt-1 border-b border-slate-100 dark:border-slate-800/80">
            <NavLink to="/admin/dashboard" className="flex items-center gap-2.5 group">
              {/* Donezo Style Green Icon Badge */}
              <div className="w-10 h-10 rounded-2xl bg-[#E8F5EE] dark:bg-[#154D3F]/40 border border-[#CBEAD8] dark:border-emerald-600/30 flex items-center justify-center text-[#154D3F] dark:text-emerald-400 shadow-sm group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight leading-none flex items-center gap-1.5">
                  SahiVahan
                </div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-1">
                  Central Ops
                </div>
              </div>
            </NavLink>

            {/* Mobile close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MENU SECTION (Donezo style) */}
          <div className="mt-6">
            <div className="px-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              Menu
            </div>
            <nav className="space-y-1">
              {menuNavLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'text-[#154D3F] dark:text-emerald-400 font-bold bg-[#E8F5EE] dark:bg-[#154D3F]/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Left vertical pill indicator on active link */}
                      {isActive && (
                        <span className="absolute -left-1 top-2 bottom-2 w-1.5 bg-[#154D3F] dark:bg-emerald-400 rounded-r-full" />
                      )}
                      <div className="flex items-center gap-3">
                        <span
                          className={`transition-colors ${
                            isActive
                              ? 'text-[#154D3F] dark:text-emerald-400'
                              : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* GENERAL SECTION (Donezo style) */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="px-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
              General
            </div>
            <nav className="space-y-1">
              {generalNavLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'text-[#154D3F] dark:text-emerald-400 font-bold bg-[#E8F5EE] dark:bg-[#154D3F]/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              ))}

              {/* RBAC Role Selector in General */}
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl mt-2 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">
                  <span>RBAC Role</span>
                  <span className="text-[#154D3F] dark:text-emerald-400 font-extrabold">Active</span>
                </div>
                <select
                  value={currentUser.role}
                  onChange={(e) => switchRole(e.target.value as AdminRole)}
                  className="w-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#154D3F]"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="operations">Operations Dispatch</option>
                  <option value="quality_reviewer">QA Reviewer</option>
                  <option value="finance_controller">Finance Controller</option>
                </select>
              </div>

              {/* Sign Out Link */}
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
              >
                <LogOut className="w-[18px] h-[18px]" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* BOTTOM USER PROFILE CARD (Donezo style) */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#0A0E12] m-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#E8F5EE] dark:bg-[#154D3F] border border-[#CBEAD8] dark:border-emerald-600/40 text-[#154D3F] dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center shadow-xs">
                {currentUser.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#12181E]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                {currentUser.email}
              </div>
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F5EE] dark:bg-[#154D3F]/50 text-[#154D3F] dark:text-emerald-300 text-[9px] font-extrabold uppercase tracking-wider">
                <Shield className="w-2.5 h-2.5" />
                {currentUser.role.replace('_', ' ')}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
