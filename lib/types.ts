export interface Step {
  kind: "POLICY" | "MARKET" | "DECISION" | "CHECK" | "EXECUTION";
  hash: string;
  txHash: string;
  timestamp: number;
  payload: Record<string, unknown>;
}

export interface Session {
  sessionId: string;
  agent: string;
  startedAt: number;
  finalizedAt?: number;
  steps: Step[];
  strategy?: string;
  verdict?: "BUY" | "SELL" | "SKIP";
  confidence?: number;
  token?: string | null;
  reasoning?: string;
}

export interface Attestation {
  attester: string;
  timestamp: number;
}

export interface AttestationsResult {
  sessionId: string;
  attestations: Attestation[];
  count: number;
}

export interface Holding {
  amount: number;
  avgEntryPrice: number;
  costUsd: number;
  currentPrice: number;
  currentUsd: number;
  unrealisedUsd: number;
  unrealisedPct: number;
}

export interface TradeRecord {
  sessionId: string;
  timestamp: number;
  side: "BUY" | "SELL";
  token: string;
  amountUsd: number;
  price: number;
  units: number;
  pnlUsd: number | null;
  usdcBalanceAfter: number;
}

export interface Portfolio {
  startingBalanceUsd: number;
  usdcBalance: number;
  holdings: Record<string, Holding>;
  totalValueUsd: number;
  totalPnlUsd: number;
  totalPnlPct: number;
  realisedPnlUsd: number;
  unrealisedPnlUsd: number;
  tradesTotal: number;
  winningTrades: number;
  losingTrades: number;
  tradeHistory: TradeRecord[];
  startedAt: number;
  lastUpdatedAt: number;
}

export interface Policy {
  maxSpendUsd: number;
  confidenceThreshold: number;
  cooldownSeconds: number;
  allowedTokens: string[];
  maxPositionUsd?: number;
  maxDrawdownPct?: number;
  strategy?: string;
  paused?: boolean;
}
