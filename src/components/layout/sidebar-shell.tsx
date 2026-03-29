"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";

const STORAGE_KEY = "isa-sidebar-collapsed";

export function SidebarShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setCollapsed(stored === "true");
    setMounted(true);
  }, []);

  const desktopMargin = collapsed ? 64 : 288;

  return (
    <>
      <Sidebar onCollapsedChange={setCollapsed} />
      <motion.main
        className="min-h-screen pb-20 md:pb-0"
        initial={false}
        animate={{ marginLeft: mounted && isDesktop ? desktopMargin : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.main>
    </>
  );
}
