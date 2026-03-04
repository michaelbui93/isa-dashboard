"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/formatters";
import type { TaxYear } from "@/types";

interface AllowanceSummaryProps {
  taxYear: TaxYear;
  deposited: number;
  remaining: number;
  percentUsed: number;
}

export function AllowanceSummary({
  taxYear,
  deposited,
  remaining,
  percentUsed,
}: AllowanceSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Year {taxYear.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Allowance used</span>
            <span className="font-medium">{percentUsed.toFixed(1)}%</span>
          </div>
          <Progress value={percentUsed} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Deposited</p>
            <CurrencyDisplay amount={deposited} className="text-lg font-semibold" />
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <CurrencyDisplay amount={remaining} className="text-lg font-semibold text-gain" />
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax year starts</span>
            <span>{formatDate(taxYear.startDate)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Tax year ends</span>
            <span>{formatDate(taxYear.endDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
