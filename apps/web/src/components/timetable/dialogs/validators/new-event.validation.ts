import { z } from "zod";

export const createEventSchema = (
  timeSlots: string[],
  intervalMinutes: number,
  allowedDays: string[]
) => {
  return z
    .object({
      title: z
        .string()
        .min(1, "Event title is required")
        .max(100, "Title must be less than 100 characters"),
      date: z.date({ required_error: "Date is required" }),
      startTime: z.string().min(1, "Start time is required"),
      duration: z.number().min(1, "Duration must be at least 15 minutes"),
      description: z.string().optional(),
    })
    .refine(
      (data) => {
        // Validate that the selected date is a weekday (Monday-Friday)
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const selectedDayName = dayNames[data.date.getDay()];
        return allowedDays.includes(selectedDayName);
      },
      {
        message: "Events can only be created for weekdays (Monday-Friday)",
        path: ["date"],
      }
    )
    .refine(
      (data) => {
        // Validate that the event doesn't exceed the day boundary
        const startIndex = timeSlots.indexOf(data.startTime);
        const maxDuration = timeSlots.length - startIndex;
        return data.duration <= maxDuration;
      },
      {
        message: "Event duration exceeds available time slots for the day",
        path: ["duration"],
      }
    )
    .refine(
      (data) => {
        // Validate ensure end time is within the same day
        const [startHour] = data.startTime.split(":").map(Number);
        const durationInMinutes = data.duration * intervalMinutes;
        const endTimeInMinutes =
          startHour * 60 +
          Number.parseInt(data.startTime.split(":")[1]) +
          durationInMinutes;
        const endHour = Math.floor(endTimeInMinutes / 60);
        return endHour < 24;
      },
      {
        message: "Event cannot extend beyond midnight",
        path: ["duration"],
      }
    );
};

export type EventFormData = z.infer<ReturnType<typeof createEventSchema>>;
