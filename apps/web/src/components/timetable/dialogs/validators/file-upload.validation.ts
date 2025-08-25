import { z } from "zod";

const ACCEPTED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)

    .refine((file) => file !== null, {
      message: "Please select a file",
    })
    .refine((file) => file && ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Please select an Excel file (.xlsx only)",
    })
    .refine((file) => file && file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 10MB",
    })
    .nullable(),
});

export type FileUpload = z.infer<typeof fileUploadSchema>;
