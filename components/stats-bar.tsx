"use client";

import type { Session } from "@/lib/types";

const FEE_RATE = 0.001; // 0.1% of trade volume — approximate gas earned by caleb-chain

function getExecutionPayload(session: Session) {
  const step = session.steps?.find((s) => s.kind === "EXECUTION");
  return step?.payload as Record<string, unknown> | undefined;
}

function computeStats(sessions: Session[]) {
  const dayAgo = Math.floor(Date.now() / 1000) - 86400;
  const recent = sessions.filter((s) => s.startedAt >= dayAgo);

  let trades = 0;
  let volumeUsd = 0;

  for (const s of recent) {
    const exec = getExecutionPayload(s);
    if (exec?.executed) {
      trades++;
      volumeUsd += (exec.amountUsd as number) ?? 0;
    }
  }

  const feesUsd = volumeUsd * FEE_RATE;

  return { trades, volumeUsd, feesUsd };
}

function fmt(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  if (n >= 1)    return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
}

export function StatsBar({ sessions }: { sessions: Session[] }) {
  const { trades, volumeUsd, feesUsd } = computeStats(sessions);

  return (
    <div className="flex items-center gap-6 text-sm flex-wrap">
      <Stat label="Trades today" value={String(trades)} />
      <Sep />
      <Stat label="Volume" value={fmt(volumeUsd)} />
      <Sep />
      <Stat label="Fees earned" value={fmt(feesUsd)} highlight />
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={`font-mono font-semibold tabular-nums ${highlight ? "text-foreground" : "text-foreground/80"}`}>
        {value}
      </span>
    </div>
  );
}

function Sep() {
  return <span className="text-muted-foreground/30">·</span>;
}
