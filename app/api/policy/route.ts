import { AGENT_API } from "@/lib/config";

export async function GET() {
  const res = await fetch(`${AGENT_API}/api/policy`, { cache: "no-store" });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

export async function POST(req: Request) {
  const body = await req.text();
  const res = await fetch(`${AGENT_API}/api/policy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
