import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Activity } from "lucide-react";

export const WorkEntriesTodaySkeleton = () => (
  <Card className="bg-card border-border overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
      <div className="flex items-center gap-3">
        <Activity className="h-6 w-6 text-chart-2" />
        <div className="h-6 bg-muted animate-pulse rounded w-32"></div>
      </div>
      <div className="h-6 bg-muted animate-pulse rounded w-16"></div>
    </CardHeader>
    <CardContent>
      <div className="h-[500px] space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 rounded-xl border border-border"
          >
            <div className="w-10 h-10 bg-muted animate-pulse rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-muted animate-pulse rounded w-48"></div>
              <div className="h-4 bg-muted/60 animate-pulse rounded w-32"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-muted/60 animate-pulse rounded w-20"></div>
                <div className="h-3 bg-muted/60 animate-pulse rounded w-24"></div>
                <div className="h-3 bg-muted/60 animate-pulse rounded w-16"></div>
              </div>
            </div>
            <div className="w-16 h-12 bg-muted animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
