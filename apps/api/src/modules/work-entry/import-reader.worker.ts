import { parentPort, workerData } from 'node:worker_threads';
import * as XLSX from 'xlsx';
import { IMPORT_LIMITS } from './utils/import-limits';
import {
  ImportLimitExceededError,
  readImportArchive,
} from './utils/read-import-archive';

function validatePosition(position: XLSX.CellAddress): void {
  const exceedsRowLimit = position.r > IMPORT_LIMITS.maxRows;
  const exceedsColumnLimit = position.c >= IMPORT_LIMITS.maxColumns;
  if (exceedsRowLimit || exceedsColumnLimit) {
    throw new ImportLimitExceededError();
  }
}

function validateWorksheet(worksheet: XLSX.WorkSheet): void {
  const reference = worksheet['!ref'];
  if (reference) {
    validatePosition(XLSX.utils.decode_range(reference).e);
  }

  // Check actual cells as well: the declared range may omit distant cells.
  for (const address of Object.keys(worksheet)) {
    const isMetadata = address.startsWith('!');
    if (!isMetadata) validatePosition(XLSX.utils.decode_cell(address));
  }
}

function readRows(buffer: Buffer): Record<string, unknown>[] {
  const archive = readImportArchive(buffer);
  const workbook = XLSX.read(archive, {
    type: 'buffer',
    cellDates: true,
    cellHTML: false,
    dense: false,
    sheets: 0,
  });
  const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!firstWorksheet) throw new Error('Missing worksheet');

  validateWorksheet(firstWorksheet);

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    firstWorksheet,
    {
      raw: true,
      defval: null,
    },
  );
  const exceedsRowLimit = rows.length > IMPORT_LIMITS.maxRows;
  if (exceedsRowLimit) throw new ImportLimitExceededError();
  return rows;
}

try {
  const { buffer } = workerData as { buffer: Uint8Array };
  parentPort?.postMessage({ rows: readRows(Buffer.from(buffer)) });
} catch (error) {
  const exceedsImportLimits = error instanceof ImportLimitExceededError;
  parentPort?.postMessage({ error: exceedsImportLimits ? 'LIMIT' : 'INVALID' });
}
