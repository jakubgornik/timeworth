import { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function ExpandableSearch({
  value,
  onChange,
  onClear,
  placeholder,
}: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  const handleCollapse = () => {
    if (!value) {
      setIsExpanded(false);
    }
  };

  const handleClear = () => {
    onClear();
    setIsExpanded(false);
  };

  return (
    <div
      className={`relative flex items-center rounded-lg border bg-background hover:bg-accent group duration-300 transition-all ease-out overflow-hidden h-10 ${
        isExpanded ? "w-50 shadow-md bg-accent" : "w-10 cursor-pointer"
      }`}
      onClick={!isExpanded ? handleExpand : undefined}
    >
      <div className="flex items-center justify-center w-10 h-10 shrink-0">
        <Search
          className={`h-4 w-4 duration-300 ${
            isExpanded
              ? "text-secondary"
              : "text-muted-foreground group-hover:text-secondary"
          }`}
        />
      </div>

      <div className={`transition-all duration-300 ease-out`}>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={handleCollapse}
          className="border-0 bg-background focus-visible:ring-0 focus-visible:ring-offset-0 h-10 pl-0 px-2"
        />
      </div>

      {value && isExpanded && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleClear}
          className="h-10 w-10 p-0 border-l hover:bg-destructive/10 hover:text-destructive rounded-none"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
