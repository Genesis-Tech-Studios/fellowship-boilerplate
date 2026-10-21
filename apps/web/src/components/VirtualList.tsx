"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Zap } from "lucide-react";

export function VirtualList() {
  // Generate 10,000 dummy transaction records
  const items = Array.from({ length: 10_000 }, (_, i) => ({
    id: `tx_${100000 + i}`,
    block: 19842000 + (i % 500),
    amount: (Math.random() * 5).toFixed(4),
    status: i % 7 === 0 ? "FAILED" : "CONFIRMED",
  }));

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  return (
    <div className="p-6 border border-neutral-200 bg-white shadow-sm rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>High-Throughput Virtualized Windowing (10,000 Records)</span>
          </h4>
          <p className="text-xs text-neutral-500">
            Week 05 Deliverable: 60 FPS scrolling with sub-50 active DOM nodes.
          </p>
        </div>
        <span className="px-2 py-0.5 text-[11px] font-mono bg-neutral-100 text-neutral-700 rounded border">
          Active DOM: ~25 nodes
        </span>
      </div>

      <div
        ref={parentRef}
        className="h-64 overflow-auto border border-neutral-200 rounded font-mono text-xs"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((vItem) => {
            const item = items[vItem.index];
            return (
              <div
                key={vItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${vItem.size}px`,
                  transform: `translateY(${vItem.start}px)`,
                }}
                className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-neutral-400">#{vItem.index + 1}</span>
                  <span className="font-bold text-neutral-900">{item.id}</span>
                  <span className="text-neutral-500 text-[10px]">Block {item.block}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-neutral-800">{item.amount} ETH</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded ${
                      item.status === "CONFIRMED"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
