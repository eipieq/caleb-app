import { AGENT_API } from "@/lib/config";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${AGENT_API}/api/verify/${id}`, { cache: "no-store" });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
