"use client";

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

interface HoldingsTableProps {
  holdings: HoldingWithDetails[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No holdings yet. Browse funds to start investing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => (
                <TableRow key={holding.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{holding.fundSymbol}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {holding.fund.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatShares(holding.shares)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <CurrencyDisplay amount={holding.fund.currentPrice} size="sm" />
                      <PercentageChange
                        value={holding.fund.dayChange}
                        size="sm"
                        showIcon={false}
                        className="block"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <CurrencyDisplay amount={holding.currentValue} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <CurrencyDisplay
                        amount={holding.gainLoss}
                        showSign
                        colorCode
                        size="sm"
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
                    {holding.allocation.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {holdings.map((holding) => (
            <div
              key={holding.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{holding.fundSymbol}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {formatShares(holding.shares)} shares
                </p>
              </div>
              <div className="text-right">
                <CurrencyDisplay amount={holding.currentValue} className="font-medium" />
                <PercentageChange
                  value={holding.gainLossPercent}
                  size="sm"
                  className="block"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
