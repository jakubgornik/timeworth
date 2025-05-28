import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios/axios";
import {
  IUserCredentialsDto,
  IUserDto as IRegisterResponseDto,
} from "@packages/types";
import { useNavigate } from "react-router";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation<IRegisterResponseDto, AxiosError, IUserCredentialsDto>({
    mutationFn: async (data: IUserCredentialsDto) => {
      const res = await api.post("/user/register", data);
      return res.data;
    },
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
  });
}
