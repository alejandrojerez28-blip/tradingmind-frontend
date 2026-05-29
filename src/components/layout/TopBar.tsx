"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { screenTitle } from "./nav";
import { StatusPill } from "@/components/ui/StatusPill";
import { useSystemStore } from "@/lib/store";
import { etClock, formatPrice } from "@/lib/utils";

const SIMULATED_CAPITAL = 2500;

function useMarketStatus() {
  const schedulerRunning = useSystemStore((s) => s.schedulerRunning);
  const backendOnline = useSystemStore((s) => s.backendOnline);

  const now = new Date();
  const etParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);
  const weekday = etParts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(etParts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(etParts.find((p) => p.type === "minute")?.value ?? "0");
  const minutes = hour * 60 + minute;
  const isWeekday = !["Sat", "Sun"].includes(weekday);
  const isOpen = isWeekday && minutes >= 9 * 60 + 35 && minutes <= 15 * 60 + 30;

  if (!backendOnline)
    return { tone: "red" as const, label: "SISTEMA DETENIDO" };
  if (isOpen)
    return { tone: "green" as const, label: schedulerRunning ? "SISTEMA ACTIVO" : "MERCADO ABIERTO" };
  return { tone: "amber" as const, label: "MERCADO CERRADO" };
}

export function TopBar() {
  const pathname = usePathname();
  const market = useMarketStatus();
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    setClock(etClock());
    const id = setInterval(() => setClock(etClock()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex h-12 items-center justify-between border-b border-neon-cyan/10 bg-deep/60 px-5 backdrop-blur-xl">
      <div className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.22em] text-muted">
        <span className="text-neon-cyan">TM</span>
        <span className="text-dim">/</span>
        <span className="text-ink">{screenTitle(pathname)}</span>
      </div>

      <StatusPill tone={market.tone} label={market.label} />

      <div className="flex items-center gap-5">
        <span className="font-mono text-xs text-neon-blue">{clock} ET</span>
        <span className="hidden items-center gap-2 sm:flex">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Capital
          </span>
          <span className="font-mono text-sm font-bold text-neon-cyan">
            {formatPrice(SIMULATED_CAPITAL)}
          </span>
        </span>
      </div>
    </header>
  );
}
