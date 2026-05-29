"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { GlowButton } from "@/components/ui/GlowButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { ClosePositionModal } from "./ClosePositionModal";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { daysToExpiration, stopProximity } from "@/lib/derive";
import { formatPnl, formatPrice, formatPct } from "@/lib/utils";
import type { PaperTrade } from "@/lib/types";

function PositionCard({
  t,
  onClose,
}: {
  t: PaperTrade;
  onClose: (t: PaperTrade) => void;
}) {
  const pnl = t.simulated_pnl ?? 0;
  const up = pnl >= 0;
  const prox = stopProximity(t);
  const dte = daysToExpiration(t);
  const isCall = (t.action ?? t.option_type ?? "").toUpperCase().includes("CALL");

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      glareEnable
      glareMaxOpacity={0.12}
      glareColor="#00E5FF"
      glarePosition="all"
      transitionSpeed={1500}
      className="h-full"
    >
      <NeonCard glow={up ? "green" : "red"} className="h-full">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-wide text-ink">
                {t.ticker}
              </span>
              <NeonBadge variant={isCall ? "allow" : "block"}>
                {t.action ?? t.option_type ?? "—"}
              </NeonBadge>
            </div>
            <p className="mt-0.5 font-mono text-[11px] uppercase text-muted">
              {t.setup_type ?? "setup —"}
              {t.option_strike ? ` · ${formatPrice(t.option_strike)}` : ""}
            </p>
          </div>
          <div className="text-right">
            <p className={`font-mono text-lg font-bold ${up ? "text-neon-green" : "text-neon-red"}`}>
              {formatPnl(pnl)}
            </p>
            <p className={`font-mono text-[11px] ${up ? "text-neon-green" : "text-neon-red"}`}>
              {formatPct(t.simulated_pnl_pct, false)}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px]">
          <div>
            <p className="text-dim">Entrada</p>
            <p className="text-ink">{formatPrice(t.entry_price)}</p>
          </div>
          <div>
            <p className="text-dim">Actual</p>
            <p className="text-neon-cyan">{formatPrice(t.current_price)}</p>
          </div>
          <div>
            <p className="text-dim">Stop</p>
            <p className="text-neon-red">{formatPrice(t.stop_loss_price)}</p>
          </div>
        </div>

        {prox !== null && (
          <div className="mt-3">
            <div className="mb-1 flex justify-between font-mono text-[9px] uppercase text-dim">
              <span>Stop</span>
              <span>{dte !== null ? `${dte}d exp` : "Target"}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prox * 100}%` }}
                transition={{ duration: 0.6 }}
                className={`h-full rounded-full ${
                  prox < 0.3 ? "bg-neon-red" : prox < 0.6 ? "bg-neon-amber" : "bg-neon-green"
                }`}
              />
            </div>
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <GlowButton tone="red" size="sm" onClick={() => onClose(t)}>
            Cerrar
          </GlowButton>
        </div>
      </NeonCard>
    </Tilt>
  );
}

export function OpenPositions({
  trades,
  loading,
}: {
  trades: PaperTrade[];
  loading?: boolean;
}) {
  const [selected, setSelected] = useState<PaperTrade | null>(null);

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <NeonCard key={i}>
            <Skeleton className="mb-3 h-5 w-24" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </NeonCard>
        ))}
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <NeonCard>
        <p className="py-6 text-center font-mono text-sm text-muted">
          Sin posiciones abiertas. El scanner abrirá trades en horario de mercado.
        </p>
      </NeonCard>
    );
  }

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-3 sm:grid-cols-2"
      >
        {trades.map((t) => (
          <motion.div key={t.id} variants={fadeInUp}>
            <PositionCard t={t} onClose={setSelected} />
          </motion.div>
        ))}
      </motion.div>
      <ClosePositionModal trade={selected} onClose={() => setSelected(null)} />
    </>
  );
}
