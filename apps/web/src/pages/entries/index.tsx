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
import { convertSortingToQuery } from "@/lib/utils/convert-sorting-to-sorting-query";
import { mapFiltersToOrganizationWorkEntriesQuery } from "./utils/map-filters-to-work-entries-query";
import { useExportWorkEntries } from "@/hooks/work-entry/use-export-work-entries";
import { FilterColumn, FilterState } from "@/modules/filters/filters.types";
import { TableToolbar } from "@/modules/filters/table-toolbar";

export default function EntriesPage() {
  const currentUser = useCurrentUser();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
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
    () => mapFiltersToOrganizationWorkEntriesQuery(filters),
    [filters]
  );

  const { data: workEntries } = useOrganizationWorkEntries({
    managerId: currentUser.data?.id ?? "",
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ...sortingQuery,
    ...filtersQuery,
    search: filters.search,
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
    manualFiltering: true,
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

  useEffect(() => setExpanded({}), [pagination.pageIndex, pagination.pageSize]);

  const additionalFilters: FilterColumn[] = [
    { id: "workPeriod", type: "dateRange", label: "Work Period" },
  ];

  const { mutate: exportWorkEntries } = useExportWorkEntries();

  return (
    <>
      <SectionHeader title="Entries Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary">
          <TableToolbar
            exportFn={() => exportWorkEntries(filtersQuery)}
            table={table}
            onFiltersChange={handleFiltersChange}
            currentFilters={filters}
            additionalFilters={additionalFilters}
          />
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
