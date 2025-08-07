"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { SelectOption } from "./filters.types";

interface MultiselectFilterProps {
  id: string;
  label: string;
  value: string[];
  loader?: () => Promise<SelectOption[] | undefined>;
  onChange: (value: string[]) => void;
  onRemove: () => void;
  placeholder?: string;
}

export function MultiselectFilter({
  label,
  value,
  loader,
  onChange,
  onRemove,
  placeholder = "Select options...",
}: MultiselectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (loader) {
      loader()
        .then((result) => {
          if (result) {
            setOptions(result);
          }
        })
        .catch(console.error);
    }
  }, [loader]);

  const safeValue = Array.isArray(value) ? value : [];

  const handleSelect = (optionValue: string) => {
    const newValue = safeValue.includes(optionValue)
      ? safeValue.filter((v) => v !== optionValue)
      : [...safeValue, optionValue];

    onChange(newValue);
  };

  const getDisplayText = () => {
    if (safeValue.length === 0) return placeholder;
    if (safeValue.length === 1) {
      const option = options.find((opt) => opt.value === safeValue[0]);
      return option?.label || safeValue[0];
    }
    return `${safeValue.length} selected`;
  };

  return (
    <div className="flex items-center gap-0 border rounded-lg bg-background shadow-sm overflow-hidden h-10">
      <div className="flex items-center gap-2 px-3 py-2 bg-background border-r">
        <Badge variant="outline" className="text-xs font-medium bg-background">
          {label}
        </Badge>
        <div className="w-px h-4 bg-border" />
        <span className="text-xs text-muted-foreground font-medium">
          contains
        </span>
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-40 justify-between border-0 bg-background focus-visible:ring-0 focus-visible:ring-offset-0 text-sm rounded-none hover:bg-muted/50"
          >
            <span
              className={cn(
                "truncate",
                value.length === 0 && "text-muted-foreground"
              )}
            >
              {getDisplayText()}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search options..." />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        onClick={onRemove}
        className="h-10 w-10 p-0 border-l hover:bg-destructive/10 hover:text-destructive rounded-none"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
