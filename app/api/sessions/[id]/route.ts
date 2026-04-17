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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${AGENT_API}/api/sessions/${id}`, { cache: "no-store" });
  const data = await res.json();
  return Response.json(normalizeSteps(data), { status: res.status });
}
