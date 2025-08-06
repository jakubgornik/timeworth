import { IOrganizationWorkEntriesFiltersDto } from "@packages/types";
import { FilterState } from "../filters.types";

export const mapFiltersToOrganizationWorkEntriesQuery = (
  filters: FilterState
): IOrganizationWorkEntriesFiltersDto => {
  const dto: IOrganizationWorkEntriesFiltersDto = {};

  for (const filter of filters.filters) {
    switch (filter.column) {
      case "title":
        if (typeof filter.value === "string") {
          dto.title = filter.value;
        }
        break;

      case "hoursWorked": {
        if (typeof filter.value === "string") {
          dto.hoursWorked = parseFloat(filter.value);
        }
        break;
      }

      case "workPeriod":
        if (
          typeof filter.value === "object" &&
          filter.value !== null &&
          "from" in filter.value &&
          "to" in filter.value
        ) {
          dto.workEntryStartedAt = filter.value.from?.toISOString();
          dto.workEntryEndedAt = filter.value.to?.toISOString();
        }
        break;
    }
  }

  return dto;
};
