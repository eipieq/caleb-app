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

export const revalidate = 5;

export default async function Home() {
  let sessions: Session[] = [];
  let portfolio: Portfolio | null = null;
  try {
    [sessions, portfolio] = await Promise.all([getSessions(), getPortfolio()]);
  } catch {
    try { sessions = await getSessions(); } catch {}
  }

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

      {/* connected wallet balance */}
      <div className="mb-4">
        <UserBalanceCard />
      </div>

      {portfolio && (
        <div className="mb-8">
          <PortfolioCard portfolio={portfolio} />
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
