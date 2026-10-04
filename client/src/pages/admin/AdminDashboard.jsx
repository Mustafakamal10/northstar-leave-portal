/**
 * Admin Dashboard Page
 * High-level leave management overview with total metrics and quick approval actions with optional review messages.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminSummaryQuery, useAdminLeavesQuery, useUpdateLeaveStatusMutation } from '@/api/adminApi';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LeaveDetailsDialog } from '@/components/common/LeaveDetailsDialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { LEAVE_TYPE_LABELS } from '@/constants/leaveTypes';
import { formatDate } from '@/utils/formatDate';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  X,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { leave, status: 'approved' | 'rejected' }

  // Clean overview without top date filter tabs
  const { data: summary, isLoading: summaryLoading } = useAdminSummaryQuery('all');
  const { data: leavesData, isLoading: leavesLoading } = useAdminLeavesQuery({
    range: 'all',
    page: 1,
    limit: 5
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
        <span className="truncate max-w-[180px] block text-slate-600" title={row.reason}>
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
      {/* Clean Header without top tabs */}
      <PageHeader
        eyebrow="Admin Overview"
        title="Leave Management"
        subtitle="Review employee time-off requests, monitor company attendance, and approve pending leaves."
      />

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={summaryLoading ? '...' : String(summary?.totalEmployees ?? 0)}
          subtitle="Registered staff members"
          icon={Users}
          color="indigo"
        />

        <StatCard
          title="Pending Requests"
          value={summaryLoading ? '...' : String(summary?.pending ?? 0)}
          subtitle="Awaiting manager review"
          icon={Clock}
          color="amber"
        />

        <StatCard
          title="Approved Leaves"
          value={summaryLoading ? '...' : String(summary?.approved ?? 0)}
          subtitle="Total approved leaves"
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Rejected Requests"
          value={summaryLoading ? '...' : String(summary?.rejected ?? 0)}
          subtitle="Total rejected requests"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Recent Leave Requests Card */}
      <Card className="rounded-xl border border-slate-200/80 bg-white shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Recent Leave Requests
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Review recent requests or take immediate approval action
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            <Link to={ROUTES.ADMIN_LEAVE_REQUESTS} className="flex items-center gap-1">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={leavesData?.data || []}
            isLoading={leavesLoading}
            emptyTitle="No leave requests found"
            emptyDescription="There are currently no leave requests to display."
          />
        </CardContent>
      </Card>

      {/* Leave Details Modal */}
      <LeaveDetailsDialog
        open={Boolean(selectedLeave)}
        onOpenChange={(open) => !open && setSelectedLeave(null)}
        leave={selectedLeave}
      />

      {/* Confirm Action Alert Dialog with optional review message */}
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

export default AdminDashboard;
