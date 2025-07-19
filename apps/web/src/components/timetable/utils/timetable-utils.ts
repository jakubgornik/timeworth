import { TimetableConfig } from "../timetable.types";

export const generateTimeSlots = (
  startHour = 6,
  endHour = 22,
  intervalMinutes = 15
): string[] => {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour === endHour && minute > 0) break; // Stop at end hour
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
};

export const getDefaultConfig = (): TimetableConfig => ({
  timeSlots: generateTimeSlots(),
  daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  colors: [
    "bg-blue-600/80 border-blue-500 text-blue-100",
    "bg-green-600/80 border-green-500 text-green-100",
    "bg-purple-600/80 border-purple-500 text-purple-100",
    "bg-orange-600/80 border-orange-500 text-orange-100",
    "bg-pink-600/80 border-pink-500 text-pink-100",
    "bg-indigo-600/80 border-indigo-500 text-indigo-100",
    "bg-teal-600/80 border-teal-500 text-teal-100",
    "bg-red-600/80 border-red-500 text-red-100",
    "bg-yellow-600/80 border-yellow-500 text-yellow-100",
    "bg-cyan-600/80 border-cyan-500 text-cyan-100",
  ],
  startHour: 6,
  endHour: 22,
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
  return date.toISOString().split("T")[0];
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
    nextMinutes >= 60 ? nextMinutes - intervalMinutes : nextMinutes;

  const nextTime = `${nextHours.toString().padStart(2, "0")}:${adjustedNextMinutes.toString().padStart(2, "0")}`;
  return `${timeSlot}-${nextTime}`;
};
