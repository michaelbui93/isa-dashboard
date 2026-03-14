"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 rounded-xl hover:bg-accent"
      >
        <div className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 rounded-xl hover:bg-accent btn-press"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-muted-foreground theme-toggle-icon" />
      ) : (
        <Moon className="h-5 w-5 text-muted-foreground theme-toggle-icon" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
