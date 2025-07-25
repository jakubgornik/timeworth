import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import { ICreateWorkEntryDto } from "@packages/types";

export function useCreateWorkEntry() {
  return useMutation({
    mutationFn: async (data: ICreateWorkEntryDto) => {
      const res = await api.post("/work-entry/create", data);
      return res.data;
    },
  });
}
