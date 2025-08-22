import { IWorkEntryDto } from "@packages/types";

export interface DayData {
  date: Date;
  hours: number;
  level: number;
  entries: IWorkEntryDto[];
}

export interface Statistics {
  totalDaysWorked: number;
  totalHours: number;
  averageHours: number;
  longestStreak: number;
}

export interface MonthPosition {
  month: string;
  position: number;
  width: number;
}
