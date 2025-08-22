import { useState, useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimalPlaces?: number;
  formatter?: (value: number) => string;
}

export function AnimatedNumber({
  value,
  duration = 80,
  decimalPlaces = 1,
  suffix = "",
  prefix = "",
  formatter,
}: AnimatedNumberProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(value);

  useEffect(() => {
    if (value === currentValue) {
      return;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    startTimeRef.current = null;
    startValueRef.current = currentValue;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const animatedValue =
        startValueRef.current + (value - startValueRef.current) * progress;

      setCurrentValue(animatedValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(value);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration, currentValue]);

  return (
    <span>
      {prefix}
      {formatter
        ? formatter(currentValue)
        : currentValue.toFixed(decimalPlaces)}
      {suffix}
    </span>
  );
}
