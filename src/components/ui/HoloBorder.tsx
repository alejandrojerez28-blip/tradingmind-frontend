import { cn } from "@/lib/utils";

interface HoloBorderProps {
  children: React.ReactNode;
  className?: string;
}

export function HoloBorder({ children, className }: HoloBorderProps) {
  return (
    <div className={cn("holo-gradient rounded-xl p-px", className)}>
      <div className="rounded-[11px] bg-deep/80">{children}</div>
    </div>
  );
}
