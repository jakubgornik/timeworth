import { Unzip, UnzipInflate, zipSync } from 'fflate';
import { IMPORT_LIMITS } from './import-limits';

const INPUT_CHUNK_BYTES = 1024;
const XLSX_WORKBOOK_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml';

export class ImportLimitExceededError extends Error {}

/**
 * Unpacks an XLSX archive within entry-count and decompressed-size limits.
 * Returns a rebuilt ZIP buffer with actual entry sizes for SheetJS to read.
 * Throws if the archive is invalid or exceeds these limits.
 */
export function readImportArchive(buffer: Buffer): Buffer {
  const files: Record<string, Uint8Array> = Object.create(null);
  const fileNames = new Set<string>();
  let inflatedBytes = 0;
  let unfinishedFiles = 0;

  const archive = new Unzip((file) => {
    if (fileNames.has(file.name)) throw new Error('Duplicate archive entry');
    fileNames.add(file.name);

    const exceedsEntryLimit = fileNames.size > IMPORT_LIMITS.maxArchiveEntries;
    const remainingBytes = IMPORT_LIMITS.maxInflatedBytes - inflatedBytes;
    const exceedsDeclaredSizeLimit = (file.originalSize ?? 0) > remainingBytes;
    if (exceedsEntryLimit || exceedsDeclaredSizeLimit) {
      throw new ImportLimitExceededError();
    }

    const chunks: Uint8Array[] = [];
    unfinishedFiles++;
    file.ondata = (error, chunk, finished) => {
      if (error) throw error;

      inflatedBytes += chunk.length;
      const exceedsInflationLimit =
        inflatedBytes > IMPORT_LIMITS.maxInflatedBytes;
      if (exceedsInflationLimit) throw new ImportLimitExceededError();
      chunks.push(chunk);

      if (finished) {
        unfinishedFiles--;
        if (!file.name.endsWith('/')) {
          files[file.name] = Buffer.concat(chunks);
        }
      }
    };
    file.start();
  });
  archive.register(UnzipInflate);

  // Small input chunks let us enforce the byte budget during decompression.
  for (let offset = 0; offset < buffer.length; offset += INPUT_CHUNK_BYTES) {
    const end = Math.min(offset + INPUT_CHUNK_BYTES, buffer.length);
    const isLastChunk = end === buffer.length;
    archive.push(buffer.subarray(offset, end), isLastChunk);
  }

  if (unfinishedFiles > 0) throw new Error('Incomplete archive');

  const contentTypes = Buffer.from(files['[Content_Types].xml'] ?? []).toString(
    'utf8',
  );
  const isXlsx = contentTypes.includes(XLSX_WORKBOOK_CONTENT_TYPE);
  const hasWorkbook = Boolean(files['xl/workbook.xml']);
  if (!isXlsx || !hasWorkbook) throw new Error('Not an XLSX workbook');

  // SheetJS receives entries with verified sizes, rather than untrusted ZIP headers.
  return Buffer.from(zipSync(files, { level: 0 }));
}
