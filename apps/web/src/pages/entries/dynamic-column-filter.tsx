import { useState } from "react";
import type { Table } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import { DateRangeFilter } from "./date-range-filter";
import { AddFilterDropdown } from "./add-filter-dropdown";
import { FilterChip } from "./filter-chip";
import { SearchInput } from "./search-input";
import { AdditionalFilter, FilterRule, FilterState } from "./filters.types";
import { isDateRangeColumn, processFilters } from "./filters.utils";

interface DynamicColumnFilterProps<TData> {
  table: Table<TData>;
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
  additionalFilters?: AdditionalFilter[];
  enableSearch?: boolean;
}

export function DynamicColumnFilter<TData>({
  table,
  onFiltersChange,
  currentFilters,
  additionalFilters = [],
  enableSearch,
}: DynamicColumnFilterProps<TData>) {
  const [filters, setFilters] = useState<FilterRule[]>([]);

  const tableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanFilter() && column.accessorFn)
    .map((column) => ({
      id: column.id,
      label: column.id.charAt(0).toUpperCase() + column.id.slice(1),
      type: isDateRangeColumn(column.id)
        ? ("dateRange" as const)
        : ("text" as const),
    }));

  const additionalColumns = additionalFilters.map((filter) => ({
    id: filter.columnId,
    label: filter.label,
    type: filter.type,
  }));

  const availableColumns = [
    ...tableColumns.filter(
      (col) => !additionalFilters.some((add) => add.columnId === col.id)
    ),
    ...additionalColumns,
  ];

  const availableColumnsForFilter = availableColumns.filter(
    (col) => !filters.some((filter) => filter.column === col.id)
  );

  const applyFilters = (updatedFilters: FilterRule[]) => {
    if (!onFiltersChange) return;

    const validFilters = processFilters(updatedFilters);

    onFiltersChange({
      search: currentFilters.search,
      filters: validFilters,
    });
  };

  const addFilter = (columnId: string, type: "text" | "dateRange" = "text") => {
    const columnConfig = availableColumns.find((col) => col.id === columnId);
    const label = columnConfig?.label || columnId;

    const newFilter: FilterRule = {
      id: crypto.randomUUID(),
      column: columnId,
      label: label,
      value: type === "text" ? "" : undefined,
      type,
    };

    const updatedFilters = [...filters, newFilter];
    setFilters(updatedFilters);
  };

  const updateFilter = (filterId: string, value?: string | DateRange) => {
    const updatedFilters = filters.map((filter) =>
      filter.id === filterId ? { ...filter, value } : filter
    );
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const removeFilter = (filterId: string) => {
    const updatedFilters = filters.filter((filter) => filter.id !== filterId);
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const renderFilter = (filter: FilterRule) => {
    if (filter.type === "dateRange") {
      return (
        <DateRangeFilter
          label={filter.label}
          key={filter.id}
          value={filter.value as DateRange | undefined}
          onChange={(value) => updateFilter(filter.id, value)}
          onRemove={() => removeFilter(filter.id)}
        />
      );
    }

    return (
      <FilterChip
        label={filter.label}
        key={filter.id}
        value={filter.value as string}
        onChange={(value) => updateFilter(filter.id, value)}
        onRemove={() => removeFilter(filter.id)}
      />
    );
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {enableSearch && (
        <SearchInput
          onSearchChange={onFiltersChange}
          currentFilters={currentFilters}
        />
      )}
      <AddFilterDropdown
        columns={availableColumnsForFilter}
        onAddFilter={addFilter}
      />
      {filters.map(renderFilter)}
    </div>
  );
}
