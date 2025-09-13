import { FilterState } from "@/modules/filters/filters.types";
import { IOrganizationUsersFiltersDto, UserStatusType } from "@packages/types";

export const mapFiltersToOrganizationUsersQuery = (
  filters: FilterState
): IOrganizationUsersFiltersDto => {
  const dto: IOrganizationUsersFiltersDto = {};

  for (const filter of filters.filters) {
    switch (filter.column) {
      case "email":
        if (typeof filter.value === "string") {
          dto.email = filter.value;
        }
        break;

      case "userStatus":
        if (Array.isArray(filter.value) && filter.value.length > 0) {
          dto.userStatus = filter.value as UserStatusType[];
        }
        break;
    }
  }

  return dto;
};
