import { AGENT_API } from "./config";
import type { Session, Policy, AttestationsResult, Portfolio } from "./types";

// server components can't use relative URLs — they need the full VPS address.
// client components use /api/* which proxies through Next.js route handlers
// (avoids mixed-content HTTPS→HTTP block in the browser).
const isServer = typeof window === "undefined";
const base = isServer ? AGENT_API : "";

function normalizeSteps(session: any) {
  if (!session?.steps) return session;
  return {
    ...session,
    steps: session.steps.map((s: any) => ({ ...s, hash: s.hash ?? s.dataHash })),
  };
}

export async function getSessions(limit = 50): Promise<Session[]> {
  const res = await fetch(`${base}/api/sessions?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("failed to fetch sessions");
  const data = await res.json();
  return Array.isArray(data) ? data.map(normalizeSteps) : data;
}

export async function getSession(id: string): Promise<Session> {
  const res = await fetch(`${base}/api/sessions/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("session not found");
  return normalizeSteps(await res.json());
}

export async function verifySession(id: string) {
  const res = await fetch(`${base}/api/verify/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("verify failed");
  return res.json();
}

export async function getPolicy(address?: string): Promise<Policy> {
  const url = address ? `${base}/api/policy/${address}` : `${base}/api/policy`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return { maxSpendUsd: 50, confidenceThreshold: 0.3, cooldownSeconds: 0, allowedTokens: ["INIT", "ETH", "USDC"] };
  return res.json();
}

export async function getAttestations(id: string): Promise<AttestationsResult> {
  const res = await fetch(`${base}/api/attestations/${id}`, { cache: "no-store" });
  if (!res.ok) return { sessionId: id, attestations: [], count: 0 };
  return res.json();
}

export async function getPortfolio(): Promise<Portfolio> {
  const res = await fetch(`${base}/api/portfolio`, { cache: "no-store" });
  if (!res.ok) throw new Error("portfolio not available");
  return res.json();
}

export async function savePolicy(policy: Policy, address?: string): Promise<void> {
  const url = address ? `${base}/api/policy/${address}` : `${base}/api/policy`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policy),
  });
  if (!res.ok) throw new Error("failed to save policy");
}
