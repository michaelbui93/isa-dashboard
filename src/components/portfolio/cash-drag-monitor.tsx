"use client";

import { useMemo } from "react";
import { Banknote } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { PortfolioSummary } from "@/types";

interface CashDragMonitorProps {
  summary: PortfolioSummary;
}

const NEGLIGIBLE_THRESHOLD = 25000; // £250 in pence

export function CashDragMonitor({ summary }: CashDragMonitorProps) {
  const { cashBalance, totalGainLossPercent } = summary;

  const monthlyCost = useMemo(() => {
    if (cashBalance < NEGLIGIBLE_THRESHOLD || totalGainLossPercent <= 0) return 0;
    // Treat portfolio return as annualised rate; divide by 12 for monthly cost
    return Math.round((cashBalance * (totalGainLossPercent / 100)) / 12);
  }, [cashBalance, totalGainLossPercent]);

  if (cashBalance < NEGLIGIBLE_THRESHOLD || monthlyCost <= 0) return null;

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3 flex items-start gap-3">
      <div className="mt-0.5 shrink-0 h-8 w-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
        <Banknote className="w-4 h-4 text-amber-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-500 font-sans">Cash Drag</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          <span className="font-mono font-medium text-foreground">
            {formatCurrency(cashBalance)}
          </span>{" "}
          cash uninvested &mdash; estimated opportunity cost:{" "}
          <span className="font-mono font-medium text-amber-500">
            {formatCurrency(monthlyCost)}/month
          </span>{" "}
          vs. your portfolio average
        </p>
      </div>
    </div>
  );
}
