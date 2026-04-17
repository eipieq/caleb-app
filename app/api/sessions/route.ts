import { AGENT_API } from "@/lib/config";

function normalizeSteps(session: any) {
  if (!session?.steps) return session;
  return {
    ...session,
    steps: session.steps.map((s: any) => ({
      ...s,
      hash: s.hash ?? s.dataHash,
    })),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "50";
  const res = await fetch(`${AGENT_API}/api/sessions?limit=${limit}`, { cache: "no-store" });
  const data = await res.json();
  const normalized = Array.isArray(data) ? data.map(normalizeSteps) : data;
  return Response.json(normalized, { status: res.status });
}
