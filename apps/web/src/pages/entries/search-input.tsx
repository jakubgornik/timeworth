import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ExpandableSearch } from "./expandable-search";
import { FilterState } from "./filters.types";

interface SearchInputProps {
  onSearchChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export function SearchInput({
  onSearchChange,
  currentFilters,
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search ?? "");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearchChange({
      search: value,
      filters: currentFilters.filters,
    });
  }, 400);

  const handleChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearchChange({
      search: "",
      filters: currentFilters.filters,
    });
  };

  return (
    <ExpandableSearch
      value={searchTerm}
      onChange={handleChange}
      onClear={handleClear}
      placeholder="Search..."
    />
  );
}
