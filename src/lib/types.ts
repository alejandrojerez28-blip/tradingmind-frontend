export type TradeStatus = "OPEN" | "CLOSED" | "BLOCKED" | "CANCELLED";
export type Decision = "ALLOW" | "BLOCK" | "WARN";

export interface PaperTrade {
  id: number;
  ticker: string;
  status: TradeStatus;
  asset_type: string;
  action: string | null;
  setup_type: string | null;
  entry_price: number;
  current_price: number | null;
  exit_price: number | null;
  stop_loss_price: number | null;
  target_price: number | null;
  option_strike: number | null;
  option_expiration: string | null;
  option_type: string | null;
  contracts: number;
  max_risk_dollars: number | null;
  simulated_cost: number | null;
  simulated_pnl: number | null;
  simulated_pnl_pct: number | null;
  quality_score: number | null;
  quality_grade: string | null;
  opened_at: string;
  closed_at: string | null;
}

export interface SchedulerStatus {
  running: boolean;
  next_scan: string | null;
  next_report: string | null;
  scheduler_enabled: boolean;
}

export interface ScanResult {
  ticker: string;
  decision: Decision;
  reason_code: string | null;
  paper_trade_id: number | null;
}

export interface TriggerScanResponse {
  triggered: boolean;
  results: ScanResult[];
}

export interface InvestmentProposal {
  ticker: string;
  proposal_status: "PROPOSED" | "BLOCKED";
  reason_code: string | null;
  authorizable: boolean;
  setup_type?: string;
  option_type?: string;
  option_strike?: number;
  option_expiration?: string;
  entry_price?: number;
  stop_loss_price?: number;
  target_price?: number;
  liquidity_score?: number;
  volume_relative?: number;
  market_data_source?: string;
  market_data_timestamp?: string;
}

export interface ProposalsGenerateResponse {
  generated_at: string;
  simulated_capital: number;
  total: number;
  proposed: number;
  blocked: number;
  proposals: InvestmentProposal[];
}

export interface AuthorizeSimulateResponse {
  ticker: string;
  decision: Decision;
  reason_code: string | null;
  paper_trade_id: number | null;
  authorized: boolean;
  simulated_capital: number;
  executed_at: string;
}

export interface ScorecardSummary {
  overall_grade: string;
  total_trades: number;
  profit_factor: number;
  win_rate: number;
  computed_at: string;
}

export interface PerformanceMetrics {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  profit_factor: number;
  expectancy_dollars: number;
  avg_win_dollars: number;
  avg_loss_dollars: number;
  avg_rr_realized: number;
  max_drawdown_pct: number;
  sharpe_ratio: number;
  consistency_weekly: number;
}

export interface DisciplineMetrics {
  rule_violations: number;
  trades_without_stop: number;
  stops_respected_pct: number;
  trades_outside_hours: number;
  no_trade_journal_coverage_pct: number;
}

export interface SignalQualityMetrics {
  avg_quality_score: number;
  no_trade_rate: number;
  top_setup_types: { setup_type: string; count: number; win_rate: number }[];
  avg_slippage_pct: number;
}

export interface EvaluationScorecard {
  period_start: string;
  period_end: string;
  simulated_capital: number;
  performance: PerformanceMetrics;
  discipline: DisciplineMetrics;
  signal_quality: SignalQualityMetrics;
  overall_grade: string;
}

export interface DailyReportEntry {
  trade_id: number;
  ticker: string;
  setup_type: string | null;
  action: string | null;
  status: string;
  entry_price: number;
  exit_price: number | null;
  simulated_pnl: number | null;
  quality_score: number | null;
  close_reason: string | null;
  opened_at: string;
  closed_at: string | null;
}

export interface DailyReport {
  report_date: string;
  generated_at: string;
  market_day: boolean;
  trades_opened: number;
  trades_closed: number;
  trades_blocked: number;
  gross_pnl_day: number;
  best_trade_pnl: number | null;
  worst_trade_pnl: number | null;
  discipline_score: number;
  entries: DailyReportEntry[];
  notes: string;
}

export interface NoTradeJournalEntry {
  id: number;
  evaluated_at: string;
  ticker: string | null;
  setup_type: string | null;
  decision: string;
  primary_reason_code: string | null;
  primary_reason: string | null;
  reasons: string[] | null;
  liquidity_score: number | null;
  bid: number | null;
  ask: number | null;
  created_at: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  environment: string;
  db_online: boolean;
  database: string;
  redis: string;
}

export interface ReadinessResponse {
  status: "ready" | "not_ready";
  service: string;
  environment: string;
  checks: {
    database_ok: boolean;
    redis_ok: boolean;
    critical_api_key_configured: boolean;
    scheduler_ok: boolean;
  };
}

export interface JournalEntry {
  id: string;
  created_at: string;
  ticker: string | null;
  thesis: string;
  confidence: number;
  emotion: string;
  result: "WIN" | "LOSS" | "BLOCKED" | "OBSERVATION";
  pnl: number | null;
  whatWentWell: string;
  whatToChange: string;
  respectedStop: boolean;
  lesson: string;
}
