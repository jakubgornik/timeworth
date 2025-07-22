import { EventCard } from "./event-card";
import { SelectionOverlay } from "./selection-overlay";
import { TimeSlotCellProps } from "./timetable.types";

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
