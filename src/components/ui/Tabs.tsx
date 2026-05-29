"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export function Tabs({
  items,
  active,
  onChange,
  className,
}: {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-white/10 bg-void/40 p-1",
        className
      )}
    >
      {items.map((it) => {
        const isActive = it.id === active;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={cn(
              "relative rounded-md px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors",
              isActive ? "text-neon-cyan" : "text-muted hover:text-ink"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tab-active"
                className="absolute inset-0 rounded-md border border-neon-cyan/40 bg-neon-cyan/10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">
              {it.label}
              {it.count !== undefined && (
                <span className="ml-1.5 opacity-60">{it.count}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
