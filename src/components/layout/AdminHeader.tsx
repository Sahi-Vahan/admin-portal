import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  ExternalLink,
  Menu,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Shield,
  Sun,
  Moon,
  Command,
  Plus
} from 'lucide-react';
import { useAdmin } from '../../store/AdminContext';
import { useTheme } from '../../store/ThemeContext';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { currentUser, bookings, logout } = useAdmin();
  const { theme, toggleTheme } = useTheme();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unassigned = bookings.filter((b) => b.status === 'paid').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-18 bg-white/80 dark:bg-[#12181E]/80 backdrop-blur-md border-b border-[#E5E9EB] dark:border-[#1E262E] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      
      {/* Mobile Hamburger & Donezo Pill Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Hamburger Toggle (Mobile / Tablet) */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden shrink-0 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Donezo Style Rounded-Full Search Input with ⌘F Shortcut */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search task, bookings, specialist..."
            className="w-full bg-[#F4F6F8] dark:bg-[#0A0E12] border border-[#E5E9EB] dark:border-[#1E262E] focus:border-[#154D3F] dark:focus:border-emerald-500 rounded-full pl-10 pr-12 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              <span>⌘</span><span>F</span>
            </span>
          </div>
        </div>

      </div>

      {/* Donezo Right Controls (Bell, Theme Toggle, User Profile) */}
      <div className="flex items-center gap-2.5 sm:gap-3 ml-3">
        
        {/* Customer Portal Shortcut */}
        <a
          href="http://127.0.0.1:3000"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#154D3F] dark:hover:text-emerald-400 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <span>Customer</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Theme Switcher Toggle (Sun / Moon) */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notifications Icon Button with badge (Donezo style) */}
        <div className="relative w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center cursor-pointer transition-all shadow-2xs hover:scale-105">
          <Bell className="w-4 h-4" />
          {unassigned > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
              {unassigned}
            </span>
          )}
        </div>

        {/* User Profile Pill (Donezo style with circular avatar and sub-email) */}
        <div className="relative pl-1" ref={dropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-left"
            aria-expanded={userDropdownOpen}
          >
            {/* Donezo circular memoji / avatar */}
            <div className="w-9 h-9 rounded-full bg-[#E8F5EE] dark:bg-[#154D3F] border border-[#CBEAD8] dark:border-emerald-600/40 text-[#154D3F] dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center shadow-xs">
              {currentUser.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
            </div>
            
            <div className="hidden sm:block leading-tight text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <span>{currentUser.name}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[120px]">
                {currentUser.email}
              </div>
            </div>
          </button>

          {/* User Popover Menu */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#12181E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white text-xs">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F5EE] dark:bg-[#154D3F]/40 text-[#154D3F] dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  <Shield className="w-3 h-3" />
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                <Link
                  to="/admin/login"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#154D3F] dark:text-emerald-400" />
                  <span>Switch Operator Role</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
