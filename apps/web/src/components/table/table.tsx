import React from "react";
import { flexRender, Table } from "@tanstack/react-table";
import { motion, AnimatePresence } from "motion/react";

interface DataTableProps<TData> {
  table: Table<TData>;
  isLoading?: boolean;
  renderExpandedRow?: (row: TData) => React.ReactNode;
  onRowClick?: (row: TData) => void;
}

export default function DataTable<TData>({
  table,
  isLoading = false,
  renderExpandedRow,
  onRowClick,
}: DataTableProps<TData>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="min-h-[500px] max-h-[500px] 3xl:max-h-none bg-background border rounded-t-lg overflow-auto custom-scrollbar">
        <table className="w-full border-separate ">
          <thead className="bg-accent sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-2 border-x border-b py-2 text-xs font-medium text-secondary uppercase tracking-wider text-center"
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
                      {header.column.getCanSort() && (
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
                  className={`hover:bg-accent/50 border ${onRowClick ? "cursor-pointer" : ""} ${
                    row.getIsExpanded() ? "bg-accent/50" : ""
                  }`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`${
                        cell.column.columnDef.meta?.disablePadding
                          ? "p-0 h-full"
                          : "px-2 py-2 text-center"
                      } border whitespace-nowrap text-sm text-secondary`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>

                {renderExpandedRow && (
                  <AnimatePresence mode="wait">
                    {row.getIsExpanded() && (
                      <motion.tr
                        key={`${row.id}-expanded`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td colSpan={table.getAllColumns().length}>
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
