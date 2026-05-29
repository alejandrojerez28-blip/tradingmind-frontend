"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tone = "cyan" | "green" | "red" | "violet";

const tones: Record<Tone, string> = {
  cyan: "border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[var(--glow-cyan)]",
  green: "border-neon-green/50 text-neon-green hover:bg-neon-green/10 hover:shadow-[var(--glow-green)]",
  red: "border-neon-red/50 text-neon-red hover:bg-neon-red/10 hover:shadow-[var(--glow-red)]",
  violet:
    "border-neon-violet/50 text-neon-violet hover:bg-neon-violet/10 hover:shadow-[var(--glow-violet)]",
};

interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  size?: "sm" | "md" | "lg";
}

export function GlowButton({
  tone = "cyan",
  size = "md",
  className,
  children,
  disabled,
  ...rest
}: GlowButtonProps) {
  const pad =
    size === "lg"
      ? "px-6 py-3 text-sm"
      : size === "sm"
        ? "px-3 py-1.5 text-xs"
        : "px-4 py-2 text-xs";

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.96 }}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border bg-transparent font-mono font-bold uppercase tracking-wider transition-all duration-200",
        pad,
        tones[tone],
        disabled && "cursor-not-allowed opacity-40 hover:bg-transparent hover:shadow-none",
        className
      )}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
