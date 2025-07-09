import { DialogCard } from "@/components/dialog-card";
import Layout from "@/components/layout";
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
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

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

  const { data: organizationUsers } = useOrganizationUsers({
    managerId: currentUser.data?.id ?? "",
    page: 1,
    pageSize: 50,
  });

  // TODO
  // 1. pass organizationUsers to hook to create details jsx for each row, pass data, columns, and renderExpandedRow to table
  // 2. adjust user table
  // 3. add pagination, sorting
  const { columns, data, renderExpandedRow } = useTableDemo();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  console.log(organizationUsers);

  // TODO: pass organizationUsers
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    manualPagination: true,
    pageCount: 1, // TODO organizationUsers.totalPages,
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
    <Layout>
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
            <div className="flex w-full h-full px-6">
              <DataTable table={table} renderExpandedRow={renderExpandedRow} />

              {/* 
        <Pagination
          table={table}
          totalCount={data.total}
          isLoading={isLoading}
          pageSizeOptions={pageSizeOptions}
        />
       */}
            </div>
          ) : null}
        </Card>
      </SectionWrapper>
    </Layout>
  );
}
