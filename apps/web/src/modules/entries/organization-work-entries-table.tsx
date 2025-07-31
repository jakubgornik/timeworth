import Pagination from "@/components/pagination/pagination";
import DataTable from "@/components/table/table";
import { IWorkEntryDto } from "@packages/types";
import { Table } from "@tanstack/react-table";

interface OrganizationWorkEntriesTableProps<TData> {
  table: Table<TData>;
  totalCount: number;
  pageSizeOptions: number[];
}

export default function OrganizationWorkEntriesTable({
  pageSizeOptions,
  table,
  totalCount,
}: OrganizationWorkEntriesTableProps<IWorkEntryDto>) {
  return (
    <div className="flex flex-col w-full h-full px-6">
      <DataTable table={table} />
      <Pagination
        table={table}
        totalCount={totalCount}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}
