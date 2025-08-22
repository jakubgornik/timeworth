import { IWorkEntryDtoWithUser } from "@packages/types";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface Activity {
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

export const mapToActivities = (entries: IWorkEntryDtoWithUser[]) => {
  if (!entries || entries.length === 0) return [];

  const activities: Activity[] = [];
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const todayEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const todayEntries = entries
    .filter((entry) => {
      const entryDate = new Date(entry.endedAt);
      return entryDate >= todayStart && entryDate < todayEnd;
    })
    .sort(
      (a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime()
    );

  todayEntries.forEach((entry) => {
    const hoursWorked = entry.hoursWorked;
    let activityType = "work";
    let icon = Clock;
    let color = "text-chart-1";
    let bgColor = "bg-chart-1/10";

    if (hoursWorked > 6) {
      activityType = "milestone";
      icon = CheckCircle;
      color = "text-chart-2";
      bgColor = "bg-chart-2/10";
    } else if (hoursWorked < 2) {
      activityType = "quick";
      icon = AlertCircle;
      color = "text-chart-3";
      bgColor = "bg-chart-3/10";
    }

    activities.push({
      id: entry.id,
      type: activityType,
      icon,
      color,
      bgColor,
      title: entry.title,
      description: `${hoursWorked.toFixed(1)} hours logged`,
      timestamp: new Date(entry.endedAt),
      user: `Employee ${entry.user.name}`,
      startTime: new Date(entry.startedAt),
      endTime: new Date(entry.endedAt),
    });
  });

  return activities;
};

export const getActivityTypeLabel = (type: string) => {
  switch (type) {
    case "milestone":
      return "Long Session";
    case "quick":
      return "Quick Task";
    default:
      return "Work Session";
  }
};
