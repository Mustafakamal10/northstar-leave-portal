/**
 * Admin Service (API calls)
 * Plain Axios functions for admin summary, leave requests, leave approvals, employee management, and password resets.
 */

import apiClient from '../apiConfig/apiClient';

export async function getAdminSummary(range = 'today') {
  const response = await apiClient.get('/admin/summary', { params: { range } });
  return response.data;
}

export async function getAdminLeaves(params = {}) {
  const response = await apiClient.get('/admin/leaves', { params });
  return response.data;
}

export async function updateLeaveStatus(id, status, adminComment = '') {
  const response = await apiClient.patch(`/admin/leaves/${id}/status`, { status, adminComment });
  return response.data;
}

export async function getEmployees(params = {}) {
  const response = await apiClient.get('/admin/employees', { params });
  return response.data;
}

export async function createEmployee(data) {
  const response = await apiClient.post('/admin/employees', data);
  return response.data;
}

export async function resetPassword(id, newPassword) {
  const response = await apiClient.patch(`/admin/employees/${id}/password`, { newPassword });
  return response.data;
}
