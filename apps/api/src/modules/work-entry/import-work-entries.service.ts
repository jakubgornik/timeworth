import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { CreateWorkEntryDto } from './dto/create-work-entry.dto';
import { ImportWorkEntryValidator } from './utils/import-work-entries.validator';
import { ImportWorkEntriesEmptyFileException } from './exceptions/import-work-entries.exception';

@Injectable()
export class ImportWorkEntriesService {
  async parseWorkEntriesFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<CreateWorkEntryDto[]> {
    try {
      const workbook = XLSX.read(file.buffer, {
        type: 'buffer',
        cellDates: true,
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        worksheet,
        {
          raw: true,
          defval: null,
        },
      );

      if (!rawData.length) {
        throw new ImportWorkEntriesEmptyFileException();
      }

      return rawData.map((row, index) => {
        const rowIndex = index + 2;
        const { title, description, startedAt, endedAt } =
          ImportWorkEntryValidator.validate(row, rowIndex);

        return {
          title,
          startedAt,
          endedAt,
          description,
          userId,
          organizationId: '', // temporary solution, organization id is added in handler
        } satisfies CreateWorkEntryDto;
      });
    } catch (error) {
      throw new BadRequestException(`Failed to parse file: ${error.message}`);
    }
  }
}
