"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hexagon } from "lucide-react";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "./nav";
import { cn } from "@/lib/utils";
import { useSystemStore } from "@/lib/store";

export function Sidebar() {
  const pathname = usePathname();
  const backendOnline = useSystemStore((s) => s.backendOnline);
  const dbOnline = useSystemStore((s) => s.dbOnline);

  return (
    <motion.aside
      initial={false}
      className="group/sidebar fixed left-0 top-0 z-40 flex h-full w-16 flex-col border-r border-neon-cyan/10 bg-deep/80 backdrop-blur-xl transition-[width] duration-300 hover:w-[220px]"
    >
      <div className="flex h-12 items-center gap-3 overflow-hidden px-[18px]">
        <span className="relative shrink-0">
          <Hexagon className="h-6 w-6 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-neon-cyan">
            TM
          </span>
        </span>
        <span className="whitespace-nowrap font-display text-sm font-bold tracking-[0.18em] text-ink opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
          TRADINGMIND
        </span>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 px-2.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "relative flex h-11 items-center gap-3 overflow-hidden rounded-lg px-[10px] transition-colors",
                active
                  ? "bg-neon-cyan/10 text-neon-cyan"
                  : "text-muted hover:bg-hover hover:text-ink"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              )}
              <Icon className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="flex h-14 items-center gap-3 overflow-hidden border-t border-neon-cyan/10 px-[18px]">
        <span
          className={cn(
            "h-2.5 w-2.5 shrink-0 rounded-full",
            backendOnline ? "bg-neon-green dot-pulse" : "bg-neon-red"
          )}
        />
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100">
          {backendOnline ? (dbOnline ? "Backend · DB OK" : "Backend · DB off") : "Offline"}
        </span>
      </div>
    </motion.aside>
  );
}
