import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { join } from 'node:path';
import { Worker } from 'node:worker_threads';
import { IMPORT_LIMITS } from './utils/import-limits';

type WorkerResult = {
  rows?: Record<string, unknown>[];
  error?: 'LIMIT' | 'INVALID';
};

// Keep untrusted XLSX parsing off the API event loop and enforce a work budget.
@Injectable()
export class ImportReader {
  private activeParsers = 0;

  async read(buffer: Buffer): Promise<Record<string, unknown>[]> {
    if (buffer.length > IMPORT_LIMITS.maxFileBytes) {
      throw new PayloadTooLargeException('Import exceeds 1 MiB');
    }
    if (this.activeParsers >= IMPORT_LIMITS.maxConcurrentParsers) {
      throw new ServiceUnavailableException(
        'Import capacity reached; try again later',
      );
    }
    this.activeParsers++;
    let worker: Worker | undefined;
    try {
      worker = new Worker(join(__dirname, 'import-reader.worker.js'), {
        workerData: { buffer },
        resourceLimits: { maxOldGenerationSizeMb: IMPORT_LIMITS.workerHeapMb },
      });
      return await new Promise<Record<string, unknown>[]>((resolve, reject) => {
        const timer = setTimeout(
          () =>
            reject(
              new PayloadTooLargeException(
                'Spreadsheet exceeds parsing limits',
              ),
            ),
          IMPORT_LIMITS.timeoutMs,
        );
        worker!.once('message', (result: WorkerResult) => {
          clearTimeout(timer);
          if (result.error === 'LIMIT') {
            reject(
              new PayloadTooLargeException('Spreadsheet exceeds import limits'),
            );
          } else if (result.rows) {
            resolve(result.rows);
          } else {
            reject(new BadRequestException('Invalid or unsupported XLSX file'));
          }
        });
        worker!.once('error', (error) => {
          clearTimeout(timer);
          reject(
            new BadRequestException(
              'Unable to parse XLSX within import limits',
              { cause: error },
            ),
          );
        });
        worker!.once('exit', () => {
          clearTimeout(timer);
          reject(
            new BadRequestException('XLSX parser stopped before completion'),
          );
        });
      });
    } finally {
      // Wait for termination before releasing capacity, including after a timeout.
      await worker?.terminate();
      this.activeParsers--;
    }
  }
}
