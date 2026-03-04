import type { Portfolio } from "@/types";

export const INITIAL_PORTFOLIO: Portfolio = {
  holdings: [
    {
      id: "h1",
      fundSymbol: "VUAG",
      shares: 45.5,
      averageCostPerShare: 8500,
      purchaseDate: "2023-06-15",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "h2",
      fundSymbol: "VWRP",
      shares: 22.0,
      averageCostPerShare: 11000,
      purchaseDate: "2023-09-20",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "h3",
      fundSymbol: "EQQQ",
      shares: 8.5,
      averageCostPerShare: 38000,
      purchaseDate: "2024-01-10",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "h4",
      fundSymbol: "VAGP",
      shares: 100.0,
      averageCostPerShare: 2200,
      purchaseDate: "2024-03-05",
      lastUpdated: new Date().toISOString(),
    },
  ],
  cashBalance: 125000,
  lastUpdated: new Date().toISOString(),
};
