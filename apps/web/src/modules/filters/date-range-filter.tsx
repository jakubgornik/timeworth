import { useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  label: string;
  value?: DateRange;
  onChange: (value?: DateRange) => void;
  onRemove: () => void;
}

export function DateRangeFilter({
  label,
  value,
  onChange,
  onRemove,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState<DateRange | undefined>(value);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleDateChange = (dateRange?: DateRange) => {
    setTempValue(dateRange);
    if (!dateRange?.from) {
      setIsSelecting(false);
      return;
    }
    if (!dateRange.to || dateRange.from.getTime() === dateRange.to.getTime()) {
      setIsSelecting(true);
      return;
    }
    setIsSelecting(false);
    onChange(dateRange);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      if (isSelecting && tempValue?.from) {
        const finalValue = tempValue.to
          ? tempValue
          : {
              from: tempValue.from,
              to: tempValue.from,
            };
        onChange(finalValue);
      } else if (
        tempValue?.from &&
        tempValue?.to &&
        tempValue.from.getTime() !== tempValue.to.getTime()
      ) {
        onChange(tempValue);
      }
      setIsSelecting(false);
    } else {
      setTempValue(value);
      setIsSelecting(false);
    }
  };

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) return "Pick dates";
    if (!dateRange.to || dateRange.from.getTime() === dateRange.to.getTime()) {
      return format(dateRange.from, "dd/MM/yyyy");
    }
    return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;
  };

  return (
    <div className="flex items-center gap-0 border rounded-lg bg-background shadow-sm overflow-hidden h-10">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-r">
        <Badge variant="outline" className="text-xs font-medium bg-background">
          {label}
        </Badge>
        <div className="w-px h-4 bg-border" />
        <span className="text-xs text-muted-foreground font-medium">
          between
        </span>
      </div>

      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "h-10 justify-start text-left font-normal border-0 bg-transparent hover:bg-muted/50 rounded-none",
              isSelecting && "bg-muted/50"
            )}
          >
            <CalendarIcon className="text-muted-foreground mr-1 h-4 w-4" />
            <span
              className={cn(
                "text-sm",
                (!value?.from && !tempValue?.from) ||
                  formatDateRange(isOpen ? tempValue : value) === "Pick dates"
                  ? "text-muted-foreground"
                  : "text-secondary"
              )}
            >
              {formatDateRange(isOpen ? tempValue : value)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={tempValue?.from || value?.from}
            selected={tempValue}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
          {isSelecting && (
            <div className="p-3 border-t text-xs text-muted-foreground text-center">
              Select end date or click outside to apply single date
            </div>
          )}
        </PopoverContent>
      </Popover>
      <Button
        size="sm"
        variant="outline"
        onClick={onRemove}
        className="h-10 w-10 p-0 border-l hover:bg-destructive/10 hover:text-destructive rounded-none"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
