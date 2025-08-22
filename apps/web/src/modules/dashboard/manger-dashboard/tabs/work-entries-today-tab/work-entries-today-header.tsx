import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function WorkEntriesTodayHeader() {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
      <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
        <Activity className="h-6 w-6 text-chart-2" />
        Today's Activity
      </CardTitle>
      <Badge
        variant="outline"
        className="text-chart-2 border-chart-2/30 px-3 py-1"
      >
        <div className="w-2 h-2 bg-chart-2 rounded-full mr-2 animate-pulse" />
        Live
      </Badge>
    </CardHeader>
  );
}
