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

caleb isn't a CRUD app with mock data. it's a next.js frontend talking to a **live autonomous agent** over REST, rendering real-time portfolio data from **actual trades**, fetching on-chain hashes from a **custom EVM rollup**, and handling wallet connections across five providers via interwovenkit. the client bundle pulls in wagmi, viem, recharts, and liveline. there are async data flows everywhere: polling sessions every 10 seconds, lazy-loading session detail from the agent API, client-side hash verification against on-chain state, and wallet-gated attestation transactions.

this is a harder testing surface than most web apps. the data changes every hour. the session IDs are real transaction hashes. the verification flow hits a real chain. you can't seed a database and call it done.

manually testing all of that is slow and you inevitably miss the edges. the proof links in the trade history looked fine when you clicked the right ones. the orphan sessions only broke if you happened to click a trade whose session failed to commit. you don't catch that stuff by clicking around.

## testing with testsprite

we ran **5 rounds** of automated testing via testsprite's MCP server, generating test cases from a standardized PRD and executing them against the live app in a headless browser.

### what testsprite found that we never would have

**1. our deployment strategy was wrong (R1)**
round 1 returned 0% pass rate. every test saw a blank page. we were serving from `next dev` and the heavy client bundle took 8-31 seconds to hydrate. testsprite's browser timed out at ~15s. we'd been developing against dev mode for weeks and never noticed because our browsers had hot caches. switching to `next build && next start` fixed it instantly. testsprite caught a production-readiness issue hiding in plain sight.

**2. misleading icon caused wrong navigation path (R2)**
a "proof" link in trade history used `ExternalLinkIcon` even though it was an internal route. testsprite's runner followed an explorer link instead, exactly what a confused user would do. the icon was a UX lie. swapped to `ArrowRightIcon`.

**3. orphan sessions with no error context (R2)**
some trades referenced sessions that never committed on-chain (nonce race in the agent). clicking "proof" gave "session not found" with zero explanation. testsprite hit this because it systematically clicks every link. we only ever clicked the ones that worked. added a `validSessionIds` filter so orphan trades show "no proof" with a tooltip explaining the nonce error.

**4. truncated hash routing failure (R3)**
the feed displays `sessionId.slice(0, 18)...` but the detail page needs the full 66-char hash. any user who bookmarks a session, shares a URL, or copies the visible hash gets "session not found". this single bug blocked 7 of 26 tests. we added prefix matching fallback -- if a short hash is passed, fetch all sessions and redirect to the full match. testsprite confirmed: zero "session not found" errors in R4.

**5. invisible UX gaps (R4)**
- copy-to-clipboard had no visual feedback. you click, nothing happens, you don't know if it worked.
- audit steps were flat rows with no expand/collapse. you couldn't drill into reasoning or hide it after reading.
- analytics showed no loading state during a multi-second server fetch.

all three fixed. all three confirmed passing in R5.

### the numbers

across 5 rounds, testsprite surfaced **8 real bugs** we'd been shipping. every one was fixed and verified in the subsequent round.

| round | pass rate | effective* | key change |
|---|---|---|---|
| R1 | 0% (0/15) | 0% | everything blocked -- dev server too slow |
| R2 | 33% (5/15) | 63% | switched to production build |
| R3 | 62% (16/26) | 84% | expanded suite, core flows passing |
| R4 | 46% (11/24) | 69% | new test plan, prefix matching fix validated |
| R5 | 46% (11/24) | 69% | collapse + copy + loading fixes confirmed |

*\*effective pass rate excludes wallet/auth tests that require a browser extension the headless runner can't provide. these test the wallet provider (MetaMask/Keplr/Privy), not the app.*

remaining R5 failures are test-bot navigation edge cases (bot clicks arrow icon instead of the wrapping `<Link>`) and data-dependent checks (SKIP sessions intentionally have no trade amount). all core user flows -- feed, session detail, verification, analytics, navigation -- pass.

full analysis in [testsprite_tests/DELTA.md](testsprite_tests/DELTA.md). per-round results in `testsprite_tests/round-*/`.

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
    ├── DELTA.md                        R1->R5 analysis + cumulative progress
    ├── round-1/                        0/15 passed (broken setup)
    ├── round-2/                        5/15 passed (first real run)
    ├── round-3/                        16/26 passed (post-fix, expanded suite)
    ├── round-4/                        11/24 passed (new plan, prefix fix validated)
    └── round-5/                        11/24 passed (collapse + copy + loading fixes)
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
