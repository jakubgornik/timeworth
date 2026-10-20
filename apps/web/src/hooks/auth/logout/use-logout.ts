import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api, { resetAuthRedirect, withAuthMutation } from "@/lib/axios/axios";
import { useNotification } from "@/hooks/use-notification";
import { useNavigate } from "react-router";
import { ROUTES } from "@/routes/routes";

interface ILogoutResponseDto {
  message: string;
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showError } = useNotification();

  return useMutation<ILogoutResponseDto, AxiosError, void>({
    mutationFn: async () => {
      const res = await withAuthMutation(() => api.post("/auth/logout"));
      return res.data;
    },
    onSuccess: () => {
      resetAuthRedirect();
      queryClient.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: () => {
      showError("Logout failed. Please try again.");
    },
  });
}
