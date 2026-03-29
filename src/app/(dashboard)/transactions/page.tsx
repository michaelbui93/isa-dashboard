"use client";

import { PageTransition } from "@/components/layout/page-transition";
import { Header } from "@/components/layout/header";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { TransactionTableSkeleton } from "@/components/skeletons/portfolio-skeletons";
import { useTransactions } from "@/hooks/use-transactions";
import { useLoadingState } from "@/hooks/use-loading-state";

export default function TransactionsPage() {
  const { transactions } = useTransactions();
  const loading = useLoadingState(500);

  return (
    <PageTransition>
      <>
        <Header title="Transactions" />
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {loading ? (
            <TransactionTableSkeleton />
          ) : (
            <div className="transition-opacity duration-300">
              <TransactionTable transactions={transactions} />
            </div>
          )}
        </div>
      </>
    </PageTransition>
  );
}
