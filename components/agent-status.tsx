"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function formatRelative(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m ago`;
}

export function AgentStatus({ lastSessionAt }: { lastSessionAt: number | null }) {
  const router = useRouter();
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  // tick every second for the live elapsed counter
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  // refresh page data every 5s — fast enough to feel live at HFT frequency
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 5_000);
    return () => clearInterval(id);
  }, [router]);

  if (!lastSessionAt) return null;

  const elapsed = now - lastSessionAt;
  const isLive = elapsed < 15; // consider "live" if last session < 15s ago

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
      <span
        className={`size-1.5 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-muted-foreground/40"}`}
      />
      <span>
        Last trade {formatRelative(elapsed)}
      </span>
    </div>
  );
}
