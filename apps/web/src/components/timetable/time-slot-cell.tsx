import type React from "react";
import { EventCard } from "./event-card";
import { SelectionOverlay } from "./selection-overlay";
import { Event } from "./timetable.types";

interface TimeSlotCellProps {
  day: string;
  timeSlot: string;
  timeIndex: number;
  eventsStartingHere: Event[];
  overlappingEvents: Event[];
  isEmpty: boolean;
  isCellSelected: boolean;
  isCellHovered: boolean;
  isSelecting: boolean;
  isTopSelectedCell: boolean | null;
  selectionInfo: {
    startIndex: number;
    endIndex: number;
    duration: number;
    topTimeSlot: string;
    selectedSlots: string[];
    day: string;
  } | null;
  hoveredEvent: string | null;
  onCellClick: (day: string, timeSlot: string, e: React.MouseEvent) => void;
  onMouseEnter: (day: string, timeSlot: string, e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onEventClick: (event: Event, e: React.MouseEvent) => void;
  onEventHover: (eventId: string | null) => void;
  getEventLayoutInfo: (
    event: Event,
    day: string
  ) => {
    width: string;
    left: string;
    zIndex: number;
  };
  cellHeight?: number;
}

export function TimeSlotCell({
  day,
  timeSlot,
  eventsStartingHere,
  overlappingEvents,
  isSelecting,
  isTopSelectedCell,
  selectionInfo,
  hoveredEvent,
  onCellClick,
  onMouseEnter,
  onMouseLeave,
  onEventClick,
  onEventHover,
  getEventLayoutInfo,
  cellHeight = 25,
}: TimeSlotCellProps) {
  return (
    <div
      key={`${day}-${timeSlot}`}
      className={`relative transition-all duration-200 select-none bg-background border-b border-l  p-1`}
      style={{ height: `${cellHeight}px` }}
      onMouseDown={(e) => onCellClick(day, timeSlot, e)}
      onMouseEnter={(e) => onMouseEnter(day, timeSlot, e)}
      onMouseLeave={onMouseLeave}
    >
      {isSelecting && selectionInfo && isTopSelectedCell && (
        <SelectionOverlay selectionInfo={selectionInfo} />
      )}

      {eventsStartingHere.map((event) => {
        const layoutInfo = getEventLayoutInfo(event, day);

        return (
          <EventCard
            key={event.id}
            event={event}
            layoutInfo={layoutInfo}
            isHovered={hoveredEvent === event.id}
            isSelecting={isSelecting}
            overlappingCount={overlappingEvents.length}
            onEventClick={onEventClick}
            onMouseEnter={() => onEventHover(event.id)}
            onMouseLeave={() => onEventHover(null)}
            cellHeight={cellHeight}
          />
        );
      })}
    </div>
  );
}
