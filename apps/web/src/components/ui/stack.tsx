import * as React from "react";
import { cn } from "@/lib/utils";

interface StackProps {
  children: React.ReactNode;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  wrap?: boolean;
  className?: string;
}

export const Stack = ({
  children,
  direction = "column",
  spacing = "md",
  justify,
  align,
  wrap,
  className,
}: StackProps) => {
  return (
    <div
      className={cn(
        "flex",
        {
          "flex-col": direction === "column",
          "flex-row": direction === "row",
          "flex-col-reverse": direction === "column-reverse",
          "flex-row-reverse": direction === "row-reverse",

          "gap-0": spacing === "none",
          "gap-1": spacing === "xs",
          "gap-2": spacing === "sm",
          "gap-4": spacing === "md",
          "gap-8": spacing === "lg",
          "gap-16": spacing === "xl",

          "justify-start": justify === "start",
          "justify-end": justify === "end",
          "justify-center": justify === "center",
          "justify-between": justify === "between",
          "justify-around": justify === "around",
          "justify-evenly": justify === "evenly",

          "items-start": align === "start",
          "items-end": align === "end",
          "items-center": align === "center",
          "items-baseline": align === "baseline",
          "items-stretch": align === "stretch",

          "flex-wrap": wrap === true,
        },
        className
      )}
    >
      {children}
    </div>
  );
};
