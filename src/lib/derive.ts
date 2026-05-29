import type { PaperTrade } from "./types";

export const BASE_CAPITAL = 2500;

function etDateKey(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

export interface Kpis {
  capitalNow: number;
  capitalPct: number;
  pnlToday: number;
  pnlTodayPct: number;
  pnlWeek: number;
  pnlWeekPct: number;
  unrealized: number;
  openCount: number;
}

export function deriveKpis(trades: PaperTrade[]): Kpis {
  const open = trades.filter((t) => t.status === "OPEN");
  const closed = trades.filter((t) => t.status === "CLOSED");

  const unrealized = open.reduce((s, t) => s + (t.simulated_pnl ?? 0), 0);
  const realizedTotal = closed.reduce((s, t) => s + (t.simulated_pnl ?? 0), 0);

  const todayKey = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const realizedToday = closed
    .filter((t) => etDateKey(t.closed_at) === todayKey)
    .reduce((s, t) => s + (t.simulated_pnl ?? 0), 0);

  const realizedWeek = closed
    .filter((t) => t.closed_at && new Date(t.closed_at).getTime() >= weekAgo)
    .reduce((s, t) => s + (t.simulated_pnl ?? 0), 0);

  const capitalNow = BASE_CAPITAL + realizedTotal + unrealized;
  const pnlToday = realizedToday + unrealized;
  const pnlWeek = realizedWeek + unrealized;

  return {
    capitalNow,
    capitalPct: ((capitalNow - BASE_CAPITAL) / BASE_CAPITAL) * 100,
    pnlToday,
    pnlTodayPct: (pnlToday / BASE_CAPITAL) * 100,
    pnlWeek,
    pnlWeekPct: (pnlWeek / BASE_CAPITAL) * 100,
    unrealized,
    openCount: open.length,
  };
}

export interface CurvePoint {
  time: number; // unix seconds
  value: number;
}

export function capitalCurve(trades: PaperTrade[]): CurvePoint[] {
  const closed = trades
    .filter((t) => t.status === "CLOSED" && t.closed_at)
    .sort(
      (a, b) =>
        new Date(a.closed_at as string).getTime() -
        new Date(b.closed_at as string).getTime()
    );

  let equity = BASE_CAPITAL;
  const points: CurvePoint[] = [];
  const seen = new Set<number>();
  for (const t of closed) {
    equity += t.simulated_pnl ?? 0;
    let time = Math.floor(new Date(t.closed_at as string).getTime() / 1000);
    while (seen.has(time)) time += 1;
    seen.add(time);
    points.push({ time, value: Number(equity.toFixed(2)) });
  }
  return points;
}

/** Proximidad al stop: 0 = en el stop, 1 = lejos (en/encima de entrada). */
export function stopProximity(t: PaperTrade): number | null {
  if (t.stop_loss_price == null) return null;
  const current = t.current_price ?? t.entry_price;
  const span = t.entry_price - t.stop_loss_price;
  if (span <= 0) return null;
  return Math.max(0, Math.min(1, (current - t.stop_loss_price) / span));
}

export function daysToExpiration(t: PaperTrade): number | null {
  if (!t.option_expiration) return null;
  const diff = new Date(t.option_expiration).getTime() - Date.now();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}
