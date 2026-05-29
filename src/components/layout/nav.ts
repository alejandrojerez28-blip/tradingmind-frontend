import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Eye,
  FileText,
  LayoutDashboard,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/watchlist", label: "Watchlist", icon: Eye },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/scorecard", label: "Scorecard", icon: BarChart3 },
  { href: "/reports", label: "Reportes", icon: FileText },
  { href: "/briefing", label: "Briefing", icon: ClipboardList },
  { href: "/journal", label: "Journal", icon: BookOpen },
];

export function screenTitle(pathname: string): string {
  if (pathname.startsWith("/signal")) return "Signal Analysis";
  const item = NAV_ITEMS.find((n) => pathname.startsWith(n.href));
  return item ? item.label : "TradingMind";
}
