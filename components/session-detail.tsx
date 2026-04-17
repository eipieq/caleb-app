"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon, CheckIcon, XIcon, ShieldCheckIcon, UsersIcon, CopyIcon, AlertTriangleIcon } from "lucide-react";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { encodeFunctionData } from "viem";
import { MsgCall } from "@initia/initia.proto/minievm/evm/v1/tx";
import { verifySession, getAttestations } from "@/lib/api";
import { LEGACY_CUTOFF } from "@/components/session-feed";
import { EXPLORER_TX, CONTRACT_ADDRESS, DECISION_LOG_ABI, CHAIN_ID } from "@/lib/config";
import type { Session, Attestation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

const STEP_LABELS: Record<string, string> = {
  POLICY: "Policy",
  MARKET: "Market",
  DECISION: "Decision",
  CHECK: "Check",
  EXECUTION: "Execution",
};

type VerifyResult = { allPassed: boolean; steps: { index: number; match: boolean }[] };

export function SessionDetail({ session }: { session: Session }) {
  const { isConnected, address, hexAddress, openConnect, requestTxBlock } = useInterwovenKit();

  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [alreadyAttested, setAlreadyAttested] = useState(false);

  const [attesting, setAttesting] = useState(false);
  const [attestTxHash, setAttestTxHash] = useState<string | null>(null);
  const [attestConfirmed, setAttestConfirmed] = useState(false);
  const [attestError, setAttestError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  function copyWithFeedback(text: string, label: string) {
    try { navigator.clipboard.writeText(text); } catch {}
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  }

  function toggleStep(kind: string) {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind); else next.add(kind);
      return next;
    });
  }

  const decision = session.steps?.find((s) => s.kind === "DECISION");
  const verdict   = (decision?.payload?.verdict as string) ?? "SKIP";
  const confidence = (decision?.payload?.confidence as number) ?? 0;
  const reasoning  = (decision?.payload?.reasoning as string) ?? "";
  const strategy   = (decision?.payload?.strategy as string) ?? session.strategy ?? null;
  const isBuy = verdict === "BUY";
  const isSell = verdict === "SELL";

  const loadAttestations = useCallback(async () => {
    const data = await getAttestations(session.sessionId);
    setAttestations(data.attestations);
    if (hexAddress) {
      setAlreadyAttested(data.attestations.some(
        (a) => a.attester.toLowerCase() === hexAddress.toLowerCase()
      ));
    }
  }, [session.sessionId, hexAddress]);

  useEffect(() => { loadAttestations(); }, [loadAttestations]);

  async function handleVerify() {
    setVerifying(true);
    try {
      const r = await verifySession(session.sessionId);
      setResult(r);
    } finally {
      setVerifying(false);
    }
  }

  async function handleAttest() {
    setAttesting(true);
    setAttestError(null);
    try {
      const sender = address || hexAddress;
      if (!sender) { setAttestError("Wallet address not available — reconnect your wallet"); return; }

      // encode the attest(bytes32) call using viem
      const input = encodeFunctionData({
        abi: DECISION_LOG_ABI,
        functionName: "attest",
        args: [session.sessionId as `0x${string}`],
      }).slice(2); // strip 0x — MsgCall expects raw hex

      // explicitly protobuf-encode the message so the registry doesn't need to know the type
      const msgValue = MsgCall.encode(MsgCall.fromPartial({
        sender,
        contractAddr: CONTRACT_ADDRESS,
        input,
        value: "",
        accessList: [],
        authList: [],
      })).finish();

      // send as a native Initia MsgCall cosmos transaction
      const res = await requestTxBlock({
        messages: [{
          typeUrl: "/minievm.evm.v1.MsgCall",
          value: msgValue,
        }],
        chainId: CHAIN_ID,
      });

      setAttestTxHash(res.transactionHash);
      setAttestConfirmed(true);
      await loadAttestations();
    } catch (err) {
      setAttestError(err instanceof Error ? err.message.slice(0, 100) : "Transaction failed");
    } finally {
      setAttesting(false);
    }
  }

  const showAttestButton = result?.allPassed && isConnected && !alreadyAttested && !attestConfirmed;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Button variant="ghost" size="sm" render={<Link href="/" />} nativeButton={false} className="mb-6">
        <ArrowLeftIcon data-icon="inline-start" />
        Back
      </Button>

      {/* chain commit failed banner — hide if verification already passed */}
      {(session as any).committed === false && !result?.allPassed && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-yellow-500/40 bg-transparent px-4 py-3 text-xs text-yellow-400">
          <AlertTriangleIcon className="size-3.5 mt-0.5 shrink-0" />
          <span className="flex flex-col gap-1">
            <span>
              chain commit failed — on-chain proof unavailable for this session.
              {(session as any).commitError && (
                <span className="ml-1 font-mono opacity-70">{(session as any).commitError}</span>
              )}
            </span>
            <span className="text-muted-foreground">
              this was a nonce race condition in the runner — when two sessions overlapped,
              the chain rejected the tx with a sequence mismatch. the trade was recorded in
              the portfolio but the session file was never saved. fixed: the runner now
              re-fetches the nonce before every tx and saves a session file before any chain
              commit fires.
            </span>
          </span>
        </div>
      )}

      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Badge variant={isBuy ? "default" : isSell ? "destructive" : "secondary"} className="text-sm">
                  {verdict}
                </Badge>
                <span className="text-muted-foreground font-mono text-sm">{confidence.toFixed(2)} signal</span>
                {strategy && (
                  <span className="text-xs text-muted-foreground/60">{strategy}</span>
                )}
                {attestations.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <UsersIcon className="size-3" />
                    {attestations.length} {attestations.length === 1 ? "attestation" : "attestations"}
                  </span>
                )}
              </div>
              <CardDescription className="font-mono text-xs break-all">{session.sessionId}</CardDescription>
              <CardDescription className="text-xs">
                {new Date(session.startedAt * 1000).toLocaleString()}
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <Button variant="outline" onClick={handleVerify} disabled={verifying}>
                {verifying ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon data-icon="inline-start" />
                    Verify on-chain
                  </>
                )}
              </Button>

              {result?.allPassed && !isConnected && (
                <Button size="sm" onClick={openConnect}>
                  Connect wallet to submit an attestation
                </Button>
              )}

              {showAttestButton && (
                <Button size="sm" onClick={handleAttest} disabled={attesting}>
                  {attesting ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Attesting...
                    </>
                  ) : (
                    <>
                      <CheckIcon data-icon="inline-start" />
                      Attest on-chain
                    </>
                  )}
                </Button>
              )}

              {(attestConfirmed || alreadyAttested) && (
                <Badge variant="default" className="text-xs">
                  <CheckIcon className="size-3 mr-1" />
                  You attested this session
                </Badge>
              )}

              {attestError && (
                <span className="text-xs text-destructive max-w-[200px] text-right">
                  {attestError}
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        {result && (
          <CardContent className="flex flex-col gap-3">
            <Badge variant={result.allPassed ? "default" : session.startedAt < LEGACY_CUTOFF ? "secondary" : "destructive"}>
              {result.allPassed ? "All 5 hashes match on-chain" : session.startedAt < LEGACY_CUTOFF ? "Legacy session — format predates current agent" : "Hash mismatch detected"}
            </Badge>
            {attestTxHash && (
              <button
                title={`attestation tx: ${attestTxHash}\n\non caleb-chain — query via RPC at 64.227.139.172:26657`}
                onClick={() => copyWithFeedback(attestTxHash, "attest-tx")}
                className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                {copiedHash === "attest-tx" ? (
                  <><CheckIcon className="size-3 text-green-400" /> Copied to clipboard</>
                ) : (
                  <>Attestation tx: {attestTxHash.slice(0, 20)}... <CopyIcon className="size-3" /></>
                )}
              </button>
            )}
          </CardContent>
        )}
      </Card>

      {/* Attestations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="size-4" />
            Independent Attestations
            <span className="text-sm font-normal text-muted-foreground ml-1">({attestations.length})</span>
          </CardTitle>
          <CardDescription>
            {attestations.length > 0
              ? "These addresses independently verified and attested this session on-chain."
              : "No attestations yet. Verify this session and attest on-chain to be the first."}
          </CardDescription>
        </CardHeader>
        {attestations.length > 0 && (
          <CardContent>
            <div className="flex flex-col gap-2">
              {attestations.map((a, i) => (
                <div key={i} className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-mono text-xs text-muted-foreground truncate">
                    {a.attester}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(a.timestamp * 1000).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Signal Reasoning */}
      {reasoning && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Signal Reasoning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{reasoning}</p>
          </CardContent>
        </Card>
      )}

      {/* Steps */}
      <Card>
        <CardHeader>
          <CardTitle>5-Step Cycle</CardTitle>
          <CardDescription>Each step is hashed and committed on-chain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {session.steps?.map((step, i) => {
              const verified = result?.steps?.[i];
              const isExpanded = expandedSteps.has(step.kind);
              return (
                <div key={step.kind} className="flex flex-col">
                  <button
                    onClick={() => toggleStep(step.kind)}
                    className="flex items-center gap-4 w-full text-left hover:bg-accent/30 rounded-lg px-2 py-1.5 -mx-2 transition-colors"
                  >
                    <Badge variant="outline" className="w-24 justify-center shrink-0">
                      {STEP_LABELS[step.kind] ?? step.kind}
                    </Badge>

                    <span className="font-mono text-xs text-muted-foreground truncate flex-1 min-w-0">
                      {step.hash}
                    </span>

                    {verified && (
                      <Badge variant={verified.match ? "default" : "destructive"}>
                        {verified.match ? <CheckIcon /> : <XIcon />}
                      </Badge>
                    )}

                    <span className="text-xs text-muted-foreground/50 shrink-0">{isExpanded ? "▾" : "▸"}</span>
                  </button>

                  {isExpanded && (
                    <div className="ml-28 mt-2 mb-3 flex flex-col gap-2 text-xs">
                      {step.payload && (
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {(() => {
                            const p = step.payload as Record<string, unknown>;
                            const text = (p.reasoning as string) ?? (p.reason as string) ?? (p.signal as string) ?? null;
                            if (text) return <p>{text}</p>;
                            if (step.kind === "POLICY") return <p>max spend ${String(p.maxSpendUsd)}, confidence threshold {String(p.confidenceThreshold)}, tokens: {Array.isArray(p.allowedTokens) ? (p.allowedTokens as string[]).join(", ") : "—"}</p>;
                            if (step.kind === "CHECK") return <p>{p.passed ? "all gates passed" : `blocked by: ${String(p.blockedBy)}`}</p>;
                            return <p className="text-muted-foreground/60">expand raw JSON below for full payload.</p>;
                          })()}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); copyWithFeedback(step.hash, `hash-${step.kind}`); }}
                          className="flex items-center gap-1 font-mono text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedHash === `hash-${step.kind}` ? (
                            <><CheckIcon className="size-3 text-green-400" /> Copied to clipboard</>
                          ) : (
                            <><CopyIcon className="size-3" /> Copy hash</>
                          )}
                        </button>
                      </div>

                      {step.txHash ? (
                        <button
                          title={`tx: ${step.txHash}\n\non caleb-chain — query via RPC at 64.227.139.172:26657`}
                          onClick={(e) => { e.stopPropagation(); copyWithFeedback(step.txHash, `tx-${step.kind}`); }}
                          className="flex items-center gap-1 font-mono text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedHash === `tx-${step.kind}` ? (
                            <><CheckIcon className="size-3 text-green-400" /> Copied to clipboard</>
                          ) : (
                            <>tx: {step.txHash.slice(0, 8)}... <CopyIcon className="size-3" /></>
                          )}
                        </button>
                      ) : (
                        <span className="font-mono text-muted-foreground/40">no tx</span>
                      )}

                      <details className="mt-1">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors select-none">
                          Raw JSON
                        </summary>
                        <pre className="mt-2 p-3 bg-muted rounded-lg overflow-auto text-muted-foreground leading-relaxed">
                          {JSON.stringify(step.payload, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Raw data */}
      <Separator className="my-6" />
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors select-none text-sm">
          Raw session data
        </summary>
        <pre className="mt-3 p-4 bg-muted rounded-xl overflow-auto text-xs text-muted-foreground leading-relaxed">
          {JSON.stringify(session, null, 2)}
        </pre>
      </details>
    </div>
  );
}
