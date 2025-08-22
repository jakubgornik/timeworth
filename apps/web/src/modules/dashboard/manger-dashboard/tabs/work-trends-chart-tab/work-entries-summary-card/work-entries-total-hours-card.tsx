import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { AnimatedNumber } from "../../animated-number";

interface WorkEntriesTotalHoursCardProps {
  totalHours: number;
  formattedDateRange: string;
}

export const WorkEntriesTotalHoursCard = ({
  totalHours,
  formattedDateRange,
}: WorkEntriesTotalHoursCardProps) => (
  <Card className="bg-background border-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        Total Hours
      </CardTitle>
      <Clock className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="text-4xl font-bold text-foreground">
        <AnimatedNumber value={totalHours} suffix="h" decimalPlaces={1} />
      </div>
      <div className="space-y-1">
        <p className="text-base text-muted-foreground font-medium">
          Selected period
        </p>
        <div className="text-xl font-semibold text-secondary leading-tight">
          {formattedDateRange}
        </div>
      </div>
    </CardContent>
  </Card>
);
