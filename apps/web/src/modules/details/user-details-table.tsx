import Pagination from "@/components/pagination/pagination";
import DataTable from "@/components/table/table";
import { ICurrentUserDto } from "@packages/types";
import { Table } from "@tanstack/react-table";

interface UserDetailsTableProps<TData> {
  table: Table<TData>;
  renderExpandedRow?: (row: TData) => React.ReactNode;
  totalCount?: number;
  pageSizeOptions: number[];
  isLoading?: boolean;
  isError?: boolean;
}

export default function UserDetailsTable({
  pageSizeOptions,
  table,
  totalCount,
  isLoading,
  isError,
  renderExpandedRow,
}: UserDetailsTableProps<ICurrentUserDto>) {
  return (
    <div className="flex flex-col w-full h-full px-6">
      <DataTable
        table={table}
        renderExpandedRow={renderExpandedRow}
        isLoading={isLoading}
        isError={isError}
      />
      <Pagination
        table={table}
        totalCount={totalCount}
        pageSizeOptions={pageSizeOptions}
        isLoading={isLoading}
      />
    </div>
  );
}
