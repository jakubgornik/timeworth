import { cn } from "@/lib/utils";
import { AnimatedNumber } from "../../animated-number";

export interface TrendStats {
  direction: string;
  change: number;
  icon: React.ComponentType<{ className: string }>;
  colorClass: string;
  averageHours: number;
  maxHours: number;
  minHours: number;
}

interface TrendIndicatorProps {
  trendStats: TrendStats;
}

export const WorkEntriesTrendIndicator = ({
  trendStats,
}: TrendIndicatorProps) => {
  const absChange = Math.abs(trendStats.change);
  const trendSymbol =
    trendStats.change > 0 ? "↑" : trendStats.change < 0 ? "↓" : "→";

  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs">Trend Direction</span>
      <div className="flex items-center gap-1 text-xl font-bold text-foreground">
        <span
          className={cn(
            "transition-colors duration-300",
            trendStats.colorClass
          )}
        >
          {trendSymbol}
        </span>
        <AnimatedNumber
          value={absChange}
          suffix="%"
          decimalPlaces={1}
          duration={350}
        />
      </div>
      <p
        className={cn(
          "text-xs mt-1 transition-colors duration-300",
          trendStats.colorClass
        )}
      >
        {trendStats.direction}
      </p>
    </div>
  );
};
