"use client";

import { useMemo, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "./use-local-storage";
import { INITIAL_TRANSACTIONS } from "@/data/mock-transactions";
import { STORAGE_KEYS, getCurrentTaxYear } from "@/lib/constants";
import type { Transaction, TransactionType, TransactionFilters } from "@/types";

export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    STORAGE_KEYS.TRANSACTIONS,
    INITIAL_TRANSACTIONS
  );

  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions]
  );

  const addTransaction = useCallback(
    (
      type: TransactionType,
      amount: number,
      options?: {
        fundSymbol?: string;
        shares?: number;
        pricePerShare?: number;
        description?: string;
        date?: string;
      }
    ) => {
      const taxYear = getCurrentTaxYear();
      const newTransaction: Transaction = {
        id: uuidv4(),
        type,
        date: options?.date || new Date().toISOString().split("T")[0],
        amount,
        fundSymbol: options?.fundSymbol,
        shares: options?.shares,
        pricePerShare: options?.pricePerShare,
        description: options?.description || `${type} transaction`,
        taxYear: taxYear.id,
      };

      setTransactions((prev) => [...prev, newTransaction]);
      return newTransaction;
    },
    [setTransactions]
  );

  const removeTransaction = useCallback(
    (transactionId: string) => {
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    },
    [setTransactions]
  );

  const filterTransactions = useCallback(
    (filters: TransactionFilters): Transaction[] => {
      return sortedTransactions.filter((t) => {
        if (filters.type && filters.type.length > 0 && !filters.type.includes(t.type)) {
          return false;
        }
        if (filters.fundSymbol && t.fundSymbol !== filters.fundSymbol) {
          return false;
        }
        if (filters.dateFrom && new Date(t.date) < new Date(filters.dateFrom)) {
          return false;
        }
        if (filters.dateTo && new Date(t.date) > new Date(filters.dateTo)) {
          return false;
        }
        if (filters.taxYear && t.taxYear !== filters.taxYear) {
          return false;
        }
        return true;
      });
    },
    [sortedTransactions]
  );

  const getTransactionsByTaxYear = useCallback(
    (taxYearId: string) => {
      return sortedTransactions.filter((t) => t.taxYear === taxYearId);
    },
    [sortedTransactions]
  );

  return {
    transactions: sortedTransactions,
    addTransaction,
    removeTransaction,
    filterTransactions,
    getTransactionsByTaxYear,
  };
}
