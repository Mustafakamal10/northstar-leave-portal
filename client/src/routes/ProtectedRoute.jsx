/**
 * ProtectedRoute Component
 * Guards access based on authentication token and authorized user role.
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';

export function ProtectedRoute({ allowedRole, children }) {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect user to their own respective dashboard
    const targetDashboard =
      user.role === ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.EMPLOYEE_DASHBOARD;
    return <Navigate to={targetDashboard} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
