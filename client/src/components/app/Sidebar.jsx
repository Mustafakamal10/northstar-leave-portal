/**
 * Sidebar Navigation Component
 * Fixed left navigation bar customized by user role (employee or admin).
 */

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Logo } from '@/components/common/Logo';
import { SidebarItem } from './SidebarItem';
import { UserProfileCard } from './UserProfileCard';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';
import {
  LayoutDashboard,
  CalendarDays,
  FilePlus,
  Users,
  CheckSquare
} from 'lucide-react';

export function Sidebar({ onCloseMobile }) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === ROLES.ADMIN;

  return (
    <aside className="w-[280px] h-full flex flex-col justify-between bg-white border-r border-slate-200/80 p-5 select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-1 pt-1">
          <Logo />
        </div>

        {/* Section Heading & Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            {isAdmin ? 'Admin Workspace' : 'Employee Workspace'}
          </p>

          <nav className="space-y-1">
            {isAdmin ? (
              <>
                <SidebarItem
                  to={ROUTES.ADMIN_DASHBOARD}
                  icon={LayoutDashboard}
                  label="Dashboard"
                  onClick={onCloseMobile}
                />
                <SidebarItem
                  to={ROUTES.ADMIN_LEAVE_REQUESTS}
                  icon={CheckSquare}
                  label="Leave Requests"
                  onClick={onCloseMobile}
                />
                <SidebarItem
                  to={ROUTES.ADMIN_EMPLOYEES}
                  icon={Users}
                  label="Employees"
                  onClick={onCloseMobile}
                />
              </>
            ) : (
              <>
                <SidebarItem
                  to={ROUTES.EMPLOYEE_DASHBOARD}
                  icon={LayoutDashboard}
                  label="Dashboard"
                  onClick={onCloseMobile}
                />
                <SidebarItem
                  to={ROUTES.EMPLOYEE_MY_LEAVES}
                  icon={CalendarDays}
                  label="My Leaves"
                  onClick={onCloseMobile}
                />
                <SidebarItem
                  to={ROUTES.EMPLOYEE_APPLY_LEAVE}
                  icon={FilePlus}
                  label="Apply Leave"
                  onClick={onCloseMobile}
                />
              </>
            )}
          </nav>
        </div>
      </div>

      {/* User Profile at bottom */}
      <div className="pt-4 border-t border-slate-100">
        <UserProfileCard />
      </div>
    </aside>
  );
}
