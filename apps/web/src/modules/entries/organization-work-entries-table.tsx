import Pagination from "@/components/pagination/pagination";
import DataTable from "@/components/table/table";
import { IWorkEntryDto } from "@packages/types";
import { Table } from "@tanstack/react-table";

interface OrganizationWorkEntriesTableProps<TData> {
  table: Table<TData>;
  totalCount: number;
  pageSizeOptions: number[];
  renderExpandedRow?: (row: TData) => React.ReactNode;
}

export default function OrganizationWorkEntriesTable({
  pageSizeOptions,
  table,
  totalCount,
  renderExpandedRow,
}: OrganizationWorkEntriesTableProps<IWorkEntryDto>) {
  return (
    <div className="flex flex-col w-full h-full px-6">
      <DataTable table={table} renderExpandedRow={renderExpandedRow} />
      <Pagination
        table={table}
        totalCount={totalCount}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}
