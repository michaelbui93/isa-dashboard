export type FundCategory =
  | "US Equity"
  | "Global Equity"
  | "UK Equity"
  | "Emerging Markets"
  | "Bonds"
  | "Mixed Assets"
  | "Sector - Technology"
  | "Sector - Healthcare";

export interface PricePoint {
  date: string;
  price: number;
}

export interface Fund {
  symbol: string;
  name: string;
  isin: string;
  provider: string;
  category: FundCategory;
  currency: "GBP" | "USD" | "EUR";
  currentPrice: number;
  previousClose: number;
  dayChange: number;
  yearChange: number;
  ter: number;
  dividendYield?: number;
  accumulatingOrDistributing: "Acc" | "Dist";
  description: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  priceHistory: PricePoint[];
}
