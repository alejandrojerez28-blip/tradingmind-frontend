"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tone = "cyan" | "green" | "red" | "amber" | "violet";

const stroke: Record<Tone, string> = {
  cyan: "#00E5FF",
  green: "#00FF88",
  red: "#FF1744",
  amber: "#FFB300",
  violet: "#B388FF",
};

interface CircularGaugeProps {
  value: number; // 0-100
  size?: number;
  thickness?: number;
  tone?: Tone;
  label?: string;
  sublabel?: string;
  display?: string;
}

export function CircularGauge({
  value,
  size = 96,
  thickness = 7,
  tone = "cyan",
  label,
  sublabel,
  display,
}: CircularGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={thickness}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke[tone]}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${stroke[tone]})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-mono font-bold leading-none")} style={{ color: stroke[tone], fontSize: size * 0.24 }}>
          {display ?? Math.round(clamped)}
        </span>
        {label && (
          <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted">
            {label}
          </span>
        )}
        {sublabel && <span className="font-mono text-[9px] text-dim">{sublabel}</span>}
      </div>
    </div>
  );
}
