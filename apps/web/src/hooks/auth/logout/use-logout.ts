import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api, { resetLogoutState } from "@/lib/axios/axios";
import { useNavigate } from "react-router";
import { ROUTES } from "@/routes/routes";

interface ILogoutResponseDto {
  message: string;
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<ILogoutResponseDto, AxiosError, void>({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      resetLogoutState();
      queryClient.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });
}
