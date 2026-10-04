/**
 * Authentication Service (API calls)
 * Plain Axios functions for user login and current user profile retrieval.
 */

import apiClient from '../apiConfig/apiClient';

export async function login({ email, password }) {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
}

export async function getMe() {
  const response = await apiClient.get('/auth/me');
  return response.data;
}
