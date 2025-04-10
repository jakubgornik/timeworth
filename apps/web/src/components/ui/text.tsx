import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      primary: "text-primary",
      secondary: "text-secondary",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      thin: "font-thin",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    decoration: {
      underline: "underline",
      "line-through": "line-through",
      "no-underline": "no-underline",
    },
    transform: {
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
      "normal-case": "normal-case",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "base",
    weight: "normal",
    align: "left",
    decoration: "no-underline",
    transform: "normal-case",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType;
  truncate?: boolean;
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

export function Text({
  className,
  variant,
  size,
  weight,
  align,
  decoration,
  transform,
  as: Component = "p",
  children,
  ref,
  ...props
}: TextProps) {
  return (
    <Component
      ref={ref}
      className={cn(
        textVariants({ variant, size, weight, align, decoration, transform }),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
