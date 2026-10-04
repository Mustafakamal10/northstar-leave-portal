/**
 * Status Badge Component
 * Displays a rounded pill badge with a colored dot matching the status.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG } from '@/constants/statusOptions';

export function StatusBadge({ status, className }) {
  const normalized = (status || 'pending').toLowerCase();
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-2xs capitalize select-none',
        config.badgeClass,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dotClass)} />
      {config.label}
    </span>
  );
}
