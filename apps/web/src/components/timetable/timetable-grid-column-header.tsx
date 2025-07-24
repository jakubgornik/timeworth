interface TimetableGridColumnHeaderProps {
  day: string;
  dayDate: Date;
  isToday: boolean;
}

export function TimetableGridColumnHeader({
  day,
  dayDate,
  isToday,
}: TimetableGridColumnHeaderProps) {
  return (
    <div className="sticky top-0 z-[50] text-center p-1 bg-accent border-b border-l min-w-[140px]">
      <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
        {day.slice(0, 2)}
      </div>
      <div
        className={`text-lg font-medium ${
          isToday
            ? "bg-secondary text-primary w-8 h-8 rounded-full flex items-center justify-center mx-auto"
            : "text-slate-200"
        }`}
      >
        {dayDate.getDate()}
      </div>
    </div>
  );
}
