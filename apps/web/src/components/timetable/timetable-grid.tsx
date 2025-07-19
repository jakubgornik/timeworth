import React from "react";
import { TimeSlotCell } from "./time-slot-cell";

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

interface TimetableGridProps {
  timeSlots: string[];
  daysOfWeek: string[];
  weekDates: Date[];
  formatDate: (date: Date) => string;
  getEventsStartingInSlot: (day: string, timeSlot: string) => Event[];
  getOverlappingEventsForTimeSlot: (day: string, timeSlot: string) => Event[];
  hasEmptySpace: (day: string, timeSlot: string) => boolean;
  isCellSelected: (day: string, timeSlot: string) => boolean;
  isTopSelectedCell: (day: string, timeSlot: string) => boolean | null;
  isCellHovered: (day: string, timeSlot: string) => boolean;
  isSelecting: boolean;
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
  intervalMinutes?: number;
}

export function TimetableGrid({
  timeSlots,
  daysOfWeek,
  weekDates,
  getEventsStartingInSlot,
  getOverlappingEventsForTimeSlot,
  hasEmptySpace,
  isCellSelected,
  isTopSelectedCell,
  isCellHovered,
  isSelecting,
  selectionInfo,
  hoveredEvent,
  onCellClick,
  onMouseEnter,
  onMouseLeave,
  onEventClick,
  onEventHover,
  getEventLayoutInfo,
  intervalMinutes = 15,
}: TimetableGridProps) {
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Define cell height constant
  const CELL_HEIGHT = 25;

  // Function to format time slot display - FIXED: Now uses intervalMinutes parameter
  const formatTimeSlotDisplay = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(":").map(Number);
    const nextMinutes = minutes + intervalMinutes;
    const nextHours = nextMinutes >= 60 ? hours + 1 : hours;
    const adjustedNextMinutes =
      nextMinutes >= 60 ? nextMinutes - 60 : nextMinutes;

    const nextTime = `${nextHours.toString().padStart(2, "0")}:${adjustedNextMinutes.toString().padStart(2, "0")}`;

    return `${timeSlot}-${nextTime}`;
  };

  return (
    <div className="overflow-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 max-h-[600px]">
      <div
        className="grid gap-0 min-w-[1000px]"
        style={{ gridTemplateColumns: "100px repeat(5, 1fr)" }}
      >
        {/* Header row */}
        <div className="sticky top-0 z-20 bg-slate-800 border-b border-slate-700"></div>
        {daysOfWeek.map((day, index) => {
          const dayDate = weekDates[index];
          const todayHighlight = isToday(dayDate);

          return (
            <div
              key={day}
              className="sticky top-0 z-20 text-center p-4 bg-slate-800 border-b  border-l border-slate-700"
            >
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                {day.slice(0, 2)}
              </div>
              <div
                className={`text-lg font-medium ${
                  todayHighlight
                    ? "bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto"
                    : "text-slate-200"
                }`}
              >
                {dayDate.getDate()}
              </div>
            </div>
          );
        })}

        {/* Time slots and events */}
        {timeSlots.map((timeSlot, timeIndex) => (
          <>
            <div
              key={timeSlot}
              className="text-xs p-2 text-slate-400 border-b border-slate-700 sticky left-0 z-15 h-[25px] flex items-start justify-end pr-3 pt-2"
              style={{ backgroundColor: "#1e293b" }}
            >
              <div className="text-right leading-tight">
                {formatTimeSlotDisplay(timeSlot)}
              </div>
            </div>
            {daysOfWeek.map((day) => {
              const eventsStartingHere = getEventsStartingInSlot(day, timeSlot);
              const overlappingEvents = getOverlappingEventsForTimeSlot(
                day,
                timeSlot
              );
              const isEmpty = hasEmptySpace(day, timeSlot);

              return (
                <TimeSlotCell
                  key={`${day}-${timeSlot}`}
                  day={day}
                  timeSlot={timeSlot}
                  timeIndex={timeIndex}
                  eventsStartingHere={eventsStartingHere}
                  overlappingEvents={overlappingEvents}
                  isEmpty={isEmpty}
                  isCellSelected={isCellSelected(day, timeSlot)}
                  isCellHovered={isCellHovered(day, timeSlot)}
                  isSelecting={isSelecting}
                  isTopSelectedCell={isTopSelectedCell(day, timeSlot)}
                  selectionInfo={selectionInfo}
                  hoveredEvent={hoveredEvent}
                  onCellClick={onCellClick}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  onEventClick={onEventClick}
                  onEventHover={onEventHover}
                  getEventLayoutInfo={getEventLayoutInfo}
                  cellHeight={CELL_HEIGHT} // Pass cell height to TimeSlotCell
                />
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
