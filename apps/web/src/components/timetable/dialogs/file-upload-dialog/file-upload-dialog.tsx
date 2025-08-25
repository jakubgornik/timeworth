import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone, type FileRejection } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { File, X, AlertCircle } from "lucide-react";
import {
  FileUpload,
  fileUploadSchema,
} from "../validators/file-upload.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ACCEPTED_FILE_TYPE,
  ERROR_MESSAGES,
  formatFileSize,
  getDropzoneDescriptionText,
  getDropzoneIcon,
  getDropzoneStyles,
  getDropzoneText,
  getDropzoneTextStyles,
  getIconStyles,
  MAX_FILE_SIZE,
} from "./file-upload-dialog.utils";
import { DropzoneState, FileErrorType } from "./file-upload-dialog.types";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSubmit: (file: File) => void;
}

export function FileUploadDialog({
  isOpen,
  onClose,
  onFileSubmit,
}: FileUploadModalProps) {
  const form = useForm<FileUpload>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: { file: null },
    mode: "onChange",
  });

  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = form;
  const selectedFile = watch("file");

  const handleMultipleFilesError = useCallback(() => {
    setError("file", {
      type: "multiple",
      message: ERROR_MESSAGES.MULTIPLE_FILES,
    });
  }, [setError]);

  const handleFileAlreadySelectedError = useCallback(() => {
    setError("file", {
      type: "already-selected",
      message: ERROR_MESSAGES.ALREADY_SELECTED,
    });
  }, [setError]);

  const handleRejectedFileError = useCallback(
    (rejection: FileRejection) => {
      const errorCode = rejection.errors?.[0]?.code;

      const errorMap: Record<string, { type: FileErrorType; message: string }> =
        {
          "file-too-large": {
            type: "size",
            message: ERROR_MESSAGES.FILE_TOO_LARGE,
          },
          "file-invalid-type": {
            type: "type",
            message: ERROR_MESSAGES.INVALID_TYPE,
          },
        };

      const error = errorMap[errorCode] || {
        type: "invalid",
        message: ERROR_MESSAGES.GENERIC_ERROR,
      };
      setError("file", error);
    },
    [setError]
  );

  const processAcceptedFile = useCallback(
    (file: File) => {
      setValue("file", file, { shouldValidate: true });
    },
    [setValue]
  );

  const handleFileDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const totalFiles = acceptedFiles.length + rejectedFiles.length;
      clearErrors("file");

      if (totalFiles > 1) {
        handleMultipleFilesError();
        return;
      }

      if (rejectedFiles.length > 0) {
        handleRejectedFileError(rejectedFiles[0]);
        return;
      }

      if (selectedFile && acceptedFiles.length > 0) {
        handleFileAlreadySelectedError();
        return;
      }

      if (acceptedFiles.length === 1) {
        processAcceptedFile(acceptedFiles[0]);
      }
    },
    [
      selectedFile,
      clearErrors,
      handleFileAlreadySelectedError,
      handleMultipleFilesError,
      handleRejectedFileError,
      processAcceptedFile,
    ]
  );

  const dropzoneConfig = {
    onDrop: handleFileDrop,
    accept: ACCEPTED_FILE_TYPE,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    multiple: false,
    disabled: !!selectedFile,
    noClick: !!selectedFile,
    noDrag: !!selectedFile,
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone(dropzoneConfig);

  const handleRemoveFile = useCallback(() => {
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

  const handleOpenBrowseMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    open();
  };

  const getDropzoneState = (): DropzoneState => {
    if (selectedFile && !errors.file) return "success";
    if (errors.file) return "error";
    if (isDragReject && isDragActive) return "reject";
    if (isDragActive) return "active";
    return "idle";
  };

  const dropzoneState = getDropzoneState();

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
          <div
            {...getRootProps()}
            className={getDropzoneStyles(selectedFile, dropzoneState)}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className={getIconStyles(dropzoneState)}>
                {getDropzoneIcon(dropzoneState)}
              </div>
              <div className="space-y-2">
                <p className={getDropzoneTextStyles(dropzoneState)}>
                  {getDropzoneText(selectedFile, isDragActive, isDragReject)}
                </p>
                {!selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    {getDropzoneDescriptionText(dropzoneConfig.maxFiles)}
                  </p>
                )}
              </div>
              {!selectedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleOpenBrowseMode}
                >
                  Browse Files
                </Button>
              )}
            </div>
          </div>
          {errors.file && (
            <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{errors.file.message}</p>
            </div>
          )}
          {selectedFile && !errors.file && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected File:</h4>
              <div className="flex items-center justify-between p-3 bg-background border-2 border-dashed border-muted-foreground/50 rounded-md">
                <div className="flex items-center space-x-3">
                  <File className="h-4 w-4 text-secondary flex-shrink-0" />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-secondary">
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
                  onClick={handleRemoveFile}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
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
