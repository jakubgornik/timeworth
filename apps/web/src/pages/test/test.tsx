import { Timetable } from "@/components/timetable/timetable";
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

interface TimetableCallbacks {
  onEventCreate?: (event: Omit<Event, "id" | "color">) => void;
  onEventDelete?: (eventId: string) => void;
  onEventClick?: (event: Event) => void;
  onWeekChange?: (direction: "prev" | "next", currentWeek: Date) => void;
}

export default function Test() {
  const [events, setEvents] = useState<Event[]>([]);

  const callbacks: TimetableCallbacks = {
    onEventCreate: (newEvent) => {
      // TODO replace with actual event creation logic on the be
      const event: Event = {
        id: Date.now().toString(),
        ...newEvent,
        color: "bg-blue-600/80 border-blue-500 text-blue-100",
      };
      setEvents((prev) => [...prev, event]);
    },
    onEventDelete: (eventId) => {
      // TODO
      console.log("Delete event with ID:", eventId);
    },
    onEventClick: (event) => {
      // TODO
      console.log("Event details id:", event.id);
    },
    onWeekChange: (direction, newWeek) => {
      console.log("Week changed:", direction, newWeek);
      // TODO could fetch new events for the week
    },
  };

  return (
    <Timetable
      events={events}
      callbacks={callbacks}
      loading={false} // Set to query loading state
      config={{
        startHour: 6,
        endHour: 22,
        intervalMinutes: 15,
      }}
    />
  );
}
