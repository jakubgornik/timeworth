import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IWorkEntryDto } from "@packages/types";
import { Loader2 } from "lucide-react";
import { WorkEntriesComposedChart } from "./work-entries-chart";

interface WorkEntriesChartCardProps {
  data: IWorkEntryDto[];
  isLoading: boolean;
}

export function WorkEntriesChartCard({
  data,
  isLoading,
}: WorkEntriesChartCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-background border-border">
        <CardHeader>
          <div className="space-y-2">
            <div className="h-8 bg-muted animate-pulse rounded w-48"></div>
            <div className="h-4 bg-muted/60 animate-pulse rounded w-64"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground">
          Work Entries Trends
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Total hours worked over time with trend analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WorkEntriesComposedChart data={data} />
      </CardContent>
    </Card>
  );
}
