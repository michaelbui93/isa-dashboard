"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { HoldingWithDetails } from "@/types";

interface PerformanceChartProps {
  holdings: HoldingWithDetails[];
  period: string;
}

export function PerformanceChart({ holdings, period }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    if (holdings.length === 0) return [];

    const periodDays: Record<string, number> = {
      "1D": 1,
      "1W": 7,
      "1M": 30,
      "3M": 90,
      "YTD": 365,
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
        const pricePoint = holding.fund.priceHistory.find(
          (p) => p.date === dateStr
        );
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

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add holdings to see performance.
          </p>
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
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isPositive ? "hsl(var(--gain))" : "hsl(var(--loss))"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isPositive ? "hsl(var(--gain))" : "hsl(var(--loss))"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(date) => formatDate(date, "dd MMM")}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value as number), "Value"]}
                labelFormatter={(date) => formatDate(date as string, "dd MMM yyyy")}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "hsl(var(--gain))" : "hsl(var(--loss))"}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
