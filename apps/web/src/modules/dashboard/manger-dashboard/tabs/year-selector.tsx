import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  availableYears: readonly number[];
  disabled?: boolean;
  className?: string;
}

export function YearSelector({
  selectedYear,
  onYearChange,
  availableYears,
  disabled = false,
}: YearSelectorProps) {
  return (
    <Select
      value={selectedYear.toString()}
      onValueChange={(value) => onYearChange(Number(value))}
      disabled={disabled}
    >
      <SelectTrigger className="w-[120px] bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg disabled:opacity-50">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border text-popover-foreground rounded-lg shadow-xl">
        {availableYears.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
