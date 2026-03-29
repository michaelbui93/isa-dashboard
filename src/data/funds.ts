import type { Fund, PricePoint } from "@/types";

function generatePriceHistory(
  currentPrice: number,
  days: number,
  volatility = 0.015,
  trend = 1.15
): PricePoint[] {
  const history: PricePoint[] = [];
  let price = currentPrice / trend;
  const dailyReturn = Math.pow(trend, 1 / days);

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const randomFactor = 1 + (Math.random() - 0.5) * volatility * 2;
    price = price * dailyReturn * randomFactor;

    history.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price),
    });
  }

  history[history.length - 1].price = currentPrice;
  return history;
}

export const FUNDS: Fund[] = [
  {
    symbol: "VUAG",
    name: "Vanguard S&P 500 UCITS ETF (Acc)",
    isin: "IE00BFMXXD54",
    provider: "Vanguard",
    category: "US Equity",
    currency: "GBP",
    currentPrice: 9717,
    previousClose: 9630,
    peakPrice: 10480,
    dayChange: 0.9,
    yearChange: 24.5,
    ter: 0.07,
    accumulatingOrDistributing: "Acc",
    description:
      "Tracks the S&P 500 Index, providing exposure to 500 of the largest US companies. Dividends are reinvested automatically.",
    riskLevel: 4,
    priceHistory: generatePriceHistory(9717, 365, 0.012, 1.245),
  },
  {
    symbol: "VUSA",
    name: "Vanguard S&P 500 UCITS ETF (Dist)",
    isin: "GB00B3X7QG63",
    provider: "Vanguard",
    category: "US Equity",
    currency: "GBP",
    currentPrice: 8245,
    previousClose: 8190,
    peakPrice: 8560,
    dayChange: 0.67,
    yearChange: 23.8,
    ter: 0.07,
    dividendYield: 1.32,
    accumulatingOrDistributing: "Dist",
    description:
      "Distributing version of the S&P 500 tracker, paying quarterly dividends to investors.",
    riskLevel: 4,
    priceHistory: generatePriceHistory(8245, 365, 0.012, 1.238),
  },
  {
    symbol: "VWRP",
    name: "Vanguard FTSE All-World UCITS ETF (Acc)",
    isin: "IE00BK5BQT80",
    provider: "Vanguard",
    category: "Global Equity",
    currency: "GBP",
    currentPrice: 12718,
    previousClose: 12658,
    peakPrice: 13050,
    dayChange: 0.47,
    yearChange: 18.2,
    ter: 0.22,
    accumulatingOrDistributing: "Acc",
    description:
      "Tracks the FTSE All-World Index, covering over 90% of the global investable market capitalisation.",
    riskLevel: 4,
    priceHistory: generatePriceHistory(12718, 365, 0.01, 1.182),
  },
  {
    symbol: "VWRL",
    name: "Vanguard FTSE All-World UCITS ETF (Dist)",
    isin: "IE00B3RBWM25",
    provider: "Vanguard",
    category: "Global Equity",
    currency: "GBP",
    currentPrice: 11234,
    previousClose: 11180,
    peakPrice: 11580,
    dayChange: 0.48,
    yearChange: 17.9,
    ter: 0.22,
    dividendYield: 1.85,
    accumulatingOrDistributing: "Dist",
    description:
      "Distributing global equity ETF with quarterly dividend payments covering developed and emerging markets.",
    riskLevel: 4,
    priceHistory: generatePriceHistory(11234, 365, 0.01, 1.179),
  },
  {
    symbol: "VFEG",
    name: "Vanguard FTSE Emerging Markets UCITS ETF (Acc)",
    isin: "IE00BK5BR626",
    provider: "Vanguard",
    category: "Emerging Markets",
    currency: "GBP",
    currentPrice: 5890,
    previousClose: 5920,
    peakPrice: 7240,
    dayChange: -0.51,
    yearChange: 8.4,
    ter: 0.22,
    accumulatingOrDistributing: "Acc",
    description:
      "Exposure to large and mid-cap stocks in emerging markets including China, India, and Brazil.",
    riskLevel: 5,
    priceHistory: generatePriceHistory(5890, 365, 0.018, 1.084),
  },
  {
    symbol: "VUKE",
    name: "Vanguard FTSE 100 UCITS ETF (Dist)",
    isin: "IE00B810Q511",
    provider: "Vanguard",
    category: "UK Equity",
    currency: "GBP",
    currentPrice: 3456,
    previousClose: 3440,
    peakPrice: 3590,
    dayChange: 0.47,
    yearChange: 12.3,
    ter: 0.09,
    dividendYield: 3.65,
    accumulatingOrDistributing: "Dist",
    description:
      "Tracks the FTSE 100 Index of the 100 largest UK-listed companies by market capitalisation.",
    riskLevel: 4,
    priceHistory: generatePriceHistory(3456, 365, 0.01, 1.123),
  },
  {
    symbol: "CSPX",
    name: "iShares Core S&P 500 UCITS ETF (Acc)",
    isin: "IE00B5BMR087",
    provider: "iShares",
    category: "US Equity",
    currency: "GBP",
    currentPrice: 58234,
    previousClose: 57800,
    peakPrice: 61800,
    dayChange: 0.75,
    yearChange: 25.1,
    ter: 0.07,
    accumulatingOrDistributing: "Acc",
    description:
      "BlackRock's flagship S&P 500 tracker with accumulating dividends and one of the largest ETFs globally.",
    riskLevel: 4,
    priceHistory: generatePriceHistory(58234, 365, 0.012, 1.251),
  },
  {
    symbol: "SWDA",
    name: "iShares Core MSCI World UCITS ETF (Acc)",
    isin: "IE00B4L5Y983",
    provider: "iShares",
    category: "Global Equity",
    currency: "GBP",
    currentPrice: 9156,
    previousClose: 9100,
    peakPrice: 9430,
    dayChange: 0.62,
    yearChange: 19.8,
    ter: 0.2,
    accumulatingOrDistributing: "Acc",
    description:
      "Tracks the MSCI World Index covering developed markets globally with over 1,500 companies.",
    riskLevel: 4,
    priceHistory: generatePriceHistory(9156, 365, 0.011, 1.198),
  },
  {
    symbol: "EQQQ",
    name: "Invesco EQQQ NASDAQ-100 UCITS ETF (Acc)",
    isin: "IE0032077012",
    provider: "Invesco",
    category: "Sector - Technology",
    currency: "GBP",
    currentPrice: 42567,
    previousClose: 42100,
    peakPrice: 51800,
    dayChange: 1.11,
    yearChange: 32.4,
    ter: 0.3,
    accumulatingOrDistributing: "Acc",
    description:
      "Tracks the NASDAQ-100 Index of the largest non-financial companies listed on NASDAQ.",
    riskLevel: 5,
    priceHistory: generatePriceHistory(42567, 365, 0.016, 1.324),
  },
  {
    symbol: "VAGP",
    name: "Vanguard Global Aggregate Bond UCITS ETF (Acc)",
    isin: "IE00BG47KH54",
    provider: "Vanguard",
    category: "Bonds",
    currency: "GBP",
    currentPrice: 2345,
    previousClose: 2340,
    peakPrice: 3010,
    dayChange: 0.21,
    yearChange: 4.2,
    ter: 0.1,
    accumulatingOrDistributing: "Acc",
    description:
      "Diversified exposure to global investment-grade bonds including government and corporate debt.",
    riskLevel: 2,
    priceHistory: generatePriceHistory(2345, 365, 0.005, 1.042),
  },
  {
    symbol: "VGOV",
    name: "Vanguard UK Gilt UCITS ETF (Dist)",
    isin: "IE00B42WWV65",
    provider: "Vanguard",
    category: "Bonds",
    currency: "GBP",
    currentPrice: 1987,
    previousClose: 1980,
    peakPrice: 2180,
    dayChange: 0.35,
    yearChange: 2.8,
    ter: 0.07,
    dividendYield: 3.12,
    accumulatingOrDistributing: "Dist",
    description: "Exposure to UK government bonds (gilts) with varying maturities.",
    riskLevel: 2,
    priceHistory: generatePriceHistory(1987, 365, 0.004, 1.028),
  },
  {
    symbol: "V3AM",
    name: "Vanguard LifeStrategy 80% Equity UCITS ETF (Acc)",
    isin: "IE00BMVB5R75",
    provider: "Vanguard",
    category: "Mixed Assets",
    currency: "GBP",
    currentPrice: 3234,
    previousClose: 3210,
    peakPrice: 3380,
    dayChange: 0.75,
    yearChange: 14.6,
    ter: 0.25,
    accumulatingOrDistributing: "Acc",
    description:
      "Multi-asset fund with 80% equities and 20% bonds, designed for growth-oriented investors.",
    riskLevel: 4,
    priceHistory: generatePriceHistory(3234, 365, 0.009, 1.146),
  },
];

export function getFundBySymbol(symbol: string): Fund | undefined {
  return FUNDS.find((f) => f.symbol === symbol);
}

export function getFundsByCategory(category: string): Fund[] {
  return FUNDS.filter((f) => f.category === category);
}

export function searchFunds(query: string): Fund[] {
  const lowerQuery = query.toLowerCase();
  return FUNDS.filter(
    (f) =>
      f.symbol.toLowerCase().includes(lowerQuery) ||
      f.name.toLowerCase().includes(lowerQuery) ||
      f.provider.toLowerCase().includes(lowerQuery)
  );
}
