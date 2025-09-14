import { TimePeriod, TimetableConfig } from "../timetable.types";
import { startOfWeek, addDays, startOfDay, endOfDay } from "date-fns";
import { format, toZonedTime, fromZonedTime } from "date-fns-tz";

export const generateTimeSlots = (
  startHour = 6,
  endHour = 22,
  intervalMinutes = 15
): string[] => {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour === endHour && minute > 0) break;
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
};

export const getDefaultConfig = (): TimetableConfig => ({
  timeSlots: generateTimeSlots(),
  daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  startHour: 6,
  endHour: 20,
  intervalMinutes: 15,
});

export const getWeekDates = (date: Date): Date[] => {
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

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatDateForStorage = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getWeekRange = (weekDates: Date[]): string => {
  const start = weekDates[0];
  const end = weekDates[4];
  return `${formatDate(start)} - ${formatDate(end)}, ${start.getFullYear()}`;
};

export const getEndTime = (
  startTime: string,
  duration: number,
  intervalMinutes = 15
): string => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + duration * intervalMinutes;
  const endHour = Math.floor(totalMinutes / 60);
  const endMinute = totalMinutes % 60;
  return `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
};

export const getDurationInHours = (
  duration: number,
  intervalMinutes = 15
): number => {
  return (duration * intervalMinutes) / 60;
};

export const formatTimeSlotDisplay = (
  timeSlot: string,
  intervalMinutes = 15
): string => {
  const [hours, minutes] = timeSlot.split(":").map(Number);
  const nextMinutes = minutes + intervalMinutes;
  const nextHours = nextMinutes >= 60 ? hours + 1 : hours;

  const adjustedNextMinutes =
    nextMinutes >= 60 ? nextMinutes - 60 : nextMinutes;

  const nextTime = `${nextHours.toString().padStart(2, "0")}:${adjustedNextMinutes.toString().padStart(2, "0")}`;
  return `${timeSlot}-${nextTime}`;
};

export const defaultAllowedDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export const getMaxDuration = (
  startTime: string,
  timeSlots: string[],
  intervalMinutes: number
) => {
  if (!startTime || !timeSlots.length) return 64; // Default to 16 hours if no constraints

  const startIndex = timeSlots.indexOf(startTime);
  if (startIndex === -1) return 64;

  // Calculate max slots until end of day
  const maxSlotsUntilEndOfDay = timeSlots.length - startIndex;

  // Calculate max slots until midnight (24:00)
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const startTimeInMinutes = startHour * 60 + startMinute;
  const minutesUntilMidnight = 24 * 60 - startTimeInMinutes;
  const maxSlotsUntilMidnight = Math.floor(
    minutesUntilMidnight / intervalMinutes
  );

  // Return the smaller of the two constraints
  return Math.min(maxSlotsUntilEndOfDay, maxSlotsUntilMidnight);
};

export const getDurationOptions = (
  startTime: string,
  timeSlots: string[],
  intervalMinutes: number
) => {
  const maxDuration = getMaxDuration(startTime, timeSlots, intervalMinutes);
  const options = [];

  for (let i = 1; i <= maxDuration; i++) {
    const hours = getDurationInHours(i, intervalMinutes);

    let label: string;
    if (hours < 1) {
      label = `${i * intervalMinutes} min`;
    } else if (hours === 1) {
      label = "1 hour";
    } else if (hours % 1 === 0) {
      label = `${hours} hours`;
    } else {
      const wholeHours = Math.floor(hours);
      const remainingMinutes = (hours - wholeHours) * 60;
      if (remainingMinutes === 30) {
        label = `${wholeHours}h 30m`;
      } else {
        label = `${wholeHours}h ${remainingMinutes}m`;
      }
    }

    options.push({ value: i, label });
  }

  return options;
};

export const getWorkWeekRange = (date: Date) => {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  const friday = addDays(monday, 4);

  const from = startOfDay(monday);
  const to = endOfDay(friday);

  return { from, to };
};

export const combineDateAndTime = (date: string, time: string): Date => {
  if (!date || !time) {
    throw new Error(`Invalid date/time: date='${date}', time='${time}'`);
  }

  const dateTimeString = `${date}T${time}`;
  const result = new Date(dateTimeString);

  if (isNaN(result.getTime())) {
    throw new Error(`Invalid Date constructed from "${dateTimeString}"`);
  }

  return result;
};

export const getDateRangeFromDates = (dates: Date[]): TimePeriod => {
  if (dates.length === 0) {
    throw new Error("Dates array cannot be empty");
  }

  const sortedDates = dates.slice().sort((a, b) => a.getTime() - b.getTime());

  const firstDay = sortedDates[0];
  const lastDay = sortedDates[sortedDates.length - 1];

  const from = new Date(firstDay);
  from.setHours(0, 0, 0, 0);

  const to = new Date(lastDay);
  to.setHours(23, 59, 59, 999);

  return { from, to };
};

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function formatEventTimeToLocal(eventDate: string, time: string) {
  const utcDate = new Date(`${eventDate}T${time}:00Z`);
  const zoned = toZonedTime(utcDate, userTimeZone);
  return format(zoned, "HH:mm");
}

export function convertLocalTimeSlotToUtc(date: string, timeSlot: string) {
  const localDate = new Date(`${date}T${timeSlot}:00`);
  const utcDate = fromZonedTime(localDate, userTimeZone);
  return utcDate.toISOString();
}
