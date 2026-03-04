"use client";

import { useMemo, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "./use-local-storage";
import { INITIAL_PORTFOLIO } from "@/data/mock-portfolio";
import { getFundBySymbol, FUNDS } from "@/data/funds";
import { calculateHoldingDetails, calculatePortfolioSummary } from "@/lib/calculations";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Portfolio, Holding, HoldingWithDetails, PortfolioSummary } from "@/types";

export function usePortfolio() {
  const [portfolio, setPortfolio] = useLocalStorage<Portfolio>(
    STORAGE_KEYS.PORTFOLIO,
    INITIAL_PORTFOLIO
  );

  const holdingsWithDetails: HoldingWithDetails[] = useMemo(() => {
    const totalValue = portfolio.holdings.reduce((sum, h) => {
      const fund = getFundBySymbol(h.fundSymbol);
      return sum + (fund ? h.shares * fund.currentPrice : 0);
    }, 0) + portfolio.cashBalance;

    return portfolio.holdings
      .map((h) => {
        const fund = getFundBySymbol(h.fundSymbol);
        if (!fund) return null;
        return calculateHoldingDetails(h, fund, totalValue);
      })
      .filter((h): h is HoldingWithDetails => h !== null);
  }, [portfolio]);

  const summary: PortfolioSummary = useMemo(
    () => calculatePortfolioSummary(holdingsWithDetails, portfolio.cashBalance),
    [holdingsWithDetails, portfolio.cashBalance]
  );

  const addHolding = useCallback(
    (fundSymbol: string, shares: number, pricePerShare: number) => {
      const existingIndex = portfolio.holdings.findIndex(
        (h) => h.fundSymbol === fundSymbol
      );

      if (existingIndex >= 0) {
        setPortfolio((prev) => {
          const existing = prev.holdings[existingIndex];
          const totalShares = existing.shares + shares;
          const totalCost =
            existing.shares * existing.averageCostPerShare + shares * pricePerShare;
          const newAvgCost = totalCost / totalShares;

          const newHoldings = [...prev.holdings];
          newHoldings[existingIndex] = {
            ...existing,
            shares: totalShares,
            averageCostPerShare: Math.round(newAvgCost),
            lastUpdated: new Date().toISOString(),
          };

          return {
            ...prev,
            holdings: newHoldings,
            cashBalance: prev.cashBalance - shares * pricePerShare,
            lastUpdated: new Date().toISOString(),
          };
        });
      } else {
        const newHolding: Holding = {
          id: uuidv4(),
          fundSymbol,
          shares,
          averageCostPerShare: pricePerShare,
          purchaseDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };

        setPortfolio((prev) => ({
          ...prev,
          holdings: [...prev.holdings, newHolding],
          cashBalance: prev.cashBalance - shares * pricePerShare,
          lastUpdated: new Date().toISOString(),
        }));
      }
    },
    [portfolio, setPortfolio]
  );

  const removeHolding = useCallback(
    (holdingId: string, sellPrice: number) => {
      const holding = portfolio.holdings.find((h) => h.id === holdingId);
      if (!holding) return;

      const saleValue = holding.shares * sellPrice;

      setPortfolio((prev) => ({
        ...prev,
        holdings: prev.holdings.filter((h) => h.id !== holdingId),
        cashBalance: prev.cashBalance + saleValue,
        lastUpdated: new Date().toISOString(),
      }));
    },
    [portfolio, setPortfolio]
  );

  const updateCashBalance = useCallback(
    (amount: number) => {
      setPortfolio((prev) => ({
        ...prev,
        cashBalance: prev.cashBalance + amount,
        lastUpdated: new Date().toISOString(),
      }));
    },
    [setPortfolio]
  );

  return {
    portfolio,
    holdings: holdingsWithDetails,
    summary,
    addHolding,
    removeHolding,
    updateCashBalance,
  };
}
