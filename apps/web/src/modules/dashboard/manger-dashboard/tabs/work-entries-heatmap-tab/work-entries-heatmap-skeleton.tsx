import { memo } from "react";
import {
  CALENDAR_HEIGHT,
  CELL_SIZE,
  WEEK_HEIGHT,
} from "./work-entries-heatmap.utils";

export const WorkEntriesHeatmapSkeleton = memo(() => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="text-center">
          <div className="h-8 bg-muted rounded mb-2 w-16 mx-auto" />
          <div className="h-4 bg-muted/60 rounded w-20 mx-auto" />
        </div>
      ))}
    </div>
    <div className="relative w-full">
      <div className="relative mb-4 ml-12 h-4">
        <div className="flex gap-8">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="h-3 bg-muted/60 rounded w-8" />
          ))}
        </div>
      </div>
      <div className="flex w-full">
        <div
          className="flex flex-col mr-3 text-xs text-muted-foreground flex-shrink-0 w-10"
          style={{ height: CALENDAR_HEIGHT }}
        >
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-end pr-1"
              style={{ height: WEEK_HEIGHT, lineHeight: 1 }}
            >
              <div className="h-3 bg-muted/60 rounded w-8" />
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
                    className="bg-muted/60 rounded border border-border"
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
    </div>
    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
      <div className="flex items-center gap-2">
        <div className="h-3 bg-muted/60 rounded w-8" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-muted/60 border border-border"
            />
          ))}
        </div>
        <div className="h-3 bg-muted/60 rounded w-8" />
      </div>
    </div>
  </div>
));
