# caleb-app — product specification

**version:** 0.1.0
**status:** live at [app.caleb.sandpark.co](https://app.caleb.sandpark.co)
**last updated:** 2026-04-18

---

## what it is

a next.js dashboard for caleb, an autonomous HFT trading agent that runs on its own EVM L2 (minievm on Initia). the dashboard lets anyone inspect the agent's trades, verify their cryptographic audit trails on-chain, and optionally connect a wallet to configure strategy parameters or attest sessions independently.

the core claim: every trade decision follows a 5-step cycle (POLICY, MARKET, DECISION, CHECK, EXECUTION), each step is keccak256-hashed and committed on-chain, and any visitor can verify the hashes match in one click. trust the math, not the operator.

---

## target users

1. **observers** — anyone who wants to see what the agent is doing. no wallet needed. browse the feed, drill into sessions, read the AI's reasoning, verify hashes.
2. **participants** — wallet-connected users who configure their own strategy (risk limits, token allowlist, signal threshold) and let the agent trade on their behalf.
3. **attesters** — wallet-connected users who verify a session's on-chain hashes and then submit an independent attestation tx to the `DecisionLog` contract.

---

## pages and routes

| route | purpose | data source |
|---|---|---|
| `/` | trade feed. live session list grouped by day, portfolio card, agent status indicator, stats bar. polls every 10s. | `GET /api/sessions`, `GET /api/portfolio` |
| `/sessions/[id]` | session detail. 5-step hash breakdown, verify button, attest button (post-verify, wallet required), AI reasoning, raw JSON. | `GET /api/sessions/:id`, `GET /api/verify/:id`, `GET /api/attestations/:id` |
| `/strategy` | strategy config form. wallet-gated. toggle agent on/off, pick strategy (momentum / mean-revert / scalper), set max spend, confidence threshold, allowed tokens, max position, max drawdown. saves per-address. | `GET /api/policy`, `POST /api/policy` |
| `/analytics` | portfolio analytics. stat cards (P&L, value, win rate, trade count), cumulative P&L chart (Liveline), portfolio value chart, verdict pie chart, confidence histogram. | `GET /api/portfolio`, `GET /api/sessions` |

### api routes (next.js proxies)

all proxies exist to avoid mixed-content blocks (HTTPS frontend → HTTP VPS).

| route | purpose |
|---|---|
| `/api/sessions` | proxies `AGENT_API/api/sessions` |
| `/api/sessions/[id]` | proxies `AGENT_API/api/sessions/:id` |
| `/api/verify/[id]` | proxies `AGENT_API/api/verify/:id` |
| `/api/attestations/[id]` | proxies `AGENT_API/api/attestations/:id` |
| `/api/portfolio` | proxies `AGENT_API/api/portfolio` |
| `/api/policy` | proxies `AGENT_API/api/policy` (GET + POST) |
| `/api/policy/[address]` | proxies `AGENT_API/api/policy/:address` |
| `/api/chain-rpc/[[...path]]` | proxies Cosmos RPC (`:26657`) — used by InterwovenKit for tx broadcast |
| `/api/chain-rest/[[...path]]` | proxies Cosmos REST (`:1317`) — used by InterwovenKit for account queries |
| `/api/chain-evm` | proxies EVM JSON-RPC (`:8545`) — used by wagmi/viem for on-chain reads |

---

## data model

### session
the atomic unit. one complete run of the 5-step cycle.

- `sessionId` — bytes32 identifier
- `agent` — wallet address of the agent
- `startedAt` / `finalizedAt` — unix timestamps
- `steps[]` — array of 5 steps, each with `kind`, `hash`, `txHash`, `timestamp`, `payload`
- `strategy` — which algorithm was used (momentum, mean-revert, scalper)
- `verdict` — BUY / SELL / SKIP
- `confidence` — 0 to 1 signal strength
- `reasoning` — natural language explanation from Venice AI (Llama 3.3-70B)

### step
one phase of the 5-step cycle.

- `kind` — POLICY | MARKET | DECISION | CHECK | EXECUTION
- `hash` — keccak256 of the step's payload
- `txHash` — on-chain transaction hash on caleb-chain
- `payload` — arbitrary JSON (strategy params, price data, decision output, etc.)

### portfolio
running state of all positions and trade history.

- `startingBalanceUsd`, `usdcBalance`, `totalValueUsd`
- `totalPnlUsd`, `totalPnlPct`, `realisedPnlUsd`, `unrealisedPnlUsd`
- `holdings` — map of token to position (amount, avg entry, current price, unrealised P&L)
- `tradeHistory[]` — ordered list of executed trades with session links
- `winningTrades`, `losingTrades`

### policy
per-address strategy configuration.

- `maxSpendUsd` — max USD per trade
- `confidenceThreshold` — minimum signal strength to act
- `cooldownSeconds` — min time between trades
- `allowedTokens` — token allowlist (INIT, ETH, USDC)
- `maxPositionUsd` — max exposure per token
- `maxDrawdownPct` — halt threshold
- `strategy` — algorithm name (momentum, mean-revert, scalper)
- `paused` — kill switch

### attestation
independent third-party verification record.

- `attester` — wallet address
- `timestamp` — when the attestation tx was confirmed

---

## core flows

### 1. verify a session

1. user clicks "verify on-chain" on a session detail page
2. frontend calls `/api/verify/:id` (proxied to agent API)
3. agent API re-hashes each step's payload locally and compares against the on-chain hashes via RPC
4. result: pass/fail per step, displayed as green/red badges

### 2. attest a session

1. prerequisite: verification passed, wallet connected, user hasn't already attested
2. user clicks "attest on-chain"
3. frontend encodes `attest(bytes32 sessionId)` via viem, wraps in a Cosmos `MsgCall` (minievm protobuf), sends via InterwovenKit's `requestTxBlock`
4. tx lands on caleb-chain, `DecisionLog.sol` records the attester address and timestamp
5. attestation count and list refresh on the detail page

### 3. configure strategy

1. user connects wallet via InterwovenKit (Initia testnet)
2. existing policy for their address loads from agent API
3. user edits parameters (strategy, limits, tokens, drawdown)
4. "save strategy" sends `POST /api/policy/:address` to agent API
5. agent picks up new config on next tick

### 4. browse trade feed

1. home page polls `GET /api/sessions` and `GET /api/portfolio` every 10 seconds
2. sessions grouped by day, most recent first
3. portfolio card shows value, P&L breakdown, open positions, last 10 trades with "proof" links
4. legacy sessions (before 2026-04-06) hidden by default behind an "archive" toggle

---

## tech stack

| layer | choice |
|---|---|
| framework | Next.js 16.2.1 (App Router) |
| react | 19.2.4 |
| styling | Tailwind CSS 4, shadcn (Base UI), tw-animate-css |
| charts | Recharts 3.8.1, Liveline 0.0.7 (sparkline with scrub/pulse) |
| wallet | InterwovenKit (Initia), wagmi 2, viem 2 |
| state | React Query (TanStack), localStorage for stale-while-revalidate |
| icons | Lucide React, @initia/icons-react |
| chain | caleb-chain (minievm on Initia), EVM chain ID `1043515499963059` |
| contract | `DecisionLog.sol` at `0x22679adc7475B922901137F22D120404c074044f` |
| agent API | Node.js on VPS `64.227.139.172:4000` |
| indexer | Rollytics at `:6767` |
| RPC | `:8545` (EVM), `:26657` (Tendermint) |

---

## infrastructure

```
                 browser (HTTPS)
                    │
                    ▼
         ┌──────────────────────────┐
         │   caleb-app (Vercel)     │
         │   Next.js 16             │
         │   /api/* proxies:        │
         │     sessions, portfolio, │
         │     verify, attestations,│
         │     policy, chain-rpc,   │
         │     chain-rest, chain-evm│
         └──────┬───────────────────┘
                │ fetch (HTTP, server-side)
                ▼
   ┌────────────────────────────────┐
   │   VPS 64.227.139.172           │
   │   :4000  agent API (sessions,  │
   │          policy, portfolio,    │
   │          verify)               │
   │   :6767  Rollytics indexer     │
   │   :8545  EVM JSON-RPC          │
   │   :26657 Tendermint RPC        │
   │   :1317  Cosmos REST           │
   │   minitiad (caleb-chain)       │
   └────────────────────────────────┘
                │
                ▼
         Initia testnet (initiation-2)
         settlement layer
```

all next.js API routes are server-side proxies. they exist so the HTTPS frontend can reach the HTTP VPS without mixed-content blocks. this includes the chain RPC/REST/EVM endpoints used by InterwovenKit and wagmi for wallet tx broadcast and on-chain reads.

---

## component inventory

| component | what it does |
|---|---|
| `HomeFeed` | top-level home page. fetches sessions + portfolio, renders feed + stats + portfolio card |
| `SessionFeed` | groups sessions by day, paginates within each group (5 per page), archive toggle for legacy sessions |
| `SessionCard` | compact row for one session. verdict badge, confidence, strategy, timestamp, reasoning preview |
| `SessionDetail` | full session view. 5-step hash table, verify/attest buttons, attestation list, reasoning, raw JSON |
| `PortfolioCard` | portfolio summary. value, P&L breakdown, open positions, trade history with proof links |
| `AnalyticsDashboard` | charts page. stat cards, cumulative P&L (Liveline), portfolio value (Liveline), verdict pie, confidence histogram |
| `StrategyForm` | wallet-gated policy editor. strategy toggle, spend/threshold/token/drawdown controls |
| `StatsBar` | inline stats from session list (counts, verdicts) |
| `AgentStatus` | live elapsed time since last session, green dot if < 15s |
| `ConnectCta` | banner prompting wallet connect, links to /strategy |
| `UserBalanceCard` | shows connected wallet's balance on Initia testnet |
| `WalletButton` | InterwovenKit connect/disconnect button |
| `Nav` | sticky header. logo ("caleb / trust the math"), feed + strategy links, live indicator, wallet button |
| `Footer` | page footer |
| `Providers` | wraps app in QueryClient, WagmiProvider, InterwovenKitProvider with caleb-chain config |

---

## contract interface (DecisionLog.sol)

the dashboard interacts with one contract function and reads three:

| function | type | purpose |
|---|---|---|
| `attest(bytes32 sessionId)` | write | record caller as an independent attester for a session |
| `getAttestationCount(bytes32)` | view | number of attestations for a session |
| `getAttestation(bytes32, uint256)` | view | attester address + timestamp at index |
| `hasAttested(bytes32, address)` | view | check if a specific address already attested |

event: `Attested(bytes32 indexed sessionId, address indexed attester, uint256 timestamp)`

---

## design decisions

**why proxy API routes instead of calling the VPS directly?**
the VPS serves over HTTP. the app is deployed on Vercel over HTTPS. browsers block mixed-content fetches. all Next.js API routes are server-side proxies that sidestep this — including the chain RPC/REST/EVM endpoints needed by the wallet SDK for attestation tx broadcast.

**why localStorage for sessions/portfolio?**
stale-while-revalidate pattern. show cached data instantly on page load, then replace with fresh data from the 10s polling interval. avoids a blank loading state on repeat visits.

**why a legacy cutoff date?**
the agent's payload format changed on 2026-04-06 when the cron-based runner was replaced with the current architecture. sessions before that date have incompatible hash structures. they're kept but hidden by default.

**why Cosmos MsgCall for attestation instead of a direct EVM tx?**
caleb-chain is a minievm rollup on Initia. InterwovenKit operates at the Cosmos SDK level. the attestation call is encoded as EVM calldata via viem, then wrapped in a protobuf `MsgCall` and sent as a Cosmos transaction. this is the standard pattern for minievm chains.

**why per-address policies?**
forward-looking. currently the agent runs one global strategy, but the architecture supports multiple users each configuring their own policy. the agent reads the connected wallet's policy on each tick.

---

## known limitations

- **single VPS, single agent.** no redundancy, no failover. if the VPS goes down, the dashboard shows stale data.
- **no auth on agent API.** policy writes are unauthenticated. anyone with the VPS IP can POST a policy. acceptable for a hackathon demo, not for production.
- **HTTP backend.** the VPS doesn't serve HTTPS, hence the proxy routes. a proper deployment would terminate TLS at the VPS.
- **no websocket / SSE.** polling every 10s. fine for the current tick interval, would need real-time transport for sub-second HFT.
- **legacy sessions can't be verified.** hash format mismatch. they're displayable but verification returns false positives.
- **chain commit failures.** nonce race conditions between overlapping sessions caused some trades to record in the portfolio but not commit on-chain. fixed with local nonce tracking (`acquireNonce`/`syncNonce`), but historically affected sessions show a yellow warning banner. banner auto-hides if verification passes.

## strategies

| name | description | AI layer |
|---|---|---|
| `momentum` | trend-following. buys when short EMA crosses above long EMA, sells on crossover down. | yes — Venice AI (Llama 3.3-70B) confirms or overrides signals |
| `mean-revert` | mean-reversion. buys when price drops below a moving average band, sells when it reverts above. | yes |
| `scalper` | micro-scalping. trades on tiny deviations (0.05%) from a 5-tick EMA. fires frequently for high-frequency demo with lots of on-chain proofs. | no — AI disabled, micro-moves get vetoed every time |
