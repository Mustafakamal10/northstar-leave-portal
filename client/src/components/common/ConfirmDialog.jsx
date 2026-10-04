/**
 * ConfirmDialog Component
 * Alert dialog for confirming actions like approving or rejecting leave requests,
 * with support for an optional review message / comment for the employee.
 */

import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default', // 'default' | 'destructive' | 'emerald'
  isLoading = false,
  showCommentField = true,
  commentLabel = 'Optional Message / Reason for Employee',
  commentPlaceholder = 'Add an optional note (e.g. Approved, enjoy! or Rejection reason...)'
}) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!open) {
      setComment('');
    }
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-slate-900">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {showCommentField && (
          <div className="space-y-1.5 my-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                {commentLabel}
              </Label>
              <span className="text-[11px] text-slate-400 font-normal">Optional</span>
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={commentPlaceholder}
              rows={2}
              className="text-xs bg-slate-50/50 border-slate-200 resize-none"
            />
          </div>
        )}

        <AlertDialogFooter className="pt-2">
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm(comment);
            }}
            disabled={isLoading}
            className={cn(
              variant === 'emerald' && 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium',
              variant === 'destructive' && 'bg-rose-600 hover:bg-rose-700 text-white font-medium'
            )}
          >
            {isLoading ? 'Processing...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
