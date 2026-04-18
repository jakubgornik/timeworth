import SectionHeader from "@/components/section-header";
import SectionWrapper from "@/components/section-wrapper";
import { Card } from "@/components/ui/card";
import {
  useGetStorage,
  useUploadEmployeeFiles,
} from "@/hooks/storage/storage.hooks";
import { convertSortingToQuery } from "@/lib/utils/convert-sorting-to-sorting-query";
import { StorageCard } from "@/modules/storage/storage-card";
import StorageTable from "@/modules/storage/storage-table";
import { useStorageColumns } from "@/modules/storage/use-storage-files-columns";
import {
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

export default function StoragePage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { mutate: uploadFiles } = useUploadEmployeeFiles();

  const handleFilesAdded = useCallback(
    (files: File[]) => {
      uploadFiles(files);
    },
    [uploadFiles],
  );

  const sortingQuery = useMemo(() => convertSortingToQuery(sorting), [sorting]);

  const { data: storageFiles } = useGetStorage({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ...sortingQuery,
  });

  const data = useMemo(() => {
    return storageFiles?.data ?? [];
  }, [storageFiles?.data]);
  console.log(data);
  const columns = useStorageColumns({
    onDelete: () => {}, //todo
    onDownload: () => {},
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: storageFiles?.totalPages,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <>
      <SectionHeader title="Storage Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary px-4 py-8">
          <StorageCard onFilesAdded={handleFilesAdded} />
          <StorageTable
            table={table}
            totalCount={storageFiles?.totalCount ?? 0}
            pageSizeOptions={[10, 15, 20]}
          />
        </Card>
      </SectionWrapper>
    </>
  );
}
