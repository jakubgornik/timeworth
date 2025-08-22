import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IWorkEntryDto } from "@packages/types";
import { useMonthlyTrendData } from "./work-entries-trend-card.utils";
import { WorkEntriesTrendCardSkeleton } from "./work-entries-trend-card-skeleton";
import { WorkEntriesTrendIndicator } from "./work-entries-trend-indicator";
import { WorkEntriesTrendStat } from "./work-entries-trend-stat";

interface WorkEntriesTrendCardProps {
  data: IWorkEntryDto[];
  isLoading: boolean;
}

export function WorkEntriesTrendCard({
  data,
  isLoading,
}: WorkEntriesTrendCardProps) {
  const { trendStats } = useMonthlyTrendData(data);

  if (isLoading) {
    return <WorkEntriesTrendCardSkeleton />;
  }

  const TrendIcon = trendStats.icon;

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Overall Trend Analysis
        </CardTitle>
        <TrendIcon className="h-5 w-5 transition-colors duration-300 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        <WorkEntriesTrendIndicator trendStats={trendStats} />
        <WorkEntriesTrendStat
          label="Average Monthly"
          value={trendStats.averageHours}
          description="Selected period"
        />
        <WorkEntriesTrendStat
          label="Highest Monthly"
          value={trendStats.maxHours}
          description="Peak performance"
        />
        <WorkEntriesTrendStat
          label="Lowest Monthly"
          value={trendStats.minHours}
          description="Lowest point"
        />
      </CardContent>
    </Card>
  );
}
