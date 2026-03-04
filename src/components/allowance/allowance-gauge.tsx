"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/shared/currency-display";

interface AllowanceGaugeProps {
  used: number;
  total: number;
  percentUsed: number;
}

export function AllowanceGauge({ used, total, percentUsed }: AllowanceGaugeProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentUsed / 100) * circumference;

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="45"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="45"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{percentUsed.toFixed(0)}%</span>
              <span className="text-xs text-muted-foreground">used</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">Contributed</p>
            <CurrencyDisplay amount={used} className="text-2xl font-bold" />
            <p className="text-sm text-muted-foreground mt-1">
              of <CurrencyDisplay amount={total} className="font-medium" />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
