"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Radar, ArrowUpRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowButton } from "@/components/ui/GlowButton";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { MiniSparkline } from "@/components/charts/MiniSparkline";
import { useTriggerScan } from "@/hooks/useData";
import { usePaperTrades } from "@/hooks/useData";
import { useSystemStore } from "@/lib/store";
import { WATCHLIST_DEFAULT } from "@/lib/api";
import { seededSparkline } from "@/lib/utils";

export default function WatchlistPage() {
  const scan = useTriggerScan();
  const pushEvent = useSystemStore((s) => s.pushEvent);
  const { data: trades } = usePaperTrades({ status: "OPEN", limit: 100 }, 20_000);

  const openByTicker = new Set((trades ?? []).map((t) => t.ticker));

  function runScan() {
    scan.mutate(undefined, {
      onSuccess: (res) => {
        const allow = res.results.filter((r) => r.decision === "ALLOW").length;
        pushEvent({
          kind: allow > 0 ? "ALLOW" : "BLOCK",
          message: `Watchlist scan: ${allow}/${res.results.length} ALLOW`,
        });
      },
    });
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="space-y-5 p-5"
    >
      <div className="flex items-center justify-between">
        <SectionHeader title="Watchlist" className="mb-0" />
        <GlowButton tone="cyan" size="sm" onClick={runScan} disabled={scan.isPending}>
          <Radar className="h-3.5 w-3.5" />
          {scan.isPending ? "Escaneando…" : "Scan universo"}
        </GlowButton>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {WATCHLIST_DEFAULT.map((ticker) => {
          const spark = seededSparkline(ticker, 24);
          const trend = spark[spark.length - 1] - spark[0];
          const up = trend >= 0;
          const hasOpen = openByTicker.has(ticker);
          return (
            <motion.div key={ticker} variants={fadeInUp}>
              <Tilt
                tiltMaxAngleX={6}
                tiltMaxAngleY={6}
                glareEnable
                glareMaxOpacity={0.1}
                glareColor={up ? "#00FF88" : "#FF1744"}
                transitionSpeed={1400}
              >
                <Link href={`/signal/${ticker}`}>
                  <NeonCard glow={up ? "green" : "red"} className="group">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-display text-lg font-bold tracking-wide text-ink">
                          {ticker}
                        </span>
                        {hasOpen && (
                          <NeonBadge variant="info" className="ml-2">
                            OPEN
                          </NeonBadge>
                        )}
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-neon-cyan" />
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <MiniSparkline
                        data={spark}
                        color={up ? "#00FF88" : "#FF1744"}
                      />
                      <span
                        className={`font-mono text-sm font-bold ${
                          up ? "text-neon-green" : "text-neon-red"
                        }`}
                      >
                        {up ? "+" : ""}
                        {trend.toFixed(1)}%
                      </span>
                    </div>
                  </NeonCard>
                </Link>
              </Tilt>
            </motion.div>
          );
        })}
      </motion.div>

      <p className="font-mono text-[11px] text-dim">
        * Las mini-series son indicativas (universo configurado). Pulsa un ticker para
        el análisis de señal o ejecuta un scan para evaluar setups reales.
      </p>
    </motion.div>
  );
}
