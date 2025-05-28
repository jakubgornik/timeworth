import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api, { resetLogoutState } from "@/lib/axios/axios";
import { useNavigate } from "react-router";

interface ILogoutResponseDto {
  message: string;
}

export function useLogout() {
  const navigate = useNavigate();

  return useMutation<ILogoutResponseDto, AxiosError, void>({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      resetLogoutState();
      navigate("/login", { replace: true });
    },
  });
}
