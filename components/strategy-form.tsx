"use client";

import { useState, useEffect } from "react";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { savePolicy, getPolicy } from "@/lib/api";
import type { Policy } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Field, FieldGroup, FieldTitle, FieldDescription } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { CheckIcon } from "lucide-react";

const ALL_TOKENS = ["INIT", "ETH", "USDC"];
const ALL_STRATEGIES = ["momentum", "mean-revert"];

const DEFAULT: Policy = {
  maxSpendUsd: 50,
  confidenceThreshold: 0.3,
  cooldownSeconds: 0,
  allowedTokens: ["INIT", "ETH", "USDC"],
  maxPositionUsd: 200,
  maxDrawdownPct: 5,
  strategy: "momentum",
  paused: false,
};

export function StrategyForm({ initialPolicy }: { initialPolicy: Policy | null }) {
  const { isConnected, hexAddress, openConnect } = useInterwovenKit();
  const [policy, setPolicy] = useState<Policy>({ ...DEFAULT, ...initialPolicy });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // load wallet-specific policy when connected
  useEffect(() => {
    if (!isConnected || !hexAddress) return;
    getPolicy(hexAddress).then((p) => {
      if (p && Object.keys(p).length > 0) setPolicy((prev) => ({ ...prev, ...p }));
    });
  }, [isConnected, hexAddress]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await savePolicy(policy, hexAddress);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
        <Image
          src="/wallet.jpeg"
          alt="connect wallet"
          width={200}
          height={200}
          className="rounded-2xl opacity-90"
          priority
        />
        <div className="flex flex-col gap-1.5">
          <p className="font-semibold tracking-tight">connect your wallet to configure a strategy</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            your strategy is saved to your wallet address and applied on every tick.
          </p>
        </div>
        <Button onClick={openConnect} variant="outline" className="text-xs h-8 px-4">
          connect wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Strategy</h1>
        <p className="text-muted-foreground">
          Configure the trading strategy and risk limits. Changes take effect on the next tick.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Agent active</CardTitle>
              <CardDescription>
                {policy.paused ? "Paused — no trades will execute" : "Running autonomously on every tick"}
              </CardDescription>
            </div>
            <Switch
              checked={!policy.paused}
              onCheckedChange={(checked) => setPolicy((p) => ({ ...p, paused: !checked }))}
            />
          </div>
        </CardHeader>

        <Separator />

        <CardContent>
          <FieldGroup>
            <Field orientation="horizontal">
              <div>
                <FieldTitle id="strategy-label">Strategy</FieldTitle>
                <FieldDescription>Algorithm used for trade decisions</FieldDescription>
              </div>
              <ToggleGroup
                value={[policy.strategy ?? "momentum"]}
                onValueChange={(v) => v[0] && setPolicy((p) => ({ ...p, strategy: v[0] }))}
                spacing={2}
                aria-labelledby="strategy-label"
              >
                {ALL_STRATEGIES.map((s) => (
                  <ToggleGroupItem key={s} value={s}>
                    {s}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>

            <Field orientation="horizontal">
              <FieldTitle id="max-spend-label">Max spend per trade</FieldTitle>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">$</span>
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  value={policy.maxSpendUsd}
                  onChange={(e) => setPolicy((p) => ({ ...p, maxSpendUsd: Number(e.target.value) }))}
                  className="w-28 font-mono text-right"
                  aria-labelledby="max-spend-label"
                />
                <span className="text-muted-foreground text-sm">USD</span>
              </div>
            </Field>

            <Field orientation="horizontal">
              <div>
                <FieldTitle id="confidence-label">Min signal strength</FieldTitle>
                <FieldDescription>Trades below this threshold are blocked</FieldDescription>
              </div>
              <div className="flex items-center gap-3 w-48">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={policy.confidenceThreshold}
                  onChange={(e) => setPolicy((p) => ({ ...p, confidenceThreshold: Number(e.target.value) }))}
                  aria-labelledby="confidence-label"
                  className="flex-1 accent-primary"
                />
                <span className="font-mono text-sm w-10 text-right tabular-nums shrink-0">
                  {policy.confidenceThreshold.toFixed(2)}
                </span>
              </div>
            </Field>

            <Field orientation="horizontal">
              <FieldTitle id="tokens-label">Allowed tokens</FieldTitle>
              <ToggleGroup
                multiple
                value={policy.allowedTokens}
                onValueChange={(v) => setPolicy((p) => ({ ...p, allowedTokens: v as string[] }))}
                spacing={2}
                aria-labelledby="tokens-label"
              >
                {ALL_TOKENS.map((token) => (
                  <ToggleGroupItem key={token} value={token}>
                    {token}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>

            <Field orientation="horizontal">
              <div>
                <FieldTitle id="max-position-label">Max position size</FieldTitle>
                <FieldDescription>Total USD exposure cap per token</FieldDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">$</span>
                <Input
                  type="number"
                  min={1}
                  value={policy.maxPositionUsd ?? 200}
                  onChange={(e) => setPolicy((p) => ({ ...p, maxPositionUsd: Number(e.target.value) }))}
                  className="w-28 font-mono text-right"
                  aria-labelledby="max-position-label"
                />
                <span className="text-muted-foreground text-sm">USD</span>
              </div>
            </Field>

            <Field orientation="horizontal">
              <div>
                <FieldTitle id="drawdown-label">Max drawdown</FieldTitle>
                <FieldDescription>Halt trading if position loses more than this</FieldDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0.1}
                  max={100}
                  step={0.5}
                  value={policy.maxDrawdownPct ?? 5}
                  onChange={(e) => setPolicy((p) => ({ ...p, maxDrawdownPct: Number(e.target.value) }))}
                  className="w-24 font-mono text-right"
                  aria-labelledby="drawdown-label"
                />
                <span className="text-muted-foreground text-sm">%</span>
              </div>
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="justify-between">
          <p className="text-xs text-muted-foreground font-mono truncate max-w-[240px]">
            {hexAddress}
          </p>
          <Button onClick={handleSave} disabled={saving || saved}>
            {saving ? (
              <>
                <Spinner data-icon="inline-start" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckIcon data-icon="inline-start" />
                Saved
              </>
            ) : (
              "Save Strategy"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
