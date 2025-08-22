import { Card, CardContent } from "@/components/ui/card";
import { startOfDay, endOfDay } from "date-fns";
import { useMemo } from "react";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useGetFilteredWorkEntries } from "@/hooks/work-entry/use-filtered-organization-work-entries";
import { mapToActivities } from "./work-entries-today.utils";
import { WorkEntriesTodaySkeleton } from "./work-entries-today-skeleton";
import { WorkEntriesTodayFooter } from "./work-entries-today-footer";
import { WorkEntriesTodayHeader } from "./work-entries-today-header";
import { WorkEntriesTodayActivityList } from "./work-entries-today-activity-list";

export function WorkEntriesTodayTab() {
  const todayRange = useMemo(
    () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
    []
  );

  const { data: currentUser } = useCurrentUser();
  const { data, isLoading } = useGetFilteredWorkEntries({
    filter: {
      type: "dateRange",
      from: todayRange.from,
      to: todayRange.to,
    },
    managerId: currentUser?.id ?? "",
  });

  const entries = useMemo(() => data || [], [data]);
  const activities = mapToActivities(entries);

  if (isLoading) {
    return <WorkEntriesTodaySkeleton />;
  }

  return (
    <Card className="bg-background border-border">
      <WorkEntriesTodayHeader />
      <CardContent>
        <WorkEntriesTodayActivityList activities={activities} />
        {activities.length > 0 && (
          <WorkEntriesTodayFooter activityCount={activities.length} />
        )}
      </CardContent>
    </Card>
  );
}
