import { IWorkEntryDto } from "@packages/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format, startOfMonth, eachMonthOfInterval } from "date-fns";
import { useMemo } from "react";
import { TrendStats } from "./work-entries-trend-indicator";

export const TREND_THRESHOLDS = {
  SIGNIFICANT: 15,
  MODERATE: 5,
  SLIGHT: 1,
} as const;

export const TREND_COLORS = {
  POSITIVE: "text-chart-2",
  NEGATIVE: "text-destructive",
  NEUTRAL: "text-muted-foreground",
} as const;

export const roundToDecimal = (value: number, places: number = 1): number =>
  Math.round(value * 10 ** places) / 10 ** places;

export const calculateMovingAverage = (
  data: number[],
  index: number,
  window: number = 3
): number => {
  const start = Math.max(0, index - window + 1);
  const slice = data.slice(start, index + 1);
  return slice.reduce((sum, val) => sum + val, 0) / slice.length;
};

export const calculateTrendChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0)
    return current > 0 ? Infinity : current < 0 ? -Infinity : 0;
  return ((current - previous) / previous) * 100;
};

export const getTrendDirection = (change: number) => {
  const absChange = Math.abs(change);

  const isSignificant = absChange >= TREND_THRESHOLDS.SIGNIFICANT;
  const isModerate = absChange >= TREND_THRESHOLDS.MODERATE;
  const isSlight = absChange >= TREND_THRESHOLDS.SLIGHT;

  const getDirectionText = (): string => {
    if (isSignificant)
      return change > 0 ? "Significant Increase" : "Significant Decrease";
    if (isModerate)
      return change > 0 ? "Moderate Increase" : "Moderate Decrease";
    if (isSlight) return change > 0 ? "Slight Increase" : "Slight Decrease";
    return "Stable";
  };

  const getIcon = () => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return Minus;
  };

  const getColorClass = () => {
    if (isSlight)
      return change > 0 ? TREND_COLORS.POSITIVE : TREND_COLORS.NEGATIVE;
    return TREND_COLORS.NEUTRAL;
  };

  return {
    direction: getDirectionText(),
    icon: getIcon(),
    colorClass: getColorClass(),
  };
};

export const getMonthlyTotals = (data: IWorkEntryDto[]) => {
  if (!data?.length) return [];

  const dates = data.map((entry) => new Date(entry.startedAt));
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const months = eachMonthOfInterval({
    start: startOfMonth(minDate),
    end: startOfMonth(maxDate),
  });

  return months.map((month) => {
    const monthData = data.filter((entry) => {
      const entryMonth = startOfMonth(new Date(entry.startedAt));
      return entryMonth.getTime() === month.getTime();
    });

    return {
      month: format(month, "MMM yyyy"),
      totalHours: roundToDecimal(
        monthData.reduce((sum, entry) => sum + entry.hoursWorked, 0)
      ),
    };
  });
};

interface MonthlyData {
  month: string;
  totalHours: number;
  trend: number;
  trendChange: number;
}

type MonthlyTotals = Pick<MonthlyData, "month" | "totalHours">;

const getMonthlyData = (monthlyTotals: MonthlyTotals[]): MonthlyData[] => {
  return monthlyTotals.map((item, index) => {
    const hourValues = monthlyTotals.map((m) => m.totalHours);
    const trend = calculateMovingAverage(hourValues, index);

    let trendChange = 0;
    if (index > 0) {
      const prevTrend = calculateMovingAverage(hourValues, index - 1);
      trendChange = calculateTrendChange(trend, prevTrend);
    }

    return {
      ...item,
      trend: roundToDecimal(trend),
      trendChange: roundToDecimal(trendChange, 2),
    };
  });
};

const DEFAULT_STATS: TrendStats = {
  direction: "Stable",
  change: 0,
  icon: Minus,
  colorClass: TREND_COLORS.NEUTRAL,
  averageHours: 0,
  maxHours: 0,
  minHours: 0,
};

const calculateStats = (monthlyData: MonthlyData[]): TrendStats => {
  if (!monthlyData.length) return DEFAULT_STATS;

  const totalHours = monthlyData.map((m) => m.totalHours);
  const averageHours = roundToDecimal(
    totalHours.reduce((sum, h) => sum + h, 0) / totalHours.length
  );

  const firstTrend = monthlyData[0]?.trend || 0;
  const lastTrend = monthlyData[monthlyData.length - 1]?.trend || 0;
  const overallChange = roundToDecimal(
    calculateTrendChange(lastTrend, firstTrend),
    1
  );

  const { direction, icon, colorClass } = getTrendDirection(overallChange);

  return {
    direction,
    change: overallChange,
    icon,
    colorClass,
    averageHours,
    maxHours: Math.max(...totalHours),
    minHours: Math.min(...totalHours),
  };
};

export const useMonthlyTrendData = (data: IWorkEntryDto[]) => {
  return useMemo(() => {
    const monthlyTotals = getMonthlyTotals(data);
    const monthlyData = getMonthlyData(monthlyTotals);
    const trendStats = calculateStats(monthlyData);

    return { monthlyData, trendStats };
  }, [data]);
};
