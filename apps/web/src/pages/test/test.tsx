import { Timetable } from "@/components/timetable/timetable";
import {
  Event,
  TimetableCallbacks,
} from "@/components/timetable/timetable.types";
import { useState } from "react";

export default function Component() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading] = useState(false);

  // TODO
  const callbacks: TimetableCallbacks = {
    // TODO: create on be
    onEventCreate: (newEvent) => {
      const event: Event = {
        id: Date.now().toString(),
        ...newEvent,
        color: "bg-slate-600/80",
      };
      setEvents((prev) => [...prev, event]);
    },
    onEventDelete: (eventId) => {
      console.log("Event deleted", eventId);
    },
    onEventClick: (event) => {
      console.log("Event clicked:", event.id);
    },
    onWeekChange: (direction, newWeek) => {
      console.log("Week changed:", direction, newWeek);
      // Here you could fetch new events for the week
    },
  };

  return (
    <Timetable
      events={events}
      callbacks={callbacks}
      loading={loading}
      config={{
        startHour: 6,
        endHour: 20,
        intervalMinutes: 15,
      }}
    />
  );
}
