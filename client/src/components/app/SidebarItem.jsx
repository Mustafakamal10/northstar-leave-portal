/**
 * SidebarItem Component
 * Single navigation item link with icon and active styling.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function SidebarItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-2xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-colors',
              isActive ? 'text-indigo-600' : 'text-slate-400'
            )}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
