import { format, startOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { IWorkEntryDto } from "@packages/types";

export const DEFAULT_DATE_RANGE = {
  from: subMonths(new Date(), 3),
  to: new Date(),
};

export const CHART_COLORS = {
  PRIMARY: "#f5f5f5",
  SECONDARY: "#673147",
  GRID: "rgba(255,255,255,0.08)",
  AXIS: "rgba(255,255,255,0.6)",
} as const;

export const CHART_CONFIG = {
  HEIGHT: 400,
  BAR_RADIUS: [6, 6, 0, 0] as [number, number, number, number],
  BAR_MAX_SIZE: 60,
  LINE_WIDTH: 3,
  DOT_SIZE: 4,
  ACTIVE_DOT_SIZE: 6,
  ANIMATION_DURATION: 800,
  TREND_ANIMATION_DURATION: 1000,
  TREND_WINDOW: 3,
} as const;

export const TOOLTIP_STYLES = {
  content: {
    backgroundColor: "rgba(32, 33, 36, 0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    padding: "16px",
    minWidth: "220px",
    backdropFilter: "blur(8px)",
  },
  label: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    fontSize: "16px",
    marginBottom: "12px",
  },
} as const;

export const formatHoursAndMinutes = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  if (hours === 0 && minutes === 0) return "0 minutes";
  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hours`;
  return `${hours} hours ${minutes} minutes`;
};

const roundToDecimal = (value: number, places: number = 1): number =>
  Math.round(value * 10 ** places) / 10 ** places;

export const getDateRange = (data: IWorkEntryDto[]) => {
  const dates = data.map((entry) => new Date(entry.startedAt));
  return {
    min: new Date(Math.min(...dates.map((d) => d.getTime()))),
    max: new Date(Math.max(...dates.map((d) => d.getTime()))),
  };
};

export const getMonthlyTotals = (data: IWorkEntryDto[]) => {
  const { min, max } = getDateRange(data);
  const months = eachMonthOfInterval({
    start: startOfMonth(min),
    end: startOfMonth(max),
  });

  return months.map((month) => {
    const monthKey = format(month, "MMM yyyy");
    const monthData = data.filter((entry) => {
      const entryMonth = startOfMonth(new Date(entry.startedAt));
      return entryMonth.getTime() === month.getTime();
    });

    const totalHours = monthData.reduce(
      (sum, entry) => sum + entry.hoursWorked,
      0
    );

    return {
      month: monthKey,
      totalHours: roundToDecimal(totalHours),
    };
  });
};

export const calculateTrendData = (
  monthlyData: Array<{ month: string; totalHours: number }>
) => {
  const chartDataWithTrend = monthlyData.map((item, index, arr) => {
    let trend = item.totalHours;
    if (index >= 2) {
      const sum = arr
        .slice(index - 2, index + 1)
        .reduce((acc, curr) => acc + curr.totalHours, 0);
      trend = sum / 3;
    } else if (index === 1) {
      trend = (arr[0].totalHours + arr[1].totalHours) / 2;
    }

    return {
      ...item,
      trend: roundToDecimal(trend),
      trendChange: 0,
    };
  });

  chartDataWithTrend.forEach((item, index) => {
    if (index > 0) {
      const prevTrend = chartDataWithTrend[index - 1].trend;
      if (prevTrend !== 0) {
        item.trendChange = ((item.trend - prevTrend) / prevTrend) * 100;
      } else if (item.trend > 0) {
        item.trendChange = Number.POSITIVE_INFINITY;
      } else if (item.trend < 0) {
        item.trendChange = Number.NEGATIVE_INFINITY;
      }
      item.trendChange = roundToDecimal(item.trendChange, 2);
    }
  });

  return chartDataWithTrend;
};

export const processChartData = (data: IWorkEntryDto[]) => {
  const monthlyTotals = getMonthlyTotals(data);
  return calculateTrendData(monthlyTotals);
};
