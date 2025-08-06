import { FilterDefinition, FilterRule } from "./filters.types";
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
): string | DateRange | null => {
  if (typeof filter.value === "string") {
    return filter.value;
  }

  if (isDateRange(filter.value)) {
    return filter.value;
  }

  return null;
};

export const processFilters = (filters: FilterRule[]): FilterDefinition[] => {
  return filters
    .filter((filter) => filter.value !== undefined && filter.value !== "")
    .map((filter) => {
      const value = formatFilterValue(filter);
      return value ? { column: filter.id, value, type: filter.type } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
};

export const formatColumnLabel = (columnId: string): string => {
  return columnId
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
};
