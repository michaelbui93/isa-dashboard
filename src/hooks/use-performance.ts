"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface PortfolioSnapshot {
  snapshot_date: string;
  total_value: number;
  cash_balance: number | null;
  invested_value: number | null;
  ppl: number | null;
}

export function usePerformance() {
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user || cancelled) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      supabase
        .from("portfolio_snapshots")
        .select("snapshot_date, total_value, cash_balance, invested_value, ppl")
        .eq("user_id", data.user.id)
        .order("snapshot_date", { ascending: true })
        .limit(365)
        .then(({ data: rows, error: err }) => {
          if (cancelled) return;
          if (err) {
            setError(err.message);
          } else {
            setSnapshots((rows as PortfolioSnapshot[]) ?? []);
          }
          setIsLoading(false);
        });
    });

    return () => { cancelled = true; };
  }, []);

  return { snapshots, isLoading, error };
}
