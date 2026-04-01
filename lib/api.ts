import { AGENT_API } from "./config";
import type { Session, Policy, AttestationsResult } from "./types";

export async function getSessions(): Promise<Session[]> {
  const res = await fetch(`${AGENT_API}/api/sessions`, { cache: "no-store" });
  if (!res.ok) throw new Error("failed to fetch sessions");
  return res.json();
}

export async function getSession(id: string): Promise<Session> {
  const res = await fetch(`${AGENT_API}/api/sessions/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("session not found");
  return res.json();
}

export async function verifySession(id: string) {
  const res = await fetch(`${AGENT_API}/api/verify/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("verify failed");
  return res.json();
}

export async function getPolicy(): Promise<Policy> {
  const res = await fetch(`${AGENT_API}/api/policy`, { cache: "no-store" });
  if (!res.ok) return { maxSpendUsd: 50, confidenceThreshold: 0.7, cooldownSeconds: 3600, allowedTokens: ["INIT", "ETH", "USDC"] };
  return res.json();
}

export async function getAttestations(id: string): Promise<AttestationsResult> {
  const res = await fetch(`${AGENT_API}/api/attestations/${id}`, { cache: "no-store" });
  if (!res.ok) return { sessionId: id, attestations: [], count: 0 };
  return res.json();
}

export async function savePolicy(policy: Policy): Promise<void> {
  const res = await fetch(`${AGENT_API}/api/policy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policy),
  });
  if (!res.ok) throw new Error("failed to save policy");
}
