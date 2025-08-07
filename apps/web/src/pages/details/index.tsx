import SectionHeader from "@/components/section-header";
import SectionWrapper from "@/components/section-wrapper";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useOrganizationUsers } from "@/hooks/user/use-organization-users";
import {
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import UserDetailsTable from "@/modules/details/user-details-table";
import { useUserDetailsTableColumns } from "@/modules/dashboard/use-details-table-columns";
import { convertSortingToQuery } from "@/lib/utils/convert-sorting-to-sorting-query";
import { TableToolbar } from "../entries/table-toolbar";
import { FilterColumn, FilterState } from "../entries/filters.types";
import { fetchUserStatusOptions } from "@/loaders/use-user-statuses.loader";

export default function DetailsPage() {
  const currentUser = useCurrentUser();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    filters: [],
  });

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const sortingQuery = useMemo(() => convertSortingToQuery(sorting), [sorting]);

  const { data: organizationUsers } = useOrganizationUsers({
    managerId: currentUser.data?.id ?? "",
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ...sortingQuery,
  });

  const data = useMemo(() => {
    return organizationUsers?.data ?? [];
  }, [organizationUsers?.data]);

  const { columns, renderExpandedRow } = useUserDetailsTableColumns();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
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

  useEffect(
    () => setExpanded({}),
    [
      organizationUsers?.data,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ]
  );

  const additionalFilters: FilterColumn[] = [
    {
      id: "userStatus",
      type: "select",
      label: "Status",
      loader: fetchUserStatusOptions,
    },
  ];

  console.log("FILTERS", filters);

  return (
    <>
      <SectionHeader title="Details Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary">
          <TableToolbar
            table={table}
            onFiltersChange={handleFiltersChange}
            currentFilters={filters}
            omitColumnsById={["name", "status"]}
            enableSearch
            additionalFilters={additionalFilters}
          />
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
