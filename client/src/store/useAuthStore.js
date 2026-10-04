/**
 * Auth Zustand Store
 * Stores JWT authentication token and current user session state with localStorage persistence.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),

      logout: () => set({ token: null, user: null })
    }),
    {
      name: 'northstar-auth-storage'
    }
  )
);
