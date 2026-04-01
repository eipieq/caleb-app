"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { Session } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function getDecision(session: Session) {
  const step = session.steps?.find((s) => s.kind === "DECISION");
  if (!step) return { verdict: "SKIP", confidence: 0, token: null };
  const p = step.payload as Record<string, unknown>;
  return {
    verdict: (p.verdict as string) ?? "SKIP",
    confidence: (p.confidence as number) ?? 0,
    token: (p.token as string) ?? null,
  };
}

export function SessionCard({ session }: { session: Session }) {
  const { verdict, confidence, token } = getDecision(session);
  const isBuy = verdict === "BUY";
  const date = new Date(session.startedAt * 1000);

  return (
    <Link href={`/sessions/${session.sessionId}`} className="group">
      <Card size="sm" className="flex-row items-center justify-between gap-4 px-4 py-3 hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <Badge variant={isBuy ? "default" : "secondary"}>
            {verdict}
          </Badge>

          {isBuy && token && (
            <Badge variant="outline">{token}</Badge>
          )}

          <span className="font-mono text-xs text-muted-foreground truncate hidden sm:block">
            {session.sessionId.slice(0, 20)}...
          </span>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="text-right hidden md:block">
            <div className="text-xs text-muted-foreground">confidence</div>
            <div className={cn("text-sm font-mono font-medium", confidence >= 0.7 ? "text-foreground" : "text-muted-foreground")}>
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
