"use client";

import { PageTransition } from "@/components/layout/page-transition";

import { Header } from "@/components/layout/header";
import { PortfolioHero } from "@/components/portfolio/portfolio-hero";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { HoldingsTable } from "@/components/portfolio/holdings-table";
import { AssetHeatmap } from "@/components/portfolio/asset-heatmap";
import { CashDragMonitor } from "@/components/portfolio/cash-drag-monitor";
import { usePortfolio } from "@/hooks/use-portfolio";

export default function PortfolioPage() {
  const { holdings, summary } = usePortfolio();

  return (
    <PageTransition>
      <>
      <Header title="Portfolio" />
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <PortfolioHero summary={summary} />
        <PortfolioSummary summary={summary} />

        <CashDragMonitor summary={summary} />

        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <HoldingsTable holdings={holdings} />
          <AssetHeatmap holdings={holdings} />
        </div>
      </div>
    </>
    </PageTransition>
  );
}
