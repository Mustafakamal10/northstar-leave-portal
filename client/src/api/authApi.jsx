/**
 * Auth API Hooks
 * TanStack Query hook for user authentication.
 */

import { useMutation } from '@tanstack/react-query';
import { login as loginService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';

export function useLoginMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    }
  });
}
