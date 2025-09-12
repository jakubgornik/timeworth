import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvailableFilterTypes, FilterColumn } from "./filters.types";

interface AddFilterDropdownProps {
  filterColumns: FilterColumn[];
  onAddFilter: (columnId: string, type?: AvailableFilterTypes) => void;
}

export function AddFilterDropdown({
  filterColumns,
  onAddFilter,
}: AddFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddFilter = (columnId: string, type?: AvailableFilterTypes) => {
    onAddFilter(columnId, type);
    setIsOpen(false);
  };

  const hasAvailableColumns = filterColumns.length > 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 bg-background text-muted-foreground"
          disabled={!hasAvailableColumns}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Select Column</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hasAvailableColumns ? (
          filterColumns.map((column) => (
            <DropdownMenuItem
              key={column.id}
              onClick={() => handleAddFilter(column.id, column.type)}
            >
              {column.label}
              {column.type === "dateRange" && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Range
                </span>
              )}
              {column.type === "text" && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Text
                </span>
              )}
              {column.type === "select" && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Select
                </span>
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
            All columns are already filtered
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
