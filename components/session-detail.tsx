"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon, CheckIcon, XIcon, ShieldCheckIcon, UsersIcon, CopyIcon } from "lucide-react";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { encodeFunctionData } from "viem";
import { MsgCall } from "@initia/initia.proto/minievm/evm/v1/tx";
import { verifySession, getAttestations } from "@/lib/api";
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
      // encode the attest(bytes32) call using viem
      const input = encodeFunctionData({
        abi: DECISION_LOG_ABI,
        functionName: "attest",
        args: [session.sessionId as `0x${string}`],
      }).slice(2); // strip 0x — MsgCall expects raw hex

      // explicitly protobuf-encode the message so the registry doesn't need to know the type
      const msgValue = MsgCall.encode(MsgCall.fromPartial({
        sender: address,
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
                  Connect wallet to attest
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
            <Badge variant={result.allPassed ? "default" : "destructive"}>
              {result.allPassed ? "All 5 hashes match on-chain" : "Hash mismatch detected"}
            </Badge>
            {attestTxHash && (
              <button
                title={`attestation tx: ${attestTxHash}\n\non caleb-chain — query via RPC at 64.227.139.172:26657`}
                onClick={() => navigator.clipboard.writeText(attestTxHash)}
                className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                Attestation tx: {attestTxHash.slice(0, 20)}...
                <CopyIcon className="size-3" />
              </button>
            )}
          </CardContent>
        )}
      </Card>

      {/* Attestations */}
      {attestations.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="size-4" />
              Independent Attestations
            </CardTitle>
            <CardDescription>
              These addresses independently verified and attested this session on-chain.
            </CardDescription>
          </CardHeader>
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
        </Card>
      )}

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
              return (
                <div key={step.kind} className="flex items-center gap-4">
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

                  <button
                    title={`tx: ${step.txHash}\n\non caleb-chain — query via RPC at 64.227.139.172:26657`}
                    onClick={() => navigator.clipboard.writeText(step.txHash)}
                    className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {step.txHash.slice(0, 8)}...
                    <CopyIcon className="size-3" />
                  </button>
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
