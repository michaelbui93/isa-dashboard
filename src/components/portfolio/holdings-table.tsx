"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { PercentageChange } from "@/components/shared/percentage-change";
import { formatShares } from "@/lib/formatters";
import type { HoldingWithDetails } from "@/types";

function DrawdownBadge({ value }: { value: number }) {
  const abs = Math.abs(value);
  const label = value === 0 ? "Peak" : `${value.toFixed(1)}%`;

  let classes = "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-financial font-medium";
  if (abs <= 5) {
    classes += " bg-gain/15 text-gain";
  } else if (abs <= 20) {
    classes += " bg-amber-500/15 text-amber-500";
  } else {
    classes += " bg-loss/15 text-loss";
  }

  return <span className={classes}>{label}</span>;
}

interface HoldingsTableProps {
  holdings: HoldingWithDetails[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <Card className="animate-fade-in-up stagger-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[100px] text-muted-foreground text-sm">
            No holdings yet. Browse funds to start investing.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in-up stagger-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">Drawdown</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding, index) => (
                <TableRow
                  key={holding.id}
                  className="animate-fade-in-up cursor-pointer hover:bg-muted/50 transition-colors"
                  style={{ animationDelay: `${(index + 4) * 50}ms` }}
                >
                  <TableCell>
                    <Link href={`/funds/${holding.fundSymbol}`} className="block">
                      <p className="font-medium">{holding.fundSymbol}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {holding.fund.name}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-financial">
                    {formatShares(holding.shares)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <CurrencyDisplay amount={holding.fund.currentPrice} size="sm" className="font-financial" />
                      <PercentageChange
                        value={holding.fund.dayChange}
                        size="sm"
                        showIcon={false}
                        className="block"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <CurrencyDisplay amount={holding.currentValue} className="font-financial" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <CurrencyDisplay
                        amount={holding.gainLoss}
                        showSign
                        colorCode
                        size="sm"
                        className="font-financial"
                      />
                      <PercentageChange
                        value={holding.gainLossPercent}
                        size="sm"
                        showIcon={false}
                        className="block"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DrawdownBadge value={holding.drawdownPercent} />
                  </TableCell>
                  <TableCell className="text-right font-financial">
                    {holding.allocation.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-2">
          {holdings.map((holding, index) => (
            <Link
              href={`/funds/${holding.fundSymbol}`}
              key={holding.id}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors btn-press touch-target animate-fade-in-up"
              style={{ animationDelay: `${(index + 4) * 50}ms` }}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{holding.fundSymbol}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {formatShares(holding.shares)} shares
                </p>
              </div>
              <div className="text-right">
                <CurrencyDisplay amount={holding.currentValue} className="font-medium font-financial" />
                <PercentageChange
                  value={holding.gainLossPercent}
                  size="sm"
                  className="block"
                />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
