import { IExportConfig } from 'src/modules/export.service';

export const WORK_ENTRY_EXPORT_CONFIG: IExportConfig = {
  sheetName: 'Work Entries',
  filename: 'work-entries-export',
  columns: [
    { key: 'id', label: 'ID', formatter: (value: string) => value },
    {
      key: 'title',
      label: 'Title',
      formatter: (value: string) => value,
    },
    {
      key: 'startedAt',
      label: 'Started At',
      formatter: (value: Date) => value?.toLocaleString(),
    },
    {
      key: 'endedAt',
      label: 'Ended At',
      formatter: (value: Date) => value?.toLocaleString(),
    },
    {
      key: 'hoursWorked',
      label: 'Hours Worked',
      formatter: (value: number) => value?.toFixed(2),
    },
    {
      key: 'description',
      label: 'Description',
      formatter: (value: string | null) => value ?? '',
    },
  ],
};
