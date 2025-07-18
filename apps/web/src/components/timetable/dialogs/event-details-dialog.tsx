"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Trash2 } from "lucide-react";

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

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onDeleteEvent: (eventId: string) => void;
}

export function EventDetailsDialog({
  open,
  onOpenChange,
  event,
  onDeleteEvent,
}: EventDetailsDialogProps) {
  if (!event) return null;

  // Calculate duration in hours (duration is in 15-minute slots)
  const durationInHours = (event.duration * 15) / 60;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-5 h-5 text-primary" />
            Event Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {event.title}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Date:</span>
                <Badge variant="outline" className="bg-background">
                  {event.day}, {new Date(event.date).toLocaleDateString()}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Time:</span>
                <Badge variant="outline" className="bg-background">
                  {event.startTime} - {event.endTime}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">
                  Duration:
                </span>
                <Badge variant="outline" className="bg-background">
                  {durationInHours} hour{durationInHours !== 1 ? "s" : ""}
                </Badge>
              </div>
              {event.description && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Description:
                  </span>
                  <p className="text-foreground mt-1 p-2 bg-background rounded border border-border">
                    {event.description}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                onDeleteEvent(event.id);
                onOpenChange(false);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
