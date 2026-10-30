import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ScrollToTop } from '../common/ScrollToTop';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-[#F4F6F8] dark:bg-[#0A0E12] text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">
      <ScrollToTop />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          <div key={location.pathname} className="page-transition-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
