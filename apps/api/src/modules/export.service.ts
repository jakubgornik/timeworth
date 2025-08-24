import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';

interface IExportColumn {
  key: string;
  label: string;
  formatter: (value: unknown) => string;
}

export interface IExportConfig {
  columns: IExportColumn[];
  sheetName: string;
  filename: string;
}

@Injectable()
export class ExportService {
  async exportToExcel<T = unknown>(
    data: T[],
    config: IExportConfig,
  ): Promise<Buffer> {
    const excelData = data.map((item) => {
      const row: Record<string, unknown> = {};

      config.columns.forEach((column) => {
        const value = (item as any)[column.key];
        row[column.label] = column.formatter(value);
      });

      return row;
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    XLSX.utils.book_append_sheet(workbook, worksheet, config.sheetName);

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}
