"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ShieldAlert } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { GlowButton } from "@/components/ui/GlowButton";
import { Tabs } from "@/components/ui/Tabs";
import { useNoTradeJournal } from "@/hooks/useData";
import { usePersistStore } from "@/lib/store";
import { relativeTime, formatPnl } from "@/lib/utils";
import type { JournalEntry } from "@/lib/types";

const EMOTIONS = ["Calma", "Confianza", "Ansiedad", "FOMO", "Frustración", "Disciplina"];
const RESULTS: JournalEntry["result"][] = ["WIN", "LOSS", "BLOCKED", "OBSERVATION"];

const resultVariant: Record<JournalEntry["result"], "allow" | "block" | "warn" | "ai"> = {
  WIN: "allow",
  LOSS: "block",
  BLOCKED: "warn",
  OBSERVATION: "ai",
};

const emptyForm = {
  ticker: "",
  thesis: "",
  confidence: 50,
  emotion: "Calma",
  result: "OBSERVATION" as JournalEntry["result"],
  pnl: "",
  whatWentWell: "",
  whatToChange: "",
  respectedStop: true,
  lesson: "",
};

function inputCls() {
  return "w-full rounded-lg border border-neon-cyan/20 bg-void/60 px-3 py-2 font-mono text-sm text-ink outline-none focus:border-neon-cyan/60";
}

export default function JournalPage() {
  const entries = usePersistStore((s) => s.journalEntries);
  const addEntry = usePersistStore((s) => s.addJournalEntry);
  const removeEntry = usePersistStore((s) => s.removeJournalEntry);
  const { data: blocks } = useNoTradeJournal({ limit: 40 });

  const [tab, setTab] = useState("mine");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function submit() {
    if (!form.thesis.trim()) return;
    addEntry({
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ticker: form.ticker.trim().toUpperCase() || null,
      thesis: form.thesis.trim(),
      confidence: Number(form.confidence),
      emotion: form.emotion,
      result: form.result,
      pnl: form.pnl === "" ? null : Number(form.pnl),
      whatWentWell: form.whatWentWell.trim(),
      whatToChange: form.whatToChange.trim(),
      respectedStop: form.respectedStop,
      lesson: form.lesson.trim(),
    });
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="space-y-5 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeader title="Trading Journal" className="mb-0" />
        <div className="flex items-center gap-3">
          <Tabs
            items={[
              { id: "mine", label: "Mis notas", count: entries.length },
              { id: "system", label: "Bloqueos", count: blocks?.length },
            ]}
            active={tab}
            onChange={setTab}
          />
          {tab === "mine" && (
            <GlowButton tone="cyan" size="sm" onClick={() => setShowForm((s) => !s)}>
              <Plus className="h-3.5 w-3.5" />
              Nueva nota
            </GlowButton>
          )}
        </div>
      </div>

      <AnimatePresence>
        {tab === "mine" && showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <NeonCard glow="cyan">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
                    Ticker (opcional)
                  </label>
                  <input
                    value={form.ticker}
                    onChange={(e) => setForm({ ...form, ticker: e.target.value })}
                    className={inputCls()}
                    placeholder="AAPL"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
                    Resultado
                  </label>
                  <select
                    value={form.result}
                    onChange={(e) =>
                      setForm({ ...form, result: e.target.value as JournalEntry["result"] })
                    }
                    className={inputCls()}
                  >
                    {RESULTS.map((r) => (
                      <option key={r} value={r} className="bg-deep">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
                    Tesis / contexto
                  </label>
                  <textarea
                    value={form.thesis}
                    onChange={(e) => setForm({ ...form, thesis: e.target.value })}
                    className={`${inputCls()} min-h-[60px] resize-none`}
                    placeholder="¿Qué viste y por qué actuaste (o no)?"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
                    Confianza: {form.confidence}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.confidence}
                    onChange={(e) => setForm({ ...form, confidence: Number(e.target.value) })}
                    className="w-full accent-[#00e5ff]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
                    Emoción dominante
                  </label>
                  <select
                    value={form.emotion}
                    onChange={(e) => setForm({ ...form, emotion: e.target.value })}
                    className={inputCls()}
                  >
                    {EMOTIONS.map((em) => (
                      <option key={em} value={em} className="bg-deep">
                        {em}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
                    P&L (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.pnl}
                    onChange={(e) => setForm({ ...form, pnl: e.target.value })}
                    className={inputCls()}
                    placeholder="0.00"
                  />
                </div>
                <label className="flex items-center gap-2 pt-6 font-mono text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={form.respectedStop}
                    onChange={(e) => setForm({ ...form, respectedStop: e.target.checked })}
                    className="h-4 w-4 accent-[#00ff88]"
                  />
                  Respeté mi stop
                </label>
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
                    Qué salió bien
                  </label>
                  <input
                    value={form.whatWentWell}
                    onChange={(e) => setForm({ ...form, whatWentWell: e.target.value })}
                    className={inputCls()}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
                    Qué cambiar
                  </label>
                  <input
                    value={form.whatToChange}
                    onChange={(e) => setForm({ ...form, whatToChange: e.target.value })}
                    className={inputCls()}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
                    Lección clave
                  </label>
                  <input
                    value={form.lesson}
                    onChange={(e) => setForm({ ...form, lesson: e.target.value })}
                    className={inputCls()}
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <GlowButton tone="red" size="sm" onClick={() => setShowForm(false)}>
                  Cancelar
                </GlowButton>
                <GlowButton tone="green" size="sm" onClick={submit}>
                  Guardar nota
                </GlowButton>
              </div>
            </NeonCard>
          </motion.div>
        )}
      </AnimatePresence>

      {tab === "mine" ? (
        entries.length === 0 ? (
          <NeonCard>
            <p className="py-10 text-center font-mono text-sm text-muted">
              Aún no tienes notas. Documenta tus decisiones para construir disciplina.
            </p>
          </NeonCard>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {entries.map((e) => (
              <motion.div key={e.id} variants={fadeInUp} initial="initial" animate="animate">
                <NeonCard className="group h-full">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {e.ticker && (
                        <span className="font-display font-bold text-ink">{e.ticker}</span>
                      )}
                      <NeonBadge variant={resultVariant[e.result]}>{e.result}</NeonBadge>
                    </div>
                    <button
                      onClick={() => removeEntry(e.id)}
                      className="text-dim opacity-0 transition-opacity hover:text-neon-red group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-2 font-mono text-sm text-ink">{e.thesis}</p>
                  <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px]">
                    <span className="rounded border border-white/10 px-2 py-0.5 text-muted">
                      {e.emotion}
                    </span>
                    <span className="rounded border border-white/10 px-2 py-0.5 text-neon-cyan">
                      {e.confidence}% conf.
                    </span>
                    <span
                      className={`rounded border px-2 py-0.5 ${
                        e.respectedStop
                          ? "border-neon-green/30 text-neon-green"
                          : "border-neon-red/30 text-neon-red"
                      }`}
                    >
                      {e.respectedStop ? "Stop OK" : "Stop roto"}
                    </span>
                    {e.pnl !== null && (
                      <span
                        className={`rounded border px-2 py-0.5 ${
                          e.pnl >= 0
                            ? "border-neon-green/30 text-neon-green"
                            : "border-neon-red/30 text-neon-red"
                        }`}
                      >
                        {formatPnl(e.pnl)}
                      </span>
                    )}
                  </div>
                  {e.lesson && (
                    <p className="mt-3 border-l-2 border-neon-violet/50 pl-2 font-mono text-[11px] italic text-muted">
                      {e.lesson}
                    </p>
                  )}
                  <p className="mt-2 font-mono text-[10px] text-dim">
                    {relativeTime(e.created_at)}
                  </p>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        )
      ) : !blocks || blocks.length === 0 ? (
        <NeonCard>
          <p className="py-10 text-center font-mono text-sm text-muted">
            Sin bloqueos registrados por el sistema.
          </p>
        </NeonCard>
      ) : (
        <NeonCard noPad>
          <div className="divide-y divide-white/5">
            {blocks.map((b) => (
              <div key={b.id} className="flex items-start gap-3 px-4 py-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-neon-red" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-ink">
                      {b.ticker ?? "—"}
                    </span>
                    <NeonBadge variant={b.decision === "BLOCK" ? "block" : "warn"}>
                      {b.primary_reason_code ?? b.decision}
                    </NeonBadge>
                    {b.setup_type && (
                      <span className="font-mono text-[10px] uppercase text-dim">
                        {b.setup_type}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-muted">
                    {b.primary_reason ?? "—"}
                  </p>
                  {b.reasons && b.reasons.length > 1 && (
                    <p className="mt-1 font-mono text-[10px] text-dim">
                      {b.reasons.slice(0, 3).join(" · ")}
                    </p>
                  )}
                </div>
                <span className="shrink-0 font-mono text-[10px] text-dim">
                  {relativeTime(b.created_at ?? b.evaluated_at)}
                </span>
              </div>
            ))}
          </div>
        </NeonCard>
      )}
    </motion.div>
  );
}
