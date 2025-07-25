import { Timetable } from "@/components/timetable/timetable";
import {
  Event,
  TimetableCallbacks,
} from "@/components/timetable/timetable.types";
import { getWorkWeekRange } from "@/components/timetable/utils/timetable-utils";
import { useState } from "react";

export default function MvpTimetable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading] = useState(false);

  // TODO
  // This should be replaced with actual callbacks to handle event creation, deletion on db etc.
  // Repalce events with work entries, adjust accordingly

  const callbacks: TimetableCallbacks = {
    onEventCreate: (newEvent) => {
      // TODO: Replace with actual API call, create workentry,
      const event: Event = {
        id: Date.now().toString(),
        ...newEvent,
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
      console.log(
        "Week changed:",
        direction,
        getWorkWeekRange(new Date(newWeek))
      );
    },
  };

  return (
    <Timetable
      events={events}
      callbacks={callbacks}
      loading={loading}
      config={{
        startHour: 8,
        endHour: 20,
        intervalMinutes: 15,
      }}
    />
  );
}
