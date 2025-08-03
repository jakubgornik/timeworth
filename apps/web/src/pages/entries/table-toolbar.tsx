import type { Table } from "@tanstack/react-table";
import { DynamicColumnFilter } from "./dynamic-column-filter";
import { AdditionalFilter, FilterState } from "./filters.types";

interface TableToolbarProps<TData> {
  table: Table<TData>;
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
  additionalFilters?: AdditionalFilter[];
  enableSearch?: boolean;
}

export function TableToolbar<TData>({
  table,
  onFiltersChange,
  currentFilters,
  additionalFilters,
  enableSearch,
}: TableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-4 px-6">
      <DynamicColumnFilter
        table={table}
        onFiltersChange={onFiltersChange}
        currentFilters={currentFilters}
        additionalFilters={additionalFilters}
        enableSearch={enableSearch}
      />
      {/* TODO add column visibility */}
    </div>
  );
}
