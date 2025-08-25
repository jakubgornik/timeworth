import { cn } from "@/lib/utils";
import { DropzoneState } from "./file-upload-dialog.types";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";

export const ACCEPTED_FILE_TYPE = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ERROR_MESSAGES = {
  MULTIPLE_FILES: "Please select only one file at a time",
  FILE_TOO_LARGE: "File size must be less than 10MB",
  INVALID_TYPE: "Please select an Excel file (.xlsx only)",
  ALREADY_SELECTED: "Remove the current file before selecting a new one",
  GENERIC_ERROR: "Invalid file. Please try again.",
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const getDropzoneDescriptionText = (fileLimit: number) => {
  const parts: string[] = [];

  const extText = Object.values(ACCEPTED_FILE_TYPE).flat().join(", ");
  if (extText) parts.push(`Only ${extText}`);

  if (typeof MAX_FILE_SIZE === "number") {
    parts.push(`Max ${formatFileSize(MAX_FILE_SIZE)}`);
  }

  parts.push(fileLimit === 1 ? "Single file only" : `Up to ${fileLimit} files`);

  return parts.join(" • ");
};

export const getDropzoneText = (
  selectedFile: File | null,
  isDragActive: boolean,
  isDragReject: boolean
) => {
  if (selectedFile) return "File selected successfully";
  if (isDragActive && isDragReject) return "Invalid input";
  if (isDragActive) return "Drop your Excel file here";
  return "Drop your Excel file here or click to browse";
};

export const getDropzoneIcon = (state: DropzoneState) => {
  switch (state) {
    case "success":
      return <CheckCircle2 className="h-6 w-6" />;
    case "error":
    case "reject":
      return <AlertCircle className="h-6 w-6" />;
    default:
      return <Upload className="h-6 w-6" />;
  }
};

export const getDropzoneTextStyles = (state: DropzoneState) => {
  switch (state) {
    case "success":
      return "text-sm font-medium text-green-500";
    case "error":
    case "reject":
      return "text-sm font-medium text-destructive";
    case "active":
    default:
      return "text-sm font-medium text-muted-foreground";
  }
};

export const getIconStyles = (state: DropzoneState) => {
  const baseClasses = "p-3 rounded-full transition-colors";

  const stateClasses = {
    active: "bg-background",
    error: "bg-destructive text-destructive-foreground",
    reject: "bg-destructive text-destructive-foreground",
    success: "bg-green-500 text-secondary",
    idle: "bg-background",
  };

  return cn(baseClasses, stateClasses[state]);
};

export const getDropzoneStyles = (
  selectedFile: File | null,
  state: DropzoneState
) => {
  const baseClasses =
    "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200";

  const stateClasses = {
    active: "border-muted-foreground/50",
    error: "border-destructive bg-destructive/5",
    reject: "border-destructive bg-destructive/5",
    success: "border-green-500",
    idle: "border-muted-foreground/50",
  };

  const disabledClasses = selectedFile ? "cursor-not-allowed opacity-30 " : "";
  const hoverClasses = !selectedFile ? "cursor-pointer" : "";

  return cn(baseClasses, hoverClasses, stateClasses[state], disabledClasses);
};
