/**
 * My Leaves Page (Employee)
 * Filterable and paginated history of all leave requests submitted by the employee.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyLeavesQuery } from '@/api/leaveApi';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { PaginationBar } from '@/components/common/PaginationBar';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LeaveDetailsDialog } from '@/components/common/LeaveDetailsDialog';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ROUTES } from '@/constants/routes';
import { STATUS_OPTIONS } from '@/constants/statusOptions';
import { LEAVE_TYPE_LABELS } from '@/constants/leaveTypes';
import { formatDate } from '@/utils/formatDate';
import { PlusCircle, Eye } from 'lucide-react';

export function MyLeaves() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedLeave, setSelectedLeave] = useState(null);

  const { data, isLoading } = useMyLeavesQuery({
    page,
    limit: 10,
    search,
    status
  });

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
        <span className="truncate max-w-[240px] block text-slate-600" title={row.reason}>
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
            className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md max-w-[180px] truncate border border-slate-200 font-medium cursor-pointer"
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
      {/* Page Header */}
      <PageHeader
        eyebrow="Leave Management"
        title="My Leaves"
        subtitle="View all past and upcoming leave requests and their current review status."
      >
        <Button
          onClick={() => navigate(ROUTES.EMPLOYEE_APPLY_LEAVE)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Apply Leave
        </Button>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search by reason or type..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        <div className="w-full sm:w-48">
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

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          emptyTitle="No leave records found"
          emptyDescription="Try adjusting your search filters or submit a new leave request."
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

      {/* Leave Details Modal */}
      <LeaveDetailsDialog
        open={Boolean(selectedLeave)}
        onOpenChange={(open) => !open && setSelectedLeave(null)}
        leave={selectedLeave}
      />
    </div>
  );
}

export default MyLeaves;
