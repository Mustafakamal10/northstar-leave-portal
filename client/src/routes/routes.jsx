/**
 * Main Application Routes Configuration
 * Configures role-guarded routes, public routes, and root navigation redirects.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@/layout/AppLayout';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';

// Pages
import { Login } from '@/pages/auth/Login';
import { EmployeeDashboard } from '@/pages/employee/EmployeeDashboard';
import { MyLeaves } from '@/pages/employee/MyLeaves';
import { ApplyLeave } from '@/pages/employee/ApplyLeave';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminLeaveRequests } from '@/pages/admin/AdminLeaveRequests';
import { Employees } from '@/pages/admin/Employees';

function RootRedirect() {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user.role === ROLES.ADMIN) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return <Navigate to={ROUTES.EMPLOYEE_DASHBOARD} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Login */}
      <Route path={ROUTES.LOGIN} element={<Login />} />

      {/* Employee Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRole={ROLES.EMPLOYEE}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.EMPLOYEE_DASHBOARD} element={<EmployeeDashboard />} />
        <Route path={ROUTES.EMPLOYEE_MY_LEAVES} element={<MyLeaves />} />
        <Route path={ROUTES.EMPLOYEE_APPLY_LEAVE} element={<ApplyLeave />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRole={ROLES.ADMIN}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN_LEAVE_REQUESTS} element={<AdminLeaveRequests />} />
        <Route path={ROUTES.ADMIN_EMPLOYEES} element={<Employees />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default AppRoutes;
