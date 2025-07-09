import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps<TData> {
  table: Table<TData>;
  totalCount: number;
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
  const totalPages = Math.ceil(totalCount / pageSize);
  // TODO: adjust styles use shadcn select
  return (
    <div className="border-t-0 border flex items-center justify-between px-4 py-3 bg-background rounded-b-lg shadow-sm sm:px-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-secondary">Items per page:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              disabled={isLoading}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
            className="cursor-pointer px-3 py-2 text-sm font-medium text-primary bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-1">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => table.setPageIndex(pageNumber - 1)}
                  disabled={isLoading}
                  className={`cursor-pointer px-3 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentPage === pageNumber
                      ? "bg-secondary text-primary border"
                      : "text-secondary bg-background border"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
            className="cursor-pointer px-3 py-2 text-sm font-medium text-primary bg-secondary border  rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
