"use client";

import { useState } from "react";
import { savePolicy } from "@/lib/api";
import type { Policy } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Field, FieldGroup, FieldTitle, FieldDescription } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { CheckIcon } from "lucide-react";

const ALL_TOKENS = ["INIT", "ETH", "USDC"];

const DEFAULT: Policy = {
  maxSpendUsd: 50,
  confidenceThreshold: 0.7,
  cooldownSeconds: 3600,
  allowedTokens: ["INIT", "ETH", "USDC"],
  paused: false,
};

export function StrategyForm({ initialPolicy }: { initialPolicy: Policy | null }) {
  const [policy, setPolicy] = useState<Policy>({ ...DEFAULT, ...initialPolicy });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await savePolicy(policy);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Strategy</h1>
        <p className="text-muted-foreground">
          Configure how the agent trades. Changes take effect on the next cycle.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Agent active</CardTitle>
              <CardDescription>
                {policy.paused ? "Paused \u2014 no cycles will run" : "Running every hour autonomously"}
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
              <FieldTitle id="max-spend-label">Max spend per cycle</FieldTitle>
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
              <FieldTitle id="confidence-label">Confidence threshold</FieldTitle>
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
              <FieldTitle id="cooldown-label">Cooldown between cycles</FieldTitle>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={Math.round(policy.cooldownSeconds / 60)}
                  onChange={(e) => setPolicy((p) => ({ ...p, cooldownSeconds: Number(e.target.value) * 60 }))}
                  className="w-24 font-mono text-right"
                  aria-labelledby="cooldown-label"
                />
                <span className="text-muted-foreground text-sm">min</span>
              </div>
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="justify-end">
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
