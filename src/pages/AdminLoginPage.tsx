import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Key,
  Eye,
  EyeOff,
  UserCheck,
  ExternalLink,
  LogOut,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';
import { useTheme } from '../store/ThemeContext';
import { AdminRole } from '../types/admin';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, login, logout } = useAdmin();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('vikram.s@sahivahan.com');
  const [password, setPassword] = useState('SahiVahan#2026MasterKey');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AdminRole>('super_admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selectedRole, email);
      setLoading(false);
      navigate('/admin/dashboard');
    }, 400);
  };

  const handleRolePreset = (role: AdminRole, presetEmail?: string) => {
    setLoading(true);
    setTimeout(() => {
      login(role, presetEmail);
      setLoading(false);
      navigate('/admin/dashboard');
    }, 300);
  };

  const handleSignOutFromLogin = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-donezo-lightBg dark:bg-donezo-dark text-slate-900 dark:text-white relative transition-colors duration-200">
      {/* Top right Theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full border border-donezo-lightBorder dark:border-donezo-darkBorder bg-white dark:bg-donezo-darkCard flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-donezo-green dark:hover:text-emerald-400 transition-colors shadow-sm"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl p-6 sm:p-8 shadow-donezo relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-donezo-green text-white mb-3 shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">SahiVahan</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-donezo-greenLight dark:bg-emerald-950/40 text-donezo-green dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
              OPS HQ
            </span>
          </div>
          <p className="text-xs font-bold text-donezo-green dark:text-emerald-400 mt-1 uppercase tracking-wider">
            Admin Central Command Center
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5">
            Operations control, specialist dispatch, pricing matrix, and quality review desk.
          </p>
        </div>

        {/* Current Active Session Banner (if already logged in) */}
        {isAuthenticated && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Active Session Detected
              </span>
              <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300">
              Logged in as <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> ({currentUser.email})
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="flex-1 py-2 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleSignOutFromLogin}
                className="py-2 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold transition-all flex items-center gap-1"
                title="Sign out of current account"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" /> Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Fast Role Sign In (One-Click) */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#0E1318] border border-donezo-lightBorder dark:border-donezo-darkBorder space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-donezo-green dark:text-emerald-400" /> Fast Role Sign In (One-Click)
            </span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
              Instant
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleRolePreset('super_admin', 'vikram.s@sahivahan.com')}
              className="p-3 bg-donezo-green hover:bg-donezo-greenHover text-white rounded-2xl text-xs font-bold transition-all text-left shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span>Super Admin</span>
                <ArrowRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[10px] text-emerald-200 font-normal">Vikram Sengupta</div>
            </button>

            <button
              type="button"
              onClick={() => handleRolePreset('operations', 'anita.d@sahivahan.com')}
              className="p-3 bg-white dark:bg-donezo-darkCard hover:bg-slate-100 dark:hover:bg-slate-800 border border-donezo-lightBorder dark:border-donezo-darkBorder text-slate-900 dark:text-white rounded-2xl text-xs font-bold transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span>Operations</span>
                <ArrowRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Anita Desai</div>
            </button>

            <button
              type="button"
              onClick={() => handleRolePreset('quality_reviewer', 'karan.m@sahivahan.com')}
              className="p-3 bg-white dark:bg-donezo-darkCard hover:bg-slate-100 dark:hover:bg-slate-800 border border-donezo-lightBorder dark:border-donezo-darkBorder text-slate-900 dark:text-white rounded-2xl text-xs font-bold transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span>QA Reviewer</span>
                <ArrowRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Karan Mehra</div>
            </button>

            <button
              type="button"
              onClick={() => handleRolePreset('finance_controller', 'pooja.h@sahivahan.com')}
              className="p-3 bg-white dark:bg-donezo-darkCard hover:bg-slate-100 dark:hover:bg-slate-800 border border-donezo-lightBorder dark:border-donezo-darkBorder text-slate-900 dark:text-white rounded-2xl text-xs font-bold transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span>Finance</span>
                <ArrowRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Pooja Hegde</div>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-donezo-lightBorder dark:border-donezo-darkBorder"></div>
          </div>
          <span className="relative bg-white dark:bg-donezo-darkCard px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Or Standard Credentials
          </span>
        </div>

        {/* Standard Credentials Form */}
        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Admin Corporate Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1318] border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              placeholder="operator@sahivahan.com"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Passkey / Security Token
              </label>
              <span className="text-[10px] text-donezo-green dark:text-emerald-400 font-mono font-bold">Demo: SahiVahan#2026</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0E1318] border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-xl px-4 py-2.5 pr-10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-donezo-green focus:ring-donezo-green"
              />
              <span>Remember workstation</span>
            </label>
            <span className="text-slate-400 text-[11px]">256-Bit TLS Secured</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-donezo-green hover:bg-donezo-greenHover text-white font-bold rounded-full text-xs transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In & Access Operations Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Portal Switcher Footer */}
        <div className="mt-6 pt-5 border-t border-donezo-lightBorder dark:border-donezo-darkBorder text-center space-y-2">
          <div className="text-[11px] text-slate-500 font-medium">Looking for customer or specialist portals?</div>
          <div className="flex items-center justify-center gap-3">
            <a
              href="http://127.0.0.1:3000"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-donezo-green dark:hover:text-emerald-400 flex items-center gap-1 font-semibold hover:underline"
            >
              Customer Portal <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a
              href="http://127.0.0.1:3001"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-donezo-green dark:hover:text-emerald-400 flex items-center gap-1 font-semibold hover:underline"
            >
              Specialist Terminal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
