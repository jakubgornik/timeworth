import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IMPORT_LIMITS, XLSX_MIME_TYPE } from '../utils/import-limits';

export const ImportFileInterceptor = FileInterceptor('file', {
  limits: {
    fileSize: IMPORT_LIMITS.maxFileBytes, // Maximum bytes in the XLSX upload.
    files: 1, // One XLSX file.
    fields: 1, // One text field: timezone.
    // The parser rejects at this count, so file + timezone (2 parts) need 3.
    parts: 3,
    fieldSize: 256, // Maximum bytes in the timezone field.
  },
  fileFilter: (_request, file, callback) => {
    const hasXlsxExtension = file.originalname.toLowerCase().endsWith('.xlsx');
    const hasAcceptedMimeType = [
      XLSX_MIME_TYPE,
      'application/octet-stream',
    ].includes(file.mimetype);

    if (!hasXlsxExtension || !hasAcceptedMimeType) {
      return callback(
        new BadRequestException('Only XLSX imports are supported'),
        false,
      );
    }
    callback(null, true);
  },
});
