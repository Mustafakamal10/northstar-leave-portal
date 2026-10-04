/**
 * UserProfileCard Component
 * Displays user avatar, name, and designation with a logout icon button.
 */

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getInitials } from '@/utils/initials';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function UserProfileCard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (!user) return null;

  const initials = getInitials(user.name);

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-2xs">
          {initials}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
            {user.name}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {user.designation || (user.role === 'admin' ? 'HR Administrator' : 'Employee')}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        title="Log out"
        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
      >
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Logout</span>
      </button>
    </div>
  );
}
