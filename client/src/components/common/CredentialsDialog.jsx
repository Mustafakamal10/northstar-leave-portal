/**
 * CredentialsDialog Component
 * Displays temporary credentials once after account creation or password reset.
 * Offers copy buttons for email, password, and full credential text.
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Copy, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function CredentialsDialog({ open, onOpenChange, credentials }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!credentials) return null;

  const { email, password, name } = credentials;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    const text = `Northstar Leave Portal\nEmployee: ${name || ''}\nEmail: ${email}\nPassword: ${password}\nURL: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopiedField('all');
    toast.success('Copied full credentials to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Account Credentials</span>
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Employee Login Credentials
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {name ? `Credentials generated for ${name}.` : 'New login credentials have been generated.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-2">
          {/* Email Row */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Email Address
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-medium text-slate-800 select-all">
                {email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(email, 'email')}
                className="h-7 px-2 text-xs hover:bg-slate-200/60 text-slate-600"
              >
                {copiedField === 'email' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                Copy
              </Button>
            </div>
          </div>

          {/* Password Row */}
          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 block mb-1">
              Password
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-bold text-indigo-950 select-all tracking-wide">
                {password}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(password, 'password')}
                className="h-7 px-2 text-xs hover:bg-indigo-100 text-indigo-700 font-medium"
              >
                {copiedField === 'password' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                Copy
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs leading-relaxed">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              This password will not be shown again. Share it with the employee securely.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyAll}
            className="w-full sm:w-auto text-xs"
          >
            {copiedField === 'all' ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1.5" />
            )}
            Copy All Details
          </Button>

          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-xs"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
