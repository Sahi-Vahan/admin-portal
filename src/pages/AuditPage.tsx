import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  User,
  Tag,
  CalendarCheck,
  ShieldAlert,
  ReceiptIndianRupee
} from 'lucide-react';
import { useAdmin } from '../store/AdminContext';

export const AuditPage: React.FC = () => {
  const { auditLogs } = useAdmin();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter((log) => {
    if (filterCategory !== 'all' && log.category !== filterCategory) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.adminName.toLowerCase().includes(q) ||
      log.resourceId.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Platform Audit Trail & Security Logs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Immutable system log recording all privileged administrative operations, dispatches, document approvals, and financial adjustments.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder focus:border-donezo-green rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-56 sm:w-64 shadow-donezo"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-donezo-lightBorder dark:border-donezo-darkBorder pb-3">
        {[
          { key: 'all', label: 'All Operations' },
          { key: 'booking', label: 'Bookings & Dispatch' },
          { key: 'specialist', label: 'Specialist KYC & Fleet' },
          { key: 'quality', label: 'Quality & Disputes' },
          { key: 'pricing', label: 'Pricing Matrix' },
          { key: 'finance', label: 'Financial Adjustments' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterCategory(tab.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterCategory === tab.key
                ? 'bg-donezo-green text-white shadow-sm'
                : 'bg-white dark:bg-donezo-darkCard text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-donezo-lightBorder dark:border-donezo-darkBorder'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-donezo-darkCard border border-donezo-lightBorder dark:border-donezo-darkBorder rounded-3xl overflow-hidden shadow-donezo">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0E1318] text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-donezo-lightBorder dark:border-donezo-darkBorder">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Operator</th>
                <th className="p-4">Action</th>
                <th className="p-4">Category</th>
                <th className="p-4">Resource ID</th>
                <th className="p-4">Operation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-donezo-darkBorder">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 whitespace-nowrap font-sans">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{log.adminName}</div>
                    <div className="text-[10px] text-donezo-green dark:text-emerald-400 font-bold uppercase">{log.adminRole.replace('_', ' ')}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="text-[11px] font-bold text-donezo-green dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap uppercase text-[10px] text-slate-500 dark:text-slate-400 font-sans">
                    {log.category}
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{log.resourceId}</td>
                  <td className="p-4 font-sans text-slate-600 dark:text-slate-300 text-xs min-w-[300px]">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
