/**
 * StatCard Component
 * Displays high-level metrics with colored icon chips, bold values, and descriptive subtitles.
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const COLOR_VARIANTS = {
  indigo: {
    chip: 'bg-indigo-50 text-indigo-600',
    border: 'border-slate-200/80'
  },
  amber: {
    chip: 'bg-amber-50 text-amber-600',
    border: 'border-slate-200/80'
  },
  emerald: {
    chip: 'bg-emerald-50 text-emerald-600',
    border: 'border-slate-200/80'
  },
  rose: {
    chip: 'bg-rose-50 text-rose-600',
    border: 'border-slate-200/80'
  }
};

export function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo', className }) {
  const styles = COLOR_VARIANTS[color] || COLOR_VARIANTS.indigo;

  return (
    <Card className={cn('p-5 bg-white rounded-xl border shadow-2xs hover:shadow-xs transition-shadow', styles.border, className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={cn('p-2.5 rounded-lg flex items-center justify-center shrink-0', styles.chip)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
}
