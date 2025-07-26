import { Timetable } from "@/components/timetable/timetable";
import {
  Event,
  TimePeriod,
  TimetableCallbacks,
} from "@/components/timetable/timetable.types";
import { combineDateAndTime } from "@/components/timetable/utils/timetable-utils";
import { useState } from "react";
import { useCreateWorkEntry } from "@/hooks/work-entry/use-create-work-entry";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { ICreateWorkEntryDto } from "@packages/types";

const mockEvents: Event[] = [
  {
    id: "1753561220116",
    title: "adad",
    description: "Test",
    date: "2025-07-24",
    day: "Thursday",
    startTime: "08:00",
    endTime: "10:00",
    duration: 8,
  },
];

export default function MvpTimetable() {
  // TODO: replace with actual work entreis from db
  const [events, setEvents] = useState<Event[]>(mockEvents);
  // TODO: replace with getter loading
  const [loading] = useState(false);
  const { mutate: createWorkEntry } = useCreateWorkEntry();
  const currentUser = useCurrentUser();
  const [currentWeek, setCurrentWeek] = useState<TimePeriod>();

  console.log(currentWeek);

  const callbacks: TimetableCallbacks = {
    onEventCreate: (newEvent) => {
      // TODO:  remove after get is complete
      const event: Event = {
        id: Date.now().toString(),
        ...newEvent,
      };
      setEvents((prev) => [...prev, event]);

      // TODO: add notification
      if (!currentUser.data?.organization?.id) {
        throw new Error("User is not part of an organization");
      }

      const payload: ICreateWorkEntryDto = {
        userId: currentUser.data!.id,
        title: event.title,
        startedAt: combineDateAndTime(event.date, event.startTime),
        endedAt: combineDateAndTime(event.date, event.endTime),
        description: event.description,
        organizationId: currentUser.data!.organization?.id ?? "",
      };

      // TODO: add notification
      createWorkEntry(payload);
    },
    onEventDelete: (eventId) => {
      console.log(`Event with id ${eventId} deleted`);
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
      setCurrentWeek={setCurrentWeek}
    />
  );
}
