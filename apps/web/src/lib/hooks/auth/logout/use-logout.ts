import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios/axios";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      window.location.href = "/login";
    },
  });
}
