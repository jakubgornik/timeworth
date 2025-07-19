import { useState } from "react";

import { getDefaultConfig, getWeekDates } from "../utils/timetable-utils";

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
  const timetableConfig: TimetableConfig = {
    ...getDefaultConfig(),
    ...config,
  };

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

  const weekDates = getWeekDates(currentWeek);

  const formatDateForStorage = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const currentWeekEvents = events.filter((event) => {
    const weekDateStrings = weekDates.map((date) => formatDateForStorage(date));
    return weekDateStrings.includes(event.date);
  });

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
    callbacks?.onWeekChange?.(direction, newDate);
  };

  const createNewEvent = () => {
    callbacks?.onEventCreate?.(newEvent);
    setNewEventDialogOpen(false);
  };

  const deleteEvent = (eventId: string) => {
    callbacks?.onEventDelete?.(eventId);
    setSelectedEvent(null);
    setDialogOpen(false);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
    callbacks?.onEventClick?.(event);
  };

  const addNewEvent = () => {
    setNewEvent({
      title: "",
      startTime: timetableConfig.timeSlots[0],
      endTime: timetableConfig.timeSlots[1],
      day: timetableConfig.daysOfWeek[0],
      date: weekDates[0].toISOString().split("T")[0],
      description: "",
      duration: 1,
    });
    setNewEventDialogOpen(true);
  };

  return {
    hoveredEvent,
    dialogOpen,
    newEventDialogOpen,
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
    createNewEvent,
    deleteEvent,
    handleEventClick,
    addNewEvent,
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
