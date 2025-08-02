import SectionHeader from "@/components/section-header";
import SectionWrapper from "@/components/section-wrapper";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import {
  getCoreRowModel,
  getExpandedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useOrganizationWorkEntries } from "@/hooks/work-entry/use-organization-work-entries";
import OrganizationWorkEntriesTable from "@/modules/entries/organization-work-entries-table";

export interface FilterState {
  search?: string;
  filters: Array<{
    column: string;
    value: string | { from: string; to: string };
    type: "text" | "dateRange";
  }>;
}

export default function EntriesPage() {
  const currentUser = useCurrentUser();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const sortingQuery = useMemo(
    () =>
      sorting.length > 0
        ? {
            id: sorting[0].id,
            desc: sorting[0].desc,
          }
        : undefined,
    [sorting]
  );

  const { data: workEntries } = useOrganizationWorkEntries({
    managerId: currentUser.data?.id ?? "",
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ...sortingQuery,
  });

  const data = useMemo(() => {
    return workEntries?.data ?? [];
  }, [workEntries?.data]);

  // const { columns } = useOrganizationWorkEntriesTableColumns();

  // const table = useReactTable({
  //   data,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getExpandedRowModel: getExpandedRowModel(),
  //   manualPagination: true,
  //   manualSorting: true,
  //   onPaginationChange: setPagination,
  //   onSortingChange: setSorting,
  //   state: {
  //     sorting,
  //     pagination,
  //   },
  //   pageCount: workEntries?.totalPages,
  // });

  return (
    <>
      <SectionHeader title="Entries Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary">
          {/* <OrganizationWorkEntriesTable
            table={table}
            totalCount={workEntries?.totalCount ?? 0}
            pageSizeOptions={[10, 15, 20]}
          /> */}
        </Card>
      </SectionWrapper>
    </>
  );
}
