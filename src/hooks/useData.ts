"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authorizeAndSimulateProposal,
  closePaperTrade,
  generateInvestmentProposals,
  getDailyReport,
  getDailyReportHistory,
  getHealth,
  getReadiness,
  getNoTradeJournal,
  getPaperTrades,
  getScorecard,
  getScorecardSummary,
  getSchedulerStatus,
  monitorPositions,
  triggerScan,
} from "@/lib/api";

export function usePaperTrades(
  params?: { status?: string; limit?: number },
  refetchInterval?: number
) {
  return useQuery({
    queryKey: ["paper-trades", params],
    queryFn: () => getPaperTrades(params),
    refetchInterval,
  });
}

export function useSchedulerStatus() {
  return useQuery({
    queryKey: ["scheduler-status"],
    queryFn: getSchedulerStatus,
    refetchInterval: 30_000,
  });
}

export function useScorecardSummary() {
  return useQuery({ queryKey: ["scorecard-summary"], queryFn: getScorecardSummary });
}

export function useScorecard(periodDays = 60, simulatedCapital = 2500) {
  return useQuery({
    queryKey: ["scorecard", periodDays, simulatedCapital],
    queryFn: () =>
      getScorecard({ period_days: periodDays, simulated_capital: simulatedCapital }),
  });
}

export function useDailyReport(reportDate?: string) {
  return useQuery({
    queryKey: ["daily-report", reportDate ?? "today"],
    queryFn: () => getDailyReport(reportDate),
  });
}

export function useDailyReportHistory(limit = 14) {
  return useQuery({
    queryKey: ["daily-report-history", limit],
    queryFn: () => getDailyReportHistory(limit),
  });
}

export function useNoTradeJournal(params?: {
  ticker?: string;
  decision?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["no-trade-journal", params],
    queryFn: () => getNoTradeJournal(params),
  });
}

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 15_000,
    retry: 0,
  });
}

export function useReadiness() {
  return useQuery({
    queryKey: ["readiness"],
    queryFn: getReadiness,
    refetchInterval: 20_000,
    retry: 0,
  });
}

export function useTriggerScan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: triggerScan,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paper-trades"] });
      qc.invalidateQueries({ queryKey: ["no-trade-journal"] });
    },
  });
}

export function useGenerateInvestmentProposals() {
  return useMutation({
    mutationFn: (vars?: { simulated_capital?: number; tickers?: string }) =>
      generateInvestmentProposals(vars),
  });
}

export function useAuthorizeAndSimulateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { ticker: string; simulated_capital?: number }) =>
      authorizeAndSimulateProposal(vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paper-trades"] });
      qc.invalidateQueries({ queryKey: ["scorecard-summary"] });
      qc.invalidateQueries({ queryKey: ["daily-report"] });
    },
  });
}

export function useMonitorPositions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: monitorPositions,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paper-trades"] }),
  });
}

export function useClosePosition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; exit_price: number; close_reason?: string }) =>
      closePaperTrade(vars.id, {
        exit_price: vars.exit_price,
        close_reason: vars.close_reason,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paper-trades"] });
      qc.invalidateQueries({ queryKey: ["scorecard-summary"] });
    },
  });
}
