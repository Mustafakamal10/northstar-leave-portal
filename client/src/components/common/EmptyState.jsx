/**
 * EmptyState Component
 * Displays helpful illustrations or icons when lists or queries return no results.
 */

import React from 'react';
import { CalendarX, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'There are no records to display at this time.',
  action,
  className
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">
        {title}
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
