/**
 * Login Page
 * User authentication portal with demo account quick-fill and role-based redirection.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLoginMutation } from '@/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/common/FormField';
import { LogoIcon } from '@/components/common/Logo';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';
import { Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export function Login() {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // If already logged in, redirect to respective dashboard
  if (token && user) {
    const destination =
      user.role === ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.EMPLOYEE_DASHBOARD;
    return <Navigate to={destination} replace />;
  }

  const onSubmit = async (values) => {
    setAuthError('');
    try {
      const result = await loginMutation.mutateAsync(values);
      toast.success(`Welcome back, ${result.user.name}`);
      if (result.user.role === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        navigate(ROUTES.EMPLOYEE_DASHBOARD);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      setAuthError(message);
    }
  };

  const handleFillDemo = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setAuthError('');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast.info('Please contact your HR administrator to reset your password.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 overflow-x-hidden">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-3">
            <LogoIcon className="h-12 w-12 rounded-2xl shadow-sm" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Northstar Leave Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to manage leave requests and view balances
          </p>
        </div>

        <Card className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>Enter your work email and password below</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-rose-700 text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                label="Email Address"
                error={errors.email?.message}
                required
              >
                <Input
                  type="email"
                  placeholder="name@northstar.com"
                  autoComplete="email"
                  {...register('email')}
                />
              </FormField>

              <FormField
                label="Password"
                error={errors.password?.message}
                required
              >
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register('password')}
                    className="pr-10"
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
              </FormField>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-10 shadow-sm"
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Box */}
        <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Demo Credentials (Click to Autofill)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleFillDemo('emily@northstar.com', 'Admin@123')}
              className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
            >
              <span className="font-semibold text-slate-800 block">HR Admin</span>
              <span className="text-slate-500 font-mono text-[11px] block truncate">emily@northstar.com</span>
              <span className="text-slate-400 font-mono text-[11px] block">Admin@123</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('mustafa@northstar.com', 'Employee@123')}
              className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
            >
              <span className="font-semibold text-slate-800 block truncate">Mustafa Kamal</span>
              <span className="text-slate-500 font-mono text-[11px] block truncate">mustafa@northstar.com</span>
              <span className="text-slate-400 font-mono text-[11px] block">Employee@123</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('abbas@northstar.com', 'Employee@123')}
              className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
            >
              <span className="font-semibold text-slate-800 block truncate">Abbas Khan</span>
              <span className="text-slate-500 font-mono text-[11px] block truncate">abbas@northstar.com</span>
              <span className="text-slate-400 font-mono text-[11px] block">Employee@123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
