"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, TrendingUp, PiggyBank, Receipt, Search,
  Sun, Moon, Command, X,
} from "lucide-react";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string;
}

function score(cmd: Command, query: string): number {
  const q = query.toLowerCase();
  const label = cmd.label.toLowerCase();
  const desc = (cmd.description ?? "").toLowerCase();
  const kw = (cmd.keywords ?? "").toLowerCase();
  if (label.startsWith(q)) return 3;
  if (label.includes(q)) return 2;
  if (desc.includes(q) || kw.includes(q)) return 1;
  return 0;
}

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: "nav-portfolio", label: "Portfolio", description: "View your holdings", icon: LayoutDashboard, action: () => router.push("/"), keywords: "holdings positions" },
    { id: "nav-performance", label: "Performance", description: "Chart & benchmark", icon: TrendingUp, action: () => router.push("/performance"), keywords: "chart returns" },
    { id: "nav-allowance", label: "ISA Allowance", description: "View allowance & pacing", icon: PiggyBank, action: () => router.push("/allowance"), keywords: "tax year contributions" },
    { id: "nav-transactions", label: "Transactions", description: "Transaction history", icon: Receipt, action: () => router.push("/transactions"), keywords: "buy sell deposit" },
    { id: "nav-funds", label: "Fund Universe", description: "Browse available funds", icon: Search, action: () => router.push("/funds"), keywords: "etf search browse" },
    {
      id: "theme-toggle",
      label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      description: "Toggle colour theme",
      icon: theme === "dark" ? Sun : Moon,
      action: () => setTheme(theme === "dark" ? "light" : "dark"),
      keywords: "theme dark light mode",
    },
  ];

  const filtered = query.trim()
    ? commands.filter((c) => score(c, query) > 0).sort((a, b) => score(b, query) - score(a, query))
    : commands;

  const close = useCallback(() => { setOpen(false); setQuery(""); setActiveIndex(0); }, []);

  const run = useCallback((cmd: Command) => { cmd.action(); close(); }, [close]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Arrow key + enter navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { if (filtered[activeIndex]) run(filtered[activeIndex]); }
    else if (e.key === "Escape") close();
  };

  // Reset active index on query change
  useEffect(() => { setActiveIndex(0); }, [query]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="cmd-backdrop"
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={close}
            />

            {/* Palette */}
            <motion.div
              key="cmd-palette"
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className="fixed z-[70] w-full max-w-lg mx-auto left-0 right-0 bottom-0 md:bottom-auto md:top-[20vh] px-4 md:px-0"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onKeyDown={handleKeyDown}
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search commands…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    aria-label="Search commands"
                  />
                  <button onClick={close} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Results */}
                <div className="py-2 max-h-72 overflow-y-auto" role="listbox">
                  {filtered.length === 0 && (
                    <p className="px-4 py-3 text-sm text-muted-foreground">No commands found.</p>
                  )}
                  {filtered.map((cmd, i) => (
                    <button
                      key={cmd.id}
                      role="option"
                      aria-selected={i === activeIndex}
                      onClick={() => run(cmd)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={[
                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                        i === activeIndex ? "bg-accent text-foreground" : "text-foreground hover:bg-muted/50",
                      ].join(" ")}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${i === activeIndex ? "bg-primary/20" : "bg-muted"}`}>
                        <cmd.icon className={`h-4 w-4 ${i === activeIndex ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium leading-tight">{cmd.label}</p>
                        {cmd.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{cmd.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer hint */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 text-xs text-muted-foreground">
                  <span>↑↓ navigate · Enter select · Esc close</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">⌘K</kbd>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
