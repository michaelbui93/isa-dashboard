"use client";

import { PageTransition } from "@/components/layout/page-transition";
import { Header } from "@/components/layout/header";
import { PortfolioHero } from "@/components/portfolio/portfolio-hero";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { HoldingsTable } from "@/components/portfolio/holdings-table";
import { AssetHeatmap } from "@/components/portfolio/asset-heatmap";
import { CashDragMonitor } from "@/components/portfolio/cash-drag-monitor";
import {
  PortfolioHeroSkeleton,
  PortfolioSummarySkeleton,
  HoldingsTableSkeleton,
} from "@/components/skeletons/portfolio-skeletons";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useLoadingState } from "@/hooks/use-loading-state";

export default function PortfolioPage() {
  const { holdings, summary } = usePortfolio();
  const loading = useLoadingState(500);

  return (
    <PageTransition>
      <>
        <Header title="Portfolio" />
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {loading ? (
            <>
              <PortfolioHeroSkeleton />
              <PortfolioSummarySkeleton />
              <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                <HoldingsTableSkeleton />
                <HoldingsTableSkeleton />
              </div>
            </>
          ) : (
            <div className="space-y-4 md:space-y-6 transition-opacity duration-300">
              <PortfolioHero summary={summary} />
              <PortfolioSummary summary={summary} />
              <CashDragMonitor summary={summary} />
              <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                <HoldingsTable holdings={holdings} />
                <AssetHeatmap holdings={holdings} />
              </div>
            </div>
          )}
        </div>
      </>
    </PageTransition>
  );
}
