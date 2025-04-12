import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const stackVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-8",
      xl: "gap-16",
    },
    justifyContent: {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    alignItems: {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    wrap: {
      true: "flex-wrap",
    },
  },
  defaultVariants: {
    direction: "row",
    gap: "sm",
  },
});

export interface StackProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof stackVariants> {
  children: React.ReactNode;
}

export const Stack = ({
  children,
  direction,
  gap,
  justifyContent,
  alignItems,
  wrap,
  className,
  ...props
}: StackProps) => {
  const Component = "div";

  return (
    <Component
      className={cn(
        stackVariants({ direction, gap, justifyContent, alignItems, wrap }),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
