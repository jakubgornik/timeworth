import { AnimatedNumber } from "../../animated-number";
import { formatHoursAndMinutes } from "../work-entries-chart-card/work-entries-chart.utils";

interface WorkEntriesTrendStatProps {
  label: string;
  value: number;
  description: string;
  className?: string;
}

export const WorkEntriesTrendStat = ({
  label,
  value,
  description,
}: WorkEntriesTrendStatProps) => (
  <div className="flex flex-col">
    <span className="text-muted-foreground text-xs">{label}</span>
    <span className="text-lg font-bold text-foreground">
      <AnimatedNumber
        value={value}
        formatter={formatHoursAndMinutes}
        duration={350}
      />
    </span>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </div>
);
