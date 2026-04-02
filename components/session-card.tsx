"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { Session } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function getDecision(session: Session) {
  const step = session.steps?.find((s) => s.kind === "DECISION");
  if (!step) return { verdict: "SKIP", confidence: 0, token: null, strategy: null, amountUsd: 0 };
  const p = step.payload as Record<string, unknown>;
  return {
    verdict:    (p.verdict as string) ?? "SKIP",
    confidence: (p.confidence as number) ?? 0,
    token:      (p.token as string) ?? null,
    strategy:   (p.strategy as string) ?? session.strategy ?? null,
    amountUsd:  (p.amountUsd as number) ?? 0,
  };
}

function verdictVariant(verdict: string): "default" | "secondary" | "destructive" | "outline" {
  if (verdict === "BUY")  return "default";
  if (verdict === "SELL") return "destructive";
  return "secondary";
}

export function SessionCard({ session }: { session: Session }) {
  const { verdict, confidence, token, strategy, amountUsd } = getDecision(session);
  const isActive = verdict === "BUY" || verdict === "SELL";
  const date = new Date(session.startedAt * 1000);

  return (
    <Link href={`/sessions/${session.sessionId}`} className="group">
      <Card size="sm" className="flex-row items-center justify-between gap-4 px-4 py-3 hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <Badge variant={verdictVariant(verdict)}>
            {verdict}
          </Badge>

          {isActive && token && (
            <Badge variant="outline">{token}</Badge>
          )}

          {strategy && (
            <span className="text-xs text-muted-foreground/60 hidden sm:block">{strategy}</span>
          )}

          <span className="font-mono text-xs text-muted-foreground truncate hidden md:block">
            {session.sessionId.slice(0, 18)}…
          </span>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          {isActive && amountUsd > 0 && (
            <div className="text-right hidden md:block">
              <div className="text-xs text-muted-foreground">amount</div>
              <div className="text-sm font-mono font-medium">${amountUsd.toFixed(2)}</div>
            </div>
          )}
          <div className="text-right hidden md:block">
            <div className="text-xs text-muted-foreground">signal</div>
            <div className={cn("text-sm font-mono font-medium", confidence >= 0.5 ? "text-foreground" : "text-muted-foreground")}>
              {confidence.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">{date.toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground/60">{date.toLocaleTimeString()}</div>
          </div>
          <ArrowRightIcon className="size-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
        </div>
      </Card>
    </Link>
  );
}
