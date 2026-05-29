"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { GlowButton } from "@/components/ui/GlowButton";
import { useClosePosition } from "@/hooks/useData";
import { useSystemStore } from "@/lib/store";
import { formatPnl, formatPrice } from "@/lib/utils";
import type { PaperTrade } from "@/lib/types";

const REASONS = ["MANUAL", "TARGET_HIT", "STOP_LOSS", "TIME_DECAY", "THESIS_INVALIDATED"];

export function ClosePositionModal({
  trade,
  onClose,
}: {
  trade: PaperTrade | null;
  onClose: () => void;
}) {
  const close = useClosePosition();
  const pushEvent = useSystemStore((s) => s.pushEvent);
  const [exitPrice, setExitPrice] = useState("");
  const [reason, setReason] = useState("MANUAL");

  const open = trade !== null;
  const defaultExit = trade?.current_price ?? trade?.entry_price ?? 0;
  const price = exitPrice === "" ? defaultExit : Number(exitPrice);

  const estPnl =
    trade && trade.contracts
      ? (price - trade.entry_price) *
        trade.contracts *
        (trade.asset_type?.toUpperCase().includes("OPTION") ? 100 : 1)
      : null;

  function handleConfirm() {
    if (!trade) return;
    close.mutate(
      { id: trade.id, exit_price: price, close_reason: reason },
      {
        onSuccess: () => {
          pushEvent({
            kind: "CLOSED",
            message: `${trade.ticker} cerrado @ ${formatPrice(price)} (${reason})`,
          });
          setExitPrice("");
          setReason("MANUAL");
          onClose();
        },
      }
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={trade ? `Cerrar ${trade.ticker}` : ""}>
      {trade && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 font-mono text-sm">
            <div>
              <p className="text-[10px] uppercase text-muted">Entrada</p>
              <p className="text-ink">{formatPrice(trade.entry_price)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted">Actual</p>
              <p className="text-neon-cyan">{formatPrice(trade.current_price)}</p>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
              Precio de salida
            </label>
            <input
              type="number"
              step="0.01"
              value={exitPrice}
              placeholder={String(defaultExit)}
              onChange={(e) => setExitPrice(e.target.value)}
              className="w-full rounded-lg border border-neon-cyan/20 bg-void/60 px-3 py-2 font-mono text-sm text-ink outline-none focus:border-neon-cyan/60"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
              Motivo
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-neon-cyan/20 bg-void/60 px-3 py-2 font-mono text-sm text-ink outline-none focus:border-neon-cyan/60"
            >
              {REASONS.map((r) => (
                <option key={r} value={r} className="bg-deep">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {estPnl !== null && (
            <div className="rounded-lg border border-white/10 bg-void/40 px-3 py-2">
              <span className="font-mono text-[10px] uppercase text-muted">
                P&L estimado
              </span>
              <span
                className={`ml-2 font-mono text-sm font-bold ${
                  estPnl >= 0 ? "text-neon-green" : "text-neon-red"
                }`}
              >
                {formatPnl(estPnl)}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <GlowButton tone="cyan" size="sm" onClick={onClose}>
              Cancelar
            </GlowButton>
            <GlowButton
              tone="red"
              size="sm"
              onClick={handleConfirm}
              disabled={close.isPending}
            >
              {close.isPending ? "Cerrando…" : "Confirmar cierre"}
            </GlowButton>
          </div>
        </div>
      )}
    </Modal>
  );
}
