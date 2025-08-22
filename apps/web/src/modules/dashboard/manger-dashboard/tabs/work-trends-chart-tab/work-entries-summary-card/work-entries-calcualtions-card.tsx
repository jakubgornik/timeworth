import { Input } from "@/components/ui/input";
import { Currency, CurrencySelector } from "../../currency-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { AnimatedNumber } from "../../animated-number";

interface RateConfigurationProps {
  totalHours: number;
  hourlyRate: number;
  selectedCurrency: Currency;
  onRateChange: (value: string) => void;
  onCurrencyChange: (currency: Currency) => void;
}

const RateConfiguration = ({
  totalHours,
  hourlyRate,
  selectedCurrency,
  onRateChange,
  onCurrencyChange,
}: RateConfigurationProps) => (
  <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg border border-border/50 max-w-md">
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <span className="font-medium">{totalHours.toFixed(1)}h</span>
      <span>x</span>
    </div>
    <CurrencySelector
      selectedCurrency={selectedCurrency}
      onSelectCurrency={onCurrencyChange}
    />
    <Input
      type="number"
      value={hourlyRate}
      onChange={(e) => onRateChange(e.target.value)}
      className="w-20 bg-accent border-border text-foreground text-center font-semibold focus:border-chart-2 focus:ring-chart-2 transition-all duration-300"
    />
    <div className="text-sm text-muted-foreground">
      <span>/hour</span>
    </div>
  </div>
);

interface WorkEntriesCalculationCardProps {
  estimatedEarnings: number;
  totalHours: number;
  hourlyRate: number;
  selectedCurrency: Currency;
  onRateChange: (value: string) => void;
  onCurrencyChange: (currency: Currency) => void;
}

export const WorkEntriesCalculationCard = ({
  estimatedEarnings,
  totalHours,
  hourlyRate,
  selectedCurrency,
  onRateChange,
  onCurrencyChange,
}: WorkEntriesCalculationCardProps) => {
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card className="bg-background border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Estimated Earnings
        </CardTitle>
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-bold text-chart-2">
          <AnimatedNumber
            value={estimatedEarnings}
            suffix={selectedCurrency.symbol}
            decimalPlaces={2}
            formatter={formatCurrency}
          />
        </div>
        <RateConfiguration
          totalHours={totalHours}
          hourlyRate={hourlyRate}
          selectedCurrency={selectedCurrency}
          onRateChange={onRateChange}
          onCurrencyChange={onCurrencyChange}
        />
        <p className="text-xs text-muted-foreground">
          Calculated based on total hours and hourly rate in{" "}
          {selectedCurrency.name}
        </p>
      </CardContent>
    </Card>
  );
};
