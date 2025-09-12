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

const isStringArray = (value: unknown): value is string[] => {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
};

export const formatFilterValue = (
  filter: FilterRule
): string | DateRange | string[] | null => {
  const { value } = filter;

  if (typeof value === "string") return value;
  if (isDateRange(value)) return value;
  if (isStringArray(value)) return value;

  return null;
};

const isValidFilterValue = (value: unknown): boolean => {
  if (value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const processFilters = (filters: FilterRule[]): FilterDefinition[] => {
  return filters
    .filter(({ value }) => isValidFilterValue(value))
    .map((filter) => {
      const value = formatFilterValue(filter);
      if (!value) return null;

      return {
        column: filter.id,
        value,
        type: filter.type,
      };
    })
    .filter((item): item is FilterDefinition => item !== null);
};

export const formatColumnLabel = (columnId: string): string => {
  return columnId
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
};
