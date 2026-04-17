import { AGENT_API } from "@/lib/config";

export async function GET() {
  const res = await fetch(`${AGENT_API}/api/portfolio`, { cache: "no-store" });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
