import {
  CHART_COLORS,
  formatHoursAndMinutes,
} from "./work-entries-chart.utils";

interface WorkEntriesChartTooltipContentProps {
  value: number;
  name: string;
}

export const WorkEntriesChartTooltipContent = ({
  value,
  name,
}: WorkEntriesChartTooltipContentProps) => {
  const isTotal = name === "Total Hours";
  const color = isTotal ? CHART_COLORS.PRIMARY : CHART_COLORS.SECONDARY;

  return (
    <div
      className={`space-y-1 ${!isTotal ? "pt-2 mt-2 border-t border-white/10" : ""}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className={`w-3 h-3 ${isTotal ? "rounded-sm" : "rounded-full"}`}
          style={{ backgroundColor: color }}
        />
        <span className="font-medium text-white/90">
          {isTotal ? "Total Hours" : "Trend Line"}
        </span>
      </div>
      <div className="text-xl font-bold ml-5" style={{ color }}>
        {formatHoursAndMinutes(value)}
      </div>
      <div className="text-xs ml-5 text-white/60">
        {isTotal ? "Hours worked this period" : "3-month moving average"}
      </div>
    </div>
  );
};
