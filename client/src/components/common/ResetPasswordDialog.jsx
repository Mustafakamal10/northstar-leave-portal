/**
 * ResetPasswordDialog Component
 * Allows HR admin to generate or type a new password for an employee account.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from './FormField';
import { generatePassword } from '@/utils/generatePassword';
import { useResetPasswordMutation } from '@/api/adminApi';
import { KeyRound, Eye, EyeOff, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const resetSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters long')
});

export function ResetPasswordDialog({ open, onOpenChange, employee, onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const resetMutation = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      newPassword: ''
    }
  });

  const handleGenerate = () => {
    const generated = generatePassword(10);
    setValue('newPassword', generated, { shouldValidate: true });
    setShowPassword(true);
  };

  const onSubmit = async (values) => {
    if (!employee) return;
    try {
      await resetMutation.mutateAsync({
        id: employee.id,
        newPassword: values.newPassword
      });

      toast.success(`Password reset successfully for ${employee.name}`);
      onOpenChange(false);
      reset();

      // Pass credentials to show CredentialsDialog
      onSuccess?.({
        name: employee.name,
        email: employee.email,
        password: values.newPassword
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <KeyRound className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Reset Credentials</span>
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Reset Employee Password
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {employee ? `Setting new login password for ${employee.name} (${employee.email})` : ''}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <FormField
            label="New Password"
            error={errors.newPassword?.message}
            required
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter or generate password"
                  {...register('newPassword')}
                  className="pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </button>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGenerate}
                className="shrink-0 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Generate
              </Button>
            </div>
          </FormField>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={resetMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={resetMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {resetMutation.isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
