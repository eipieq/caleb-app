"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClockIcon } from "lucide-react";

function formatRelative(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export function AgentStatus({ lastSessionAt }: { lastSessionAt: number | null }) {
  const router = useRouter();
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  // tick every second
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  // auto-refresh page data every 60s
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 60_000);
    return () => clearInterval(id);
  }, [router]);

  if (!lastSessionAt) return null;

  const elapsed = now - lastSessionAt;
  const CYCLE = 3600; // hourly cron
  const nextIn = CYCLE - (elapsed % CYCLE);

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <ClockIcon className="size-3" />
        Last run {formatRelative(elapsed)} ago
      </span>
      <span className="text-muted-foreground/50">·</span>
      <span>Next cycle in {formatRelative(nextIn)}</span>
    </div>
  );
}
