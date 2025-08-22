import { CHART_COLORS } from "./work-entries-chart.utils";

export const WorkEntriesChartLegend = () => (
  <div className="flex justify-center gap-8 text-sm text-foreground">
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: CHART_COLORS.PRIMARY }}
      />
      <span className="font-medium">Total hours [h]</span>
    </div>
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: CHART_COLORS.SECONDARY }}
      />
      <span className="font-medium">Trend line</span>
    </div>
  </div>
);
