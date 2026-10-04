/**
 * Apply Leave Page (Employee)
 * Form for submitting a new leave request with client-side Zod validation and live total days calculation.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApplyLeaveMutation } from '@/api/leaveApi';
import { PageHeader } from '@/components/common/PageHeader';
import { FormField } from '@/components/common/FormField';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/constants/routes';
import { LEAVE_TYPES } from '@/constants/leaveTypes';
import { calcDays } from '@/utils/calcDays';
import { Calendar, Clock, Send, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const todayString = new Date().toISOString().split('T')[0];

const leaveSchema = z
  .object({
    leaveType: z.enum(['annual', 'sick', 'personal'], {
      required_error: 'Please select a leave type'
    }),
    startDate: z
      .string()
      .min(1, 'Start date is required')
      .refine((val) => val >= todayString, {
        message: 'Start date cannot be in the past'
      }),
    endDate: z.string().min(1, 'End date is required'),
    reason: z
      .string()
      .min(1, 'Reason is required')
      .min(10, 'Reason must be at least 10 characters long')
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date cannot be earlier than start date',
    path: ['endDate']
  });

export function ApplyLeave() {
  const navigate = useNavigate();
  const applyMutation = useApplyLeaveMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leaveType: 'annual',
      startDate: '',
      endDate: '',
      reason: ''
    }
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const reasonText = watch('reason') || '';

  const totalDays = calcDays(startDate, endDate);

  const onSubmit = async (values) => {
    try {
      await applyMutation.mutateAsync(values);
      toast.success('Leave request submitted successfully');
      navigate(ROUTES.EMPLOYEE_MY_LEAVES);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave request');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Request Time Off"
        title="Apply for Leave"
        subtitle="Submit your leave application for HR review and balance deduction."
      />

      <Card className="rounded-xl border border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            Leave Request Details
          </CardTitle>
          <CardDescription>
            Fill out the details below. All fields are required.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5 pt-5">
            {/* Leave Type */}
            <FormField
              label="Leave Type"
              error={errors.leaveType?.message}
              required
            >
              <Select {...register('leaveType')}>
                {LEAVE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </FormField>

            {/* Start and End Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                error={errors.startDate?.message}
                required
              >
                <Input
                  type="date"
                  min={todayString}
                  {...register('startDate')}
                  className="bg-white"
                />
              </FormField>

              <FormField
                label="End Date"
                error={errors.endDate?.message}
                required
              >
                <Input
                  type="date"
                  min={startDate || todayString}
                  {...register('endDate')}
                  className="bg-white"
                />
              </FormField>
            </div>

            {/* Live Day Count Banner */}
            {startDate && endDate && totalDays > 0 && (
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-semibold">
                <Clock className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>
                  Total Leave Duration: <strong className="text-indigo-700">{totalDays}</strong> {totalDays === 1 ? 'Working Day' : 'Working Days'}
                </span>
              </div>
            )}

            {/* Reason */}
            <FormField
              label="Reason for Leave"
              hint={`${reasonText.length} / min 10 chars`}
              error={errors.reason?.message}
              required
            >
              <Textarea
                placeholder="Please describe the purpose of your leave in detail (minimum 10 characters)..."
                rows={4}
                {...register('reason')}
              />
            </FormField>
          </CardContent>

          <CardFooter className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5 bg-slate-50/40 rounded-b-xl">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={applyMutation.isPending}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={applyMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium"
            >
              <Send className="h-4 w-4 mr-2" />
              {applyMutation.isPending ? 'Submitting...' : 'Submit Leave Request'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default ApplyLeave;
