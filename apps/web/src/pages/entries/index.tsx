import SectionHeader from "@/components/section-header";
import SectionWrapper from "@/components/section-wrapper";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import {
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useOrganizationWorkEntries } from "@/hooks/work-entry/use-organization-work-entries";
import OrganizationWorkEntriesTable from "@/modules/entries/organization-work-entries-table";
import { useOrganizationWorkEntriesTableColumns } from "@/modules/entries/use-organization-work-entries-table-columns";

export default function EntriesPage() {
  const currentUser = useCurrentUser();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});

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

  const { columns, renderExpandedRow } =
    useOrganizationWorkEntriesTableColumns();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: workEntries?.totalPages,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    state: {
      sorting,
      expanded,
      pagination,
    },
  });

  useEffect(
    () => setExpanded({}),
    [workEntries?.data, pagination.pageIndex, pagination.pageSize, sorting]
  );

  return (
    <>
      <SectionHeader title="Entries Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary">
          <OrganizationWorkEntriesTable
            table={table}
            renderExpandedRow={renderExpandedRow}
            totalCount={workEntries?.totalCount ?? 0}
            pageSizeOptions={[10, 15, 20]}
          />
        </Card>
      </SectionWrapper>
    </>
  );
}
