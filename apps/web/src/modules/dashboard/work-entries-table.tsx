import { Timetable } from "@/components/timetable/timetable";
import {
  TimePeriod,
  TimetableCallbacks,
} from "@/components/timetable/timetable.types";
import { combineDateAndTime } from "@/components/timetable/utils/timetable-utils";
import { useState } from "react";
import { useCreateWorkEntry } from "@/hooks/work-entry/use-create-work-entry";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { ICreateWorkEntryDto } from "@packages/types";
import { useGetWorkEntries } from "@/hooks/work-entry/use-get-work-entries";
import { useDeleteWorkEntry } from "@/hooks/work-entry/use-delete-work-entry";

export default function WorkEntriesTimetable() {
  const currentUser = useCurrentUser();
  const [currentWeek, setCurrentWeek] = useState<TimePeriod>();
  const { data: workEntries, isLoading } = useGetWorkEntries({
    userId: currentUser.data!.id,
    currentWeek,
  });
  const { mutate: createWorkEntry } = useCreateWorkEntry();
  const { mutate: deleteWorkEntry } = useDeleteWorkEntry();

  const callbacks: TimetableCallbacks = {
    onEventCreate: (newEvent) => {
      const payload: ICreateWorkEntryDto = {
        userId: currentUser.data!.id,
        title: newEvent.title,
        startedAt: combineDateAndTime(newEvent.date, newEvent.startTime),
        endedAt: combineDateAndTime(newEvent.date, newEvent.endTime),
        description: newEvent.description,
        organizationId: currentUser.data!.organization?.id ?? "",
      };

      createWorkEntry(payload);
    },
    onEventDelete: (eventId) => {
      deleteWorkEntry(eventId);
    },
  };

  return (
    <Timetable
      events={workEntries || []}
      callbacks={callbacks}
      loading={isLoading}
      config={{
        startHour: 8,
        endHour: 20,
        intervalMinutes: 15,
      }}
      setCurrentWeek={setCurrentWeek}
    />
  );
}
