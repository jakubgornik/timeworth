import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";
import { WorkEntriesActivityItem } from "./work-entries-today-activity-list-item";

export interface Activity {
  id: string;
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  startTime: Date;
  endTime: Date;
}

interface WorkEntriesTodayActivityListProps {
  activities: Activity[];
}

export function WorkEntriesTodayActivityList({
  activities,
}: WorkEntriesTodayActivityListProps) {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <WorkEntriesActivityItem key={activity.id} activity={activity} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No activity today</p>
            <p className="text-sm">
              Today's work activity will appear here as it's logged
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
