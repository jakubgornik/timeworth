import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const WorkEntriesTrendCardSkeleton = () => (
  <Card className="w-full bg-background border-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 bg-muted animate-pulse rounded w-40" />
      <div className="h-5 w-5 bg-muted animate-pulse rounded" />
    </CardHeader>
    <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col space-y-2">
          <div className="h-3 bg-muted/60 animate-pulse rounded w-20" />
          <div className="h-8 bg-muted animate-pulse rounded w-16" />
          <div className="h-3 bg-muted/60 animate-pulse rounded w-24" />
        </div>
      ))}
    </CardContent>
  </Card>
);
