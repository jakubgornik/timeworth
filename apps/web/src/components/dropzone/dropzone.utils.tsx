import React from "react";
import type { Accept } from "react-dropzone";
import {
  CloudUpload,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropzoneState } from "./dropzone.types";

export const DEFAULT_MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getDropzoneStyles(
  hasFile: boolean,
  state: DropzoneState,
): string {
  const base =
    "relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed px-6 py-10 transition-all duration-200 select-none";
  const cursor = hasFile ? "cursor-default" : "cursor-pointer";

  const stateStyles: Record<DropzoneState, string> = {
    idle: "border-border",
    active: "border-secondary/60 bg-accent/50",
    reject: "border-destructive/60 bg-destructive/5",
    success: "border-secondary/50 bg-accent/30",
    error: "border-destructive/60 bg-destructive/5",
  };

  return cn(base, cursor, stateStyles[state]);
}

export function getIconContainerStyles(state: DropzoneState): string {
  return cn(
    "flex items-center justify-center rounded-full p-3 transition-colors",
    state === "active"
      ? "bg-secondary/10"
      : state === "reject" || state === "error"
        ? "bg-destructive/10"
        : state === "success"
          ? "bg-secondary/10"
          : "bg-accent",
  );
}

export function getTextStyles(state: DropzoneState): string {
  return cn(
    "text-sm font-medium",
    state === "reject" || state === "error"
      ? "text-destructive"
      : state === "active" || state === "success"
        ? "text-secondary"
        : "text-foreground",
  );
}

export function getDropzoneIcon(state: DropzoneState): React.ReactNode {
  const cls = "h-10 w-10";
  switch (state) {
    case "active":
      return <FolderOpen className={cn(cls, "text-secondary")} />;
    case "reject":
    case "error":
      return <AlertCircle className={cn(cls, "text-destructive")} />;
    case "success":
      return <CheckCircle2 className={cn(cls, "text-secondary")} />;
    default:
      return <CloudUpload className={cn(cls, "text-muted-foreground")} />;
  }
}

export function getDropzoneText(
  selectedFile: File | null,
  isDragActive: boolean,
  isDragReject: boolean,
  state: DropzoneState,
): string {
  if (selectedFile && state === "success") return selectedFile.name;
  if (isDragReject) return "Some files cannot be accepted";
  if (isDragActive) return "Release to upload";
  if (state === "error") return "File not accepted";
  return "Drop your file here";
}

export function getDescriptionText(
  maxFiles: number,
  accept?: Accept,
  maxSize?: number,
): string {
  const extensions = accept
    ? Object.values(accept)
        .flat()
        .map((e) => e.replace(".", "").toUpperCase())
        .join(", ")
    : "PDF, TXT, XLSX";
  const sizeLimit = maxSize ?? DEFAULT_MAX_FILE_SIZE;
  const sizeMB = Math.round(sizeLimit / (1024 * 1024));
  const fileCount =
    maxFiles === 1 ? "Single file only" : `Up to ${maxFiles} files`;
  return `${extensions} — max ${sizeMB} MB — ${fileCount}`;
}
