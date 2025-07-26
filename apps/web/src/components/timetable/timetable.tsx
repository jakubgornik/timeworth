import type React from "react";
import { useCallback, useEffect, useMemo } from "react";
import { TimetableHeader } from "./timetable-header";
import { TimetableGrid } from "./timetable-grid";
import { useTimetableState } from "./hooks/use-timetable-state";
import {
  formatDate,
  getDateRangeFromDates,
  getWeekRange,
} from "./utils/timetable-utils";
import { EventDetailsDialog } from "./dialogs/event-details-dialog";
import { NewEventDialog } from "./dialogs/new-event-dialog";
import {
  Event,
  TimePeriod,
  TimetableCallbacks,
  TimetableConfig,
} from "./timetable.types";

interface TimetableProps {
  events: Event[];
  config?: Partial<TimetableConfig>;
  callbacks?: TimetableCallbacks;
  currentWeek?: Date;
  loading?: boolean;
  setCurrentWeek?: React.Dispatch<React.SetStateAction<TimePeriod | undefined>>;
}

export function Timetable({
  events,
  config,
  callbacks,
  currentWeek,
  setCurrentWeek,
  loading,
}: TimetableProps) {
  const {
    hoveredEvent,
    isEventDialogOpened,
    setIsEventDialogOpened,
    isNewEventDialogOpened,

    setIsNewEventDialogOpened,
    selectedEvent,
    hoveredCell,
    isSelecting,
    selectionStart,
    selectionEnd,
    newEvent,
    timetableConfig,
    weekDates,
    currentWeekEvents,
    navigateWeek,
    deleteEvent,
    handleEventClick,
    addNewEvent,
    setHoveredEvent,

    setHoveredCell,
    setIsSelecting,
    setSelectionStart,
    setSelectionEnd,
    setNewEvent,
  } = useTimetableState({
    events,
    config,
    callbacks,
    initialWeek: currentWeek,
  });

  const handleCellClick = useCallback(
    (day: string, timeSlot: string, e: React.MouseEvent) => {
      if (isSelecting) return;

      const target = e.target as HTMLElement;
      const isClickingOnEvent = target.closest("[data-event-id]");

      if (isClickingOnEvent) return;

      e.preventDefault();
      setIsSelecting(true);
      setSelectionStart({ day, timeSlot });
      setSelectionEnd({ day, timeSlot });
    },
    [isSelecting, setIsSelecting, setSelectionStart, setSelectionEnd]
  );

  const handleMouseEnter = useCallback(
    (day: string, timeSlot: string, e: React.MouseEvent) => {
      setHoveredCell({ day, timeSlot });

      if (isSelecting && selectionStart && selectionStart.day === day) {
        e.stopPropagation();
        setSelectionEnd({ day, timeSlot });
      }
    },
    [isSelecting, selectionStart, setHoveredCell, setSelectionEnd]
  );

  const handleMouseUp = useCallback(() => {
    if (isSelecting && selectionStart && selectionEnd) {
      const startIndex = timetableConfig.timeSlots.indexOf(
        selectionStart.timeSlot
      );
      const endIndex = timetableConfig.timeSlots.indexOf(selectionEnd.timeSlot);
      const minIndex = Math.min(startIndex, endIndex);
      const maxIndex = Math.max(startIndex, endIndex);
      const duration = maxIndex - minIndex + 1;
      const dayIndex = timetableConfig.daysOfWeek.indexOf(selectionStart.day);
      const eventDate = weekDates[dayIndex]?.toISOString().split("T")[0] || "";
      setNewEvent({
        title: "",
        day: selectionStart.day,
        date: eventDate,
        startTime: timetableConfig.timeSlots[minIndex],
        endTime:
          timetableConfig.timeSlots[maxIndex + 1] ||
          timetableConfig.timeSlots[maxIndex],
        description: "",
        duration,
      });
      setIsNewEventDialogOpened(true);
    }

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [
    isSelecting,
    selectionStart,
    selectionEnd,
    timetableConfig,
    weekDates,
    setNewEvent,
    setIsNewEventDialogOpened,
    setIsSelecting,
    setSelectionStart,
    setSelectionEnd,
  ]);

  const getSelectionInfo = useCallback(() => {
    if (
      !isSelecting ||
      !selectionStart ||
      !selectionEnd ||
      selectionStart.day !== selectionEnd.day
    ) {
      return null;
    }

    const startIndex = timetableConfig.timeSlots.indexOf(
      selectionStart.timeSlot
    );
    const endIndex = timetableConfig.timeSlots.indexOf(selectionEnd.timeSlot);
    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    const selectedSlots = [];
    for (let i = minIndex; i <= maxIndex; i++) {
      selectedSlots.push(timetableConfig.timeSlots[i]);
    }

    return {
      startIndex: minIndex,
      endIndex: maxIndex,
      duration: maxIndex - minIndex + 1,
      topTimeSlot: timetableConfig.timeSlots[minIndex],
      selectedSlots,
      day: selectionStart.day,
    };
  }, [isSelecting, selectionStart, selectionEnd, timetableConfig.timeSlots]);

  const selectionInfo = getSelectionInfo();

  const getEventsStartingInSlot = useCallback(
    (day: string, timeSlot: string) => {
      return currentWeekEvents.filter(
        (event) => event.day === day && event.startTime === timeSlot
      );
    },
    [currentWeekEvents]
  );

  const getOverlappingEventsForTimeSlot = useCallback(
    (day: string, timeSlot: string) => {
      const slotIndex = timetableConfig.timeSlots.indexOf(timeSlot);
      return currentWeekEvents.filter((event) => {
        if (event.day !== day) return false;
        const eventStartIndex = timetableConfig.timeSlots.indexOf(
          event.startTime
        );
        const eventEndIndex = eventStartIndex + event.duration - 1;
        return slotIndex >= eventStartIndex && slotIndex <= eventEndIndex;
      });
    },
    [currentWeekEvents, timetableConfig.timeSlots]
  );

  const hasEmptySpace = useCallback(
    (day: string, timeSlot: string) => {
      const overlappingEvents = getOverlappingEventsForTimeSlot(day, timeSlot);
      return overlappingEvents.length === 0;
    },
    [getOverlappingEventsForTimeSlot]
  );

  const isCellSelected = useCallback(
    (day: string, timeSlot: string) => {
      if (!selectionInfo || selectionInfo.day !== day) return false;
      return selectionInfo.selectedSlots.includes(timeSlot);
    },
    [selectionInfo]
  );

  const isTopSelectedCell = useCallback(
    (day: string, timeSlot: string) => {
      return (
        selectionInfo &&
        selectionInfo.day === day &&
        selectionInfo.topTimeSlot === timeSlot
      );
    },
    [selectionInfo]
  );

  const isCellHovered = useCallback(
    (day: string, timeSlot: string) => {
      return hoveredCell?.day === day && hoveredCell?.timeSlot === timeSlot;
    },
    [hoveredCell]
  );

  const getEventLayoutInfo = useCallback(
    (event: Event, day: string) => {
      const dayEvents = currentWeekEvents.filter((e) => e.day === day);
      const sortedEvents = dayEvents.sort((a, b) => {
        const timeCompare = a.startTime.localeCompare(b.startTime);
        if (timeCompare !== 0) return timeCompare;
        const durationCompare = b.duration - a.duration;
        if (durationCompare !== 0) return durationCompare;
        return a.id.localeCompare(b.id);
      });

      const eventStartIndex = timetableConfig.timeSlots.indexOf(
        event.startTime
      );
      const eventEndIndex = eventStartIndex + event.duration - 1;

      const overlappingEvents = sortedEvents.filter((otherEvent) => {
        if (otherEvent.id === event.id) return true;
        const otherStartIndex = timetableConfig.timeSlots.indexOf(
          otherEvent.startTime
        );
        const otherEndIndex = otherStartIndex + otherEvent.duration - 1;
        return !(
          eventEndIndex < otherStartIndex || eventStartIndex > otherEndIndex
        );
      });

      let maxConcurrent = 1;
      for (let i = eventStartIndex; i <= eventEndIndex; i++) {
        const concurrentAtThisTime = overlappingEvents.filter((otherEvent) => {
          const otherStartIndex = timetableConfig.timeSlots.indexOf(
            otherEvent.startTime
          );
          const otherEndIndex = otherStartIndex + otherEvent.duration - 1;
          return i >= otherStartIndex && i <= otherEndIndex;
        }).length;
        maxConcurrent = Math.max(maxConcurrent, concurrentAtThisTime);
      }

      const eventIndex = overlappingEvents.findIndex((e) => e.id === event.id);
      const columnWidth = 100 / maxConcurrent;
      const leftPosition = eventIndex * columnWidth;

      return {
        width: `${columnWidth}%`,
        left: `${leftPosition}%`,
        zIndex: hoveredEvent === event.id ? 20 : 10 + eventIndex,
      };
    },
    [currentWeekEvents, timetableConfig.timeSlots, hoveredEvent]
  );

  const memoizedWeekRange = useMemo(
    () => getDateRangeFromDates(weekDates),
    [weekDates]
  );

  useEffect(() => {
    if (!setCurrentWeek) return;

    setCurrentWeek((prev: { from: Date; to: Date } | undefined) => {
      if (
        prev?.from.getTime() === memoizedWeekRange.from.getTime() &&
        prev?.to.getTime() === memoizedWeekRange.to.getTime()
      ) {
        return prev;
      }
      return memoizedWeekRange;
    });
  }, [memoizedWeekRange, setCurrentWeek]);

  const handleCreateEventFromForm = useCallback(
    (eventData: Omit<Event, "id" | "color">) => {
      callbacks?.onEventCreate?.(eventData);
      setIsNewEventDialogOpened(false);
    },
    [callbacks, setIsNewEventDialogOpened]
  );

  // TODO: better loading
  if (loading) {
    return (
      <div className="min-h-screen bg-accent text-secondary p-6 flex items-center justify-center">
        <div className="text-secondary">Loading timetable...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-secondary p-6">
      <div
        className="max-w-full mx-auto"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="rounded-lg overflow-hidden shadow-2xl">
          <TimetableHeader
            weekRange={getWeekRange(weekDates)}
            onNavigateWeek={navigateWeek}
            onAddEvent={addNewEvent}
          />
          <div className="p-0">
            <TimetableGrid
              timeSlots={timetableConfig.timeSlots}
              daysOfWeek={timetableConfig.daysOfWeek}
              weekDates={weekDates}
              formatDate={formatDate}
              getEventsStartingInSlot={getEventsStartingInSlot}
              getOverlappingEventsForTimeSlot={getOverlappingEventsForTimeSlot}
              hasEmptySpace={hasEmptySpace}
              isCellSelected={isCellSelected}
              isTopSelectedCell={isTopSelectedCell}
              isCellHovered={isCellHovered}
              isSelecting={isSelecting}
              selectionInfo={selectionInfo}
              hoveredEvent={hoveredEvent}
              onCellClick={handleCellClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setHoveredCell(null)}
              onEventClick={(event, e) => {
                e.stopPropagation();
                handleEventClick(event);
              }}
              onEventHover={setHoveredEvent}
              getEventLayoutInfo={getEventLayoutInfo}
              intervalMinutes={timetableConfig.intervalMinutes}
            />
          </div>
        </div>
        <EventDetailsDialog
          open={isEventDialogOpened}
          onOpenChange={setIsEventDialogOpened}
          event={selectedEvent}
          onDeleteEvent={deleteEvent}
        />
        <NewEventDialog
          open={isNewEventDialogOpened}
          onOpenChange={setIsNewEventDialogOpened}
          newEvent={newEvent}
          onCreateEvent={handleCreateEventFromForm}
          intervalMinutes={timetableConfig.intervalMinutes}
          config={{ ...timetableConfig, weekDates }}
        />
      </div>
    </div>
  );
}
