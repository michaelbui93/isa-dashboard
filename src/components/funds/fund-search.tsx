"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "US Equity",
  "Global Equity",
  "UK Equity",
  "Emerging Markets",
  "Bonds",
  "Mixed Assets",
];

interface FundSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function FundSearch({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: FundSearchProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search funds by name, symbol, or provider..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={cn(
              "text-xs",
              selectedCategory === category &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
