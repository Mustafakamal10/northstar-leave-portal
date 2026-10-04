/**
 * Admin API Hooks
 * TanStack Query hooks for admin dashboard summary, requests list, approvals, employee CRUD, and password resets.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminSummary,
  getAdminLeaves,
  updateLeaveStatus,
  getEmployees,
  createEmployee,
  resetPassword
} from '../services/admin.service';

export function useAdminSummaryQuery(range = 'today') {
  return useQuery({
    queryKey: ['adminSummary', range],
    queryFn: () => getAdminSummary(range)
  });
}

export function useAdminLeavesQuery(params = {}) {
  return useQuery({
    queryKey: ['adminLeaves', params],
    queryFn: () => getAdminLeaves(params),
    keepPreviousData: true
  });
}

export function useUpdateLeaveStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, adminComment }) => updateLeaveStatus(id, status, adminComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLeaves'] });
      queryClient.invalidateQueries({ queryKey: ['adminSummary'] });
      queryClient.invalidateQueries({ queryKey: ['myLeaves'] });
      queryClient.invalidateQueries({ queryKey: ['mySummary'] });
    }
  });
}

export function useEmployeesQuery(params = {}) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => getEmployees(params),
    keepPreviousData: true
  });
}

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['adminSummary'] });
    }
  });
}

export function useResetPasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newPassword }) => resetPassword(id, newPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });
}
