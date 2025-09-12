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
import { userStatusesLoader } from "@/loaders/user-statuses.loader";
import { mapFiltersToOrganizationUsersQuery } from "./utils/map-filters-to-organization-users-query";
import { FilterColumn, FilterState } from "@/modules/filters/filters.types";
import { TableToolbar } from "@/modules/filters/table-toolbar";

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
  const filtersQuery = useMemo(
    () => mapFiltersToOrganizationUsersQuery(filters),
    [filters]
  );

  const { data: organizationUsers } = useOrganizationUsers({
    managerId: currentUser.data?.id ?? "",
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ...sortingQuery,
    ...filtersQuery,
    search: filters.search,
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

  useEffect(() => setExpanded({}), [pagination.pageIndex, pagination.pageSize]);

  const additionalFilters: FilterColumn[] = [
    {
      id: "userStatus",
      type: "select",
      label: "Status",
      loader: userStatusesLoader,
    },
  ];

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
