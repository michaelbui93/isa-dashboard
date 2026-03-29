"use client";

import { useState, useEffect } from "react";

/** Simulates a 500ms loading state on mount, then fades in real content */
export function useLoadingState(delay = 500) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return loading;
}
