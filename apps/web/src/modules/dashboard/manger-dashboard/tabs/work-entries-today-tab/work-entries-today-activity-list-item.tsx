import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { getActivityTypeLabel } from "./work-entries-today.utils";
import { Activity } from "./work-entries-today-activity-list";

interface WorkEntriesActivityItemProps {
  activity: Activity;
}

export function WorkEntriesActivityItem({
  activity,
}: WorkEntriesActivityItemProps) {
  return (
    <div className="group relative flex items-start gap-4 p-4 rounded-xl hover:bg-accent/30 transition-all duration-200 border border-border hover:border-border/80">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center`}
      >
        <activity.icon className={`h-5 w-5 ${activity.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold text-foreground text-lg group-hover:text-foreground transition-colors">
                {activity.title}
              </h4>
              <Badge
                variant="secondary"
                className={`text-xs ${activity.bgColor} ${activity.color} border-0`}
              >
                {getActivityTypeLabel(activity.type)}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              {activity.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{activity.user}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(activity.startTime, "MMM dd, HH:mm")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(activity.timestamp, {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">
                {activity.description.split(" ")[0]}
              </div>
              <div className="text-xs text-muted-foreground">hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
