export type TransactionType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "BUY"
  | "SELL"
  | "DIVIDEND"
  | "FEE";

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  fundSymbol?: string;
  shares?: number;
  pricePerShare?: number;
  amount: number;
  description: string;
  taxYear: string;
}

export interface TransactionFilters {
  type?: TransactionType[];
  fundSymbol?: string;
  dateFrom?: string;
  dateTo?: string;
  taxYear?: string;
}
