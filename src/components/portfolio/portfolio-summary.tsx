"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { PercentageChange } from "@/components/shared/percentage-change";
import type { PortfolioSummary as PortfolioSummaryType } from "@/types";

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
}

export function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
      <CardContent className="p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
          <CurrencyDisplay
            amount={summary.totalValue}
            size="xl"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Today</span>
            <CurrencyDisplay
              amount={summary.dayChange}
              showSign
              colorCode
              size="sm"
            />
            <PercentageChange value={summary.dayChangePercent} size="sm" />
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">All time</span>
            <CurrencyDisplay
              amount={summary.totalGainLoss}
              showSign
              colorCode
              size="sm"
            />
            <PercentageChange value={summary.totalGainLossPercent} size="sm" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Invested</p>
            <CurrencyDisplay amount={summary.totalInvested} className="font-medium" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cash</p>
            <CurrencyDisplay amount={summary.cashBalance} className="font-medium" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gain/Loss</p>
            <CurrencyDisplay
              amount={summary.totalGainLoss}
              colorCode
              showSign
              className="font-medium"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Return</p>
            <PercentageChange value={summary.totalGainLossPercent} showIcon={false} size="md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
