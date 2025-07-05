import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ExpandedState,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "motion/react";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableExpanding?: boolean;
  pageSize?: number;
  onRowClick?: (row: TData) => void;
  renderExpandedRow?: (row: TData) => React.ReactNode;
  getRowCanExpand?: (row: TData) => boolean;
}

export default function DataTable<TData>({
  data,
  columns,
  enableSorting = true,
  enableExpanding = false,
  onRowClick,
  renderExpandedRow,
  getRowCanExpand,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
    }),
    ...(enableExpanding && {
      getExpandedRowModel: getExpandedRowModel(),
      onExpandedChange: setExpanded,
      getRowCanExpand: getRowCanExpand
        ? (row) => getRowCanExpand(row.original as TData)
        : () => true,
    }),
    state: {
      sorting,
      ...(enableExpanding && { expanded }),
    },
  });

  return (
    <div className="w-full">
      <div className=" bg-background overflow-y-auto overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-background sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 border py-3 text-xs font-medium text-secondary uppercase tracking-wider text-center"
                    style={{
                      width: `${header.column.columnDef?.meta?.width}px`,
                    }}
                  >
                    <div
                      className={`flex items-center justify-center space-x-1 ${
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      {enableSorting && header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {{
                            asc: " ↑",
                            desc: " ↓",
                          }[header.column.getIsSorted() as string] ?? " ↕"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-background divide-y">
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr
                  className={`hover:bg-accent border ${onRowClick ? "cursor-pointer" : ""} ${
                    enableExpanding && row.getIsExpanded() ? "bg-accent" : ""
                  }`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`${
                        cell.column.columnDef.meta?.disablePadding
                          ? "p-0 h-full"
                          : "px-6 py-4 text-center"
                      } border whitespace-nowrap text-sm text-secondary`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>

                {enableExpanding && renderExpandedRow && (
                  <AnimatePresence mode="wait">
                    {row.getIsExpanded() && (
                      <motion.tr
                        key={`${row.id}-expanded`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td colSpan={columns.length}>
                          <motion.div
                            className="border-l-4 bg-accent border-secondary/80 pl-4"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.05, duration: 0.25 }}
                          >
                            {renderExpandedRow(row.original)}
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
