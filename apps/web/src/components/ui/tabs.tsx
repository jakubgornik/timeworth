import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const [indicatorStyle, setIndicatorStyle] =
    React.useState<React.CSSProperties>({
      opacity: 0,
    });
  const listRef = React.useRef<HTMLDivElement>(null);
  const resizeObserverRef = React.useRef<ResizeObserver | null>(null);

  const updateIndicator = React.useCallback(() => {
    const container = listRef.current;
    if (!container) return;

    const activeTab = container.querySelector(
      '[data-state="active"]'
    ) as HTMLElement;
    const allTabs = container.querySelectorAll('[role="tab"]');

    if (!activeTab || !allTabs.length) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    let activeIndex = 0;
    allTabs.forEach((tab, index) => {
      if (tab === activeTab) {
        activeIndex = index;
      }
    });

    const containerWidth = container.offsetWidth;
    const containerPadding = 4;
    const availableWidth = containerWidth - containerPadding * 3;
    const tabWidth = availableWidth / allTabs.length;
    const left = containerPadding + activeIndex * tabWidth;

    setIndicatorStyle({
      transform: `translateX(${left}px)`,
      width: `${tabWidth}px`,
      opacity: 1,
    });
  }, []);

  React.useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const timer = setTimeout(updateIndicator, 0);

    const observer = new MutationObserver((mutations) => {
      const hasActiveStateChange = mutations.some(
        (mutation) =>
          mutation.type === "attributes" &&
          mutation.attributeName === "data-state"
      );
      if (hasActiveStateChange) {
        updateIndicator();
      }
    });

    const triggers = container.querySelectorAll('[role="tab"]');
    triggers.forEach((trigger) => {
      observer.observe(trigger, {
        attributes: true,
        attributeFilter: ["data-state"],
      });
    });

    if (typeof ResizeObserver !== "undefined") {
      resizeObserverRef.current = new ResizeObserver(updateIndicator);
      resizeObserverRef.current.observe(container);
    } else {
      window.addEventListener("resize", updateIndicator);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      } else {
        window.removeEventListener("resize", updateIndicator);
      }
    };
  }, [updateIndicator]);

  return (
    <TabsPrimitive.List
      ref={(node) => {
        listRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn(
        "relative grid h-12 auto-cols-fr grid-flow-col rounded-xl border border-border bg-background p-1",
        className
      )}
      {...props}
    >
      <div
        className="absolute top-1 bottom-1 rounded-lg bg-primary/50 transition-all duration-300 ease-out pointer-events-none"
        style={indicatorStyle}
      />
      {props.children}
    </TabsPrimitive.List>
  );
});

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative z-10 flex h-full items-center justify-center rounded-lg px-4 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-accent/30",
      className
    )}
    {...props}
  />
));

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));

export { Tabs, TabsList, TabsTrigger, TabsContent };
