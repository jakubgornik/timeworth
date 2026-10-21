import { useMemo } from "react";
import {
  DayData,
  MonthPosition,
  Statistics,
} from "./work-entries-heatmap.types";
import { addDays, format, getDay, startOfYear, subDays } from "date-fns";
import { IWorkEntryDto } from "@packages/types";

const INTENSITY_SCALE = [
  { maxHours: 0, color: "bg-card border-border" },
  { maxHours: 4, color: "bg-chart-2/20 border-chart-2/40" },
  { maxHours: 6, color: "bg-chart-2/40 border-chart-2/60" },
  { maxHours: 8, color: "bg-chart-2/60 border-chart-2/80" },
  { maxHours: Infinity, color: "bg-chart-2 border-chart-2" },
] as const;

export const INTENSITY_COLORS = INTENSITY_SCALE.map(({ color }) => color);

export const HOUR_RANGES = INTENSITY_SCALE.map(({ maxHours }, level) => {
  if (level === 0) return "0 hours";
  const minHours = INTENSITY_SCALE[level - 1].maxHours;
  if (!Number.isFinite(maxHours)) return `${minHours}+ hours`;
  return `${minHours === 0 ? ">0" : minHours} to <${maxHours} hours`;
});

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

const FIRST_HEATMAP_YEAR = 2022;

export const getAvailableYears = (
  selectedYear: number,
  workEntries: readonly Pick<IWorkEntryDto, "startedAt">[],
  currentYear = new Date().getFullYear(),
): number[] => {
  let firstYear = Math.min(FIRST_HEATMAP_YEAR, currentYear, selectedYear);
  let lastYear = Math.max(currentYear, selectedYear);

  for (const entry of workEntries) {
    const year = new Date(entry.startedAt).getFullYear();
    if (!Number.isFinite(year)) continue;
    firstYear = Math.min(firstYear, year);
    lastYear = Math.max(lastYear, year);
  }

  return Array.from(
    { length: lastYear - firstYear + 1 },
    (_, index) => lastYear - index,
  );
};

export const CELL_SIZE = 16;
export const CALENDAR_HEIGHT = 168;
export const WEEK_HEIGHT = 24;

export const getIntensityLevel = (hours: number): number => {
  if (hours <= 0) return 0;
  const level = INTENSITY_SCALE.findIndex(({ maxHours }) => hours < maxHours);
  return level === -1 ? INTENSITY_SCALE.length - 1 : level;
};

export const getIntensityColor = (level: number): string => {
  return INTENSITY_COLORS[level] ?? INTENSITY_COLORS[0];
};

export const getHourRange = (level: number): string => {
  return HOUR_RANGES[level] ?? HOUR_RANGES[0];
};

const calculateStreaks = (
  calendarData: DayData[],
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
  isLoading: boolean,
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

      dayData.level = getIntensityLevel(dayData.hours);
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
  isLoading: boolean,
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
  isLoading: boolean,
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
