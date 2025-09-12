import { useState } from "react";
import type { Table } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import { DateRangeFilter } from "./date-range-filter";
import { AddFilterDropdown } from "./add-filter-dropdown";
import { FilterChip } from "./filter-chip";
import { SearchInput } from "./search-input";
import {
  AvailableFilterTypes,
  AvailableValueTypes,
  FilterColumn,
  FilterRule,
  FilterState,
} from "./filters.types";
import { formatColumnLabel, processFilters } from "./filters.utils";
import { MultiselectFilter } from "./multi-select-filter";
import { Button } from "@/components/ui/button";

interface DynamicColumnFilterProps<TData> {
  table: Table<TData>;
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
  additionalFilters?: FilterColumn[];
  enableSearch?: boolean;
  omitColumnsById?: string[];
  exportFn?: () => void;
  downloadTemplateFn?: () => void;
}

export function DynamicColumnFilter<TData>({
  table,
  onFiltersChange,
  currentFilters,
  additionalFilters = [],
  enableSearch,
  omitColumnsById,
  exportFn,
  downloadTemplateFn,
}: DynamicColumnFilterProps<TData>) {
  const [filters, setFilters] = useState<FilterRule[]>([]);

  // default from table, text type
  const tableColumns: FilterColumn[] = table
    .getAllColumns()
    .filter((column) => column.getCanFilter() && column.accessorFn)
    .filter((column) => !omitColumnsById?.includes(column.id))
    .map((column) => ({
      id: column.id,
      label: formatColumnLabel(column.id),
      type: "text",
    }));

  const additionalColumns = additionalFilters.map((filter) => ({
    id: filter.id,
    label: filter.label,
    type: filter.type,
    loader: filter.loader,
  }));

  const availableColumns = [
    ...tableColumns.filter(
      (col) => !additionalFilters.some((add) => add.id === col.id)
    ),
    ...additionalColumns,
  ];

  const availableColumnsForFilter = availableColumns.filter(
    (col) => !filters.some((filter) => filter.id === col.id)
  );

  const applyFilters = (updatedFilters: FilterRule[]) => {
    if (!onFiltersChange) return;

    const validFilters = processFilters(updatedFilters);

    onFiltersChange({
      search: currentFilters.search,
      filters: validFilters,
    });
  };

  const addFilter = (columnId: string, type: AvailableFilterTypes = "text") => {
    const columnConfig = availableColumns.find((col) => col.id === columnId);
    const label = columnConfig?.label || columnId;

    const newFilter: FilterRule = {
      id: columnId,
      label: label,
      type,
      value: type === "text" ? "" : type === "select" ? [] : undefined,
      loader: columnConfig?.loader,
    };
    const updatedFilters = [...filters, newFilter];

    setFilters(updatedFilters);
  };

  const updateFilter = (filterId: string, value?: AvailableValueTypes) => {
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

    if (filter.type === "select") {
      return (
        <MultiselectFilter
          key={filter.id}
          id={filter.id}
          label={filter.label}
          value={(filter.value as string[]) || []}
          loader={filter.loader}
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
    <div className="flex items-center gap-3 flex-wrap pl-6">
      {/* TODO dropdown */}
      {exportFn && (
        <Button
          onClick={exportFn}
          variant="outline"
          className="text-muted-foreground h-10"
        >
          Export
        </Button>
      )}
      {downloadTemplateFn && (
        <Button
          onClick={downloadTemplateFn}
          variant="outline"
          className="text-muted-foreground h-10"
        >
          Download Template
        </Button>
      )}
      {enableSearch && (
        <SearchInput
          onSearchChange={onFiltersChange}
          currentFilters={currentFilters}
        />
      )}
      <AddFilterDropdown
        filterColumns={availableColumnsForFilter}
        onAddFilter={addFilter}
      />
      {filters.map(renderFilter)}
    </div>
  );
}
