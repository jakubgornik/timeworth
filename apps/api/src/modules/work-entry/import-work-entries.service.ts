import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { ImportWorkEntryInput } from './commands/import-work-entry/import-work-entry.command';
import { ImportWorkEntryValidator } from './utils/import-work-entries.validator';
import { fromZonedTime } from 'date-fns-tz';
import { ImportWorkEntriesEmptyFileException } from './exceptions/work-entry.exceptions';
import { ImportReader } from './import-reader.service';

@Injectable()
export class ImportWorkEntriesService {
  constructor(private readonly reader: ImportReader) {}

  async parseWorkEntriesFile(
    file: Express.Multer.File,
    userId: string,
    userTimezone: string,
  ): Promise<ImportWorkEntryInput[]> {
    try {
      const rawData = await this.reader.read(file.buffer);

      if (!rawData.length) {
        throw new ImportWorkEntriesEmptyFileException();
      }

      return rawData.map((row, index) => {
        const rowIndex = index + 2;
        const { title, description, startedAt, endedAt } =
          ImportWorkEntryValidator.validate(row, rowIndex);

        const startedAtUtc = fromZonedTime(startedAt, userTimezone);
        const endedAtUtc = fromZonedTime(endedAt, userTimezone);

        return {
          title,
          startedAt: startedAtUtc,
          endedAt: endedAtUtc,
          description,
          userId,
        } satisfies ImportWorkEntryInput;
      });
    } catch (error) {
      if (error instanceof ImportWorkEntriesEmptyFileException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Invalid or unsupported spreadsheet file', {
        cause: error,
      });
    }
  }
}
