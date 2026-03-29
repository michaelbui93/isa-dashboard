"use client";

import { useMemo } from "react";
import { TrendingUp, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { TaxYear } from "@/types";

interface PacingSignalProps {
  taxYear: TaxYear;
  totalDeposited: number;
}

export function PacingSignal({ taxYear, totalDeposited }: PacingSignalProps) {
  const pacing = useMemo(() => {
    const today = new Date();
    const start = new Date(taxYear.startDate);
    const end = new Date(taxYear.endDate);

    const daysElapsed = Math.max(
      1,
      Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );
    const daysRemaining = Math.max(
      0,
      Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    );

    const dailyRate = totalDeposited / daysElapsed;
    const projectedTotal = totalDeposited + dailyRate * daysRemaining;
    const projectedCapped = Math.min(projectedTotal, taxYear.allowance);
    const shortfall = taxYear.allowance - projectedCapped;
    const onTrack = projectedTotal >= taxYear.allowance;

    return { daysElapsed, daysRemaining, dailyRate, projectedCapped, shortfall, onTrack };
  }, [taxYear, totalDeposited]);

  if (totalDeposited === 0) return null;

  const { daysRemaining, projectedCapped, shortfall, onTrack } = pacing;
  const significantlyBehind = !onTrack && projectedCapped / taxYear.allowance < 0.8;

  return (
    <div
      className={[
        "rounded-xl border p-4 flex gap-3 items-start",
        onTrack
          ? "bg-gain/10 border-gain/30 text-gain"
          : shortfall > 500000
          ? "bg-loss/10 border-loss/30 text-loss"
          : "bg-amber-500/10 border-amber-500/30 text-amber-500",
        significantlyBehind ? "pacing-behind" : "",
      ].join(" ")}
    >
      <div className="mt-0.5 shrink-0">
        {onTrack ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : shortfall > 500000 ? (
          <AlertTriangle className="w-5 h-5" />
        ) : (
          <TrendingUp className="w-5 h-5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug font-sans">
          {onTrack ? (
            "On track to maximise your ISA allowance"
          ) : (
            <>
              At your current rate, you&apos;ll contribute{" "}
              <span className="font-mono">{formatCurrency(projectedCapped)}</span> by
              April 5th — leaving{" "}
              <span className="font-mono">{formatCurrency(shortfall)}</span> unused
            </>
          )}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs opacity-75">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {daysRemaining === 0
              ? "Tax year ends today"
              : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining in tax year`}
          </span>
        </div>
      </div>
    </div>
  );
}
