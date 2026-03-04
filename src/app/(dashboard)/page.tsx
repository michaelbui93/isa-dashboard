"use client";

import { Header } from "@/components/layout/header";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { HoldingsTable } from "@/components/portfolio/holdings-table";
import { AssetAllocation } from "@/components/portfolio/asset-allocation";
import { usePortfolio } from "@/hooks/use-portfolio";

export default function PortfolioPage() {
  const { holdings, summary } = usePortfolio();

  return (
    <>
      <Header title="Portfolio" />
      <div className="p-6 space-y-6">
        <PortfolioSummary summary={summary} />

        <div className="grid gap-6 lg:grid-cols-2">
          <HoldingsTable holdings={holdings} />
          <AssetAllocation holdings={holdings} />
        </div>
      </div>
    </>
  );
}
