import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import PageNumbers from "./page-numbers";

interface PaginationNavigationProps<TData> {
  table: Table<TData>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function PaginationNavigation<TData>({
  table,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationNavigationProps<TData>) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage() || isLoading}
        variant="secondary"
        size="sm"
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </Button>

      <PageNumbers
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />

      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage() || isLoading}
        variant="secondary"
        size="sm"
        className="flex items-center"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
