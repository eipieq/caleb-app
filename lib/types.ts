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
  verdict?: "BUY" | "SKIP";
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

export interface Policy {
  maxSpendUsd: number;
  confidenceThreshold: number;
  cooldownSeconds: number;
  allowedTokens: string[];
  paused?: boolean;
}
