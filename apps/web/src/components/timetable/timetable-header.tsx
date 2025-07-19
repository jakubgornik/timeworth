"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface TimetableHeaderProps {
  weekRange: string;
  onNavigateWeek: (direction: "prev" | "next") => void;
  onAddEvent: () => void;
}

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
    <div className="bg-slate-800 text-slate-100 p-4 rounded-t-lg border-b border-slate-700">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold text-white">Timetable</h1>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              onClick={() => onNavigateWeek("prev")}
              className="text-slate-300 hover:text-white hover:bg-slate-700 p-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-medium px-4 text-white">
              {weekRange}
            </span>
            <Button
              size="sm"
              onClick={() => onNavigateWeek("next")}
              className="text-slate-300 hover:text-white hover:bg-slate-700 p-1"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={onAddEvent}
          size="sm"
          className="bg-teal-600 hover:bg-teal-700 text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>
    </div>
  );
}
