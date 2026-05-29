"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { blockBlink } from "@/lib/motion";

type Variant =
  | "allow"
  | "block"
  | "warn"
  | "ai"
  | "info"
  | "error"
  | "closed"
  | "neutral";

const styles: Record<Variant, string> = {
  allow: "text-neon-green border-neon-green/40 bg-neon-green/10",
  block: "text-neon-red border-neon-red/40 bg-neon-red/10",
  warn: "text-neon-amber border-neon-amber/40 bg-neon-amber/10",
  ai: "text-neon-violet border-neon-violet/40 bg-neon-violet/10",
  info: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
  error: "text-neon-red border-neon-red/50 bg-neon-red/15",
  closed: "text-neon-green border-neon-green/30 bg-neon-green/5",
  neutral: "text-muted border-white/10 bg-white/5",
};

interface NeonBadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  blink?: boolean;
}

export function NeonBadge({
  variant = "neutral",
  children,
  className,
  blink,
}: NeonBadgeProps) {
  return (
    <motion.span
      variants={blink ? blockBlink : undefined}
      initial={blink ? "initial" : undefined}
      animate={blink ? "animate" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider",
        styles[variant],
        className
      )}
    >
      {children}
    </motion.span>
  );
}
