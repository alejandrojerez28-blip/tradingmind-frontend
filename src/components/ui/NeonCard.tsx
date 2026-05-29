import { cn } from "@/lib/utils";

type Glow = "none" | "cyan" | "green" | "red" | "amber" | "violet";

const glowMap: Record<Glow, string> = {
  none: "",
  cyan: "shadow-[0_0_20px_rgba(0,229,255,0.4),0_0_60px_rgba(0,229,255,0.15)]",
  green: "shadow-[0_0_20px_rgba(0,255,136,0.4),0_0_60px_rgba(0,255,136,0.15)]",
  red: "shadow-[0_0_20px_rgba(255,23,68,0.4),0_0_60px_rgba(255,23,68,0.15)]",
  amber: "shadow-[0_0_20px_rgba(255,179,0,0.4),0_0_60px_rgba(255,179,0,0.15)]",
  violet: "shadow-[0_0_20px_rgba(179,136,255,0.4),0_0_60px_rgba(179,136,255,0.15)]",
};

interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: Glow;
  noPad?: boolean;
}

export function NeonCard({
  glow = "none",
  className,
  children,
  noPad,
  ...rest
}: NeonCardProps) {
  return (
    <div
      className={cn("glass rounded-xl", !noPad && "p-4", glowMap[glow], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
