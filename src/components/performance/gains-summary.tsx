"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { PercentageChange } from "@/components/shared/percentage-change";
import type { PortfolioSummary } from "@/types";

interface GainsSummaryProps {
  summary: PortfolioSummary;
}

export function GainsSummary({ summary }: GainsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Returns Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div>
            <p className="text-sm text-muted-foreground">Today&apos;s Change</p>
            <CurrencyDisplay
              amount={summary.dayChange}
              showSign
              colorCode
              className="text-lg font-semibold"
            />
          </div>
          <PercentageChange value={summary.dayChangePercent} size="lg" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div>
            <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
            <CurrencyDisplay
              amount={summary.totalGainLoss}
              showSign
              colorCode
              className="text-lg font-semibold"
            />
          </div>
          <PercentageChange value={summary.totalGainLossPercent} size="lg" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Total Invested</p>
            <CurrencyDisplay
              amount={summary.totalInvested}
              className="font-medium"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current Value</p>
            <CurrencyDisplay
              amount={summary.totalValue}
              className="font-medium"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
