import { memo } from "react";
import {
  getHourRange,
  getIntensityColor,
  INTENSITY_COLORS,
} from "./work-entries-heatmap.utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const WorkEntriesHeatmapLegend = memo(() => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
    <span>Less</span>
    <div className="flex gap-1">
      {INTENSITY_COLORS.map((_, level) => (
        <Tooltip key={level} delayDuration={0} disableHoverableContent>
          <TooltipTrigger asChild>
            <div
              className={`w-3 h-3 rounded border cursor-pointer transition-all duration-200 hover:scale-125 ${getIntensityColor(level)}`}
            />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-popover border-border text-popover-foreground"
            sideOffset={8}
            avoidCollisions={false}
            collisionPadding={0}
          >
            <div className="text-foreground font-medium">
              {getHourRange(level)}
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
    <span>More</span>
  </div>
));
