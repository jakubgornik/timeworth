import { useMutation } from "@tanstack/react-query";
import api, { resetLogoutState } from "@/lib/axios/axios";
import { IRegisterDto as ILoginDto } from "@packages/types";

export function useLogin() {
  return useMutation({
    mutationFn: async (data: ILoginDto) => {
      const res = await api.post("/auth/login", data);
      resetLogoutState();
      return res.data;
    },
  });
}
