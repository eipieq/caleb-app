"use client";

import { useEffect, useState } from "react";
import { getSessions, getPortfolio } from "@/lib/api";
import { SessionFeed } from "@/components/session-feed";
import { AgentStatus } from "@/components/agent-status";
import { StatsBar } from "@/components/stats-bar";
import { PortfolioCard } from "@/components/portfolio-card";
import { ConnectCta } from "@/components/connect-cta";
import { UserBalanceCard } from "@/components/user-balance-card";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { ClockIcon } from "lucide-react";
import type { Session, Portfolio } from "@/lib/types";

function Skeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-3 py-1">
          <div className="h-2 w-10 bg-muted rounded animate-pulse" />
          <div className="flex-1 h-px bg-border/30" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-muted/40 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function HomeFeed() {
  const [sessions, setSessions] = useState<Session[] | null>(() => {
    try { return JSON.parse(localStorage.getItem("caleb_sessions") ?? "null"); } catch { return null; }
  });
  const [portfolio, setPortfolio] = useState<Portfolio | null>(() => {
    try { return JSON.parse(localStorage.getItem("caleb_portfolio") ?? "null"); } catch { return null; }
  });

  useEffect(() => {
    const load = () => {
      getSessions().then((s) => { setSessions(s); localStorage.setItem("caleb_sessions", JSON.stringify(s)); }).catch(() => setSessions([]));
      getPortfolio().then((p) => { setPortfolio(p); localStorage.setItem("caleb_portfolio", JSON.stringify(p)); }).catch(() => setPortfolio(null));
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  if (sessions === null) return <Skeleton />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <Badge variant="secondary" className="w-fit mb-1">Live</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Trade Feed</h1>
        <p className="text-muted-foreground">
          Every trade is cryptographically committed on-chain. Verify any decision in one click.
        </p>
        <AgentStatus lastSessionAt={sessions[0]?.startedAt ?? null} />
        {sessions.length > 0 && (
          <div className="mt-3">
            <StatsBar sessions={sessions} />
          </div>
        )}
        <div className="mt-3">
          <ConnectCta />
        </div>
      </div>

      <div className="mb-4">
        <UserBalanceCard />
      </div>

      {portfolio && (
        <div className="mb-8">
          <PortfolioCard portfolio={portfolio} validSessionIds={new Set(sessions.map((s) => s.sessionId))} />
        </div>
      )}

      {sessions.length === 0 ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClockIcon />
            </EmptyMedia>
            <EmptyTitle>No sessions yet</EmptyTitle>
            <EmptyDescription>Sessions will appear here once the agent completes a cycle.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <SessionFeed sessions={sessions} />
      )}
    </div>
  );
}
