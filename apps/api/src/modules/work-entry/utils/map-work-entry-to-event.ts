import { format, differenceInMinutes } from 'date-fns';

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
    date: format(startedAt, 'yyyy-MM-dd'),
    day: format(startedAt, 'EEEE'),
    startTime: format(startedAt, 'HH:mm'),
    endTime: format(endedAt, 'HH:mm'),
    duration: durationUnits,
  };
}
