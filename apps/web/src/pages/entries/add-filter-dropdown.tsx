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
import { FilterColumn } from "./filters.types";

interface AddFilterDropdownProps {
  columns: FilterColumn[];
  onAddFilter: (columnId: string, type?: "text" | "dateRange") => void;
}

export function AddFilterDropdown({
  columns,
  onAddFilter,
}: AddFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddFilter = (columnId: string, type?: "text" | "dateRange") => {
    onAddFilter(columnId, type);
    setIsOpen(false);
  };

  const hasAvailableColumns = columns.length > 0;

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
          columns.map((column) => (
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
