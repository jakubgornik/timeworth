"use client";

import { useCallback } from "react";
import { useDropzone, type FileRejection, type Accept } from "react-dropzone";
import { AlertCircle, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ACCEPTED_FILE_TYPES, DropzoneState } from "./dropzone.types";
import {
  DEFAULT_MAX_FILE_SIZE,
  formatFileSize,
  getDescriptionText,
  getDropzoneIcon,
  getDropzoneStyles,
  getDropzoneText,
  getIconContainerStyles,
  getTextStyles,
} from "./dropzone.utils";

interface FileDropzoneProps {
  selectedFile?: File | null;
  errorMessage?: string;
  onDrop: (accepted: File[], rejected: FileRejection[]) => void;
  onRemove?: () => void;
  multiple?: boolean;
  maxFiles?: number;
  stateOverride?: DropzoneState;
  acceptOverride?: Accept;
  maxSizeOverride?: number;
  className?: string;
}

export function Dropzone({
  selectedFile = null,
  errorMessage,
  onDrop,
  onRemove,
  multiple = false,
  maxFiles = 1,
  stateOverride,
  acceptOverride,
  maxSizeOverride,
  className,
}: FileDropzoneProps) {
  const acceptConfig = acceptOverride ?? ACCEPTED_FILE_TYPES;
  const maxSizeConfig = maxSizeOverride ?? DEFAULT_MAX_FILE_SIZE;

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone({
      onDrop,
      accept: acceptConfig,
      maxSize: maxSizeConfig,
      multiple,
      maxFiles,
      disabled: !!selectedFile,
      noClick: !!selectedFile,
      noDrag: !!selectedFile,
    });

  const resolveState = (): DropzoneState => {
    if (stateOverride) return stateOverride;
    if (selectedFile && !errorMessage) return "success";
    if (errorMessage) return "error";
    if (isDragReject && isDragActive) return "reject";
    if (isDragActive) return "active";
    return "idle";
  };

  const state = resolveState();

  const handleBrowse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      open();
    },
    [open],
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        {...getRootProps()}
        className={getDropzoneStyles(!!selectedFile, state)}
      >
        <input {...getInputProps()} />
        <div className={getIconContainerStyles(state)}>
          {getDropzoneIcon(state)}
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className={getTextStyles(state)}>
            {getDropzoneText(selectedFile, isDragActive, isDragReject, state)}
          </p>
          {!selectedFile && (
            <p className="text-xs text-muted-foreground">
              {getDescriptionText(maxFiles, acceptConfig, maxSizeConfig)}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={handleBrowse}
          className={cn(
            "border-border bg-accent text-foreground hover:bg-muted transition-opacity",
            state !== "idle" ? "opacity-0 pointer-events-none" : "opacity-100",
          )}
        >
          Browse Files
        </Button>
      </div>
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{errorMessage}</p>
        </div>
      )}
      {selectedFile && !errorMessage && onRemove && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Selected File:</h4>
          <div className="flex items-center justify-between rounded-md border-2 border-dashed border-muted-foreground/40 bg-background p-3">
            <div className="flex items-center gap-3">
              <File className="h-4 w-4 shrink-0 text-secondary" />
              <div className="flex flex-col">
                <p className="text-sm font-medium text-secondary leading-tight">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={onRemove}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remove file"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
