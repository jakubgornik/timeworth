import { SelectOption } from "@/pages/entries/filters.types";
import api from "@/lib/axios/axios";

export const fetchUserStatusOptions = async (): Promise<
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
