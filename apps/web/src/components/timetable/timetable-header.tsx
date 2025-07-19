import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface TimetableHeaderProps {
  weekRange: string;
  onNavigateWeek: (direction: "prev" | "next") => void;
  onAddEvent: () => void;
}

export function TimetableHeader({
  weekRange,
  onNavigateWeek,
  onAddEvent,
}: TimetableHeaderProps) {
  return (
    <div className="bg-accent text-secondary p-4 rounded-t-lg border-b ">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold text-secondary">Timetable</h1>
          <div className="flex items-center gap-1">
            <Button size="sm" onClick={() => onNavigateWeek("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-medium px-4 text-secondary">
              {weekRange}
            </span>
            <Button size="sm" onClick={() => onNavigateWeek("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button onClick={onAddEvent} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>
    </div>
  );
}
