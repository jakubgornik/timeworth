import { formatDateForStorage } from "@/components/timetable/utils/timetable-utils";
import { FilterRule, ProcessedFilter } from "./filters.types";
import { DateRange } from "react-day-picker";

export const isDateRangeColumn = (columnId: string): boolean => {
  return columnId.includes("date") || columnId.includes("range");
};

const isDateRange = (value: unknown): value is DateRange => {
  return (
    value !== null &&
    typeof value === "object" &&
    "from" in value &&
    "to" in value
  );
};

export const formatFilterValue = (
  filter: FilterRule
): string | { from: string; to: string } | null => {
  if (typeof filter.value === "string") {
    return filter.value;
  }

  if (isDateRange(filter.value)) {
    return {
      from: filter.value.from ? formatDateForStorage(filter.value.from) : "",
      to: filter.value.to ? formatDateForStorage(filter.value.to) : "",
    };
  }

  return null;
};

export const processFilters = (filters: FilterRule[]): ProcessedFilter[] => {
  return filters
    .filter((filter) => filter.value !== undefined && filter.value !== "")
    .map((filter) => {
      const value = formatFilterValue(filter);
      return value ? { column: filter.column, value, type: filter.type } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
};
