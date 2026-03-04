"use client";

import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { PercentageChange } from "@/components/shared/percentage-change";
import type { PortfolioSummary as PortfolioSummaryType } from "@/types";

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
}

export function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  const isPositiveDay = summary.dayChange >= 0;
  const isPositiveTotal = summary.totalGainLoss >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Value - Featured Card */}
      <div className="md:col-span-2 rounded-2xl gradient-primary p-6 text-white shadow-lg shadow-primary/25">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium">Total Portfolio Value</p>
            <CurrencyDisplay
              amount={summary.totalValue}
              className="text-4xl font-bold mt-2 text-white"
            />
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
                {isPositiveDay ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {summary.dayChangePercent >= 0 ? "+" : ""}
                  {summary.dayChangePercent.toFixed(2)}% today
                </span>
              </div>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Wallet className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Today's Change */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Today&apos;s Change</p>
            <CurrencyDisplay
              amount={summary.dayChange}
              showSign
              colorCode
              className="text-2xl font-bold mt-2"
            />
            <PercentageChange value={summary.dayChangePercent} size="sm" className="mt-1" />
          </div>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isPositiveDay ? 'bg-gain/10' : 'bg-loss/10'}`}>
            {isPositiveDay ? (
              <ArrowUpRight className="h-5 w-5 text-gain" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-loss" />
            )}
          </div>
        </div>
      </div>

      {/* Total Gain/Loss */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Total Gain/Loss</p>
            <CurrencyDisplay
              amount={summary.totalGainLoss}
              showSign
              colorCode
              className="text-2xl font-bold mt-2"
            />
            <PercentageChange value={summary.totalGainLossPercent} size="sm" className="mt-1" />
          </div>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isPositiveTotal ? 'bg-gain/10' : 'bg-loss/10'}`}>
            <TrendingUp className={`h-5 w-5 ${isPositiveTotal ? 'text-gain' : 'text-loss'}`} />
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="md:col-span-2 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-card border border-border/50 p-4">
          <p className="text-xs text-muted-foreground font-medium">Invested</p>
          <CurrencyDisplay amount={summary.totalInvested} className="text-lg font-semibold mt-1" />
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-4">
          <p className="text-xs text-muted-foreground font-medium">Cash Balance</p>
          <CurrencyDisplay amount={summary.cashBalance} className="text-lg font-semibold mt-1" />
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-4">
          <p className="text-xs text-muted-foreground font-medium">Return</p>
          <PercentageChange value={summary.totalGainLossPercent} showIcon={false} size="lg" className="mt-1" />
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-4">
          <p className="text-xs text-muted-foreground font-medium">Day Change</p>
          <CurrencyDisplay amount={summary.dayChange} showSign colorCode className="text-lg font-semibold mt-1" />
        </div>
      </div>
    </div>
  );
}
