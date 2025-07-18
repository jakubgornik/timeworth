import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus, AlertCircle } from "lucide-react";
import { getDurationInHours, getEndTime } from "../utils/timetable-utils";
import { useEffect } from "react";

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

interface TimetableConfig {
  timeSlots: string[];
  daysOfWeek: string[];
  colors: string[];
  startHour?: number;
  endHour?: number;
  intervalMinutes?: number;
}

interface NewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newEvent: Omit<Event, "id" | "color">;
  onCreateEvent: (eventData: Omit<Event, "id" | "color">) => void;
  intervalMinutes?: number;
  config?: TimetableConfig & { weekDates?: Date[] };
}

// Create validation schema
const createEventSchema = (timeSlots: string[], intervalMinutes: number) => {
  return z
    .object({
      title: z
        .string()
        .min(1, "Event title is required")
        .max(100, "Title must be less than 100 characters"),
      day: z.string().min(1, "Day is required"),
      startTime: z.string().min(1, "Start time is required"),
      duration: z.number().min(1, "Duration must be at least 15 minutes"),
      endTime: z.string(),
      description: z.string().optional(),
      date: z.string(),
    })
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
        // Additional validation: ensure end time is within the same day
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

type EventFormData = z.infer<ReturnType<typeof createEventSchema>>;

export function NewEventDialog({
  open,
  onOpenChange,
  newEvent,
  onCreateEvent,
  intervalMinutes = 15,
  config,
}: NewEventDialogProps) {
  const timeSlots = config?.timeSlots || [];

  const eventSchema = createEventSchema(timeSlots, intervalMinutes);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      day: "",
      startTime: "",
      duration: 1,
      endTime: "",
      description: "",
      date: "",
    },
    mode: "onChange",
  });

  // Watch for changes to recalculate end time
  const watchedStartTime = watch("startTime");
  const watchedDuration = watch("duration");

  // Update form when newEvent prop changes (from parent component)
  useEffect(() => {
    if (open && newEvent) {
      reset({
        title: newEvent.title || "",
        day: newEvent.day || "",
        startTime: newEvent.startTime || "",
        duration: newEvent.duration || 1,
        endTime: newEvent.endTime || "",
        description: newEvent.description || "",
        date: newEvent.date || "",
      });
    }
  }, [open, newEvent, reset]);

  // Recalculate end time when start time or duration changes
  useEffect(() => {
    if (watchedStartTime && watchedDuration) {
      const endTime = getEndTime(
        watchedStartTime,
        watchedDuration,
        intervalMinutes
      );
      setValue("endTime", endTime, { shouldValidate: false });
    }
  }, [watchedStartTime, watchedDuration, setValue, intervalMinutes]);

  // Calculate maximum duration based on selected start time
  const getMaxDuration = (startTime: string) => {
    if (!startTime || !timeSlots.length) return 32; // 8 hours default

    const startIndex = timeSlots.indexOf(startTime);
    if (startIndex === -1) return 32;

    const maxSlots = timeSlots.length - startIndex;
    return Math.min(maxSlots, 32); // Max 8 hours or until end of day
  };

  // Generate duration options based on start time
  const getDurationOptions = (startTime: string) => {
    const maxDuration = getMaxDuration(startTime);
    const options = [];

    for (let i = 1; i <= maxDuration; i++) {
      const hours = getDurationInHours(i, intervalMinutes);
      const label =
        hours < 1
          ? `${i * intervalMinutes} min`
          : hours === 1
            ? "1 hour"
            : `${hours} hours`;
      options.push({ value: i, label });
    }

    return options;
  };

  const onSubmit = (data: EventFormData) => {
    // Call the parent's create event function with the form data
    onCreateEvent({
      title: data.title,
      day: data.day,
      startTime: data.startTime,
      duration: data.duration,
      endTime: data.endTime,
      description: data.description || "",
      date: data.date,
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-primary" />
            Create New Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="Enter event title"
                  className={errors.title ? "border-red-500" : ""}
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="selectedDay">Selected Day</Label>
            <Controller
              name="day"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="selectedDay"
                  disabled
                  className="bg-muted text-muted-foreground"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={errors.startTime ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 relative z-[9999]">
                      {timeSlots.map((time: string) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.startTime && (
                <p className="text-sm text-red-500">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) =>
                      field.onChange(Number.parseInt(value))
                    }
                  >
                    <SelectTrigger
                      className={errors.duration ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 relative z-[9999]">
                      {getDurationOptions(watchedStartTime).map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">
                  {errors.duration.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time (Calculated)</Label>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="endTime"
                  disabled
                  className="bg-muted text-muted-foreground"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Add event details"
                  rows={3}
                />
              )}
            />
          </div>

          {/* Show validation errors */}
          {(errors.duration?.message?.includes("exceeds") ||
            errors.duration?.message?.includes("midnight")) && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">
                {errors.duration.message}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
