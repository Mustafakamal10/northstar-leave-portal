/**
 * FormField Component
 * Form input wrapper displaying label, optional required asterisk, and red validation error message.
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function FormField({
  label,
  error,
  required = false,
  hint,
  children,
  className
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </Label>
          {hint && <span className="text-xs text-slate-400">{hint}</span>}
        </div>
      )}
      {children}
      {error && (
        <p className="text-xs font-medium text-rose-600 mt-1 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}
