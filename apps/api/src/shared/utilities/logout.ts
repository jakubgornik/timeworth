import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      return res.json();
    },
    onSuccess: async () => {
      await navigate('/login', { replace: true });
    },
  });
}
