import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios/axios";
import {
  IUserCredentialsDto as ILoginDto,
  IUserDto as ILoginResponseDto,
} from "@packages/types";
import { useNavigate } from "react-router";
import { ROUTES } from "@/routes/routes";
import { useNotification } from "@/hooks/use-notification";

export function useLogin() {
  const navigate = useNavigate();

  const { showError } = useNotification();

  return useMutation<ILoginResponseDto, AxiosError, ILoginDto>({
    mutationFn: async (data: ILoginDto) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onSuccess: () => {
      navigate(ROUTES.DASHBOARD, { replace: true });
    },
    onError: () => {
      showError("Login failed");
    },
  });
}
