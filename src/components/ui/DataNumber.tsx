"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DataNumberProps {
  value: string;
  tone?: "default" | "cyan" | "green" | "red" | "amber" | "violet" | "blue";
  className?: string;
  animateKey?: string | number;
  glow?: boolean;
}

const toneClass: Record<NonNullable<DataNumberProps["tone"]>, string> = {
  default: "text-ink",
  cyan: "text-neon-cyan",
  green: "text-neon-green",
  red: "text-neon-red",
  amber: "text-neon-amber",
  violet: "text-neon-violet",
  blue: "text-neon-blue",
};

const glowClass: Record<NonNullable<DataNumberProps["tone"]>, string> = {
  default: "",
  cyan: "text-glow-cyan",
  green: "text-glow-green",
  red: "text-glow-red",
  amber: "text-glow-amber",
  violet: "text-glow-violet",
  blue: "text-glow-cyan",
};

export function DataNumber({
  value,
  tone = "default",
  className,
  animateKey,
  glow,
}: DataNumberProps) {
  return (
    <span className={cn("font-mono tabular-nums", toneClass[tone], glow && glowClass[tone], className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={animateKey ?? value}
          initial={{ scale: 1.08, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
