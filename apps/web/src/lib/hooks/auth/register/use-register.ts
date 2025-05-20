import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import { IRegisterDto } from "@packages/types";

export function useRegister() {
  return useMutation({
    mutationFn: async (data: IRegisterDto) => {
      const res = await api.post("/user/register", data);
      return res.data;
    },
  });
}
