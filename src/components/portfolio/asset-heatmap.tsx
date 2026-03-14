"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { HoldingWithDetails } from "@/types";

interface AssetHeatmapProps {
  holdings: HoldingWithDetails[];
}

interface HeatmapBlock {
  symbol: string;
  name: string;
  currentValue: number;
  gainLossPercent: number;
  allocation: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

function getHeatmapColor(gainLossPercent: number): string {
  if (gainLossPercent <= -10) return "heatmap-loss-severe";
  if (gainLossPercent <= -5) return "heatmap-loss-high";
  if (gainLossPercent <= -2) return "heatmap-loss-medium";
  if (gainLossPercent < -0.5) return "heatmap-loss-low";
  if (gainLossPercent <= 0.5) return "heatmap-neutral";
  if (gainLossPercent < 2) return "heatmap-gain-low";
  if (gainLossPercent < 5) return "heatmap-gain-medium";
  if (gainLossPercent < 10) return "heatmap-gain-high";
  return "heatmap-gain-severe";
}

function calculateTreemapLayout(
  holdings: HoldingWithDetails[],
  containerWidth: number,
  containerHeight: number
): HeatmapBlock[] {
  if (holdings.length === 0) return [];

  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const sortedHoldings = [...holdings].sort((a, b) => b.currentValue - a.currentValue);

  const blocks: HeatmapBlock[] = [];
  let remainingArea = containerWidth * containerHeight;
  let x = 0;
  let y = 0;
  let currentWidth = containerWidth;
  let currentHeight = containerHeight;
  let isVertical = currentWidth > currentHeight;

  for (let i = 0; i < sortedHoldings.length; i++) {
    const holding = sortedHoldings[i];
    const proportion = holding.currentValue / totalValue;
    const area = proportion * containerWidth * containerHeight;

    let blockWidth: number;
    let blockHeight: number;

    if (i === sortedHoldings.length - 1) {
      blockWidth = currentWidth;
      blockHeight = currentHeight;
    } else if (isVertical) {
      blockWidth = Math.min(area / currentHeight, currentWidth);
      blockHeight = currentHeight;
    } else {
      blockWidth = currentWidth;
      blockHeight = Math.min(area / currentWidth, currentHeight);
    }

    blocks.push({
      symbol: holding.fundSymbol,
      name: holding.fund.name,
      currentValue: holding.currentValue,
      gainLossPercent: holding.gainLossPercent,
      allocation: holding.allocation,
      width: Math.max(blockWidth, 0),
      height: Math.max(blockHeight, 0),
      x,
      y,
    });

    if (isVertical) {
      x += blockWidth;
      currentWidth -= blockWidth;
    } else {
      y += blockHeight;
      currentHeight -= blockHeight;
    }

    remainingArea -= area;
    isVertical = currentWidth > currentHeight;
  }

  return blocks;
}

export function AssetHeatmap({ holdings }: AssetHeatmapProps) {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 300 });

  const blocks = useMemo(() => {
    return calculateTreemapLayout(holdings, containerSize.width, containerSize.height);
  }, [holdings, containerSize]);

  if (holdings.length === 0) {
    return (
      <Card className="animate-fade-in-up stagger-3">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
            Add holdings to see your allocation heatmap
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in-up stagger-3">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Asset Allocation</span>
          <div className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm heatmap-loss-high" />
              Loss
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm heatmap-neutral" />
              Flat
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm heatmap-gain-high" />
              Gain
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative w-full rounded-xl overflow-hidden"
          style={{ height: containerSize.height }}
          ref={(el) => {
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.width !== containerSize.width) {
                setContainerSize({
                  width: rect.width,
                  height: Math.min(rect.width * 0.6, 350),
                });
              }
            }
          }}
        >
          {blocks.map((block, index) => (
            <Link
              key={block.symbol}
              href={`/funds/${block.symbol}`}
              className="absolute heatmap-block cursor-pointer"
              style={{
                left: block.x,
                top: block.y,
                width: block.width - 2,
                height: block.height - 2,
                margin: 1,
              }}
              onMouseEnter={() => setHoveredBlock(block.symbol)}
              onMouseLeave={() => setHoveredBlock(null)}
            >
              <div
                className={`relative w-full h-full rounded-lg ${getHeatmapColor(block.gainLossPercent)} flex flex-col items-center justify-center text-white overflow-hidden animate-scale-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {block.width > 60 && block.height > 50 && (
                  <>
                    <span className="font-bold text-sm md:text-base drop-shadow-md">
                      {block.symbol}
                    </span>
                    <span className="text-xs md:text-sm font-medium drop-shadow-md opacity-90">
                      {block.gainLossPercent >= 0 ? "+" : ""}
                      {block.gainLossPercent.toFixed(2)}%
                    </span>
                  </>
                )}
                {block.width > 40 && block.height > 30 && block.width <= 60 && (
                  <span className="font-bold text-xs drop-shadow-md">
                    {block.symbol}
                  </span>
                )}

                {/* Hover overlay */}
                {hoveredBlock === block.symbol && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 rounded-lg backdrop-blur-sm">
                    <span className="font-bold text-sm">{block.symbol}</span>
                    <span className="text-xs text-center line-clamp-2 opacity-80 mt-0.5">
                      {block.name}
                    </span>
                    <span className="font-financial text-sm font-bold mt-1">
                      {formatCurrency(block.currentValue)}
                    </span>
                    <span className="text-xs opacity-80">
                      {block.allocation.toFixed(1)}% of portfolio
                    </span>
                    <span
                      className={`text-sm font-bold mt-1 ${
                        block.gainLossPercent >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {block.gainLossPercent >= 0 ? "+" : ""}
                      {block.gainLossPercent.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile legend with values */}
        <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
          {holdings
            .sort((a, b) => b.currentValue - a.currentValue)
            .map((holding) => (
              <div
                key={holding.fundSymbol}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-sm ${getHeatmapColor(holding.gainLossPercent)}`}
                  />
                  <span className="text-xs font-medium">{holding.fundSymbol}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {holding.allocation.toFixed(1)}%
                </span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
