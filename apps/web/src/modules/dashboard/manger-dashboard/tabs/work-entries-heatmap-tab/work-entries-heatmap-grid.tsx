import { memo } from "react";
import { WorkEntriesHeatmapDayCell } from "./work-entries-heatmap-day-cell";
import {
  CALENDAR_HEIGHT,
  CELL_SIZE,
  DAY_LABELS,
  WEEK_HEIGHT,
} from "./work-entries-heatmap.utils";
import { DayData } from "./work-entries-heatmap.types";

export const WorkEntriesHeatmapGrid = memo(
  ({ weeks }: { weeks: DayData[][] }) => {
    if (!weeks || weeks.length === 0) {
      return (
        <div className="flex w-full">
          <div
            className="flex flex-col mr-3 text-xs text-muted-foreground flex-shrink-0 w-10"
            style={{ height: CALENDAR_HEIGHT }}
          >
            {DAY_LABELS.map((day) => (
              <div
                key={day}
                className="flex items-center justify-end pr-1"
                style={{ height: WEEK_HEIGHT, lineHeight: 1 }}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="flex gap-1 w-full"
              style={{ height: CALENDAR_HEIGHT }}
            >
              {Array.from({ length: 53 }, (_, weekIndex) => (
                <div
                  key={weekIndex}
                  className="flex flex-col gap-1 h-full justify-between"
                  style={{ flex: "1 1 0%" }}
                >
                  {Array.from({ length: 7 }, (_, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="bg-muted/30 rounded border border-border/50"
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        minWidth: CELL_SIZE,
                        minHeight: CELL_SIZE,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex w-full">
        <div
          className="flex flex-col mr-3 text-xs text-muted-foreground flex-shrink-0 w-10"
          style={{ height: CALENDAR_HEIGHT }}
        >
          {DAY_LABELS.map((day) => (
            <div
              key={day}
              className="flex items-center justify-end pr-1"
              style={{ height: WEEK_HEIGHT, lineHeight: 1 }}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="flex gap-1 w-full"
            style={{ height: CALENDAR_HEIGHT }}
          >
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="flex flex-col gap-1 h-full justify-between"
                style={{ flex: "1 1 0%" }}
              >
                {week.map((day, dayIndex) => (
                  <WorkEntriesHeatmapDayCell
                    key={`${weekIndex}-${dayIndex}`}
                    day={day}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
