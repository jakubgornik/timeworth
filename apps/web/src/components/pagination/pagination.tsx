import { Table } from "@tanstack/react-table";
import PaginationNavigation from "./pagination-navigation";
import PageSizeSelector from "./pagination-size-selector";
import { useEffect } from "react";

interface PaginationProps<TData> {
  table: Table<TData>;
  totalCount?: number;
  pageSizeOptions: number[];
  isLoading?: boolean;
}

export default function Pagination<TData>({
  table,
  totalCount,
  isLoading = false,
  pageSizeOptions,
}: PaginationProps<TData>) {
  const pagination = table.getState().pagination;
  const { pageIndex, pageSize } = pagination;

  const currentPage = pageIndex + 1;
  const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
  const lastPageIndex = Math.max(0, totalPages - 1);

  useEffect(() => {
    if (totalCount !== undefined && !isLoading && pageIndex > lastPageIndex) {
      table.setPageIndex(lastPageIndex);
    }
  }, [totalCount, isLoading, pageIndex, lastPageIndex, table]);

  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1);
  };

  return (
    <div className="border-t-0 border flex items-center justify-between px-4 py-3 bg-background rounded-b-lg shadow-sm sm:px-6">
      <div className="flex items-center justify-between w-full">
        <PageSizeSelector
          table={table}
          pageSizeOptions={pageSizeOptions}
          isLoading={isLoading}
        />

        <PaginationNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
