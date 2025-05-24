import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios/axios";
import {
  IUserCredentialsDto as ILoginDto,
  IUserDto as ILoginResponseDto,
} from "@packages/types";
import { useNavigate } from "react-router";

export function useLogin() {
  const navigate = useNavigate();

  return useMutation<ILoginResponseDto, AxiosError, ILoginDto>({
    mutationFn: async (data: ILoginDto) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onSuccess: () => {
      navigate("/dashboard", { replace: true });
    },
  });
}
