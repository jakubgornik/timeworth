export const STORAGE_LIMITS = {
  maxFileBytes: 50 * 1024 * 1024,
  maxFilesPerRequest: 20,
  maxUserBytes: 500 * 1024 * 1024,
  maxUserFiles: 100,
  maxNameLength: 255,
  allowedMimeTypes: [
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
} as const;
