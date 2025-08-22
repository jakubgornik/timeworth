import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const WorkEntriesSummaryCardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({ length: 2 }, (_, i) => (
      <Card key={i} className="bg-background border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-muted animate-pulse rounded w-24" />
          <div className="h-5 w-5 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-12 bg-muted animate-pulse rounded w-32" />
          <div className="space-y-2">
            <div className="h-4 bg-muted/60 animate-pulse rounded w-28" />
            <div className="h-6 bg-muted/60 animate-pulse rounded w-48" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
