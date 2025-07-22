import React from "react";
import { TimeSlotCell } from "./time-slot-cell";
import { TimetableGridProps } from "./timetable.types";
import { TimetableGridColumnHeader } from "./timetable-grid-column-header";
import { formatTimeSlotDisplay } from "./utils/timetable-utils";

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

  const CELL_HEIGHT = 25;

  return (
    <div className="overflow-auto custom-scrollbar min-h-[500px] max-h-[500px] 3xl:max-h-none ">
      <div
        className="grid gap-0 "
        style={{ gridTemplateColumns: "100px repeat(5, minmax(80px, 1fr))" }}
      >
        <div className="sticky top-0 z-[50] bg-accent border-b"></div>
        {daysOfWeek.map((day, index) => {
          const dayDate = weekDates[index];
          const todayHighlight = isToday(dayDate);

          return (
            <TimetableGridColumnHeader
              key={day}
              day={day}
              dayDate={dayDate}
              isToday={todayHighlight}
            />
          );
        })}

        {timeSlots.map((timeSlot, timeIndex) => (
          <React.Fragment key={timeSlot}>
            <div
              key={timeSlot}
              className="bg-background text-xs p-2 text-secondary border-b  border-r md:border-r-0 sticky  left-0 z-[40] h-[25px] flex items-center justify-center pr-3 pt-2"
            >
              <div className="text-right leading-tight">
                {formatTimeSlotDisplay(timeSlot, intervalMinutes)}
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
                  key={`${day}-${timeSlot}-${timeIndex}`}
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
                  cellHeight={CELL_HEIGHT}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
