import { DialogCard } from "@/components/dialog-card";
import Pagination from "@/components/pagination/pagination";
import SectionHeader from "@/components/section-header";
import SectionWrapper from "@/components/section-wrapper";
import DataTable from "@/components/table/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useOrganizationUsers } from "@/hooks/user/use-organization-users";
import { CreateOrganizationDialog } from "@/modules/dashboard/dialogs/create-organization-dialog";
import { JoinOrganizationDialog } from "@/modules/dashboard/dialogs/join-organization-dialog";
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
import Test from "../test/test";

export default function DashboardPage() {
  const currentUser = useCurrentUser();

  const userIsOnboarded = useMemo(
    () => !!currentUser.data?.organization,
    [currentUser.data?.organization]
  );

  const userIsManager = useMemo(
    () => currentUser.data?.organization?.managerId === currentUser.data?.id,
    [currentUser.data?.organization?.managerId, currentUser.data?.id]
  );

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

  const { columns, renderExpandedRow } = useTableDemo();

  const data = useMemo(() => {
    return organizationUsers?.data ?? [];
  }, [organizationUsers?.data]);

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
          {!userIsOnboarded ? (
            <>
              <CardHeader className="text-2xl font-bold flex-col text-center flex gap-2 items-center justify-center mb-4">
                Welcome to the Dashboard
              </CardHeader>
              <CardContent className="flex flex-col lg:flex-row justify-around gap-5 px-4 sm:px-8 lg:px-12">
                <DialogCard
                  title="Are you part of an Organization?"
                  description="To access dashboard, please join an organization. If you don't have an organization code, please contact your organization manager."
                  dialog={<JoinOrganizationDialog />}
                />

                <DialogCard
                  title="Are you Organization manager?"
                  description="If you are the manager of an organization, you can create a new organization and invite members to join. Please provide the necessary details to set up your organization."
                  dialog={<CreateOrganizationDialog />}
                />
              </CardContent>
            </>
          ) : userIsManager ? (
            // Table test
            // <div className="flex flex-col w-full h-full px-6">
            //   <DataTable table={table} renderExpandedRow={renderExpandedRow} />
            //   <Pagination
            //     table={table}
            //     totalCount={organizationUsers?.totalCount ?? 0}
            //     pageSizeOptions={[10, 15, 20]}
            //   />
            // </div>
            // Timetable test
            <Test />
          ) : null}
        </Card>
      </SectionWrapper>
    </>
  );
}
