# caleb

autonomous trading agent you don't have to trust. every trade is cryptographically committed on-chain. verify any decision in one click.

submitted to **TestSprite Season 2**. live at [app.caleb.sandpark.co](https://app.caleb.sandpark.co).

---

## what it actually does

caleb runs an hourly trading loop against live ETH prices. every cycle follows a 5-step sequence: **policy, market, decision, check, execution**. each step produces a keccak256 hash, and all five get committed in order to caleb-chain (a dedicated minievm rollup on initia). the chain *is* the audit trail.

anyone can connect a wallet and attest a session on-chain. reputation comes from peer signatures, not self-claim. the agent doesn't ask you to trust it. it asks you to verify.

it's been running on a VPS since march 2026. 34 real trades. $1000 paper starting balance. sitting at +1.66% realized + unrealized. not a demo loop.

---

## what testsprite found

**round 1: 0/15 passed.** every test blocked with "page rendered blank, 0 interactive elements." pretty embarrassing until you look at why: the dashboard was running `next dev`. the client bundle (wagmi + viem + interwovenkit + recharts + liveline) took 8-31 seconds to hydrate. testsprite's browser gives up after ~15s. one infrastructure bug, reported 15 times.

**round 2: 5/15 passed.** one line fix: `next dev` → `next build && next start`. response time went from seconds to 4ms. that's roughly a 10,000x improvement from changing one command.

the remaining failures were genuinely useful:
- testsprite clicked a "proof" link that had an `ExternalLinkIcon` on it, so it followed an explorer URL instead of the internal session page. real UX bug, not a test quirk. swapped to `ArrowRightIcon`.
- some trades in the portfolio pointed to sessions that never committed on-chain (nonce race in the agent). clicking "proof" gave "session not found." added a `validSessionIds` filter so orphan trades show "no proof" with a tooltip instead of a broken link.
- 3 tests need a browser wallet extension to complete. headless runners can't do that. environmental, not a product issue.

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
