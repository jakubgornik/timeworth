import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios/axios";
import { IOrganizationWorkEntriesFiltersDto } from "@packages/types";

export function useExportWorkEntries() {
  return useMutation<Blob, AxiosError, IOrganizationWorkEntriesFiltersDto>({
    mutationFn: async (filtersQuery: IOrganizationWorkEntriesFiltersDto) => {
      const response = await api.post("work-entry/export", filtersQuery, {
        responseType: "blob",
        withCredentials: true,
      });

      return response.data;
    },
    onSuccess: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `work-entries-export-${currentDate}.xlsx`;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}
