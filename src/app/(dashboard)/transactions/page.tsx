"use client";

import { Header } from "@/components/layout/header";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { useTransactions } from "@/hooks/use-transactions";

export default function TransactionsPage() {
  const { transactions } = useTransactions();

  return (
    <>
      <Header title="Transactions" />
      <div className="p-6 space-y-6">
        <TransactionTable transactions={transactions} />
      </div>
    </>
  );
}
