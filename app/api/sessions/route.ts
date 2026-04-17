import { AGENT_API } from "@/lib/config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "50";
  const res = await fetch(`${AGENT_API}/api/sessions?limit=${limit}`, { cache: "no-store" });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
