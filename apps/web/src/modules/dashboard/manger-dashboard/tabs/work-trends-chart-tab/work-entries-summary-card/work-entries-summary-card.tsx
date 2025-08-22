import { useState, useMemo } from "react";
import { format } from "date-fns";
import { IWorkEntryDto } from "@packages/types";
import { WorkEntriesCalculationCard } from "./work-entries-calcualtions-card";
import { WorkEntriesTotalHoursCard } from "./work-entries-total-hours-card";
import { WorkEntriesSummaryCardSkeleton } from "./work-entries-summary-card-skeleton";
import { DateRange } from "../../date-picker-with-range";
import { Currency } from "../../currency-selector";

const DEFAULT_CURRENCY: Currency = {
  code: "USD",
  symbol: "$",
  name: "US Dollar",
};
const DEFAULT_HOURLY_RATE = 50;

const useDateRangeFormat = (dateRange: DateRange) => {
  return useMemo(() => {
    if (!dateRange.from || !dateRange.to) {
      return "Select a period";
    }

    const isSameYear =
      dateRange.from.getFullYear() === dateRange.to.getFullYear();

    return `${format(dateRange.from, isSameYear ? "dd MMM" : "dd MMM, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
  }, [dateRange.from, dateRange.to]);
};

interface WorkEntriesSummaryCardProps {
  data: IWorkEntryDto[];
  dateRange: DateRange;
  isLoading: boolean;
}

export function WorkEntriesSummaryCard({
  data,
  dateRange,
  isLoading,
}: WorkEntriesSummaryCardProps) {
  const [hourlyRate, setHourlyRate] = useState<number>(DEFAULT_HOURLY_RATE);
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currency>(DEFAULT_CURRENCY);

  const totalHours = useMemo(() => {
    return data.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  }, [data]);

  const estimatedEarnings = useMemo(() => {
    return totalHours * hourlyRate;
  }, [totalHours, hourlyRate]);

  const formattedDateRange = useDateRangeFormat(dateRange);

  const handleRateChange = (value: string) => {
    const numericValue = Number.parseFloat(value) || 0;
    setHourlyRate(numericValue);
  };

  if (isLoading) {
    return <WorkEntriesSummaryCardSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WorkEntriesTotalHoursCard
        totalHours={totalHours}
        formattedDateRange={formattedDateRange}
      />
      <WorkEntriesCalculationCard
        totalHours={totalHours}
        hourlyRate={hourlyRate}
        selectedCurrency={selectedCurrency}
        estimatedEarnings={estimatedEarnings}
        onCurrencyChange={setSelectedCurrency}
        onRateChange={handleRateChange}
      />
    </div>
  );
}
