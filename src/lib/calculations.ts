import type { Fund, Holding, HoldingWithDetails, Portfolio, PortfolioSummary } from "@/types";

export function calculateHoldingDetails(
  holding: Holding,
  fund: Fund,
  totalPortfolioValue: number
): HoldingWithDetails {
  const currentValue = holding.shares * fund.currentPrice;
  const totalCost = holding.shares * holding.averageCostPerShare;
  const gainLoss = currentValue - totalCost;
  const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
  const allocation = totalPortfolioValue > 0 ? (currentValue / totalPortfolioValue) * 100 : 0;

  return {
    ...holding,
    fund,
    currentValue,
    gainLoss,
    gainLossPercent,
    allocation,
  };
}

export function calculatePortfolioSummary(
  holdings: HoldingWithDetails[],
  cashBalance: number
): PortfolioSummary {
  const totalHoldingsValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalValue = totalHoldingsValue + cashBalance;

  const totalInvested = holdings.reduce(
    (sum, h) => sum + h.shares * h.averageCostPerShare,
    0
  );

  const totalGainLoss = totalHoldingsValue - totalInvested;
  const totalGainLossPercent =
    totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  const dayChange = holdings.reduce((sum, h) => {
    const previousValue = h.shares * h.fund.previousClose;
    return sum + (h.currentValue - previousValue);
  }, 0);

  const previousDayValue = holdings.reduce(
    (sum, h) => sum + h.shares * h.fund.previousClose,
    0
  );
  const dayChangePercent =
    previousDayValue > 0 ? (dayChange / previousDayValue) * 100 : 0;

  return {
    totalValue,
    totalInvested,
    totalGainLoss,
    totalGainLossPercent,
    dayChange,
    dayChangePercent,
    cashBalance,
  };
}

export function calculateAllocation(holdings: HoldingWithDetails[]): {
  symbol: string;
  name: string;
  value: number;
  percentage: number;
  color: string;
}[] {
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return holdings.map((h, i) => ({
    symbol: h.fundSymbol,
    name: h.fund.name,
    value: h.currentValue,
    percentage: totalValue > 0 ? (h.currentValue / totalValue) * 100 : 0,
    color: colors[i % colors.length],
  }));
}

export function calculateTotalDeposited(
  transactions: { type: string; amount: number; taxYear: string }[],
  taxYear: string
): number {
  return transactions
    .filter((t) => t.taxYear === taxYear && t.type === "DEPOSIT")
    .reduce((sum, t) => sum + t.amount, 0);
}
