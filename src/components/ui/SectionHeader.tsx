import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  accent?: "cyan" | "green" | "red" | "amber" | "violet" | "blue";
  right?: React.ReactNode;
  className?: string;
}

const accentBg: Record<NonNullable<SectionHeaderProps["accent"]>, string> = {
  cyan: "bg-neon-cyan",
  green: "bg-neon-green",
  red: "bg-neon-red",
  amber: "bg-neon-amber",
  violet: "bg-neon-violet",
  blue: "bg-neon-blue",
};

export function SectionHeader({
  title,
  accent = "cyan",
  right,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={cn("h-4 w-1 rounded-full", accentBg[accent])} />
        <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.2em] text-ink truncate">
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}
