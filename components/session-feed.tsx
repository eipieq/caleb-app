"use client";

import { useState } from "react";
import { SessionCard } from "./session-card";
import type { Session } from "@/lib/types";

const PAGE_SIZE = 5;

// sessions before this were committed by a cron-based agent with a different payload format
export const LEGACY_CUTOFF = new Date("2026-04-06T00:00:00Z").getTime() / 1000;

function dayKey(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-CA"); // YYYY-MM-DD
}

function dayLabel(key: string): string {
  const today     = new Date().toLocaleDateString("en-CA");
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");
  if (key === today)     return "today";
  if (key === yesterday) return "yesterday";
  return new Date(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupByDay(sessions: Session[]): { key: string; label: string; sessions: Session[] }[] {
  const map = new Map<string, Session[]>();
  for (const s of sessions) {
    const k = dayKey(s.startedAt);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(s);
  }
  return Array.from(map.entries()).map(([key, sessions]) => ({
    key,
    label: dayLabel(key),
    sessions,
  }));
}

function DayGroup({ label, sessions }: { label: string; sessions: Session[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? sessions : sessions.slice(0, PAGE_SIZE);
  const hidden = sessions.length - PAGE_SIZE;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 py-1">
        <span className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-xs font-mono text-muted-foreground/30">{sessions.length}</span>
        <div className="flex-1 h-px bg-border/30" />
      </div>

      <div className="flex flex-col gap-2">
        {shown.map((s) => (
          <SessionCard key={s.sessionId} session={s} />
        ))}
      </div>

      {sessions.length > PAGE_SIZE && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-mono text-muted-foreground/40 hover:text-muted-foreground transition-colors text-left pl-1 py-1"
        >
          {expanded ? "show less ↑" : `show ${hidden} more ↓`}
        </button>
      )}
    </div>
  );
}

export function SessionFeed({ sessions }: { sessions: Session[] }) {
  const [showArchive, setShowArchive] = useState(false);

  const fresh   = sessions.filter((s) => s.startedAt >= LEGACY_CUTOFF);
  const archive = sessions.filter((s) => s.startedAt < LEGACY_CUTOFF);
  const visible = showArchive ? sessions : fresh;
  const groups  = groupByDay(visible);

  return (
    <div className="flex flex-col gap-8">
      {groups.map((g) => (
        <DayGroup key={g.key} label={g.label} sessions={g.sessions} />
      ))}

      {archive.length > 0 && (
        <button
          onClick={() => setShowArchive((v) => !v)}
          className="text-xs font-mono text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors text-left py-1"
        >
          {showArchive ? "hide archive ↑" : `show ${archive.length} archived sessions ↓`}
        </button>
      )}
    </div>
  );
}
