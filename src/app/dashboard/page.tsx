"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { KpiBar } from "@/components/modules/dashboard/KpiBar";
import { OpenPositions } from "@/components/modules/dashboard/OpenPositions";
import { RecentActivity } from "@/components/modules/dashboard/RecentActivity";
import { SystemStatus } from "@/components/modules/dashboard/SystemStatus";
import { QuickMetrics } from "@/components/modules/dashboard/QuickMetrics";
import { AlertsFeed } from "@/components/modules/dashboard/AlertsFeed";
import { useDailyReport, useHealth, usePaperTrades } from "@/hooks/useData";
import { deriveKpis } from "@/lib/derive";
import { API_BASE_URL } from "@/lib/api";

export default function DashboardPage() {
  const { data: trades, isLoading } = usePaperTrades({ limit: 200 }, 10_000);
  const { data: daily } = useDailyReport();
  const health = useHealth();

  const allTrades = trades ?? [];
  const openTrades = allTrades.filter((t) => t.status === "OPEN");
  const kpis = trades ? deriveKpis(allTrades) : undefined;

  const offline = health.isError;
  const dbOffline = health.isSuccess && !health.data?.db_online;

  return (
    <div className="relative min-h-full">
      <div className="grid-3d" />
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="relative space-y-5 p-5"
      >
        {(offline || dbOffline) && (
          <div className="flex items-center gap-3 rounded-lg border border-neon-amber/40 bg-neon-amber/10 px-4 py-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-neon-amber" />
            <p className="font-mono text-xs text-neon-amber">
              {offline
                ? `Backend no responde en ${API_BASE_URL} — verifica NEXT_PUBLIC_API_URL y que la API este activa.`
                : "Backend OK pero la base de datos está offline — inicia Postgres (docker compose up) y aplica migraciones."}
            </p>
          </div>
        )}

        <KpiBar
          kpis={kpis}
          disciplineScore={daily?.discipline_score}
          loading={isLoading}
        />

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <section>
              <SectionHeader
                title="Posiciones abiertas"
                accent="green"
                right={
                  <span className="font-mono text-[11px] text-muted">
                    {openTrades.length} activas
                  </span>
                }
              />
              <OpenPositions trades={openTrades} loading={isLoading} />
            </section>

            <section>
              <RecentActivity trades={allTrades} loading={isLoading} />
            </section>
          </div>

          <div className="space-y-5">
            <SystemStatus />
            <QuickMetrics />
            <AlertsFeed />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
