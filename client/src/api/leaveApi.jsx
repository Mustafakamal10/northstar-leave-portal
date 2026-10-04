/**
 * Leave API Hooks (Employee)
 * TanStack Query hooks for employee leave dashboard summary, list, details, and application.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMySummary,
  getMyLeaves,
  getLeaveDetails,
  applyLeave
} from '../services/leave.service';

export function useMySummaryQuery() {
  return useQuery({
    queryKey: ['mySummary'],
    queryFn: getMySummary
  });
}

export function useMyLeavesQuery(params = {}) {
  return useQuery({
    queryKey: ['myLeaves', params],
    queryFn: () => getMyLeaves(params),
    keepPreviousData: true
  });
}

export function useLeaveDetailsQuery(id) {
  return useQuery({
    queryKey: ['leaveDetails', id],
    queryFn: () => getLeaveDetails(id),
    enabled: Boolean(id)
  });
}

export function useApplyLeaveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLeaves'] });
      queryClient.invalidateQueries({ queryKey: ['mySummary'] });
    }
  });
}
