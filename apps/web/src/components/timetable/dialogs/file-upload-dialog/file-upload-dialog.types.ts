export interface FileUploadFormData {
  file: File | null;
}

export type DropzoneState = "idle" | "active" | "reject" | "error" | "success";

export type FileErrorType =
  | "multiple"
  | "size"
  | "type"
  | "already-selected"
  | "validation"
  | "invalid";
