"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  showSign?: boolean;
  colorCode?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl font-semibold",
};

export function CurrencyDisplay({
  amount,
  className,
  showSign = false,
  colorCode = false,
  size = "md",
}: CurrencyDisplayProps) {
  return (
    <span
      className={cn(
        sizeClasses[size],
        colorCode && amount > 0 && "text-gain",
        colorCode && amount < 0 && "text-loss",
        className
      )}
    >
      {formatCurrency(amount, { showSign })}
    </span>
  );
}
