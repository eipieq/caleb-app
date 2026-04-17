import Link from "next/link";
import { ArrowRightIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import type { Portfolio } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function pnlColor(n: number) {
  return n > 0 ? "text-green-600" : n < 0 ? "text-red-500" : "text-muted-foreground";
}

function fmt(n: number, prefix = "$") {
  const sign = n > 0 ? "+" : "";
  return `${sign}${prefix}${Math.abs(n).toFixed(2)}`;
}

export function PortfolioCard({ portfolio, validSessionIds }: { portfolio: Portfolio; validSessionIds?: Set<string> }) {
  const { totalValueUsd, totalPnlUsd, totalPnlPct, startingBalanceUsd, usdcBalance,
          holdings, realisedPnlUsd, unrealisedPnlUsd, tradesTotal, winningTrades,
          losingTrades, tradeHistory } = portfolio;

  const closedTrades = winningTrades + losingTrades;
  const winRate = closedTrades > 0 ? Math.round((winningTrades / closedTrades) * 100) : null;
  const isUp    = totalPnlUsd >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              Portfolio
              <Badge variant="outline" className="font-mono text-xs">
                ${startingBalanceUsd.toFixed(0)} starting
              </Badge>
            </CardTitle>
            <CardDescription>All P&L is auditable — every trade links to an on-chain session</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono tabular-nums">${totalValueUsd.toFixed(2)}</div>
            <div className={cn("flex items-center gap-1 text-sm font-mono justify-end", pnlColor(totalPnlUsd))}>
              {isUp ? <TrendingUpIcon className="size-3.5" /> : <TrendingDownIcon className="size-3.5" />}
              {fmt(totalPnlUsd)} ({fmt(totalPnlPct, "")}%)
            </div>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 flex flex-col gap-4">

        {/* P&L breakdown */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <Stat label="Realised P&L" value={fmt(realisedPnlUsd)} color={pnlColor(realisedPnlUsd)} />
          <Stat label="Unrealised P&L" value={fmt(unrealisedPnlUsd)} color={pnlColor(unrealisedPnlUsd)} />
          <Stat label="USDC balance" value={`$${usdcBalance.toFixed(2)}`} />
        </div>

        {/* Trade stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <Stat label="Total trades" value={`${closedTrades} closed`} />
          <Stat label="Win / Loss" value={`${winningTrades} / ${losingTrades}`} />
          <Stat label="Win rate" value={winRate !== null ? `${winRate}%` : "—"} color={winRate !== null ? (winRate >= 50 ? "text-green-600" : "text-red-500") : undefined} />
        </div>

        {/* Holdings */}
        {Object.keys(holdings).length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Open positions</p>
              {Object.entries(holdings).map(([token, h]) => (
                <div key={token} className="flex items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{token}</Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      {h.amount.toFixed(4)} @ ${h.avgEntryPrice.toFixed(4)} avg
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">${h.currentUsd.toFixed(2)}</div>
                    <div className={cn("font-mono text-xs", pnlColor(h.unrealisedUsd))}>
                      {fmt(h.unrealisedUsd)} ({fmt(h.unrealisedPct, "")}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Trade history */}
        {tradeHistory.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Trade history</p>
              {[...tradeHistory].reverse().slice(0, 10).map((t, i) => (
                <div key={i} className="flex items-center justify-between gap-2 text-xs py-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant={t.side === "BUY" ? "default" : "destructive"} className="text-xs shrink-0">
                      {t.side}
                    </Badge>
                    <span className="text-muted-foreground">{t.token}</span>
                    <span className="font-mono">${t.amountUsd.toFixed(2)} @ ${t.price.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {t.pnlUsd !== null && (
                      <span className={cn("font-mono", pnlColor(t.pnlUsd))}>
                        {fmt(t.pnlUsd)}
                      </span>
                    )}
                    {t.sessionId && t.sessionId !== "pending" && (!validSessionIds || validSessionIds.has(t.sessionId)) ? (
                      <Link
                        href={`/sessions/${t.sessionId}`}
                        className="text-muted-foreground/50 hover:text-muted-foreground transition-colors flex items-center gap-0.5"
                      >
                        proof <ArrowRightIcon className="size-3" />
                      </Link>
                    ) : (
                      <span
                        title="audit trail unavailable — session did not commit on-chain"
                        className="text-muted-foreground/30 text-[10px]"
                      >
                        no proof
                      </span>
                    )}
                    <span className="text-muted-foreground/40">
                      {new Date(t.timestamp * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </CardContent>
    </Card>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("font-mono font-semibold tabular-nums text-sm", color)}>{value}</span>
    </div>
  );
}
