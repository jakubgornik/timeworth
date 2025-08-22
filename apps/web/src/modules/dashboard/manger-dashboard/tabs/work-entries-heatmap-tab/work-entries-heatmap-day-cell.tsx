import { format } from "date-fns";
import { memo, useMemo } from "react";
import { CELL_SIZE, getIntensityColor } from "./work-entries-heatmap.utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DayData } from "./work-entries-heatmap.types";

export const WorkEntriesHeatmapDayCell = memo(({ day }: { day: DayData }) => {
  const uniqueKey = useMemo(
    () =>
      `${format(day.date, "yyyy-MM-dd")}-${day.hours}-${day.entries.length}`,
    [day.date, day.hours, day.entries.length]
  );

  return (
    <Tooltip key={uniqueKey} delayDuration={0} disableHoverableContent>
      <TooltipTrigger asChild>
        <div
          className={`rounded border cursor-pointer transition-all duration-200 hover:scale-110 ${getIntensityColor(day.level)}`}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            minWidth: CELL_SIZE,
            minHeight: CELL_SIZE,
          }}
        />
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-card border-1 text-popover-foreground max-w-[250px]"
        sideOffset={8}
        avoidCollisions={false}
        collisionPadding={0}
      >
        <div className="space-y-1">
          <div className="font-semibold text-foreground">
            {format(day.date, "EEEE, MMM dd, yyyy")}
          </div>
          <div className="text-chart-2">
            {day.hours > 0
              ? `${day.hours.toFixed(1)} hours logged`
              : "No activity"}
          </div>
          {day.entries.length > 0 && (
            <div className="text-muted-foreground text-xs">
              {day.entries.length} work session
              {day.entries.length > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
});
