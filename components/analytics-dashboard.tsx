"use client";

import {
  LineChart, Line, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { Portfolio, Session } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GREEN  = "hsl(142 71% 45%)";
const RED    = "hsl(0 72% 51%)";
const MUTED  = "hsl(240 5% 34%)";
const ACCENT = "hsl(217 91% 60%)";

function fmt(n: number, prefix = "$") {
  return `${prefix}${Math.abs(n).toFixed(2)}`;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-mono font-semibold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboard({ portfolio, sessions }: { portfolio: Portfolio; sessions: Session[] }) {
  // P&L over time — cumulative from trade history
  const pnlData = (() => {
    let cumulative = 0;
    return portfolio.tradeHistory
      .filter((t) => t.pnlUsd !== null)
      .map((t) => {
        cumulative += t.pnlUsd ?? 0;
        return {
          date: new Date(t.timestamp * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          pnl: parseFloat(cumulative.toFixed(4)),
          trade: parseFloat((t.pnlUsd ?? 0).toFixed(4)),
        };
      });
  })();

  // portfolio value over time
  const valueData = portfolio.tradeHistory.map((t) => ({
    date: new Date(t.timestamp * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: parseFloat(t.usdcBalanceAfter.toFixed(2)),
  }));

  // verdict breakdown
  const verdictCounts = sessions.reduce(
    (acc, s) => {
      const v = s.steps?.find((st) => st.kind === "DECISION")?.payload?.verdict as string ?? s.verdict ?? "SKIP";
      acc[v] = (acc[v] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const verdictData = [
    { name: "BUY",  value: verdictCounts["BUY"]  ?? 0, color: GREEN },
    { name: "SELL", value: verdictCounts["SELL"] ?? 0, color: RED },
    { name: "SKIP", value: verdictCounts["SKIP"] ?? 0, color: MUTED },
  ].filter((d) => d.value > 0);

  // confidence distribution (buckets 0.1 wide)
  const confBuckets: Record<string, number> = {};
  sessions.forEach((s) => {
    const c = s.steps?.find((st) => st.kind === "DECISION")?.payload?.confidence as number ?? s.confidence;
    if (c == null) return;
    const bucket = `${(Math.floor(c * 10) / 10).toFixed(1)}`;
    confBuckets[bucket] = (confBuckets[bucket] ?? 0) + 1;
  });
  const confData = Object.entries(confBuckets)
    .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
    .map(([k, v]) => ({ range: k, count: v }));

  const winRate = portfolio.tradesTotal > 0
    ? ((portfolio.winningTrades / portfolio.tradesTotal) * 100).toFixed(1)
    : "—";

  const pnlColor = portfolio.totalPnlUsd >= 0 ? GREEN : RED;
  const pnlSign  = portfolio.totalPnlUsd >= 0 ? "+" : "-";

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">
      <h1 style={{ fontFamily: "var(--font-instrument-sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.03em" }}>
        analytics
      </h1>

      {/* stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="total P&L"
          value={`${pnlSign}${fmt(portfolio.totalPnlUsd)}`}
          sub={`${pnlSign}${Math.abs(portfolio.totalPnlPct)}%`}
        />
        <StatCard
          label="portfolio value"
          value={fmt(portfolio.totalValueUsd)}
          sub={`started at ${fmt(portfolio.startingBalanceUsd)}`}
        />
        <StatCard
          label="win rate"
          value={`${winRate}%`}
          sub={`${portfolio.winningTrades}W / ${portfolio.losingTrades}L`}
        />
        <StatCard
          label="trades"
          value={String(portfolio.tradesTotal)}
          sub={`${sessions.length} sessions`}
        />
      </div>

      {/* cumulative P&L */}
      {pnlData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">cumulative P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={pnlData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={pnlColor} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={pnlColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 16%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240 5% 45%)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 45%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(240 10% 8%)", border: "1px solid hsl(240 5% 20%)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`$${(v as number).toFixed(4)}`, "cumulative P&L"]}
                />
                <Area type="monotone" dataKey="pnl" stroke={pnlColor} fill="url(#pnlGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* portfolio value */}
      {valueData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">portfolio value over time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={valueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 16%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240 5% 45%)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 45%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(240 10% 8%)", border: "1px solid hsl(240 5% 20%)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`$${(v as number).toFixed(2)}`, "USDC balance"]}
                />
                <Line type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* bottom row: verdict pie + confidence bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {verdictData.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">decision breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={verdictData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" strokeWidth={0}>
                    {verdictData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "hsl(240 10% 8%)", border: "1px solid hsl(240 5% 20%)", borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {verdictData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="size-2 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="font-mono ml-auto pl-4">{d.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {confData.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">confidence distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={confData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 16%)" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(240 5% 45%)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(240 5% 45%)" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(240 10% 8%)", border: "1px solid hsl(240 5% 20%)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [v as number, "sessions"]}
                  />
                  <Bar dataKey="count" fill={ACCENT} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
