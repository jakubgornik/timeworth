import { DateRange } from "react-day-picker";

export interface AdditionalFilter {
  columnId: string;
  type: "text" | "dateRange";
  label: string;
}

export interface FilterState {
  search?: string;
  filters: Array<{
    column: string;
    value: string | { from: string; to: string };
    type: "text" | "dateRange";
  }>;
}

export interface FilterRule {
  id: string;
  column: string;
  label: string;
  value?: string | DateRange;
  type: "text" | "dateRange";
}

export interface ProcessedFilter {
  column: string;
  value: string | { from: string; to: string };
  type: "text" | "dateRange";
}

export interface FilterColumn {
  id: string;
  label: string;
  type?: "text" | "dateRange";
}
