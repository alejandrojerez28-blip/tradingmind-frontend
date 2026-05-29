"use client";

import { cn } from "@/lib/utils";

type Tone = "green" | "amber" | "red" | "cyan" | "muted";

const dotColor: Record<Tone, string> = {
  green: "text-neon-green",
  amber: "text-neon-amber",
  red: "text-neon-red",
  cyan: "text-neon-cyan",
  muted: "text-muted",
};

const textColor: Record<Tone, string> = {
  green: "text-neon-green",
  amber: "text-neon-amber",
  red: "text-neon-red",
  cyan: "text-neon-cyan",
  muted: "text-muted",
};

interface StatusPillProps {
  tone: Tone;
  label: string;
  pulse?: boolean;
  className?: string;
}

export function StatusPill({ tone, label, pulse = true, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1",
        className
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full bg-current",
          dotColor[tone],
          pulse && "dot-pulse"
        )}
      />
      <span
        className={cn(
          "font-mono text-[11px] font-bold uppercase tracking-widest",
          textColor[tone]
        )}
      >
        {label}
      </span>
    </span>
  );
}
