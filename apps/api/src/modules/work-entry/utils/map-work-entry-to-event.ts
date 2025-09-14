import { differenceInMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export function mapWorkEntryToEvent(entry: {
  id: string;
  title: string;
  description?: string | null;
  startedAt: Date | string;
  endedAt: Date | string;
}) {
  const startedAt =
    typeof entry.startedAt === 'string'
      ? new Date(entry.startedAt)
      : entry.startedAt;
  const endedAt =
    typeof entry.endedAt === 'string' ? new Date(entry.endedAt) : entry.endedAt;

  const durationInMinutes = differenceInMinutes(endedAt, startedAt);
  const durationUnits = durationInMinutes / 15;

  return {
    id: entry.id,
    title: entry.title,
    description: entry.description ?? '',
    date: formatInTimeZone(startedAt, 'UTC', 'yyyy-MM-dd'),
    day: formatInTimeZone(startedAt, 'UTC', 'EEEE'),
    startTime: formatInTimeZone(startedAt, 'UTC', 'HH:mm'),
    endTime: formatInTimeZone(endedAt, 'UTC', 'HH:mm'),

    duration: durationUnits,
  };
}
