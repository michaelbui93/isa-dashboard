"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import type { PortfolioSummary } from "@/types";

interface PortfolioHeroProps {
  summary: PortfolioSummary;
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

export function PortfolioHero({ summary }: PortfolioHeroProps) {
  const displayValue = useCountUp(summary.totalValue);
  const isPositive = summary.dayChange >= 0;

  return (
    <>
      {/* Mobile: full-width card with radial gradient */}
      <div
        className={[
          "md:hidden rounded-2xl p-5 mb-0",
          isPositive
            ? "bg-[radial-gradient(ellipse_at_top_left,oklch(0.18_0.06_155/0.8),oklch(0.14_0.025_260))]"
            : "bg-[radial-gradient(ellipse_at_top_left,oklch(0.18_0.05_25/0.8),oklch(0.14_0.025_260))]",
        ].join(" ")}
      >
        <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
          Portfolio Value
        </p>
        <p className="text-[40px] font-semibold font-financial leading-none text-white">
          {formatCurrency(displayValue)}
        </p>
        <div className={`flex items-center gap-1.5 mt-3 ${isPositive ? "text-gain" : "text-loss"}`}>
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          <span className="text-sm font-medium font-financial">
            {formatCurrency(summary.dayChange, { showSign: true })} ({formatPercentage(summary.dayChangePercent, { showSign: true })}) today
          </span>
        </div>
      </div>

      {/* Desktop: left-aligned, no card */}
      <div className="hidden md:block pb-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Portfolio Value
        </p>
        <p className="text-[56px] font-semibold font-financial leading-none text-foreground">
          {formatCurrency(displayValue)}
        </p>
        <div className={`flex items-center gap-2 mt-3 ${isPositive ? "text-gain" : "text-loss"}`}>
          {isPositive ? (
            <ArrowUpRight className="h-5 w-5" />
          ) : (
            <ArrowDownRight className="h-5 w-5" />
          )}
          <span className="text-xl font-medium font-financial">
            {formatCurrency(summary.dayChange, { showSign: true })}
          </span>
          <span className="text-base font-financial opacity-80">
            ({formatPercentage(summary.dayChangePercent, { showSign: true })}) today
          </span>
        </div>
      </div>
    </>
  );
}
