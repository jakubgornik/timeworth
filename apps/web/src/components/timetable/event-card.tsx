import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Event } from "./timetable.types";

interface EventCardProps {
  event: Event;
  layoutInfo: {
    width: string;
    left: string;
    zIndex: number;
  };
  isHovered: boolean;
  isSelecting: boolean;
  overlappingCount: number;
  onEventClick: (event: Event, e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  cellHeight?: number;
}

export function EventCard({
  event,
  layoutInfo,
  isHovered,
  isSelecting,
  overlappingCount,
  onEventClick,
  onMouseEnter,
  onMouseLeave,
  cellHeight = 25,
}: EventCardProps) {
  // TODO should match intervals
  const durationInHours = (event.duration * 15) / 60;

  return (
    <div
      data-event-id={event.id}
      className={`absolute ${isSelecting ? "pointer-events-none" : ""} transition-all duration-200 ease-in-out`}
      style={{
        height: `${event.duration * cellHeight - 8}px`,
        width: layoutInfo.width,
        left: layoutInfo.left,
        top: "4px",
        zIndex: layoutInfo.zIndex,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`
          ${event.color} 
          cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg
          border-l-4 shadow-sm h-full rounded-sm overflow-hidden
          ${overlappingCount > 1 ? "border-r border-slate-600/50" : ""}
          ${isSelecting ? "opacity-75" : ""}
          ${isHovered ? "ring-1 ring-slate-400" : ""}
          flex flex-col justify-center p-2
        `}
        onClick={(e) => !isSelecting && onEventClick(event, e)}
        style={{ zIndex: layoutInfo.zIndex, minHeight: "unset" }}
      >
        <div className="font-medium truncate text-xs leading-tight">
          {event.title}
        </div>
        <div className="text-xs opacity-70 font-normal leading-tight">
          {event.startTime} - {event.endTime}
        </div>
        {event.description && event.duration > 2 && (
          <div className="text-xs opacity-60 mt-1 truncate">
            {event.description}
          </div>
        )}
        {event.duration > 4 && (
          <Badge
            variant="secondary"
            className="text-xs mt-1 w-fit bg-slate-700 text-slate-300"
          >
            {durationInHours}h
          </Badge>
        )}
      </div>
    </div>
  );
}
