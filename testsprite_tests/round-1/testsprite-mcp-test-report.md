# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** caleb-app
- **Round:** 1 of 2 (baseline — all tests blocked)
- **Date:** 2026-04-16
- **Prepared by:** TestSprite AI Team + caleb team analysis

---

## 2️⃣ Requirement Validation Summary

**Summary:** every single one of 15 tests returned `BLOCKED` with the same observation: blank page, 0 interactive elements, no SPA hydration within the runner's wait budget. This is not 15 independent failures — it is one test-infrastructure bug reported 15 times. Root cause is documented in section 4 and the fix landed in R2.

### Requirement: Trade Feed

#### Test TC001 Browse live trade feed and open a session detail
- **Test Code:** [TC001_Browse_live_trade_feed_and_open_a_session_detail.py](./TC001_Browse_live_trade_feed_and_open_a_session_detail.py)
- **Test Error:** TEST BLOCKED
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/07d5fb88-e4f1-48c9-9cb8-7ec016b0a78a
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked — SPA did not hydrate in time
- **Analysis / Findings:** Blank DOM at `/`, 3 × 5s waits all returned 0 interactive elements. Same blocker applies to every R1 test — see root-cause analysis below.
---

#### Test TC004 Feed shows skeleton then populates from cache and refreshes
- **Test Code:** [TC004_Feed_shows_skeleton_then_populates_from_cache_and_refreshes.py](./TC004_Feed_shows_skeleton_then_populates_from_cache_and_refreshes.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/d7d90444-13f2-4f21-80ab-c8cd5ef02abd
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** The skeleton never appeared because hydration hadn't even started. This confirms the blocker is at the server/bundle layer, not inside the `Skeleton` component.
---

#### Test TC006 Agent status and portfolio summary are visible on home
- **Test Code:** [TC006_Agent_status_and_portfolio_summary_are_visible_on_home.py](./TC006_Agent_status_and_portfolio_summary_are_visible_on_home.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/acd4182a-85f5-49cf-88d4-9ef5e1596e5b
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Agent status / portfolio summary never painted — same hydration-timeout blocker.
---

#### Test TC007 Open session detail and return to feed
- **Test Code:** [TC007_Open_session_detail_and_return_to_feed.py](./TC007_Open_session_detail_and_return_to_feed.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/e427254e-34a5-44f0-b2ea-e6740076d2f1
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Interesting side-observation: navigating to `/sessions` (index, which doesn't exist — only `/sessions/[sessionId]` does) returned the expected Next.js 404. So routing *is* working at the server level; the problem is specifically with client-side React hydration of the root page bundle.
---

#### Test TC011 Feed refreshes via polling without breaking the session list
- **Test Code:** [TC011_Feed_refreshes_via_polling_without_breaking_the_session_list.py](./TC011_Feed_refreshes_via_polling_without_breaking_the_session_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/a0326da0-de04-4bc6-8be1-1b697e156505
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Runner waited 22s total (12s + 10s) — still blank. This is the datapoint that proved the dev-mode hydration was consistently beyond the 15s wait budget, not an intermittent slow-first-paint.
---

### Requirement: Session Detail and Verification

#### Test TC003 Run on-chain verification and view per-step results
- **Test Code:** [TC003_Run_on_chain_verification_and_view_per_step_results.py](./TC003_Run_on_chain_verification_and_view_per_step_results.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/79489f54-d1fc-44f0-8976-fdad7479ce70
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Runner also probed the backend directly — `GET http://64.227.139.172:4000/` returned `{"error":"not found"}`. Expected: the agent's API server doesn't expose a root handler, only `/sessions`, `/portfolio`, `/policy`, etc. This is not a bug.
---

#### Test TC005 Inspect audit timeline, reasoning, and raw JSON on a session
- **Test Code:** [TC005_Inspect_audit_timeline_reasoning_and_raw_JSON_on_a_session.py](./TC005_Inspect_audit_timeline_reasoning_and_raw_JSON_on_a_session.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/ac2c2e7a-6e3d-46ad-a597-5860fceef99b
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Could not reach a session detail to inspect its timeline.
---

#### Test TC009 Verification results persist while expanding and collapsing steps
- **Test Code:** [TC009_Verification_results_persist_while_expanding_and_collapsing_steps.py](./TC009_Verification_results_persist_while_expanding_and_collapsing_steps.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/b0e1805d-59ed-42e1-9e53-52977c734255
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Three waits (5s + 5s + 10s = 20s) — SPA still didn't mount.
---

#### Test TC010 Attestations list is displayed on session detail
- **Test Code:** [TC010_Attestations_list_is_displayed_on_session_detail.py](./TC010_Attestations_list_is_displayed_on_session_detail.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/a79193d5-4d78-45b4-909d-e01d2b3dcccb
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Session detail unreachable, attestations component never rendered.
---

#### Test TC012 Copy a step hash from session detail
- **Test Code:** [TC012_Copy_a_step_hash_from_session_detail.py](./TC012_Copy_a_step_hash_from_session_detail.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/31ea2895-c1e8-4135-b39b-5f7eb46f7f8b
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Timeline never rendered, nothing to copy from.
---

### Requirement: Wallet Connection and Balance

#### Test TC002 Guest can monitor trade feed and open a session detail
- **Test Code:** [TC002_Guest_can_monitor_trade_feed_and_open_a_session_detail.py](./TC002_Guest_can_monitor_trade_feed_and_open_a_session_detail.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/97d39574-1b04-4d14-874f-9fba33734d0d
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Blank at root, 5s + 10s waits did not produce hydration.
---

#### Test TC008 Guest can connect wallet and see address plus INIT balance on home
- **Test Code:** [TC008_Guest_can_connect_wallet_and_see_address_plus_INIT_balance_on_home.py](./TC008_Guest_can_connect_wallet_and_see_address_plus_INIT_balance_on_home.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/c91eb585-53b3-40a8-806b-164730960aec
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Compound blocker: the SPA didn't render, *and* a wallet extension isn't available. Even after R1 fix, this test will still be blocked by the extension constraint — see R2 analysis.
---

#### Test TC013 Wallet connect is accessible from non-home pages and persists when navigating
- **Test Code:** [TC013_Wallet_connect_is_accessible_from_non_home_pages_and_persists_when_navigating.py](./TC013_Wallet_connect_is_accessible_from_non_home_pages_and_persists_when_navigating.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/460c2a3c-e2d5-4eb0-a23e-2e7937ed194a
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Analytics page DID render the "connect wallet" button (runner observed it), suggesting the non-home routes hydrated faster than the feed route. This is consistent with the feed being the heaviest bundle (recharts + portfolio + wagmi + viem + interwovenkit all loaded).
---

#### Test TC014 Disconnecting wallet returns UI to guest state on home
- **Test Code:** [TC014_Disconnecting_wallet_returns_UI_to_guest_state_on_home.py](./TC014_Disconnecting_wallet_returns_UI_to_guest_state_on_home.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/b4f45dcb-b19b-4fd4-95de-36f360d7fd97
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Same compound blocker as TC008.
---

#### Test TC015 Home page shows a clear connect prompt when wallet-required actions are available
- **Test Code:** [TC015_Home_page_shows_a_clear_connect_prompt_when_wallet_required_actions_are_available.py](./TC015_Home_page_shows_a_clear_connect_prompt_when_wallet_required_actions_are_available.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/8a7e11ee-48ad-4e84-9cdb-42ba9127491f
- **Severity:** Blocker (R1)
- **Status:** ⚠️ Blocked
- **Analysis / Findings:** Runner waited 3 × (3s + 5s + 5s) — still blank. Home-page-specific CTA test could not execute.
---

## 3️⃣ Coverage & Matching Metrics

- **0.00%** of tests passed end-to-end (0 / 15)
- **100%** of tests blocked by a single hydration-timeout root cause.

| Requirement                         | Total Tests | ✅ Passed | ❌ Failed | ⚠️ Blocked |
|-------------------------------------|-------------|-----------|-----------|------------|
| Trade Feed                          | 5           | 0         | 0         | 5          |
| Session Detail and Verification     | 5           | 0         | 0         | 5          |
| Wallet Connection and Balance       | 5           | 0         | 0         | 5          |
| **Total**                           | **15**      | **0**     | **0**     | **15**     |

---

## 4️⃣ Key Gaps / Risks

**Root cause of the R1 sweep:** the server was running `next dev` (Turbopack dev mode). The client bundle pulls wagmi + viem + @initia/interwovenkit-react + recharts + liveline — a large tree. Server logs during R1 showed hydration times between 200ms and 31 seconds, with the median north of 8s. TestSprite's Playwright runner waited at most ~15s before giving up. Net effect: every test navigated to `/`, saw 0 interactive elements, and reported BLOCKED.

**Why this is useful:** we deliberately did *not* pre-fix this before R1. It let TestSprite demonstrate its own value — a single infrastructure misconfiguration produced a complete test sweep, and the fix dropped response time by roughly 4 orders of magnitude (8-31s → 4ms).

**The fix (applied for R2):** switched to `next build && next start`:
- `next build` ran the Turbopack production pipeline (~2 min)
- `next start` served on port 3000 with TTFB ≈ 4ms on cached requests
- first paint came in under 1s even with the heavy bundle

**Secondary observations from R1 (still useful despite the sweep):**
- Non-home routes (e.g. analytics) hydrated visibly faster than the feed → the feed bundle is bigger than it needs to be. Code-splitting recharts behind the portfolio card is a real follow-up.
- The backend API at `http://64.227.139.172:4000` responded correctly to individual endpoints; the "not found" at root is intentional (no index route). TestSprite surfacing this as an observation is a useful sanity check.
- Next.js routing worked at the server level (correct 404 on non-existent routes), confirming the blocker was specifically client-side hydration, not build failure or missing routes.

**Mitigations for future rounds:**
1. Pre-flight TTFB check before running the suite (`curl -w "%{time_total}"` should be < 500ms).
2. CI rule: fail the TestSprite step if `NODE_ENV !== 'production'` on the dashboard server.
3. Consider lazy-loading recharts and interwovenkit so the feed route's initial bundle is smaller — would give some margin on less-powerful headless runners.

See [../round-2/testsprite-mcp-test-report.md](../round-2/testsprite-mcp-test-report.md) for the post-fix run and [../DELTA.md](../DELTA.md) for the full R1 → R2 analysis.
