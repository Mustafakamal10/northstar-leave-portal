/**
 * Admin Leave Requests Page
 * Comprehensive leave requests table with date range tabs, status filtering, employee search, and approval workflows.
 */

import React, { useState } from 'react';
import { useAdminLeavesQuery, useUpdateLeaveStatusMutation } from '@/api/adminApi';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { PaginationBar } from '@/components/common/PaginationBar';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LeaveDetailsDialog } from '@/components/common/LeaveDetailsDialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DATE_RANGES } from '@/constants/dateRanges';
import { STATUS_OPTIONS } from '@/constants/statusOptions';
import { LEAVE_TYPE_LABELS } from '@/constants/leaveTypes';
import { formatDate } from '@/utils/formatDate';
import { Eye, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLeaveRequests() {
  const [range, setRange] = useState('today');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { leave, status: 'approved' | 'rejected' }

  const { data, isLoading } = useAdminLeavesQuery({
    range,
    status,
    search,
    page,
    limit: 10
  });

  const updateStatusMutation = useUpdateLeaveStatusMutation();

  const handleStatusUpdate = async (adminComment) => {
    if (!confirmAction) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: confirmAction.leave.id,
        status: confirmAction.status,
        adminComment: adminComment || ''
      });
      toast.success(
        `Leave request ${confirmAction.status === 'approved' ? 'approved' : 'rejected'} successfully`
      );
      setConfirmAction(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update leave status');
    }
  };

  const columns = [
    {
      header: 'Employee',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
            {row.employee?.initials || '??'}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block leading-tight">
              {row.employee?.name || 'Unknown'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {row.employee?.code || ''}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Leave Type',
      cell: (row) => (
        <span className="font-medium text-slate-800">
          {LEAVE_TYPE_LABELS[row.leave_type] || row.leave_type}
        </span>
      )
    },
    {
      header: 'Start Date',
      cell: (row) => <span>{formatDate(row.start_date)}</span>
    },
    {
      header: 'End Date',
      cell: (row) => <span>{formatDate(row.end_date)}</span>
    },
    {
      header: 'Duration',
      cell: (row) => (
        <span className="text-slate-600 font-medium">
          {row.total_days} {row.total_days === 1 ? 'day' : 'days'}
        </span>
      )
    },
    {
      header: 'Reason',
      cell: (row) => (
        <span className="truncate max-w-[200px] block text-slate-600" title={row.reason}>
          {row.reason}
        </span>
      )
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedLeave(row)}
            className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {row.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmAction({ leave: row, status: 'approved' })}
                className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                title="Approve Request"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmAction({ leave: row, status: 'rejected' })}
                className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                title="Reject Request"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Actions"
        title="All Leave Requests"
        subtitle="Review, approve, or reject employee leave requests across specified date ranges."
      />

      {/* Date Range Tabs & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <Tabs
          value={range}
          onValueChange={(val) => {
            setRange(val);
            setPage(1);
          }}
          className="w-full lg:w-auto"
        >
          <TabsList className="bg-slate-100 p-1 w-full sm:w-auto grid grid-cols-2 sm:flex sm:flex-row h-auto">
            {DATE_RANGES.map((r) => (
              <TabsTrigger key={r.value} value={r.value} className="text-xs px-3 py-1.5">
                {r.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Search employee or reason..."
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </div>

          <div className="w-full sm:w-44">
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          emptyTitle="No leave requests found"
          emptyDescription="There are no leave requests matching the selected filters and date range."
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

      {/* Details Dialog */}
      <LeaveDetailsDialog
        open={Boolean(selectedLeave)}
        onOpenChange={(open) => !open && setSelectedLeave(null)}
        leave={selectedLeave}
      />

      {/* Approve / Reject Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction?.status === 'approved'
            ? 'Approve leave request?'
            : 'Reject leave request?'
        }
        description={`Are you sure you want to ${confirmAction?.status} the ${confirmAction?.leave?.leave_type} leave request for ${confirmAction?.leave?.employee?.name} (${formatDate(confirmAction?.leave?.start_date)} to ${formatDate(confirmAction?.leave?.end_date)})?`}
        confirmText={confirmAction?.status === 'approved' ? 'Approve' : 'Reject'}
        variant={confirmAction?.status === 'approved' ? 'emerald' : 'destructive'}
        showCommentField={true}
        commentLabel={
          confirmAction?.status === 'approved'
            ? 'Optional Approval Note'
            : 'Optional Rejection Reason'
        }
        commentPlaceholder={
          confirmAction?.status === 'approved'
            ? 'e.g. Approved, enjoy your time off!'
            : 'e.g. Please reschedule due to ongoing project deadline.'
        }
        onConfirm={handleStatusUpdate}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}

export default AdminLeaveRequests;
