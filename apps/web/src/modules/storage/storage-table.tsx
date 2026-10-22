import Pagination from "@/components/pagination/pagination";
import DataTable from "@/components/table/table";
import { IStorageFileDto } from "@packages/types";
import { Table } from "@tanstack/react-table";

interface StorageTableProps<TData> {
  table: Table<TData>;
  totalCount?: number;
  pageSizeOptions: number[];
  isLoading?: boolean;
  isError?: boolean;
}

export default function StorageTable({
  pageSizeOptions,
  table,
  totalCount,
  isLoading,
  isError,
}: StorageTableProps<IStorageFileDto>) {
  return (
    <div className="flex flex-col w-full h-full px-6">
      <DataTable table={table} isLoading={isLoading} isError={isError} />
      <Pagination
        table={table}
        totalCount={totalCount}
        pageSizeOptions={pageSizeOptions}
        isLoading={isLoading}
      />
    </div>
  );
}
