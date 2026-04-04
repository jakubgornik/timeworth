import { Accept } from "react-dropzone";

export type DropzoneState = "idle" | "active" | "reject" | "success" | "error";

export const ACCEPTED_FILE_TYPES: Accept = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
};
