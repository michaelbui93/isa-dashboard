"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { HoldingWithDetails } from "@/types";

interface PerformanceChartProps {
  holdings: HoldingWithDetails[];
  period: string;
}

// Custom tooltip card
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl px-3 py-2.5 shadow-xl text-sm">
      <p className="text-muted-foreground text-xs mb-1">
        {label ? formatDate(label, "dd MMM yyyy") : ""}
      </p>
      <p className="font-semibold font-financial text-foreground">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export function PerformanceChart({ holdings, period }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    if (holdings.length === 0) return [];

    const periodDays: Record<string, number> = {
      "1D": 1,
      "1W": 7,
      "1M": 30,
      "3M": 90,
      YTD: 365,
      "1Y": 365,
      ALL: 365,
    };

    const days = periodDays[period] || 30;
    const data: { date: string; value: number }[] = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      let totalValue = 0;
      holdings.forEach((holding) => {
        const pricePoint = holding.fund.priceHistory.find((p) => p.date === dateStr);
        if (pricePoint) {
          totalValue += holding.shares * pricePoint.price;
        } else {
          const closest = holding.fund.priceHistory.reduce((prev, curr) =>
            Math.abs(new Date(curr.date).getTime() - date.getTime()) <
            Math.abs(new Date(prev.date).getTime() - date.getTime())
              ? curr
              : prev
          );
          totalValue += holding.shares * closest.price;
        }
      });

      data.push({ date: dateStr, value: totalValue });
    }

    return data;
  }, [holdings, period]);

  const startValue = chartData[0]?.value || 0;
  const endValue = chartData[chartData.length - 1]?.value || 0;
  const isPositive = endValue >= startValue;

  const strokeColor = isPositive ? "hsl(var(--gain))" : "hsl(var(--loss))";
  const gradientId = isPositive ? "chartGradientGain" : "chartGradientLoss";

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add holdings to see performance.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="chartGradientGain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--gain))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--gain))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="chartGradientLoss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--loss))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--loss))" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="hsl(var(--border))"
                strokeOpacity={0.15}
              />

              <XAxis
                dataKey="date"
                tickFormatter={(date) => formatDate(date, "dd MMM")}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                orientation="right"
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                width={90}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "hsl(var(--muted-foreground))",
                  strokeWidth: 1,
                  strokeDasharray: "4 2",
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: strokeColor, stroke: "hsl(var(--background))", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
