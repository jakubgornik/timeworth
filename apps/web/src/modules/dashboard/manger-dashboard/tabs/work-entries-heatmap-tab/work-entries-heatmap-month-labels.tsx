import { memo } from "react";
import { DayData, MonthPosition } from "./work-entries-heatmap.types";

export const WorkEntriesHeatmapMonthLabels = memo(
  ({
    monthPositions,
    weeks,
  }: {
    monthPositions: MonthPosition[];
    weeks: DayData[][];
  }) => (
    <div className="relative mb-4 ml-12 h-4">
      {monthPositions.map((monthPos) => {
        const weekWidth = 100 / weeks.length;
        const leftPosition = monthPos.position * weekWidth;

        return (
          <div
            key={monthPos.month}
            className="absolute text-xs text-muted-foreground font-medium"
            style={{
              left: `${leftPosition}%`,
              minWidth: `${monthPos.width * weekWidth}%`,
            }}
          >
            {monthPos.month}
          </div>
        );
      })}
    </div>
  )
);
