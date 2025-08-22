interface WorkEntriesTodayFooterProps {
  activityCount: number;
}

export function WorkEntriesTodayFooter({
  activityCount,
}: WorkEntriesTodayFooterProps) {
  return (
    <div className="mt-6 pt-4 border-t border-border">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {activityCount} activities from today</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-chart-2 rounded-full" />
            <span>Long Sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-chart-1 rounded-full" />
            <span>Regular Work</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-chart-3 rounded-full" />
            <span>Quick Tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
