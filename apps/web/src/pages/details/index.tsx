import SectionHeader from "@/components/section-header";
import SectionWrapper from "@/components/section-wrapper";

import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useOrganizationUsers } from "@/hooks/user/use-organization-users";
import { useTableDemo } from "@/modules/dashboard/use-table-demo-columns";
import {
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import UserDetailsTable from "@/modules/details/user-details-table";

export default function DetailsPage() {
  const currentUser = useCurrentUser();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
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

  const { data: organizationUsers } = useOrganizationUsers({
    managerId: currentUser.data?.id ?? "",
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ...sortingQuery,
  });

  const data = useMemo(() => {
    return organizationUsers?.data ?? [];
  }, [organizationUsers?.data]);

  const { columns, renderExpandedRow } = useTableDemo();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: organizationUsers?.totalPages,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    state: {
      sorting,
      expanded,
      pagination,
    },
  });

  return (
    <>
      <SectionHeader title="Dashboard Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary">
          <UserDetailsTable
            table={table}
            renderExpandedRow={renderExpandedRow}
            totalCount={organizationUsers?.totalCount ?? 0}
            pageSizeOptions={[10, 15, 20]}
          />
        </Card>
      </SectionWrapper>
    </>
  );
}
