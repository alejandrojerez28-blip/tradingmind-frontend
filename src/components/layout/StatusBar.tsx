"use client";

import { useSystemStore } from "@/lib/store";
import { relativeTime } from "@/lib/utils";

const kindColor: Record<string, string> = {
  ALLOW: "text-neon-cyan",
  BLOCK: "text-neon-red",
  WARN: "text-neon-amber",
  CLOSED: "text-neon-green",
  INFO: "text-muted",
};

export function StatusBar() {
  const events = useSystemStore((s) => s.events);

  const items =
    events.length > 0
      ? events
      : [{ id: "idle", ts: Date.now(), kind: "INFO", message: "Sistema en espera de eventos…" }];

  const doubled = [...items, ...items];

  return (
    <footer className="relative h-6 shrink-0 overflow-hidden border-t border-neon-cyan/10 bg-void/80">
      <div className="ticker-track h-6 items-center">
        {doubled.map((e, i) => (
          <span key={`${e.id}-${i}`} className="inline-flex items-center gap-2 px-6 text-[11px]">
            <span className={`font-mono font-bold uppercase ${kindColor[e.kind] ?? "text-muted"}`}>
              {e.kind}
            </span>
            <span className="text-muted">{e.message}</span>
            <span className="text-dim">· {relativeTime(new Date(e.ts).toISOString())}</span>
            <span className="text-dim">|</span>
          </span>
        ))}
      </div>
    </footer>
  );
}
