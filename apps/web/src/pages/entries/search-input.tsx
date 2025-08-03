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
  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange({
        search: value,
        filters: currentFilters.filters,
      });
    }
  };

  const handleClear = () => {
    if (onSearchChange) {
      onSearchChange({
        search: "",
        filters: currentFilters.filters,
      });
    }
  };

  return (
    <ExpandableSearch
      value={currentFilters.search ?? ""}
      onChange={handleSearchChange}
      onClear={handleClear}
      placeholder="Search..."
    />
  );
}
