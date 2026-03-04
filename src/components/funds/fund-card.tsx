"use client";

import Link from "next/link";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { PercentageChange } from "@/components/shared/percentage-change";
import type { Fund } from "@/types";

interface FundCardProps {
  fund: Fund;
}

export function FundCard({ fund }: FundCardProps) {
  const sparklineData = fund.priceHistory.slice(-30);
  const isPositive = fund.dayChange >= 0;

  return (
    <Link href={`/funds/${fund.symbol}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold">{fund.symbol}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {fund.name}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {fund.category.replace("Sector - ", "")}
            </Badge>
          </div>

          <div className="h-12 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "hsl(var(--gain))" : "hsl(var(--loss))"}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <CurrencyDisplay amount={fund.currentPrice} className="font-semibold" />
              <PercentageChange value={fund.dayChange} size="sm" />
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>TER: {fund.ter}%</p>
              {fund.dividendYield && <p>Yield: {fund.dividendYield}%</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
