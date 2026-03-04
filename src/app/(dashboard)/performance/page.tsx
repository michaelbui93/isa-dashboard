"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { PerformanceChart } from "@/components/performance/performance-chart";
import { PeriodSelector } from "@/components/performance/period-selector";
import { GainsSummary } from "@/components/performance/gains-summary";
import { usePortfolio } from "@/hooks/use-portfolio";

export default function PerformancePage() {
  const { holdings, summary } = usePortfolio();
  const [period, setPeriod] = useState("1M");

  return (
    <>
      <Header title="Performance" />
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        <PerformanceChart holdings={holdings} period={period} />

        <div className="grid gap-6 lg:grid-cols-2">
          <GainsSummary summary={summary} />
        </div>
      </div>
    </>
  );
}
