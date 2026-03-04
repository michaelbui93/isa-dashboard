"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { formatDate } from "@/lib/formatters";
import type { Contribution } from "@/types";

interface ContributionHistoryProps {
  contributions: Contribution[];
}

export function ContributionHistory({ contributions }: ContributionHistoryProps) {
  if (contributions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No contributions this tax year.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />

          <div className="space-y-4">
            {contributions.map((contribution, index) => (
              <div key={index} className="relative pl-8">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary border-2 border-background" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {formatDate(contribution.date)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Running total:{" "}
                      <CurrencyDisplay amount={contribution.runningTotal} size="sm" />
                    </p>
                  </div>
                  <CurrencyDisplay
                    amount={contribution.amount}
                    showSign
                    className="font-medium text-gain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
