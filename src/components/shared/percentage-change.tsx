"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercentage } from "@/lib/formatters";

interface PercentageChangeProps {
  value: number;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function PercentageChange({
  value,
  className,
  showIcon = true,
  size = "md",
}: PercentageChangeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        sizeClasses[size],
        isPositive && "text-gain",
        isNegative && "text-loss",
        !isPositive && !isNegative && "text-muted-foreground",
        className
      )}
    >
      {showIcon && (
        <>
          {isPositive && <TrendingUp className={iconSizes[size]} />}
          {isNegative && <TrendingDown className={iconSizes[size]} />}
          {!isPositive && !isNegative && <Minus className={iconSizes[size]} />}
        </>
      )}
      {formatPercentage(value, { showSign: true })}
    </span>
  );
}
