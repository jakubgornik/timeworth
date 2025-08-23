import type { Table } from "@tanstack/react-table";
import { DynamicColumnFilter } from "./dynamic-column-filter";
import { FilterColumn, FilterState } from "./filters.types";

interface TableToolbarProps<TData> {
  table: Table<TData>;
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
  additionalFilters?: FilterColumn[];
  enableSearch?: boolean;
  omitColumnsById?: string[];
  exportFn?: () => void;
}

export function TableToolbar<TData>({
  table,
  onFiltersChange,
  currentFilters,
  additionalFilters,
  enableSearch,
  omitColumnsById,
  exportFn,
}: TableToolbarProps<TData>) {
  return (
    <DynamicColumnFilter
      table={table}
      onFiltersChange={onFiltersChange}
      currentFilters={currentFilters}
      additionalFilters={additionalFilters}
      enableSearch={enableSearch}
      omitColumnsById={omitColumnsById}
      exportFn={exportFn}
    />
  );
}
