export const IMPORT_LIMITS = {
  maxFileBytes: 1024 * 1024,
  maxRows: 10_000,
  maxColumns: 16,
  maxArchiveEntries: 128,
  maxInflatedBytes: 16 * 1024 * 1024,
  maxConcurrentParsers: 2,
  timeoutMs: 5000,
  workerHeapMb: 128,
} as const;

export const XLSX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
