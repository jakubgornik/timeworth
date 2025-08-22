import { memo } from "react";
import { Statistics } from "./work-entries-heatmap.types";

export const WorkEntriesStatisticsGrid = memo(
  ({ statistics }: { statistics: Statistics }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div className="text-center">
        <div className="text-2xl font-bold text-chart-2">
          {statistics.totalDaysWorked}
        </div>
        <div className="text-muted-foreground">Days Active</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-chart-1">
          {statistics.totalHours.toFixed(0)}h
        </div>
        <div className="text-muted-foreground">Total Hours</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-chart-4">
          {statistics.averageHours.toFixed(1)}h
        </div>
        <div className="text-muted-foreground">Avg/Day</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-chart-3">
          {statistics.longestStreak}
        </div>
        <div className="text-muted-foreground">Best Streak</div>
      </div>
    </div>
  )
);
