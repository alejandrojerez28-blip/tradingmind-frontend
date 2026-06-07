import axios from "axios";
import type {
  DailyReport,
  EvaluationScorecard,
  HealthResponse,
  NoTradeJournalEntry,
  PaperTrade,
  ScorecardSummary,
  SchedulerStatus,
  TriggerScanResponse,
} from "./types";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const browserFallbackApiUrl =
  typeof window !== "undefined" ? window.location.origin : undefined;

export const API_BASE_URL =
  configuredApiUrl || browserFallbackApiUrl || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// ── Scheduler ──────────────────────────────────────────
export const getSchedulerStatus = () =>
  api.get<SchedulerStatus>("/scheduler/status").then((r) => r.data);

export const triggerScan = () =>
  api.post<TriggerScanResponse>("/scheduler/trigger-scan").then((r) => r.data);

// ── Paper Trades ───────────────────────────────────────
export const getPaperTrades = (params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) => api.get<PaperTrade[]>("/paper-trades", { params }).then((r) => r.data);

export const getPaperTrade = (id: number) =>
  api.get<PaperTrade>(`/paper-trades/${id}`).then((r) => r.data);

export const createPaperTrade = (body: Record<string, unknown>) =>
  api.post("/paper-trades", body).then((r) => r.data);

export const closePaperTrade = (
  id: number,
  body: { exit_price: number; close_reason?: string }
) => api.post(`/paper-trades/${id}/close`, body).then((r) => r.data);

export const monitorPositions = () =>
  api.post("/paper-trades/monitor").then((r) => r.data);

// ── Metrics ────────────────────────────────────────────
export const getScorecard = (params?: {
  period_days?: number;
  simulated_capital?: number;
}) => api.get<EvaluationScorecard>("/metrics/scorecard", { params }).then((r) => r.data);

export const getScorecardSummary = () =>
  api.get<ScorecardSummary>("/metrics/scorecard/summary").then((r) => r.data);

// ── Reports ────────────────────────────────────────────
export const getDailyReport = (reportDate?: string) =>
  api
    .get<DailyReport>("/reports/daily", {
      params: reportDate ? { report_date: reportDate } : {},
    })
    .then((r) => r.data);

export const getDailyReportHistory = (limit = 14) =>
  api
    .get<DailyReport[]>("/reports/daily/history", { params: { limit } })
    .then((r) => r.data);

// ── No-Trade Journal ───────────────────────────────────
export const getNoTradeJournal = (params?: {
  limit?: number;
  offset?: number;
  ticker?: string;
  decision?: string;
}) =>
  api
    .get<NoTradeJournalEntry[]>("/no-trade-journal", { params })
    .then((r) => r.data);

// ── Health ─────────────────────────────────────────────
export const getHealth = () => api.get<HealthResponse>("/health").then((r) => r.data);

export const WATCHLIST_DEFAULT = [
  "SPY",
  "QQQ",
  "IWM",
  "AAPL",
  "TSLA",
  "NVDA",
  "AMZN",
  "META",
  "GOOGL",
  "MSFT",
];
