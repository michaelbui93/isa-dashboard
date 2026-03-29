"use client";

import { PageTransition } from "@/components/layout/page-transition";

import { Header } from "@/components/layout/header";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { useTransactions } from "@/hooks/use-transactions";

export default function TransactionsPage() {
  const { transactions } = useTransactions();

  return (
    <PageTransition>
      <>
      <Header title="Transactions" />
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <TransactionTable transactions={transactions} />
      </div>
    </>
    </PageTransition>
  );
}
