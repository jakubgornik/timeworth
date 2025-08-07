import { SelectOption } from "@/pages/entries/filters.types";

//  mock laoder
export const fetchUserStatusOptions = async (): Promise<SelectOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { label: "Available", value: "AVAILABLE" },
    { label: "Active", value: "ACTIVE" },
    { label: "Suspended", value: "SUSPENDED" },
  ];
};
