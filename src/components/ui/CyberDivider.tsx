import { cn } from "@/lib/utils";

export function CyberDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
      <span className="h-1 w-1 bg-neon-cyan/50" />
      <span className="h-1 w-1 bg-neon-cyan/30" />
      <span className="h-1 w-1 bg-neon-cyan/50" />
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
    </div>
  );
}
