import { z } from "zod";
import {
  IMPORT_WORK_ENTRY_ACCEPTED_FILE_TYPE,
  IMPORT_WORK_ENTRY_MAX_FILE_SIZE,
} from "../work-entry-upload-dialog";

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file !== null, {
      message: "Please select a file",
    })
    .refine(
      (file) =>
        file &&
        IMPORT_WORK_ENTRY_ACCEPTED_FILE_TYPE[
          file.type as keyof typeof IMPORT_WORK_ENTRY_ACCEPTED_FILE_TYPE
        ] !== undefined,
      {
        message: "Please select an Excel file (.xlsx only)",
      },
    )
    .refine((file) => file && file.size <= IMPORT_WORK_ENTRY_MAX_FILE_SIZE, {
      message: "File size must be less than 1MB",
    })
    .nullable(),
});

export type FileUpload = z.infer<typeof fileUploadSchema>;
