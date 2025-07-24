import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Calendar, Plus, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  defaultAllowedDays,
  formatDateForStorage,
  getDurationOptions,
  getEndTime,
} from "../utils/timetable-utils";
import { useEffect, useMemo } from "react";
import { TimetableConfig, Event } from "../timetable.types";
import {
  createEventSchema,
  EventFormData,
} from "./validators/new-event.validation";
import { AnimatePresence } from "motion/react";
import FormInputError from "@/components/form-input-error";

interface NewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newEvent: Omit<Event, "id" | "color">;
  onCreateEvent: (eventData: Omit<Event, "id" | "color">) => void;
  intervalMinutes?: number;
  config?: TimetableConfig & { weekDates?: Date[] };
}

export function NewEventDialog({
  open,
  onOpenChange,
  newEvent,
  onCreateEvent,
  intervalMinutes = 15,
  config,
}: NewEventDialogProps) {
  const timeSlots = useMemo(() => config?.timeSlots || [], [config?.timeSlots]);
  const allowedDays = config?.daysOfWeek || defaultAllowedDays;

  const eventSchema = createEventSchema(
    timeSlots,
    intervalMinutes,
    allowedDays
  );

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      startTime: "",
      duration: 1,
      description: "",
    },
    mode: "onChange",
  });

  const watchedStartTime = watch("startTime");
  const watchedDuration = watch("duration");

  const calculatedEndTime = useMemo(() => {
    if (watchedStartTime && watchedDuration) {
      return getEndTime(watchedStartTime, watchedDuration, intervalMinutes);
    }
  }, [watchedStartTime, watchedDuration, intervalMinutes]);

  useEffect(() => {
    if (open && newEvent) {
      reset({
        title: newEvent.title || "",
        date: newEvent.date ? new Date(newEvent.date) : new Date(),
        startTime: newEvent.startTime || timeSlots[0] || "",
        duration: newEvent.duration || 1,
        description: newEvent.description || "",
      });
    }
  }, [open, newEvent, reset, timeSlots]);

  const onSubmit = (data: EventFormData) => {
    const endTime = getEndTime(data.startTime, data.duration, intervalMinutes);

    // timezone-safe date formatting
    const dateString = formatDateForStorage(data.date);

    const dayName = data.date.toLocaleDateString("en-US", { weekday: "long" });
    const eventDataPayload = {
      title: data.title,
      day: dayName,
      startTime: data.startTime,
      duration: data.duration,
      endTime: endTime,
      description: data.description || "",
      date: dateString,
    };

    onCreateEvent(eventDataPayload);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-secondary" />
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
            <Label>Event Date</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                        errors.date && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0  relative z-[99999]">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={isWeekend}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <AnimatePresence>
              {errors.date && <FormInputError message={errors.date.message} />}
            </AnimatePresence>
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
                      className={`w-full ${errors.startTime ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 relative z-[99999]">
                      {timeSlots.map((time) => (
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
                      className={`w-full ${errors.duration ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 relative z-[99999]">
                      {getDurationOptions(
                        watchedStartTime,
                        timeSlots,
                        intervalMinutes
                      ).map((option) => (
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
            <Input
              id="endTime"
              value={calculatedEndTime}
              disabled
              className="bg-muted text-muted-foreground"
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
