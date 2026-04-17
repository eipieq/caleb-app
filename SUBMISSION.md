# caleb

an autonomous trading agent you don't have to trust. every trade is cryptographically committed on-chain and independently verifiable in one click.

submitted to **TestSprite Season 2** (deadline 2026-04-17).
live at [app.caleb.sandpark.co](https://app.caleb.sandpark.co).

---

## the 30-second pitch

- **policy → market → decision → check → execution.** five keccak256 hashes, committed in order to caleb-chain (a dedicated minievm rollup on initia). the chain is the audit trail.
- **dual attestation.** anyone can connect a wallet and attest a session on-chain. reputation comes from peer signatures, not self-claim.
- **not a testnet toy.** the agent has been running hourly on a VPS since mar 2026, has placed 34 real trades against live ETH prices, and sits at +1.66% realized + unrealized on a $1000 paper account.

---

## this repo

this is `caleb-app`, the next.js dashboard that testsprite tests. the agent backend and smart contract live in a sibling repo ([caleb-onchain](https://github.com/eipieq/caleb-onchain)).

```
caleb-app/
├── app/                 next.js app router pages
├── components/          react components (session feed, portfolio card, verify flow, etc.)
├── lib/                 api client, types, utils
├── SUBMISSION.md        ← you are here
├── PROGRESS.md          hackathon progress tracker
└── testsprite_tests/
    ├── testsprite-mcp-test-report.md   ← canonical combined report (R1 + R2)
    ├── DELTA.md                        ← R1→R2 narrative analysis
    ├── round-1/                        R1 artifacts — 0/15 passed (all blocked)
    └── round-2/                        R2 artifacts — 5/15 passed (+33.3pp delta)
```

---

## the testsprite story

**R1 found one bug and it dominated every test.**

all 15 tests came back BLOCKED with "page rendered blank, 0 interactive elements." root cause: the dashboard was on `next dev`. wagmi + viem + interwovenkit + recharts + liveline is a heavy client bundle. hydration was taking 8-31 seconds in the dev-mode server logs. TestSprite's browser waits ~15 seconds and gives up.

**R2 fixed that and surfaced real product bugs.**

one line change: `next dev` → `next build && next start`. response time collapsed from seconds to 4ms. pass rate went 0% → 33.3%.

the remaining failures were legitimate findings:
- a misleading `ExternalLinkIcon` on an internal "proof" link in the trade history
- "orphan" trades pointing to sessions that failed to commit on-chain (nonce race in the agent runner)

both fixed after R2. see [testsprite_tests/DELTA.md](testsprite_tests/DELTA.md) for the full analysis.

---

## what makes caleb different

- **dedicated rollup.** not logging to someone else's testnet. caleb has its own evm chain, its own contract, its own block explorer.
- **5-step atomic cycle.** the audit is structured, not freeform. policy declares constraints before action. check ratifies action before execution. the chain enforces ordering.
- **dual-path trust.** the agent commits hashes; users re-hash the payloads client-side and compare. attestation is the social layer on top.
- **real execution, not a demo loop.** the agent has been running for weeks. portfolio is tracked from $1000 starting balance. pnl is real.

---

## run it yourself

```bash
npm install
npm run build && npm run start
# open http://localhost:3000
```

defaults point to the live VPS at `64.227.139.172:4000`. no setup needed beyond install.

---

## links

- dashboard: [app.caleb.sandpark.co](https://app.caleb.sandpark.co)
- agent + contract repo: [github.com/eipieq/caleb-onchain](https://github.com/eipieq/caleb-onchain)
- contract: `0x22679adc7475B922901137F22D120404c074044f` on caleb-chain
- agent wallet: `0x772a1f0c3e3856645FF9019Af5B077B08AA1AFa3`
