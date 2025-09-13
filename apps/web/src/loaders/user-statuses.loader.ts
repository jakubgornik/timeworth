import api from "@/lib/axios/axios";
import { SelectOption } from "@/modules/filters/filters.types";

export const userStatusesLoader = async (): Promise<
  SelectOption[] | undefined
> => {
  try {
    const response = await api.get<SelectOption[]>("user/user-status-options", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user status options:", error);
  }
};
