// proxy evm json-rpc (8545) through HTTPS to avoid mixed-content blocks
const TARGET = process.env.CHAIN_EVM_URL ?? "http://64.227.139.172:8545";

export async function POST(req: Request) {
  const body = await req.text();
  const res = await fetch(TARGET, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
  });
}
