import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterChipProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function FilterChip({
  label,
  value,
  onChange,
  onRemove,
}: FilterChipProps) {
  const [inputValue, setInputValue] = useState(value);

  const debouncedChange = useDebouncedCallback((val: string) => {
    onChange(val);
  }, 400);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedChange(val);
  };

  return (
    <div className="flex items-center gap-0 border rounded-lg bg-background shadow-sm overflow-hidden h-10">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-r">
        <Badge variant="outline" className="text-xs font-medium bg-background">
          {label}
        </Badge>
        <div className="w-px h-4 bg-border" />
        <span className="text-xs text-muted-foreground font-medium">
          contains
        </span>
      </div>
      <Input
        placeholder="Enter value..."
        value={inputValue}
        onChange={handleInputChange}
        className="h-10 w-30 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
      />
      <Button
        size="sm"
        variant="outline"
        onClick={onRemove}
        className="h-10 w-10 p-0 border-l hover:bg-destructive/10 hover:text-destructive rounded-none"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
