import { cn } from "@/lib/utils";

export type Grade = "READY" | "IMPROVING" | "NOT_READY" | string;

export function gradeTone(grade: Grade): "green" | "amber" | "red" {
  if (grade === "READY") return "green";
  if (grade === "IMPROVING") return "amber";
  return "red";
}

const styles = {
  green: "text-neon-green border-neon-green/50 bg-neon-green/10 text-glow-green",
  amber: "text-neon-amber border-neon-amber/50 bg-neon-amber/10 text-glow-amber",
  red: "text-neon-red border-neon-red/50 bg-neon-red/10 text-glow-red",
};

const labels: Record<string, string> = {
  READY: "READY",
  IMPROVING: "IMPROVING",
  NOT_READY: "NOT READY",
};

export function GradeBadge({
  grade,
  size = "md",
  className,
}: {
  grade: Grade;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const tone = gradeTone(grade);
  const pad =
    size === "lg"
      ? "px-4 py-1.5 text-base"
      : size === "sm"
        ? "px-2 py-0.5 text-[11px]"
        : "px-3 py-1 text-sm";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border font-display font-bold uppercase tracking-widest",
        pad,
        styles[tone],
        className
      )}
    >
      {labels[grade] ?? grade}
    </span>
  );
}
