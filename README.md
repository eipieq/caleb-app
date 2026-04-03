# Caleb Dashboard

The frontend for [Caleb](https://github.com/calebonchain/caleb-onchain) — a verifiable autonomous trading agent on Initia.

Live: **https://caleb-app.vercel.app**

---

## What it does

- **Trade Feed** — live stream of every agent decision with verdict, confidence score, and reasoning
- **Session Detail** — full 5-step audit timeline (policy → market → decision → check → execution) with on-chain tx links
- **One-click Verify** — re-hashes all step payloads and compares to on-chain hashes. Tamper-evident.
- **Attest** — connect your Initia wallet and sign an on-chain transaction to record that you independently verified a session
- **Strategy Config** — per-wallet policy settings (max spend, confidence threshold, cooldown, token whitelist)
- **Live Balance** — your real INIT balance on Initia testnet, fetched from the Cosmos REST API

---

## Stack

- Next.js 14 (App Router)
- `@initia/interwovenkit-react` — Initia wallet connection
- wagmi + viem — EVM contract reads/writes (attestation)
- @tanstack/react-query — data fetching + polling
- shadcn/ui + Tailwind CSS

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Environment variables** (optional — defaults point to the live VPS):

```env
NEXT_PUBLIC_AGENT_API=http://64.227.139.172:4000
NEXT_PUBLIC_INDEXER_API=http://64.227.139.172:6767
NEXT_PUBLIC_EVM_RPC=http://64.227.139.172:8545
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Trade feed — all sessions, portfolio stats, agent status |
| `/sessions/[id]` | Session detail — full audit trail, verify, attest |
| `/strategy` | Per-wallet strategy configuration |

---

## Wallet Integration

Connect via the **Connect** button (top right). Uses InterwovenKit — supports Initia-native wallets.

Once connected:
- Your live INIT balance is displayed (Cosmos L1, `initiation-2`)
- Strategy settings are saved per wallet address
- You can attest sessions on-chain (writes your address to `DecisionLog.sol`)

The attestation contract is at `0x22679adc7475B922901137F22D120404c074044f` on `caleb-chain`.

---

## Deployment

Auto-deploys to Vercel on push to `main`.
