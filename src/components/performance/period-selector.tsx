"use client";

import { motion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";

const periods = ["1W", "1M", "3M", "1Y", "ALL"] as const;

interface PeriodSelectorProps {
  value: string;
  onChange: (period: string) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <LayoutGroup id="period-selector">
      <div className="flex gap-0.5 p-1 bg-muted rounded-xl">
        {periods.map((period) => {
          const isActive = value === period;
          return (
            <button
              key={period}
              onClick={() => onChange(period)}
              className={cn(
                "relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150 z-10",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="period-pill"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              {period}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
