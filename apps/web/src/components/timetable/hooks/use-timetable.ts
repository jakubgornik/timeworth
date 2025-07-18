import { useState } from "react";

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

// Generate 15-minute intervals from 06:00 to 22:00
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 22 && minute > 0) break; // Stop at 22:00
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const colors = [
  "bg-blue-600/80 border-blue-500 text-blue-100",
  "bg-green-600/80 border-green-500 text-green-100",
  "bg-purple-600/80 border-purple-500 text-purple-100",
  "bg-orange-600/80 border-orange-500 text-orange-100",
  "bg-pink-600/80 border-pink-500 text-pink-100",
  "bg-indigo-600/80 border-indigo-500 text-indigo-100",
  "bg-teal-600/80 border-teal-500 text-teal-100",
  "bg-red-600/80 border-red-500 text-red-100",
  "bg-yellow-600/80 border-yellow-500 text-yellow-100",
  "bg-cyan-600/80 border-cyan-500 text-cyan-100",
];

export function useTimetable() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
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

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      week.push(currentDate);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatDateForStorage = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[4];
    return `${formatDate(start)} - ${formatDate(end)}, ${start.getFullYear()}`;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getCurrentWeekEvents = () => {
    const weekDateStrings = weekDates.map((date) => formatDateForStorage(date));
    return events.filter((event) => weekDateStrings.includes(event.date));
  };

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration * 15; // 15 minutes per slot
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    return `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
  };

  const createNewEvent = () => {
    if (!newEvent.title) return;

    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      endTime: getEndTime(newEvent.startTime, newEvent.duration),
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setEvents([...events, event]);
    setNewEventDialogOpen(false);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setSelectedEvent(null);
  };

  return {
    // Constants
    timeSlots,
    daysOfWeek,
    colors,

    // State
    currentWeek,
    events,
    hoveredEvent,
    dialogOpen,
    newEventDialogOpen,
    selectedEvent,
    hoveredCell,
    isSelecting,
    selectionStart,
    selectionEnd,
    newEvent,

    // Computed values
    weekDates,

    // Functions
    formatDate,
    formatDateForStorage,
    getWeekRange,
    navigateWeek,
    getCurrentWeekEvents,
    getEndTime,
    createNewEvent,
    deleteEvent,

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
