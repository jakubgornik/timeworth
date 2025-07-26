import { useState } from "react";
import {
  getDefaultConfig,
  getWeekDates,
  generateTimeSlots,
} from "../utils/timetable-utils";
import { Event, TimetableCallbacks, TimetableConfig } from "../timetable.types";

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
  const defaultConfig = getDefaultConfig();
  const mergedConfig = { ...defaultConfig, ...config };

  const timetableConfig: TimetableConfig = {
    ...mergedConfig,
    timeSlots: generateTimeSlots(
      mergedConfig.startHour || 6,
      mergedConfig.endHour || 22,
      mergedConfig.intervalMinutes || 15
    ),
  };

  const [currentWeek, setCurrentWeek] = useState(initialWeek || new Date());
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [isEventDialogOpened, setIsEventDialogOpened] = useState(false);
  const [isNewEventDialogOpened, setIsNewEventDialogOpened] = useState(false);
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

  const formatDateForStorage = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const weekDates = getWeekDates(currentWeek);

  const currentWeekEvents = events.filter((event) => {
    const weekDateStrings = weekDates.map((date) => formatDateForStorage(date));
    return weekDateStrings.includes(event.date);
  });

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const deleteEvent = (eventId: string) => {
    callbacks?.onEventDelete?.(eventId);
    setSelectedEvent(null);
    setIsEventDialogOpened(false);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDialogOpened(true);
  };

  const addNewEvent = () => {
    const today = new Date();
    const todayString = formatDateForStorage(today);
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

    setNewEvent({
      title: "",
      startTime: timetableConfig.timeSlots[0],
      endTime: timetableConfig.timeSlots[1],
      day: dayName,
      date: todayString,
      description: "",
      duration: 1,
    });
    setIsNewEventDialogOpened(true);
  };

  return {
    isEventDialogOpened,
    setIsEventDialogOpened,
    isNewEventDialogOpened,
    setIsNewEventDialogOpened,
    hoveredEvent,
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
    setSelectedEvent,
    setHoveredCell,
    setIsSelecting,
    setSelectionStart,
    setSelectionEnd,
    setNewEvent,
  };
}
