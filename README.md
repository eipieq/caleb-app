# caleb

autonomous trading agent you don't have to trust. every trade is cryptographically committed on-chain. verify any decision in one click.

submitted to **TestSprite Season 2**. live at [app.caleb.sandpark.co](https://app.caleb.sandpark.co).

---

## what it actually does

caleb runs an hourly trading loop against live ETH prices. every cycle follows a 5-step sequence: **policy, market, decision, check, execution**. each step produces a keccak256 hash, and all five get committed in order to caleb-chain (a dedicated minievm rollup on initia). the chain *is* the audit trail.

anyone can connect a wallet and attest a session on-chain. reputation comes from peer signatures, not self-claim. the agent doesn't ask you to trust it. it asks you to verify.

it's been running on a VPS since march 2026. 34 real trades. $1000 paper starting balance. sitting at +1.66% realized + unrealized. not a demo loop.

---

## testing with testsprite

we used the testsprite MCP server to generate and run 15 automated test cases from a standardized PRD. covers the trade feed, session detail/verification flow, and wallet connection.

our first attempt didn't produce usable results. we were serving the app from `next dev`, and the client bundle (wagmi + viem + interwovenkit + recharts + liveline) took 8-31 seconds to hydrate. testsprite's headless browser times out after about 15 seconds, so every test reported a blank page. not a real test failure, just broken setup. we switched to `next build && next start` and ran again.

**results: 5/15 passed, 3 failed, 7 blocked.**

testsprite caught two real bugs we hadn't noticed:
- a "proof" link in the trade history used an `ExternalLinkIcon` even though it pointed to an internal page. the test runner followed an external explorer link instead, which is exactly what a confused user would do too. swapped it for an `ArrowRightIcon`.
- some portfolio trades referenced sessions that never committed on-chain (nonce race between concurrent agent cycles). clicking "proof" on these gave "session not found" with no explanation. we added a `validSessionIds` filter so orphan trades now show "no proof" with a tooltip explaining why.

both fixed after testing. 3 of the blocked tests need a browser wallet extension (metamask/rabby) which headless runners don't have, so those are environmental limits, not product bugs. the remaining blocks were downstream of the orphan session ID issue.

testsprite was genuinely useful here. we'd been using the app in a browser for weeks and never noticed either bug. the icon thing is subtle, and the orphan trades only show up if you happen to click the right row. having an automated runner systematically click through every link surfaced edge cases we would've shipped with.

full analysis in [testsprite_tests/DELTA.md](testsprite_tests/DELTA.md).

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
    ├── testsprite-mcp-test-report.md   combined R1 + R2 report
    ├── DELTA.md                        R1→R2 analysis
    ├── round-1/                        0/15 passed (all blocked)
    └── round-2/                        5/15 passed
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
