/**
 * LeaveDetailsDialog Component
 * Read-only modal displaying comprehensive details of a selected leave request,
 * including employee information, reason, and HR admin review remarks.
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '@/utils/formatDate';
import { LEAVE_TYPE_LABELS } from '@/constants/leaveTypes';
import { Calendar, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LeaveDetailsDialog({ open, onOpenChange, leave }) {
  if (!leave) return null;

  const isApproved = leave.status === 'approved';
  const isRejected = leave.status === 'rejected';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Leave Request Details
            </DialogTitle>
            <StatusBadge status={leave.status} />
          </div>
        </DialogHeader>

        <div className="space-y-3.5 pt-2 text-sm">
          {/* Employee Info if included */}
          {leave.employee && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-xs">
                {leave.employee.initials || leave.employee.name?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 leading-none">{leave.employee.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{leave.employee.designation}</p>
              </div>
            </div>
          )}

          {/* Type & Total Days */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Leave Type
              </span>
              <span className="font-semibold text-slate-800">
                {LEAVE_TYPE_LABELS[leave.leave_type] || leave.leave_type}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Total Duration
              </span>
              <span className="font-semibold text-slate-800">
                {leave.total_days} {leave.total_days === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Dates Range
            </span>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>{formatDate(leave.start_date)}</span>
              <span className="text-slate-400">→</span>
              <span>{formatDate(leave.end_date)}</span>
            </div>
          </div>

          {/* Reason */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Employee Reason
            </span>
            <p className="text-slate-700 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
              {leave.reason}
            </p>
          </div>

          {/* HR Admin Message / Remarks (if provided) */}
          {leave.admin_comment && (
            <div
              className={cn(
                'p-3.5 rounded-xl border text-xs sm:text-sm space-y-1',
                isApproved && 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950',
                isRejected && 'bg-rose-50/70 border-rose-200/80 text-rose-950',
                !isApproved && !isRejected && 'bg-indigo-50/70 border-indigo-200/80 text-indigo-950'
              )}
            >
              <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] tracking-wider">
                {isApproved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-700">HR Admin Approval Note</span>
                  </>
                ) : isRejected ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <span className="text-rose-700">HR Admin Rejection Reason / Note</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 text-indigo-600" />
                    <span className="text-indigo-700">HR Admin Remark</span>
                  </>
                )}
              </div>
              <p className="font-normal whitespace-pre-wrap leading-relaxed pt-0.5">
                {leave.admin_comment}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 px-1">
            <span>Submitted: {formatDate(leave.created_at)}</span>
            {leave.reviewer && (
              <span>Reviewed by: {leave.reviewer.name}</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
