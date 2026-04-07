import { AGENT_API } from "./config";
import type { Session, Policy, AttestationsResult, Portfolio } from "./types";

export async function getSessions(limit = 50): Promise<Session[]> {
  const res = await fetch(`${AGENT_API}/api/sessions?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("failed to fetch sessions");
  return res.json();
}

export async function getSession(id: string): Promise<Session> {
  const res = await fetch(`${AGENT_API}/api/sessions/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("session not found");
  return res.json();
}

export async function verifySession(id: string) {
  // proxy through Next.js to avoid mixed-content (HTTP VPS from HTTPS page)
  const res = await fetch(`/api/verify/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("verify failed");
  return res.json();
}

export async function getPolicy(address?: string): Promise<Policy> {
  const url = address ? `${AGENT_API}/api/policy/${address}` : `${AGENT_API}/api/policy`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return { maxSpendUsd: 50, confidenceThreshold: 0.3, cooldownSeconds: 0, allowedTokens: ["INIT", "ETH", "USDC"] };
  return res.json();
}

export async function getAttestations(id: string): Promise<AttestationsResult> {
  // proxy through Next.js to avoid mixed-content
  const res = await fetch(`/api/attestations/${id}`, { cache: "no-store" });
  if (!res.ok) return { sessionId: id, attestations: [], count: 0 };
  return res.json();
}

export async function getPortfolio(): Promise<Portfolio> {
  const res = await fetch(`${AGENT_API}/api/portfolio`, { cache: "no-store" });
  if (!res.ok) throw new Error("portfolio not available");
  return res.json();
}

export async function savePolicy(policy: Policy, address?: string): Promise<void> {
  const url = address ? `${AGENT_API}/api/policy/${address}` : `${AGENT_API}/api/policy`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policy),
  });
  if (!res.ok) throw new Error("failed to save policy");
}
