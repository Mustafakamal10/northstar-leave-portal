/**
 * Employee Dashboard Page
 * Overview of leave balance metrics, status tallies, and recent leave applications.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useMySummaryQuery, useMyLeavesQuery } from '@/api/leaveApi';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LeaveDetailsDialog } from '@/components/common/LeaveDetailsDialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { formatDate, getGreeting } from '@/utils/formatDate';
import { LEAVE_TYPE_LABELS } from '@/constants/leaveTypes';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Eye,
  ArrowRight
} from 'lucide-react';

export function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Employee';
  const greeting = getGreeting();

  const { data: summary, isLoading: summaryLoading } = useMySummaryQuery();
  const { data: leavesData, isLoading: leavesLoading } = useMyLeavesQuery({ page: 1, limit: 5 });

  const columns = [
    {
      header: 'Leave Type',
      cell: (row) => (
        <span className="font-semibold text-slate-800">
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
      header: 'Admin Note',
      cell: (row) =>
        row.admin_comment ? (
          <span
            className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md max-w-[160px] truncate border border-slate-200 font-medium cursor-pointer"
            onClick={() => setSelectedLeave(row)}
            title={row.admin_comment}
          >
            {row.admin_comment}
          </span>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        )
    },
    {
      header: 'Submitted',
      cell: (row) => <span className="text-slate-500 text-xs">{formatDate(row.created_at)}</span>
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedLeave(row)}
          className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        eyebrow="Employee Overview"
        title={`${greeting}, ${firstName}`}
        subtitle="Manage your leave requests, check your yearly balance and track application statuses."
      >
        <Button
          onClick={() => navigate(ROUTES.EMPLOYEE_APPLY_LEAVE)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Apply Leave
        </Button>
      </PageHeader>

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leave"
          value={summaryLoading ? '...' : `${summary?.totalDays || 24} Days`}
          subtitle={
            summaryLoading
              ? 'Loading balance...'
              : `${summary?.remainingDays ?? 24} days remaining this year`
          }
          icon={CalendarDays}
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
          subtitle={
            summaryLoading
              ? 'Loading used days...'
              : `${summary?.usedDays ?? 0} days used this year`
          }
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Rejected Leaves"
          value={summaryLoading ? '...' : String(summary?.rejected ?? 0)}
          subtitle={
            summary?.lastRejectedDate
              ? `Most recent: ${formatDate(summary.lastRejectedDate)}`
              : 'No rejected requests'
          }
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
              Your latest leave submissions and their approval status
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            <Link to={ROUTES.EMPLOYEE_MY_LEAVES} className="flex items-center gap-1">
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
            emptyTitle="No recent leave requests"
            emptyDescription="You haven't submitted any leave requests yet."
            emptyAction={
              <Button
                size="sm"
                onClick={() => navigate(ROUTES.EMPLOYEE_APPLY_LEAVE)}
                className="bg-indigo-600 hover:bg-indigo-700 text-xs"
              >
                Apply for your first leave
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* Leave Details Modal */}
      <LeaveDetailsDialog
        open={Boolean(selectedLeave)}
        onOpenChange={(open) => !open && setSelectedLeave(null)}
        leave={selectedLeave}
      />
    </div>
  );
}

export default EmployeeDashboard;
