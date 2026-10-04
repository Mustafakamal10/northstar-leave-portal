/**
 * Leave Service (API calls)
 * Plain Axios functions for employee leave summary, list, details, and submission.
 */

import apiClient from '../apiConfig/apiClient';

export async function getMySummary() {
  const response = await apiClient.get('/leaves/summary');
  return response.data;
}

export async function getMyLeaves(params = {}) {
  const response = await apiClient.get('/leaves/my', { params });
  return response.data;
}

export async function getLeaveDetails(id) {
  const response = await apiClient.get(`/leaves/${id}`);
  return response.data;
}

export async function applyLeave(data) {
  const response = await apiClient.post('/leaves', data);
  return response.data;
}
