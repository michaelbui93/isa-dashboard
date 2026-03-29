"use client";

import { PageTransition } from "@/components/layout/page-transition";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { PerformanceChart } from "@/components/performance/performance-chart";
import { PeriodSelector } from "@/components/performance/period-selector";
import { GainsSummary } from "@/components/performance/gains-summary";
import { BenchmarkDelta } from "@/components/performance/benchmark-delta";
import { usePortfolio } from "@/hooks/use-portfolio";

export default function PerformancePage() {
  const { holdings, summary } = usePortfolio();
  const [period, setPeriod] = useState("1M");

  return (
    <PageTransition>
      <>
      <Header title="Performance" />
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex justify-end">
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        <PerformanceChart holdings={holdings} period={period} />

        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          <GainsSummary summary={summary} />
          <BenchmarkDelta holdings={holdings} period={period} />
        </div>
      </div>
    </>
    </PageTransition>
  );
}
