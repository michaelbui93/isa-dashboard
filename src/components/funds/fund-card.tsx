"use client";

import Link from "next/link";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { PercentageChange } from "@/components/shared/percentage-change";
import { CheckCircle2 } from "lucide-react";
import type { Fund } from "@/types";

interface FundCardProps {
  fund: Fund;
  isInPortfolio?: boolean;
  index?: number;
}

export function FundCard({ fund, isInPortfolio = false, index = 0 }: FundCardProps) {
  const sparklineData = fund.priceHistory.slice(-30);
  const isPositive = fund.dayChange >= 0;

  return (
    <Link href={`/funds/${fund.symbol}`}>
      <div
        className="group relative rounded-2xl border border-border/50 bg-card p-4 md:p-5 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer btn-press touch-target animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Portfolio Indicator */}
        {isInPortfolio && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-2 py-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Owned</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">
                {fund.symbol.slice(0, 2)}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {fund.symbol}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {fund.provider}
              </p>
            </div>
          </div>
        </div>

        {/* Sparkline Chart */}
        <div className="h-14 md:h-16 mb-3 md:mb-4 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <defs>
                <linearGradient id={`gradient-${fund.symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isPositive ? "hsl(var(--gain))" : "hsl(var(--loss))"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? "hsl(var(--gain))" : "hsl(var(--loss))"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "hsl(var(--gain))" : "hsl(var(--loss))"}
                strokeWidth={2}
                dot={false}
                fill={`url(#gradient-${fund.symbol})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Price Info */}
        <div className="flex items-end justify-between">
          <div>
            <CurrencyDisplay
              amount={fund.currentPrice}
              className="text-lg md:text-xl font-bold text-foreground font-financial"
            />
            <PercentageChange value={fund.dayChange} size="sm" className="mt-0.5" />
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-xs font-normal bg-muted/50 border-0">
              {fund.category.replace("Sector - ", "")}
            </Badge>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">TER:</span> {fund.ter}%
          </div>
          {fund.dividendYield && (
            <div className="hidden sm:block">
              <span className="font-medium text-foreground">Yield:</span> {fund.dividendYield}%
            </div>
          )}
          <div>
            <span className="font-medium text-foreground">1Y:</span>{" "}
            <span className={fund.yearChange >= 0 ? "text-gain" : "text-loss"}>
              {fund.yearChange >= 0 ? "+" : ""}{fund.yearChange}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
