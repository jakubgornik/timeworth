import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isValid, subMonths } from "date-fns";
import type { DateRange as DateRangeType } from "react-day-picker";

export interface DateRange {
  from: Date;
  to: Date;
}

interface DatePickerWithRangeProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  className?: string;
}

const presets = [
  {
    label: "Last 30 days",
    range: {
      from: subMonths(new Date(), 1),
      to: new Date(),
    },
  },
  {
    label: "Last 3 months",
    range: {
      from: subMonths(new Date(), 3),
      to: new Date(),
    },
  },
  {
    label: "Last 6 months",
    range: {
      from: subMonths(new Date(), 6),
      to: new Date(),
    },
  },
];

export function DatePickerWithRange({
  dateRange,
  setDateRange,
}: DatePickerWithRangeProps) {
  const isValidDateRange = (
    range: DateRangeType | undefined
  ): range is { from: Date; to: Date } => {
    return !!(
      range?.from &&
      range?.to &&
      isValid(range.from) &&
      isValid(range.to)
    );
  };

  const handleDateSelect = (range: DateRangeType | undefined) => {
    if (isValidDateRange(range)) {
      setDateRange({ from: range.from, to: range.to });
    } else if (range?.from && isValid(range.from)) {
      setDateRange({ from: range.from, to: range.from });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="justify-start text-left font-normal bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            {dateRange?.from && dateRange?.to ? (
              <>
                {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                {format(dateRange.to, "dd/MM/yyyy")}
              </>
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-popover border-border text-popover-foreground rounded-lg shadow-xl"
          align="start"
        >
          <div className="flex">
            <div className="flex flex-col gap-1 p-4 border-r border-border min-w-[140px]">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Quick Select
              </div>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-8 text-foreground hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
                  onClick={() => setDateRange(preset.range)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="p-4">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={handleDateSelect}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
