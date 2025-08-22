import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { IWorkEntryDto } from "@packages/types";
import {
  processChartData,
  CHART_COLORS,
  CHART_CONFIG,
  TOOLTIP_STYLES,
} from "./work-entries-chart.utils";
import { WorkEntriesChartTooltipContent } from "./work-entries-chart-tooltip-content";
import { WorkEntriesChartLegend } from "./work-entries-chart-legend";

interface WorkEntriesComposedChartProps {
  data: IWorkEntryDto[];
}

export function WorkEntriesComposedChart({
  data,
}: WorkEntriesComposedChartProps) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        No data available for selected period
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-hidden">
      <ResponsiveContainer width="100%" height={CHART_CONFIG.HEIGHT}>
        <ComposedChart data={processChartData(data)}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.GRID}
            opacity={1}
          />
          <XAxis
            dataKey="month"
            stroke={CHART_COLORS.AXIS}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={CHART_COLORS.AXIS}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLES.content}
            labelStyle={TOOLTIP_STYLES.label}
            formatter={(value: number, name: string) => [
              <WorkEntriesChartTooltipContent
                key={name}
                value={value}
                name={name}
              />,
            ]}
          />
          <Bar
            name="Total Hours"
            dataKey="totalHours"
            fill={CHART_COLORS.PRIMARY}
            radius={CHART_CONFIG.BAR_RADIUS}
            animationDuration={CHART_CONFIG.ANIMATION_DURATION}
            maxBarSize={CHART_CONFIG.BAR_MAX_SIZE}
          />
          <Line
            type="monotone"
            dataKey="trend"
            stroke={CHART_COLORS.SECONDARY}
            strokeWidth={CHART_CONFIG.LINE_WIDTH}
            name="Trend"
            dot={{
              strokeWidth: 2,
              fill: CHART_COLORS.SECONDARY,
              r: CHART_CONFIG.DOT_SIZE,
            }}
            activeDot={{
              strokeWidth: 2,
              fill: "#953553",
              stroke: CHART_COLORS.SECONDARY,
              r: CHART_CONFIG.ACTIVE_DOT_SIZE,
            }}
            animationDuration={CHART_CONFIG.TREND_ANIMATION_DURATION}
            connectNulls={true}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <WorkEntriesChartLegend />
    </div>
  );
}
