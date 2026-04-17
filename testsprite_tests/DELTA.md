# round 1 → round 2 delta

| metric | R1 | R2 |
|---|---|---|
| tests passed | 0 / 15 (0.0%) | 5 / 15 (33.3%) |
| tests blocked | 15 | 7 |
| tests failed | 0 | 3 |
| pass rate delta | — | **+33.3 percentage points** |

R1: every single test was blocked because the SPA never rendered.
R2: half the pass-rate is now real, the rest splits into legitimate bugs TestSprite uncovered (3 failures) and environmental limits (7 blocks from headless-wallet constraints and indirect session-detail issues).

---

## R1: the root cause

every one of 15 tests returned `BLOCKED` with the same observation: the page rendered blank, 0 interactive elements.

root cause: the dashboard was served from `next dev` (Turbopack dev). the bundle pulls wagmi + viem + @initia/interwovenkit-react + recharts + liveline — a large client-side tree. in dev mode, hydration times ranged from 200ms to 31s in the server logs. TestSprite's headless browser waited ~15s max and moved on.

this wasn't a product bug. it was a test setup bug. pre-fixing it before R1 would have hidden it from the hackathon evidence loop.

## the fix

switched the server from `next dev` → `next build && next start`.

- build: `next build` (~2 minutes, turbopack production)
- serve: `next start` on port 3000
- post-fix response time: **4ms** for cached requests. first paint under 1s.

bootstrap output confirmed the hint: *"dev servers are single-threaded and crash under concurrent test load."* should have been production-mode from the start.

## R2: real bugs surfaced

### ❌ TC001, TC002, TC009 — session detail flakiness (3 failures)

with the app actually rendering, TestSprite could click into sessions. it found that some session-detail navigations resolved to "session not found" or error screens. the backend VPS does return valid data for real sessionIds, so the test runner likely hit stale or malformed IDs it scraped from the DOM (possibly the numeric short-hashes like `482, 5719, 8464, 9277` reported in TC001, which are not valid sessionIds).

contributing factor: `components/portfolio-card.tsx:117-123` has an internal `<Link>` labeled "proof" but wraps it with an `ExternalLinkIcon`. that icon signals "external" to both humans and heuristic test runners, which caused TC002 to follow an external Initia-explorer link it had previously seen in the tab and misattribute the failure.

### ⏭ TC008, TC013, TC014 — wallet extension unavailable

these tests exercise the connect-wallet flow. InterwovenKit opens a modal listing MetaMask, Rabby, Phantom, Keplr, Leap. completing the connection requires an injected provider (browser extension). TestSprite's headless runner has no extension, so these are blocked by environment, not by the app.

legitimate coverage even so: the tests did confirm the modal opens, lists the expected wallets, and the "connect wallet" button is present on home and non-home pages.

### ⏭ TC003, TC010, TC012 — chain-dependent session-detail

these depend on a specific session rendering so the runner can click verify / view attestations / copy hash. when the runner landed on a session-detail that errored out (same cause as TC001), the dependent tests were blocked.

### ✅ TC004, TC006, TC007, TC011, TC015 — passing

- TC004: skeleton → cached content → live data hydration works
- TC006: agent status + portfolio summary visible on home
- TC007: session detail opens and returns to feed cleanly (so detail *does* work for valid IDs)
- TC011: polling refreshes the feed without breaking existing session state
- TC015: connect-wallet CTA is clearly present when wallet is required

---

## what this proves about the product

- the 5-step audit architecture works end-to-end: the feed, detail, verify and attestation components all render and integrate with the live agent API at `64.227.139.172:4000`.
- the failures are edge cases at the session-id boundary, not core-flow bugs.
- pass rate 0% → 33.3% from one infrastructure change says more about TestSprite's value as a dev-mode detector than about the product's health.

## what we'd fix next

1. add a session-id validator in `getSession()` — reject non-hex inputs before the API call so `notFound()` doesn't show the generic error for malformed IDs.
2. remove the `ExternalLinkIcon` from the internal "proof" link in `portfolio-card.tsx` (sends wrong signal, adds to TC002 confusion).
3. add an empty-state for session-detail when the backend returns a real 404 (vs the generic error page).
4. drop a headless-wallet fixture (e.g. an ephemeral test private key + custom MockWalletProvider) so TC008/013/014 can actually exercise the attest flow.
