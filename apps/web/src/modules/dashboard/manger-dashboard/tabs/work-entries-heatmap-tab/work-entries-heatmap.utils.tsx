import { useMemo } from "react";
import {
  DayData,
  MonthPosition,
  Statistics,
} from "./work-entries-heatmap.types";
import { addDays, format, getDay, startOfYear, subDays } from "date-fns";
import { IWorkEntryDto } from "@packages/types";

export const INTENSITY_COLORS = [
  "bg-card border-border",
  "bg-chart-2/20 border-chart-2/40",
  "bg-chart-2/40 border-chart-2/60",
  "bg-chart-2/60 border-chart-2/80",
  "bg-chart-2 border-chart-2",
] as const;

export const HOUR_RANGES = [
  "0 hours",
  "1-3 hours",
  "4-5 hours",
  "6-7 hours",
  "8+ hours",
] as const;

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const DAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const AVAILABLE_YEARS = [2025, 2024, 2023, 2022] as const;

export const CELL_SIZE = 16;
export const CALENDAR_HEIGHT = 168;
export const WEEK_HEIGHT = 24;

export const getIntensityLevel = (hours: number): number => {
  if (hours === 0) return 0;
  if (hours < 4) return 1;
  if (hours < 6) return 2;
  if (hours < 8) return 3;
  return 4;
};

export const getIntensityColor = (level: number): string => {
  return INTENSITY_COLORS[level] ?? INTENSITY_COLORS[0];
};

export const getHourRange = (level: number): string => {
  return HOUR_RANGES[level] ?? HOUR_RANGES[0];
};

const calculateStreaks = (
  calendarData: DayData[]
): Pick<Statistics, "longestStreak"> => {
  let maxStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < calendarData.length; i++) {
    if (calendarData[i].hours > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return {
    longestStreak: maxStreak,
  };
};

export const useCalendarData = (
  workEntries: IWorkEntryDto[],
  selectedYear: number,
  isLoading: boolean
): DayData[] => {
  return useMemo(() => {
    if (isLoading || !workEntries?.length) return [];

    const dataByDate = new Map<string, DayData>();

    workEntries.forEach((entry) => {
      const startDate =
        typeof entry.startedAt === "string"
          ? new Date(entry.startedAt)
          : entry.startedAt;

      const dateKey = format(startDate, "yyyy-MM-dd");

      if (startDate.getFullYear() !== selectedYear) {
        return;
      }

      if (!dataByDate.has(dateKey)) {
        dataByDate.set(dateKey, {
          date: startDate,
          hours: 0,
          entries: [],
          level: 0,
        });
      }

      const dayData = dataByDate.get(dateKey)!;
      dayData.hours += entry.hoursWorked;
      dayData.entries.push(entry);

      if (dayData.hours === 0) dayData.level = 0;
      else if (dayData.hours <= 2) dayData.level = 1;
      else if (dayData.hours <= 4) dayData.level = 2;
      else if (dayData.hours <= 6) dayData.level = 3;
      else dayData.level = 4;
    });

    const allDays: DayData[] = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    const current = new Date(startDate);
    while (current <= endDate) {
      const dateKey = format(current, "yyyy-MM-dd");
      const existingData = dataByDate.get(dateKey);

      if (existingData) {
        allDays.push(existingData);
      } else {
        allDays.push({
          date: new Date(current),
          hours: 0,
          level: 0,
          entries: [],
        });
      }

      current.setDate(current.getDate() + 1);
    }

    return allDays;
  }, [workEntries, selectedYear, isLoading]);
};

export const useStatistics = (
  calendarData: DayData[],
  isLoading: boolean
): Statistics => {
  return useMemo(() => {
    if (isLoading || !calendarData.length) {
      return {
        totalDaysWorked: 0,
        totalHours: 0,
        averageHours: 0,
        longestStreak: 0,
        currentStreak: 0,
      };
    }

    const totalDaysWorked = calendarData.filter((day) => day.hours > 0).length;
    const totalHours = calendarData.reduce((sum, day) => sum + day.hours, 0);
    const averageHours = totalDaysWorked > 0 ? totalHours / totalDaysWorked : 0;
    const { longestStreak } = calculateStreaks(calendarData);

    return {
      totalDaysWorked,
      totalHours,
      averageHours,
      longestStreak,
    };
  }, [calendarData, isLoading]);
};

export const useWeeksLayout = (calendarData: DayData[], isLoading: boolean) => {
  return useMemo(() => {
    if (isLoading || !calendarData.length) return [];

    const weeksArray: DayData[][] = [];
    let currentWeek: DayData[] = [];

    const firstDayOfWeek = getDay(calendarData[0].date);
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: subDays(calendarData[0].date, firstDayOfWeek - i),
        hours: 0,
        level: 0,
        entries: [],
      });
    }

    calendarData.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeksArray.push([...currentWeek]);
        currentWeek = [];
      }
    });

    while (currentWeek.length > 0 && currentWeek.length < 7) {
      const lastDate = currentWeek[currentWeek.length - 1].date;
      currentWeek.push({
        date: addDays(lastDate, 1),
        hours: 0,
        level: 0,
        entries: [],
      });
    }

    if (currentWeek.length === 7) {
      weeksArray.push(currentWeek);
    }

    return weeksArray;
  }, [calendarData, isLoading]);
};

export const useMonthPositions = (
  weeks: DayData[][],
  selectedYear: number,
  isLoading: boolean
): MonthPosition[] => {
  return useMemo(() => {
    if (isLoading || !weeks.length) return [];

    const positions: MonthPosition[] = [];
    let currentMonth = -1;
    let monthStartWeek = 0;

    weeks.forEach((week, weekIndex) => {
      const validDay = week.find((day) => {
        const dayYear = day.date.getFullYear();
        return (
          dayYear === selectedYear &&
          day.date >= startOfYear(new Date(selectedYear, 0, 1))
        );
      });

      if (validDay) {
        const month = validDay.date.getMonth();
        if (month !== currentMonth) {
          if (currentMonth !== -1 && positions.length > 0) {
            positions[positions.length - 1].width = weekIndex - monthStartWeek;
          }

          positions.push({
            month: MONTH_LABELS[month],
            position: weekIndex,
            width: 1,
          });
          currentMonth = month;
          monthStartWeek = weekIndex;
        }
      }
    });

    if (positions.length > 0) {
      positions[positions.length - 1].width = weeks.length - monthStartWeek;
    }

    return positions;
  }, [weeks, selectedYear, isLoading]);
};
