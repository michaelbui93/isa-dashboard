"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const periods = ["1D", "1W", "1M", "3M", "YTD", "1Y", "ALL"] as const;

interface PeriodSelectorProps {
  value: string;
  onChange: (period: string) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {periods.map((period) => (
        <Button
          key={period}
          variant="ghost"
          size="sm"
          onClick={() => onChange(period)}
          className={cn(
            "px-3 py-1.5 h-auto text-sm font-medium transition-all",
            value === period
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {period}
        </Button>
      ))}
    </div>
  );
}
