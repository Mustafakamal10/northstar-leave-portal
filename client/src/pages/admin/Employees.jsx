/**
 * Employees Management Page (Admin)
 * Manage employee records, provision new employee accounts, and execute secure password resets.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEmployeesQuery, useCreateEmployeeMutation } from '@/api/adminApi';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { PaginationBar } from '@/components/common/PaginationBar';
import { SearchInput } from '@/components/common/SearchInput';
import { FormField } from '@/components/common/FormField';
import { ResetPasswordDialog } from '@/components/common/ResetPasswordDialog';
import { CredentialsDialog } from '@/components/common/CredentialsDialog';
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
import { Badge } from '@/components/ui/badge';
import { generatePassword } from '@/utils/generatePassword';
import { formatDate } from '@/utils/formatDate';
import {
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  designation: z.string().min(1, 'Designation / job title is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});

export function Employees() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmployee, setResetEmployee] = useState(null);
  const [activeCredentials, setActiveCredentials] = useState(null);

  const { data, isLoading } = useEmployeesQuery({
    page,
    limit: 10,
    search
  });

  const createMutation = useCreateEmployeeMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      name: '',
      email: '',
      designation: '',
      password: ''
    }
  });

  const handleGeneratePassword = () => {
    const generated = generatePassword(10);
    setValue('password', generated, { shouldValidate: true });
    setShowPassword(true);
  };

  const handleOpenAdd = () => {
    reset();
    setShowPassword(false);
    setIsAddOpen(true);
  };

  const onSubmitCreate = async (values) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success(`Employee ${values.name} created successfully`);
      setIsAddOpen(false);

      // Open credentials dialog with the generated password
      setActiveCredentials({
        name: values.name,
        email: values.email,
        password: values.password
      });

      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create employee');
    }
  };

  const columns = [
    {
      header: 'Employee',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
            {row.initials}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block leading-tight">
              {row.name}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {row.code}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Email Address',
      cell: (row) => <span className="font-mono text-xs text-slate-700">{row.email}</span>
    },
    {
      header: 'Designation',
      cell: (row) => <span className="text-slate-700 font-medium">{row.designation}</span>
    },
    {
      header: 'Role',
      cell: (row) => (
        <Badge variant="secondary" className="capitalize text-slate-600 bg-slate-100 font-medium">
          {row.role}
        </Badge>
      )
    },
    {
      header: 'Joined Date',
      cell: (row) => <span className="text-slate-500 text-xs">{formatDate(row.created_at)}</span>
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setResetEmployee(row)}
          className="h-8 px-2.5 text-xs text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50"
          title="Reset Password"
        >
          <KeyRound className="h-3.5 w-3.5 mr-1 text-slate-400" />
          Reset Password
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        eyebrow="Organization"
        title="Employee Directory"
        subtitle="Manage company staff, create login credentials, and reset employee passwords."
      >
        <Button
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="w-full max-w-sm">
          <SearchInput
            placeholder="Search by name, email, or designation..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          emptyTitle="No employees found"
          emptyDescription="No employee records match the search query."
          className="border-0 shadow-none rounded-none"
        />

        <PaginationBar
          page={page}
          totalPages={data?.totalPages || 1}
          total={data?.total || 0}
          limit={10}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <UserPlus className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">New Account</span>
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Add New Employee
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Create an employee profile and generate their portal credentials.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4 py-2">
            <FormField
              label="Full Name"
              error={errors.name?.message}
              required
            >
              <Input
                placeholder="e.g. Sarah Jenkins"
                {...register('name')}
              />
            </FormField>

            <FormField
              label="Work Email"
              error={errors.email?.message}
              required
            >
              <Input
                type="email"
                placeholder="sarah@northstar.com"
                {...register('email')}
              />
            </FormField>

            <FormField
              label="Designation / Role"
              error={errors.designation?.message}
              required
            >
              <Input
                placeholder="e.g. Senior Software Engineer"
                {...register('designation')}
              />
            </FormField>

            <FormField
              label="Initial Password"
              error={errors.password?.message}
              required
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter or generate password"
                    {...register('password')}
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
                  onClick={handleGeneratePassword}
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
                onClick={() => setIsAddOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Employee'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        open={Boolean(resetEmployee)}
        onOpenChange={(open) => !open && setResetEmployee(null)}
        employee={resetEmployee}
        onSuccess={(creds) => setActiveCredentials(creds)}
      />

      {/* Temporary Credentials Display Dialog */}
      <CredentialsDialog
        open={Boolean(activeCredentials)}
        onOpenChange={(open) => !open && setActiveCredentials(null)}
        credentials={activeCredentials}
      />
    </div>
  );
}

export default Employees;
