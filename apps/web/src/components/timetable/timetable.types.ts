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
  startHour?: number;
  endHour?: number;
  intervalMinutes?: number;
}

interface BaseTimetableProps {
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
}

export interface TimetableGridProps extends BaseTimetableProps {
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
  intervalMinutes?: number;
}

export interface TimeSlotCellProps extends BaseTimetableProps {
  day: string;
  timeSlot: string;
  timeIndex: number;
  eventsStartingHere: Event[];
  overlappingEvents: Event[];
  isEmpty: boolean;
  isCellSelected: boolean;
  isCellHovered: boolean;
  isTopSelectedCell: boolean | null;
  cellHeight?: number;
}
