import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Calendar } from "lucide-react";
import { useState, useMemo } from "react";
import { UserSelector } from "../user-selector";
import { IWorkEntryDto } from "@packages/types";
import {
  AVAILABLE_YEARS,
  useCalendarData,
  useMonthPositions,
  useStatistics,
  useWeeksLayout,
} from "./work-entries-heatmap.utils";

import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useGetFilteredWorkEntries } from "@/hooks/work-entry/use-filtered-organization-work-entries";
import { WorkEntriesHeatmapLegend } from "./work-entries-heatmap-legend";
import { WorkEntriesStatisticsGrid } from "./work-entries-heatmap-statistics-grid";
import { WorkEntriesHeatmapMonthLabels } from "./work-entries-heatmap-month-labels";
import { WorkEntriesHeatmapGrid } from "./work-entries-heatmap-grid";
import { WorkEntriesHeatmapSkeleton } from "./work-entries-heatmap-skeleton";
import { YearSelector } from "../year-selector";

export function WorkEntriesHeatmapTab() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading } = useGetFilteredWorkEntries({
    filter: {
      type: "year",
      year: selectedYear,
    },
    managerId: currentUser?.id ?? "",
    selectedUserId,
  });
  const heatmapData: IWorkEntryDto[] = useMemo(() => data || [], [data]);
  const calendarData = useCalendarData(heatmapData, selectedYear, isLoading);
  const weeks = useWeeksLayout(calendarData, isLoading);
  const statisticsData = useStatistics(calendarData, isLoading);
  const monthPositions = useMonthPositions(weeks, selectedYear, isLoading);

  const calendarSection = useMemo(
    () => (
      <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
        <WorkEntriesHeatmapMonthLabels
          monthPositions={monthPositions}
          weeks={weeks}
        />
        <WorkEntriesHeatmapGrid weeks={weeks} />
      </div>
    ),
    [monthPositions, weeks]
  );

  return (
    <TooltipProvider
      delayDuration={0}
      skipDelayDuration={0}
      disableHoverableContent
    >
      <Card className="bg-background border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-chart-2" />
            Work Entries Heatmap
          </CardTitle>
          <div className="flex items-center gap-4">
            <UserSelector
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
            />
            <YearSelector
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              availableYears={AVAILABLE_YEARS}
              disabled={isLoading}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <WorkEntriesHeatmapSkeleton />
          ) : (
            <>
              <WorkEntriesStatisticsGrid statistics={statisticsData} />
              {calendarSection}
              <WorkEntriesHeatmapLegend />
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
