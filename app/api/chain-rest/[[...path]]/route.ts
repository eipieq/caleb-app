// proxy cosmos rest (1317) through HTTPS to avoid mixed-content blocks
const TARGET = process.env.CHAIN_REST_URL ?? "http://64.227.139.172:1317";

async function proxy(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/chain-rest/, "") || "/";
  const target = `${TARGET}${path}${url.search}`;

  const headers: Record<string, string> = { "content-type": req.headers.get("content-type") ?? "application/json" };
  const res = await fetch(target, {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
      "access-control-allow-origin": "*",
    },
  });
}

export const GET = proxy;
export const POST = proxy;
