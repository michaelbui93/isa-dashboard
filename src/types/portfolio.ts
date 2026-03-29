import type { Fund } from "./fund";

export interface Holding {
  id: string;
  fundSymbol: string;
  shares: number;
  averageCostPerShare: number;
  purchaseDate: string;
  lastUpdated: string;
}

export interface Portfolio {
  holdings: Holding[];
  cashBalance: number;
  lastUpdated: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
  cashBalance: number;
}

export interface HoldingWithDetails extends Holding {
  fund: Fund;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  allocation: number;
  drawdownPercent: number;
}
