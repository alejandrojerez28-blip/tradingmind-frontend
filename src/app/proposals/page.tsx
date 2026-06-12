"use client";

import { useMemo, useState } from "react";
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
  const generate = useGenerateInvestmentProposals();
  const authorize = useAuthorizeAndSimulateProposal();
  const pushEvent = useSystemStore((s) => s.pushEvent);

  const proposals = proposalsPayload?.proposals ?? [];
  const proposedCount = useMemo(
    () => proposals.filter((item) => item.proposal_status === "PROPOSED").length,
    [proposals]
  );

  function generateNow() {
    generate.mutate(
      { simulated_capital: 2500 },
      {
        onSuccess: (payload) => {
          setProposalsPayload(payload);
          pushEvent({
            kind: payload.proposed > 0 ? "ALLOW" : "BLOCK",
            message: `Propuestas: ${payload.proposed} listas · ${payload.blocked} bloqueadas`,
          });
        },
      }
    );
  }

  function authorizeAndSimulate(item: InvestmentProposal) {
    authorize.mutate(
      { ticker: item.ticker, simulated_capital: 2500 },
      {
        onSuccess: (result) => {
          pushEvent({
            kind: result.decision === "ALLOW" ? "ALLOW" : result.decision === "WARN" ? "WARN" : "BLOCK",
            message: `${result.ticker}: ${result.decision}${result.reason_code ? ` (${result.reason_code})` : ""}`,
          });
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
          <span>Capital simulado: ${proposalsPayload?.simulated_capital ?? 2500}</span>
        </div>
      </NeonCard>

      <NeonCard noPad>
        {proposals.length === 0 ? (
          <p className="px-4 py-8 text-center font-mono text-sm text-muted">
            Aun no hay propuestas. Pulsa "Generar propuestas".
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {proposals.map((item) => (
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
                  </div>
                  <p className="mt-1 truncate font-mono text-[11px] text-dim">
                    entry {item.entry_price ?? "-"} · stop {item.stop_loss_price ?? "-"} · target{" "}
                    {item.target_price ?? "-"} · src {item.market_data_source ?? "-"}
                  </p>
                </div>
                <GlowButton
                  tone="green"
                  size="sm"
                  disabled={!item.authorizable || authorize.isPending}
                  onClick={() => authorizeAndSimulate(item)}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Autorizar y simular
                </GlowButton>
              </div>
            ))}
          </div>
        )}
      </NeonCard>
    </div>
  );
}
