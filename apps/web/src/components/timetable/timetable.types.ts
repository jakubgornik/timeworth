export interface Event {
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

export interface TimetableCallbacks {
  onEventCreate?: (event: Omit<Event, "id" | "color">) => void;
  onEventDelete?: (eventId: string) => void;
  onEventClick?: (event: Event) => void;
  onWeekChange?: (direction: "prev" | "next", currentWeek: Date) => void;
}

export interface TimetableConfig {
  timeSlots: string[];
  daysOfWeek: string[];
  colors: string[];
  startHour?: number;
  endHour?: number;
  intervalMinutes?: number;
}
