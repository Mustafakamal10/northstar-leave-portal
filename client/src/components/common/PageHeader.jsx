/**
 * PageHeader Component
 * Standard header layout with uppercase indigo eyebrow, primary title, subtitle, and responsive action buttons.
 */

import React from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({ eyebrow, title, subtitle, children, className }) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6', className)}>
      <div className="space-y-0.5">
        {eyebrow && (
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-0.5 sm:mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap pt-1 sm:pt-0">
          {children}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
