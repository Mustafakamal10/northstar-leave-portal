/**
 * Brand Logo Component
 * Renders the custom Northstar four-pointed star & compass logo with optional text.
 */

import React from 'react';
import { cn } from '@/lib/utils';

export function LogoIcon({ className }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-xs shrink-0',
        className || 'h-9 w-9'
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
      >
        {/* Northstar 4-pointed Star */}
        <path
          d="M12 2 L14 9.5 L21.5 12 L14 14.5 L12 22 L10 14.5 L2.5 12 L10 9.5 Z"
          fill="currentColor"
        />
        <circle cx="12" cy="12" r="1.8" fill="#c7d2fe" />
      </svg>
    </div>
  );
}

export function Logo({ showText = true, className, size = 'default' }) {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className={cn('flex items-center gap-3 select-none', className)}>
      <LogoIcon className={isLarge ? 'h-11 w-11' : isSmall ? 'h-7 w-7' : 'h-9 w-9'} />
      {showText && (
        <div className="leading-tight">
          <h2
            className={cn(
              'font-bold text-slate-900 tracking-tight',
              isLarge ? 'text-xl' : isSmall ? 'text-sm' : 'text-base'
            )}
          >
            Northstar
          </h2>
          <p
            className={cn(
              'font-bold tracking-widest uppercase text-indigo-600',
              isLarge ? 'text-[11px] mt-0.5' : 'text-[9.5px] mt-0.5'
            )}
          >
            Leave Portal
          </p>
        </div>
      )}
    </div>
  );
}

export default Logo;
