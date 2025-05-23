import api, { resetLogoutState } from "@/lib/axios/axios";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      resetLogoutState();
    },
  });
}
