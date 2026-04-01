import { getSessions } from "@/lib/api";
import { SessionCard } from "@/components/session-card";
import { AgentStatus } from "@/components/agent-status";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { ClockIcon } from "lucide-react";
import type { Session } from "@/lib/types";

export const revalidate = 30;

export default async function Home() {
  let sessions: Session[] = [];
  try {
    sessions = await getSessions();
  } catch {
    // api unreachable
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <Badge variant="secondary" className="w-fit mb-1">Live</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Agent Feed</h1>
        <p className="text-muted-foreground">
          Every decision is cryptographically committed on-chain and verifiable.
        </p>
        <AgentStatus lastSessionAt={sessions[0]?.startedAt ?? null} />
      </div>

      {sessions.length === 0 ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClockIcon />
            </EmptyMedia>
            <EmptyTitle>No sessions yet</EmptyTitle>
            <EmptyDescription>The agent runs every hour. Sessions will appear here once the first cycle completes.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-2">
          {sessions.map((s) => (
            <SessionCard key={s.sessionId} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}
