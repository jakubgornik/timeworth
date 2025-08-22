import { useState, useMemo } from "react";
import { useGetFilteredWorkEntries } from "@/hooks/work-entry/use-filtered-organization-work-entries";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { WorkEntriesChartCard } from "./work-entries-chart-card";
import { DatePickerWithRange } from "../../date-picker-with-range";
import { UserSelector } from "../../user-selector";
import { WorkEntriesSummaryCard } from "../work-entries-summary-card/work-entries-summary-card";
import { WorkEntriesTrendCard } from "../work-entries-trend-card/work-entries-trend-card";
import { DEFAULT_DATE_RANGE } from "./work-entries-chart.utils";

export function WorkEntriesChartTab() {
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );

  const { data: currentUser } = useCurrentUser();
  const { data, isLoading } = useGetFilteredWorkEntries({
    filter: {
      type: "dateRange",
      from: dateRange.from,
      to: dateRange.to,
    },
    managerId: currentUser?.id ?? "",
    selectedUserId,
  });
  const chartData = useMemo(() => data || [], [data]);

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center  gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn">
          <DatePickerWithRange
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <UserSelector
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        </div>
      </div>
      <WorkEntriesSummaryCard
        data={chartData}
        dateRange={dateRange}
        isLoading={isLoading}
      />
      <WorkEntriesTrendCard data={chartData} isLoading={isLoading} />
      <WorkEntriesChartCard data={chartData} isLoading={isLoading} />
    </>
  );
}
