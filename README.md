# caleb

autonomous trading agent you don't have to trust. every trade is cryptographically committed on-chain. verify any decision in one click.

submitted to **TestSprite Season 2**. live at [app.caleb.sandpark.co](https://app.caleb.sandpark.co).

---

## what it actually does

caleb runs an hourly trading loop against live ETH prices. every cycle follows a 5-step sequence: **policy, market, decision, check, execution**. each step produces a keccak256 hash, and all five get committed in order to caleb-chain (a dedicated minievm rollup on initia). the chain *is* the audit trail.

anyone can connect a wallet and attest a session on-chain. reputation comes from peer signatures, not self-claim. the agent doesn't ask you to trust it. it asks you to verify.

it's been running on a VPS since march 2026. 34 real trades. $1000 paper starting balance. sitting at +1.66% realized + unrealized. not a demo loop.

---

## why this needed automated testing

caleb isn't a simple CRUD app. it's a next.js frontend talking to a live trading agent over REST, rendering real-time portfolio data, fetching on-chain hashes from a custom EVM rollup, and handling wallet connections across five different providers via interwovenkit. the client bundle pulls in wagmi, viem, recharts, and liveline on top of that. there are async data flows everywhere: polling sessions every 10 seconds, lazy-loading session detail from the agent API, client-side hash verification against on-chain state, and wallet-gated attestation transactions.

manually testing all of that is slow and you inevitably miss the edges. the proof links in the trade history looked fine when you clicked the right ones. the orphan sessions only broke if you happened to click a trade whose session failed to commit. you don't catch that stuff by clicking around.

## testing with testsprite

we used testsprite's MCP server to generate automated test cases from a standardized PRD and run them against the app in a headless browser. ran three rounds total.

**round 1** didn't produce usable results. we were serving from `next dev` and the heavy client bundle took 8-31 seconds to hydrate. testsprite's browser times out after ~15s, so every test saw a blank page. not a real failure, just broken setup. switched to `next build && next start`.

**round 2 (15 tests): 5 passed, 3 failed, 7 blocked.**

testsprite caught two bugs we'd missed:
- a "proof" link in trade history used `ExternalLinkIcon` even though it was an internal route. the runner followed an explorer link instead, exactly what a confused user would do. swapped to `ArrowRightIcon`.
- some trades referenced sessions that never committed on-chain (nonce race in the agent). clicking "proof" gave "session not found" with no context. added a `validSessionIds` filter so orphan trades show "no proof" with a tooltip.

**round 3 (26 tests, post-fix): 16 passed, 3 failed, 7 blocked.**

ran again after fixing both bugs. testsprite confirmed the fixes work: TC005 (proof link navigation) now passes, and TC025 specifically tests that orphan trades show the "no proof" label. both green.

the new failures are interesting too. the verdict distribution chart shows a single "SKIP" slice because the agent skips ~83% of its cycles. technically correct data but visually looks broken. the confidence histogram has the same problem: one fat bar. these are data-skew UX issues, not rendering bugs.

the blocked tests mostly hit orphan session IDs where the runner navigated to a session that didn't commit on-chain. a few need a browser wallet extension that headless runners can't provide.

testsprite was genuinely useful here. we'd been using this app in a browser for weeks and never noticed either bug it found. the icon thing is subtle. the orphan trades only break if you click the wrong row. having a runner systematically click through every link and every flow surfaces the stuff you'd ship with otherwise.

full analysis in [testsprite_tests/DELTA.md](testsprite_tests/DELTA.md). per-round reports in `testsprite_tests/round-*/`.

---

## why it's different

most "verifiable AI" projects log a hash to someone else's testnet and call it a day. caleb has its own chain, its own contract, its own block explorer. the audit is structured (5 steps, ordered, not freeform). policy declares constraints *before* action. check ratifies *before* execution. the chain enforces ordering.

the trust model has two paths. the agent commits hashes. users re-hash the payloads client-side and compare. if they match, the agent didn't tamper. attestation is the social layer on top of that cryptographic layer.

---

## project structure

```
caleb-app/
├── app/                 next.js pages (/, /sessions/[id], /strategy, /analytics)
├── components/          session feed, portfolio card, verify flow, attestation UI
├── lib/                 api client, types, utils
└── testsprite_tests/
    ├── testsprite-mcp-test-report.md   canonical combined report
    ├── DELTA.md                        R1→R2 analysis
    ├── round-1/                        0/15 passed (broken setup)
    ├── round-2/                        5/15 passed (first real run)
    └── round-3/                        16/26 passed (post-fix)
```

next.js app router convention, so code lives in `app/`, `components/`, `lib/` instead of `src/`.

agent backend + smart contract: [caleb-onchain](https://github.com/eipieq/caleb-onchain).

---

## run it

```bash
npm install
npm run build && npm run start
```

opens on localhost:3000. defaults point to the live VPS, no env setup needed.

---

## links

- dashboard: [app.caleb.sandpark.co](https://app.caleb.sandpark.co)
- agent repo: [github.com/eipieq/caleb-onchain](https://github.com/eipieq/caleb-onchain)
- contract: `0x22679adc7475B922901137F22D120404c074044f` on caleb-chain
- agent wallet: `0x772a1f0c3e3856645FF9019Af5B077B08AA1AFa3`
