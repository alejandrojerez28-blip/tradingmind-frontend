"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { CheckCircle2, RefreshCcw } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NeonCard } from "@/components/ui/NeonCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { NeonBadge } from "@/components/ui/NeonBadge";
import {
  useAuthorizeAndSimulateProposal,
  useGenerateInvestmentProposals,
} from "@/hooks/useData";
import type { InvestmentProposal, ProposalsGenerateResponse } from "@/lib/types";
import { useSystemStore } from "@/lib/store";

export default function ProposalsPage() {
  const [proposalsPayload, setProposalsPayload] = useState<ProposalsGenerateResponse | null>(
    null
  );
  const [lastActionMessage, setLastActionMessage] = useState<string>("");
  const [lastActionTone, setLastActionTone] = useState<"allow" | "warn" | "block">("warn");
  const [activeTicker, setActiveTicker] = useState<string | null>(null);
  const generate = useGenerateInvestmentProposals();
  const authorize = useAuthorizeAndSimulateProposal();
  const pushEvent = useSystemStore((s) => s.pushEvent);

  const proposals = proposalsPayload?.proposals ?? [];
  const proposedCount = useMemo(
    () => proposals.filter((item) => item.proposal_status === "PROPOSED").length,
    [proposals]
  );
  const ordered = useMemo(
    () =>
      [...proposals].sort(
        (a, b) => Number(b.alpha_score ?? 0) - Number(a.alpha_score ?? 0)
      ),
    [proposals]
  );

  function parseError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail;
      if (typeof detail === "string" && detail.trim()) {
        return detail.trim();
      }
      if (detail && typeof detail === "object" && "error" in detail) {
        const maybeError = String(detail.error ?? "").trim();
        if (maybeError) return maybeError;
      }
      return `HTTP ${error.response?.status ?? "ERROR"}`;
    }
    if (error instanceof Error && error.message.trim()) return error.message.trim();
    return "No se pudo completar la accion";
  }

  function generateNow() {
    generate.mutate(
      { simulated_capital: 2500 },
      {
        onSuccess: (payload) => {
          setProposalsPayload(payload);
          setLastActionTone(payload.proposed > 0 ? "allow" : "warn");
          setLastActionMessage(
            `Generacion lista: ${payload.proposed} propuestas, ${payload.blocked} bloqueadas, ${payload.ready_for_authorization ?? 0} autorizables.`
          );
          pushEvent({
            kind: payload.proposed > 0 ? "ALLOW" : "BLOCK",
            message: `Propuestas: ${payload.proposed} listas · ${payload.blocked} bloqueadas`,
          });
        },
        onError: (error) => {
          const message = parseError(error);
          setLastActionTone("block");
          setLastActionMessage(`Error al generar propuestas: ${message}`);
          pushEvent({ kind: "BLOCK", message: `Generar propuestas fallo: ${message}` });
        },
      }
    );
  }

  function authorizeAndSimulate(item: InvestmentProposal) {
    setActiveTicker(item.ticker);
    authorize.mutate(
      { ticker: item.ticker, simulated_capital: 2500 },
      {
        onSuccess: (result) => {
          const tone =
            result.decision === "ALLOW" ? "allow" : result.decision === "WARN" ? "warn" : "block";
          setLastActionTone(tone);
          setLastActionMessage(
            `${result.ticker}: ${result.decision}${result.reason_code ? ` (${result.reason_code})` : ""}`
          );
          pushEvent({
            kind: result.decision === "ALLOW" ? "ALLOW" : result.decision === "WARN" ? "WARN" : "BLOCK",
            message: `${result.ticker}: ${result.decision}${result.reason_code ? ` (${result.reason_code})` : ""}`,
          });
          setActiveTicker(null);
        },
        onError: (error) => {
          const message = parseError(error);
          setLastActionTone("block");
          setLastActionMessage(`Error al autorizar/simular ${item.ticker}: ${message}`);
          pushEvent({ kind: "BLOCK", message: `Autorizar/simular fallo ${item.ticker}: ${message}` });
          setActiveTicker(null);
        },
      }
    );
  }

  return (
    <div className="space-y-5 p-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="Propuestas de Inversion" className="mb-0" />
        <GlowButton tone="cyan" size="sm" onClick={generateNow} disabled={generate.isPending}>
          <RefreshCcw className="h-3.5 w-3.5" />
          {generate.isPending ? "Analizando..." : "Generar propuestas"}
        </GlowButton>
      </div>

      <NeonCard>
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
          <span>Total: {proposalsPayload?.total ?? 0}</span>
          <span>Propuestas: {proposedCount}</span>
          <span>Bloqueadas: {proposalsPayload?.blocked ?? 0}</span>
          <span>Autorizables: {proposalsPayload?.ready_for_authorization ?? 0}</span>
          <span>Capital simulado: ${proposalsPayload?.simulated_capital ?? 2500}</span>
        </div>
        {lastActionMessage && (
          <p
            className={`mt-2 font-mono text-xs ${
              lastActionTone === "allow"
                ? "text-neon-green"
                : lastActionTone === "warn"
                  ? "text-neon-cyan"
                  : "text-neon-red"
            }`}
          >
            {lastActionMessage}
          </p>
        )}
      </NeonCard>

      <NeonCard noPad>
        {proposals.length === 0 ? (
          <p className="px-4 py-8 text-center font-mono text-sm text-muted">
            Aun no hay propuestas. Pulsa "Generar propuestas".
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {ordered.map((item) => (
              <div key={item.ticker} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base text-ink">{item.ticker}</span>
                    <NeonBadge variant={item.proposal_status === "PROPOSED" ? "info" : "block"}>
                      {item.proposal_status}
                    </NeonBadge>
                    <NeonBadge variant={item.authorizable ? "allow" : "warn"}>
                      {item.reason_code ?? "NO_REASON"}
                    </NeonBadge>
                    <NeonBadge variant={item.decision_hint === "PROPOSE" ? "allow" : "warn"}>
                      {item.decision_hint ?? "N/A"}
                    </NeonBadge>
                  </div>
                  <p className="mt-1 truncate font-mono text-[11px] text-dim">
                    alpha {(item.alpha_score ?? 0).toFixed(2)} · conf {(
                      item.confidence ?? 0
                    ).toFixed(2)} · news {(item.news_impact_score ?? 50).toFixed(1)} · exec{" "}
                    {(item.execution_quality_score ?? 65).toFixed(1)} · exp.ret{" "}
                    {(item.expected_return_pct ?? 0).toFixed(2)}% · dd{" "}
                    {(item.expected_drawdown_pct ?? 0).toFixed(2)}% · src {item.market_data_source ?? "-"}
                  </p>
                  {item.reason_codes && item.reason_codes.length > 0 && (
                    <p className="mt-1 truncate font-mono text-[10px] text-muted">
                      drivers: {item.reason_codes.join(" | ")}
                    </p>
                  )}
                </div>
                <GlowButton
                  tone="green"
                  size="sm"
                  disabled={!item.authorizable || authorize.isPending}
                  onClick={() => authorizeAndSimulate(item)}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {authorize.isPending && activeTicker === item.ticker
                    ? "Simulando..."
                    : "Autorizar y simular"}
                </GlowButton>
              </div>
            ))}
          </div>
        )}
      </NeonCard>
    </div>
  );
}
