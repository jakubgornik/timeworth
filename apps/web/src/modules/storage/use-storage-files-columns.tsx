import { Button } from "@/components/ui/button";
import { IStorageFileDto } from "@packages/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Download,
  File,
  FileSpreadsheet,
  FileText,
  Trash2,
} from "lucide-react";
import { useMemo } from "react";

type UseStorageColumnsProps = {
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileIcon = (type: string) => {
  const normalized = type.toLowerCase();

  if (
    normalized.includes(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ) ||
    normalized.includes("application/vnd.ms-excel") ||
    normalized.includes("xlsx")
  ) {
    return <FileSpreadsheet className="h-4 w-4 text-chart-1" />;
  }

  if (normalized.includes("application/pdf") || normalized.includes("pdf")) {
    return <FileText className="h-4 w-4 text-chart-5" />;
  }

  if (normalized.includes("text/plain") || normalized.includes("txt")) {
    return <FileText className="h-4 w-4 text-chart-5" />;
  }

  return <File className="h-4 w-4 text-muted-foreground" />;
};

export const useStorageColumns = ({
  onDelete,
  onDownload,
}: UseStorageColumnsProps) => {
  return useMemo<ColumnDef<IStorageFileDto>[]>(
    () => [
      {
        id: "name",
        header: "File Name",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0">{getFileIcon(row.original.type)}</span>
            <span
              className="truncate text-sm font-medium text-foreground"
              title={row.original.name}
            >
              {row.original.name}
            </span>
          </div>
        ),
      },
      {
        id: "size",
        header: "Size",
        accessorKey: "size",
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">
            {formatFileSize(getValue<number>())}
          </span>
        ),
      },
      {
        id: "uploadDate",
        header: "Added",
        accessorKey: "uploadDate",
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">
            {format(new Date(getValue<string | Date>()), "PP")}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="primary"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-secondary hover:bg-accent/60 transition-colors"
              onClick={() => onDownload(row.original.id)}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="primary"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [onDelete, onDownload],
  );
};
