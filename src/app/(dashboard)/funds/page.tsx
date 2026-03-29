"use client";

import { PageTransition } from "@/components/layout/page-transition";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { FundCard } from "@/components/funds/fund-card";
import { FundSearch } from "@/components/funds/fund-search";
import { FUNDS } from "@/data/funds";
import { usePortfolio } from "@/hooks/use-portfolio";

export default function FundsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { holdings } = usePortfolio();

  const portfolioSymbols = useMemo(
    () => new Set(holdings.map((h) => h.fundSymbol)),
    [holdings]
  );

  const filteredFunds = useMemo(() => {
    return FUNDS.filter((fund) => {
      const matchesSearch =
        searchQuery === "" ||
        fund.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.provider.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || fund.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <PageTransition>
      <>
      <Header title="Fund Universe" />
      <div className="p-6 space-y-6">
        <FundSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFunds.map((fund, index) => (
            <FundCard
              key={fund.symbol}
              fund={fund}
              isInPortfolio={portfolioSymbols.has(fund.symbol)}
              index={index}
            />
          ))}
        </div>

        {filteredFunds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No funds match your search criteria.
            </p>
          </div>
        )}
      </div>
    </>
    </PageTransition>
  );
}
