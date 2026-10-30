import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { BookingsPage } from '../pages/BookingsPage';
import { SpecialistsPage } from '../pages/SpecialistsPage';
import { QualityFlagsPage } from '../pages/QualityFlagsPage';
import { PricingCatalogPage } from '../pages/PricingCatalogPage';
import { FinancePage } from '../pages/FinancePage';
import { AuditPage } from '../pages/AuditPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { CustomersPage } from '../pages/CustomersPage';
import { ReportDetailPage } from '../pages/ReportDetailPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { useAdmin } from '../store/AdminContext';

const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAdmin();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/',
    element: (
      <AdminAuthGuard>
        <AdminLayout />
      </AdminAuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'admin/dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'admin/bookings',
        element: <BookingsPage />,
      },
      {
        path: 'admin/customers',
        element: <CustomersPage />,
      },
      {
        path: 'admin/reports/:bookingRef',
        element: <ReportDetailPage />,
      },
      {
        path: 'admin/specialists',
        element: <SpecialistsPage />,
      },
      {
        path: 'admin/quality',
        element: <QualityFlagsPage />,
      },
      {
        path: 'admin/feedback',
        element: <FeedbackPage />,
      },
      {
        path: 'admin/users',
        element: <AdminUsersPage />,
      },
      {
        path: 'admin/pricing',
        element: <PricingCatalogPage />,
      },
      {
        path: 'admin/finance',
        element: <FinancePage />,
      },
      {
        path: 'admin/audit',
        element: <AuditPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/admin/dashboard" replace />,
  },
]);
