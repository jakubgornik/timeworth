"use client";

import { useState, useCallback, useMemo } from "react";

import {
  getDefaultConfig,
  getWeekDates,
  formatDateForStorage,
  getEndTime,
} from "../utils/timetable-utils";

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

interface TimetableConfig {
  timeSlots: string[];
  daysOfWeek: string[];
  colors: string[];
  startHour?: number;
  endHour?: number;
  intervalMinutes?: number;
}

interface TimetableCallbacks {
  onEventCreate?: (event: Omit<Event, "id" | "color">) => void;
  onEventUpdate?: (eventId: string, event: Partial<Event>) => void;
  onEventDelete?: (eventId: string) => void;
  onEventClick?: (event: Event) => void;
  onWeekChange?: (direction: "prev" | "next", currentWeek: Date) => void;
}

interface UseTimetableStateProps {
  events: Event[];
  config?: Partial<TimetableConfig>;
  callbacks?: TimetableCallbacks;
  initialWeek?: Date;
}

export function useTimetableState({
  events,
  config,
  callbacks,
  initialWeek,
}: UseTimetableStateProps) {
  const [currentWeek, setCurrentWeek] = useState(initialWeek || new Date());
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{
    day: string;
    timeSlot: string;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{
    day: string;
    timeSlot: string;
  } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{
    day: string;
    timeSlot: string;
  } | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, "id" | "color">>({
    title: "",
    startTime: "",
    endTime: "",
    day: "",
    date: "",
    description: "",
    duration: 1,
  });

  const timetableConfig = useMemo(
    () => ({ ...getDefaultConfig(), ...config }),
    [config]
  );
  const weekDates = useMemo(() => getWeekDates(currentWeek), [currentWeek]);

  const getCurrentWeekEvents = useCallback(() => {
    const weekDateStrings = weekDates.map((date) => formatDateForStorage(date));
    return events.filter((event) => weekDateStrings.includes(event.date));
  }, [events, weekDates]);

  const navigateWeek = useCallback(
    (direction: "prev" | "next") => {
      const newDate = new Date(currentWeek);
      newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
      setCurrentWeek(newDate);
      callbacks?.onWeekChange?.(direction, newDate);
    },
    [currentWeek, callbacks]
  );

  const createNewEvent = useCallback(() => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.day) return;

    const eventToCreate: Omit<Event, "id" | "color"> = {
      ...newEvent,
      endTime: getEndTime(
        newEvent.startTime,
        newEvent.duration,
        timetableConfig.intervalMinutes
      ),
    };

    callbacks?.onEventCreate?.(eventToCreate);
    setNewEventDialogOpen(false);
    setNewEvent({
      title: "",
      startTime: "",
      endTime: "",
      day: "",
      date: "",
      description: "",
      duration: 1,
    });
  }, [newEvent, callbacks, timetableConfig.intervalMinutes]);

  const deleteEvent = useCallback(
    (eventId: string) => {
      callbacks?.onEventDelete?.(eventId);
      setSelectedEvent(null);
      setDialogOpen(false);
    },
    [callbacks]
  );

  const handleEventClick = useCallback(
    (event: Event) => {
      setSelectedEvent(event);
      setDialogOpen(true);
      callbacks?.onEventClick?.(event);
    },
    [callbacks]
  );

  const addNewEvent = useCallback(() => {
    const dayIndex = 0;
    const eventDate = formatDateForStorage(weekDates[dayIndex]);

    setNewEvent({
      title: "",
      day: timetableConfig.daysOfWeek[0],
      date: eventDate,
      startTime: timetableConfig.timeSlots[0],
      endTime: getEndTime(
        timetableConfig.timeSlots[0],
        1,
        timetableConfig.intervalMinutes
      ),
      description: "",
      duration: 1,
    });
    setNewEventDialogOpen(true);
  }, [weekDates, timetableConfig]);

  return {
    // State
    currentWeek,
    hoveredEvent,
    dialogOpen,
    newEventDialogOpen,
    selectedEvent,
    hoveredCell,
    isSelecting,
    selectionStart,
    selectionEnd,
    newEvent,

    // Computed
    timetableConfig,
    weekDates,
    currentWeekEvents: getCurrentWeekEvents(),

    // Actions
    navigateWeek,
    createNewEvent,
    deleteEvent,
    handleEventClick,
    addNewEvent,

    // Setters
    setHoveredEvent,
    setDialogOpen,
    setNewEventDialogOpen,
    setSelectedEvent,
    setHoveredCell,
    setIsSelecting,
    setSelectionStart,
    setSelectionEnd,
    setNewEvent,
  };
}
