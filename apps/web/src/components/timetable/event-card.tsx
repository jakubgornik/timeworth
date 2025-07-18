"use client";

import type React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  day: string;
  date: string;
  color: string;
  description?: string;
  duration: number;
}

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
}: EventCardProps) {
  // Calculate duration in hours (duration is in 15-minute slots)
  const durationInHours = (event.duration * 15) / 60;
  return (
    <div
      data-event-id={event.id}
      className={`absolute ${isSelecting ? "pointer-events-none" : ""} transition-all duration-200 ease-in-out`}
      style={{
        height: `${event.duration * 25 - 8}px`,
        width: layoutInfo.width,
        left: layoutInfo.left,
        top: "4px",
        zIndex: layoutInfo.zIndex,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card
        className={`
          ${event.color} 
          cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg
          border-l-4 shadow-sm h-full rounded-sm overflow-hidden
          ${overlappingCount > 1 ? "border-r border-slate-600/50" : ""}
          ${isSelecting ? "opacity-75" : ""}
          ${isHovered ? "!z-[100] ring-1 ring-teal-400" : ""}
        `}
        onClick={(e) => !isSelecting && onEventClick(event, e)}
        style={{ zIndex: layoutInfo.zIndex }}
      >
        <CardContent className="h-full flex flex-col justify-center p-2">
          <div className="font-medium truncate text-xs">{event.title}</div>
          <div className="text-xs opacity-70 font-normal">
            {event.startTime} - {event.endTime}
          </div>
          {event.description && (
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
        </CardContent>
      </Card>
    </div>
  );
}
