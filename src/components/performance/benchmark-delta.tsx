"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { HoldingWithDetails } from "@/types";

// Mock FTSE All-World benchmark returns (%) per period
const BENCHMARK_RETURNS: Record<string, number> = {
  "1W": 0.92,
  "1M": 1.68,
  "3M": 5.21,
  "1Y": 18.2,
  ALL: 18.2,
};

const PERIOD_DAYS: Record<string, number> = {
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "1Y": 365,
  ALL: 365,
};

interface BenchmarkDeltaProps {
  holdings: HoldingWithDetails[];
  period: string;
}

export function BenchmarkDelta({ holdings, period }: BenchmarkDeltaProps) {
  const { portfolioReturn, benchmarkReturn, delta } = useMemo(() => {
    if (holdings.length === 0) {
      return { portfolioReturn: 0, benchmarkReturn: 0, delta: 0 };
    }

    const days = PERIOD_DAYS[period] ?? 365;
    const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);

    // Weighted portfolio return, scaled linearly from annual yearChange
    const portfolioReturn = holdings.reduce((sum, h) => {
      const weight = totalValue > 0 ? h.currentValue / totalValue : 0;
      const periodReturn = h.fund.yearChange * (days / 365);
      return sum + weight * periodReturn;
    }, 0);

    const benchmarkReturn = BENCHMARK_RETURNS[period] ?? BENCHMARK_RETURNS["1Y"];
    const delta = portfolioReturn - benchmarkReturn;

    return { portfolioReturn, benchmarkReturn, delta };
  }, [holdings, period]);

  if (holdings.length === 0) return null;

  const isOutperforming = delta > 0;
  const isNeutral = Math.abs(delta) < 0.05;

  const color = isNeutral
    ? "text-muted-foreground"
    : isOutperforming
    ? "text-gain"
    : "text-loss";

  const bgColor = isNeutral
    ? "bg-muted/50"
    : isOutperforming
    ? "bg-gain/10 border-gain/20"
    : "bg-loss/10 border-loss/20";

  const Icon = isNeutral ? Minus : isOutperforming ? TrendingUp : TrendingDown;

  return (
    <Card className={`border ${bgColor}`}>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
            vs FTSE All-World ({period})
          </p>
          <div className={`flex items-center gap-2 ${color}`}>
            <Icon className="w-5 h-5" />
            <span className="text-2xl font-bold font-financial">
              {delta > 0 ? "+" : ""}
              {delta.toFixed(2)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isNeutral
              ? "Tracking benchmark closely"
              : isOutperforming
              ? "Outperforming benchmark"
              : "Underperforming benchmark"}
          </p>
        </div>

        <div className="text-right shrink-0 space-y-1.5">
          <div>
            <p className="text-xs text-muted-foreground">Portfolio</p>
            <p className={`text-sm font-semibold font-financial ${portfolioReturn >= 0 ? "text-gain" : "text-loss"}`}>
              {portfolioReturn >= 0 ? "+" : ""}
              {portfolioReturn.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Benchmark</p>
            <p className="text-sm font-semibold font-financial text-muted-foreground">
              +{benchmarkReturn.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
