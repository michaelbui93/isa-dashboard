"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { PercentageChange } from "@/components/shared/percentage-change";
import { getFundBySymbol } from "@/data/funds";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { RISK_LEVEL_LABELS } from "@/lib/constants";

export default function FundDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = use(params);
  const fund = getFundBySymbol(symbol.toUpperCase());

  if (!fund) {
    notFound();
  }

  const isPositive = fund.dayChange >= 0;

  return (
    <>
      <Header title={fund.symbol} />
      <div className="p-6 space-y-6">
        <Link
          href="/funds"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Funds
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{fund.symbol}</CardTitle>
                    <p className="text-muted-foreground">{fund.name}</p>
                  </div>
                  <Badge variant="outline">{fund.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-4 mb-6">
                  <CurrencyDisplay
                    amount={fund.currentPrice}
                    className="text-3xl font-bold"
                  />
                  <PercentageChange value={fund.dayChange} size="lg" />
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={fund.priceHistory}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={
                              isPositive ? "hsl(var(--gain))" : "hsl(var(--loss))"
                            }
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={
                              isPositive ? "hsl(var(--gain))" : "hsl(var(--loss))"
                            }
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => formatDate(date, "MMM")}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value)}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        width={70}
                      />
                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(value as number),
                          "Price",
                        ]}
                        labelFormatter={(date) =>
                          formatDate(date as string, "dd MMM yyyy")
                        }
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={
                          isPositive ? "hsl(var(--gain))" : "hsl(var(--loss))"
                        }
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{fund.description}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ISIN</span>
                  <span className="font-mono text-sm">{fund.isin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span>{fund.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency</span>
                  <span>{fund.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span>{fund.accumulatingOrDistributing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TER</span>
                  <span>{fund.ter}%</span>
                </div>
                {fund.dividendYield && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dividend Yield</span>
                    <span>{fund.dividendYield}%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span>{RISK_LEVEL_LABELS[fund.riskLevel]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1Y Return</span>
                  <PercentageChange value={fund.yearChange} showIcon={false} />
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg">
              Buy {fund.symbol}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
