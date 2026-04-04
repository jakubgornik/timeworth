"use client";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Accept, type FileRejection } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Dropzone } from "@/components/dropzone/dropzone";
import {
  FileUpload,
  fileUploadSchema,
} from "./validators/file-upload.validation";

export const IMPORT_WORK_ENTRY_ACCEPTED_FILE_TYPE: Accept = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
};

export const IMPORT_WORK_ENTRY_MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

const IMPORT_WORK_ENTRY_ERROR_MESSAGES = {
  MULTIPLE_FILES: "Please select only one file at a time",
  FILE_TOO_LARGE: "File size must be less than 10MB",
  INVALID_TYPE: "Please select an Excel file (.xlsx only)",
  ALREADY_SELECTED: "Remove the current file before selecting a new one",
  GENERIC_ERROR: "Invalid file. Please try again.",
};

interface WorkEntryUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSubmit: (file: File) => void;
}

export function WorkEntryUploadDialog({
  isOpen,
  onClose,
  onFileSubmit,
}: WorkEntryUploadDialogProps) {
  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm<FileUpload>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: { file: null },
    mode: "onChange",
  });

  const selectedFile = watch("file");

  const handleDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const totalFiles = acceptedFiles.length + rejectedFiles.length;
      clearErrors("file");

      if (totalFiles > 1) {
        setError("file", {
          type: "multiple",
          message: IMPORT_WORK_ENTRY_ERROR_MESSAGES.MULTIPLE_FILES,
        });
        return;
      }

      if (selectedFile) {
        setError("file", {
          type: "already-selected",
          message: IMPORT_WORK_ENTRY_ERROR_MESSAGES.ALREADY_SELECTED,
        });
        return;
      }

      if (rejectedFiles.length > 0) {
        const code = rejectedFiles[0].errors?.[0]?.code;
        const message =
          code === "file-too-large"
            ? IMPORT_WORK_ENTRY_ERROR_MESSAGES.FILE_TOO_LARGE
            : code === "file-invalid-type"
              ? IMPORT_WORK_ENTRY_ERROR_MESSAGES.INVALID_TYPE
              : IMPORT_WORK_ENTRY_ERROR_MESSAGES.GENERIC_ERROR;
        setError("file", { type: code, message });
        return;
      }

      if (acceptedFiles.length === 1) {
        setValue("file", acceptedFiles[0], { shouldValidate: true });
      }
    },
    [selectedFile, clearErrors, setError, setValue],
  );

  const handleRemove = useCallback(() => {
    setValue("file", null);
    clearErrors("file");
  }, [setValue, clearErrors]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleFormSubmit = handleSubmit((data) => {
    if (data.file) {
      onFileSubmit(data.file);
      handleClose();
    }
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      clearErrors();
    }
  }, [isOpen, reset, clearErrors]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Import Work Entries File
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Dropzone
            onDrop={handleDrop}
            selectedFile={selectedFile ?? null}
            errorMessage={errors.file?.message}
            onRemove={handleRemove}
            multiple={false}
            maxFiles={1}
            acceptOverride={IMPORT_WORK_ENTRY_ACCEPTED_FILE_TYPE}
            maxSizeOverride={IMPORT_WORK_ENTRY_MAX_FILE_SIZE}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || !selectedFile}>
              Import File
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
