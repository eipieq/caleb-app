
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** caleb-app
- **Date:** 2026-04-16
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Browse live trade feed and open a session detail
- **Test Code:** [TC001_Browse_live_trade_feed_and_open_a_session_detail.py](./TC001_Browse_live_trade_feed_and_open_a_session_detail.py)
- **Test Error:** TEST BLOCKED

The home feed could not be reached because the web app did not render any UI after navigation and multiple waits.

Observations:
- The page rendered as blank/white with no visible content.
- The browser state shows 0 interactive elements on the page.
- I waited 3 times (5s each) after navigation and the SPA still did not initialize.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/07d5fb88-e4f1-48c9-9cb8-7ec016b0a78a
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Guest can monitor trade feed and open a session detail
- **Test Code:** [TC002_Guest_can_monitor_trade_feed_and_open_a_session_detail.py](./TC002_Guest_can_monitor_trade_feed_and_open_a_session_detail.py)
- **Test Error:** TEST BLOCKED

The home feed could not be reached because the web app did not render any UI.

Observations:
- The homepage is blank (white) with no UI elements rendered.
- There are 0 interactive elements on the page.
- I navigated to http://localhost:3000 and waited 15 seconds (5s + 10s); the SPA still did not load.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/97d39574-1b04-4d14-874f-9fba33734d0d
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Run on-chain verification and view per-step results
- **Test Code:** [TC003_Run_on_chain_verification_and_view_per_step_results.py](./TC003_Run_on_chain_verification_and_view_per_step_results.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the app UI did not load and the backend responded with an error, so the verification flow cannot be tested.

Observations:
- The home feed page showed no interactive elements (blank / SPA did not render) after multiple navigations and waits.
- The backend API root (http://64.227.139.172:4000/) returned {"error":"not found"} when accessed.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/79489f54-d1fc-44f0-8976-fdad7479ce70
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Feed shows skeleton then populates from cache and refreshes
- **Test Code:** [TC004_Feed_shows_skeleton_then_populates_from_cache_and_refreshes.py](./TC004_Feed_shows_skeleton_then_populates_from_cache_and_refreshes.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the home feed did not render and the app shows a blank page.

Observations:
- The page remained blank with no interactive elements after navigation and waiting.
- Reloading and additional waiting did not reveal a loading skeleton or any feed content.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/d7d90444-13f2-4f21-80ab-c8cd5ef02abd
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Inspect audit timeline, reasoning, and raw JSON on a session
- **Test Code:** [TC005_Inspect_audit_timeline_reasoning_and_raw_JSON_on_a_session.py](./TC005_Inspect_audit_timeline_reasoning_and_raw_JSON_on_a_session.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the application did not render and there were no interactive elements to operate on.

Observations:
- Navigated to http://localhost:3000 but the page remained blank.
- After waiting (3s + 5s), the SPA feed did not load and there are 0 interactive elements on the page.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/ac2c2e7a-6e3d-46ad-a597-5860fceef99b
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Agent status and portfolio summary are visible on home
- **Test Code:** [TC006_Agent_status_and_portfolio_summary_are_visible_on_home.py](./TC006_Agent_status_and_portfolio_summary_are_visible_on_home.py)
- **Test Error:** TEST BLOCKED

The home page did not render, so I could not verify the presence of the agent online/offline indicator or the portfolio summary.

Observations:
- Navigated to http://localhost:3000 and the page screenshot is blank with 0 interactive elements.
- Waiting (~8 seconds total) did not cause the SPA to render; UI remains empty.
- No feed, agent status indicator, or portfolio summary elements were visible.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/acd4182a-85f5-49cf-88d4-9ef5e1596e5b
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Open session detail and return to feed
- **Test Code:** [TC007_Open_session_detail_and_return_to_feed.py](./TC007_Open_session_detail_and_return_to_feed.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached because the application did not load its feed UI.

Observations:
- The page is blank white and shows 0 interactive elements.
- Navigating to /sessions returned '404 This page could not be found.'
- Clicking the header/feed navigation did not load the feed or reveal session cards.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/e427254e-34a5-44f0-b2ea-e6740076d2f1
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Guest can connect wallet and see address plus INIT balance on home
- **Test Code:** [TC008_Guest_can_connect_wallet_and_see_address_plus_INIT_balance_on_home.py](./TC008_Guest_can_connect_wallet_and_see_address_plus_INIT_balance_on_home.py)
- **Test Error:** TEST BLOCKED

The test cannot proceed because the application did not render and the wallet connection flow requires a browser extension that is not available in this environment.

Observations:
- The home page is blank and shows 0 interactive elements after navigating to '/'.
- Waiting (3s and 5s) did not cause the SPA to render or produce navigation/wallet UI.
- The wallet connection flow requires a browser extension, which cannot be tested here.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/c91eb585-53b3-40a8-806b-164730960aec
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Verification results persist while expanding and collapsing steps
- **Test Code:** [TC009_Verification_results_persist_while_expanding_and_collapsing_steps.py](./TC009_Verification_results_persist_while_expanding_and_collapsing_steps.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the Single Page Application did not load, so the feed and timeline required for this test are inaccessible.

Observations:
- After navigating to http://localhost:3000 the page shows 0 interactive elements and a blank screen.
- I waited three times (5s, 5s, and 10s) and the SPA still did not mount, preventing further test actions.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/b0e1805d-59ed-42e1-9e53-52977c734255
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Attestations list is displayed on session detail
- **Test Code:** [TC010_Attestations_list_is_displayed_on_session_detail.py](./TC010_Attestations_list_is_displayed_on_session_detail.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the single-page app failed to render, so the session feed and session detail views are not accessible.

Observations:
- The page is blank and shows 0 interactive elements.
- After two waits (5s each) the UI did not load and remained empty.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/a79193d5-4d78-45b4-909d-e01d2b3dcccb
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Feed refreshes via polling without breaking the session list
- **Test Code:** [TC011_Feed_refreshes_via_polling_without_breaking_the_session_list.py](./TC011_Feed_refreshes_via_polling_without_breaking_the_session_list.py)
- **Test Error:** TEST BLOCKED

The feed page could not be reached because the app did not render, so the polling/refresh behavior cannot be verified.

Observations:
- The app at http://localhost:3000 shows a blank page and 0 interactive elements.
- Waiting 22 seconds (12s + 10s) did not change the page; the screenshot remains blank.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/a0326da0-de04-4bc6-8be1-1b697e156505
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Copy a step hash from session detail
- **Test Code:** [TC012_Copy_a_step_hash_from_session_detail.py](./TC012_Copy_a_step_hash_from_session_detail.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the sessions/feed UI is not available.

Observations:
- The /sessions page shows '404 This page could not be found.'
- The root/feed did not render the expected feed or session cards (blank or missing UI).

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/31ea2895-c1e8-4135-b39b-5f7eb46f7f8b
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Wallet connect is accessible from non-home pages and persists when navigating
- **Test Code:** [TC013_Wallet_connect_is_accessible_from_non_home_pages_and_persists_when_navigating.py](./TC013_Wallet_connect_is_accessible_from_non_home_pages_and_persists_when_navigating.py)
- **Test Error:** TEST BLOCKED

The wallet connection flow cannot be completed because it requires a browser wallet extension which is not available in this test environment.

Observations:
- The analytics page shows a 'connect wallet' button in the top navigation (no connected address displayed).
- After returning to the home/feed the navigation still shows 'connect wallet' (no address persisted).
- Completing a wallet connection requires an external browser extension (e.g., MetaMask) which is unavailable to the test runner.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/460c2a3c-e2d5-4eb0-a23e-2e7937ed194a
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Disconnecting wallet returns UI to guest state on home
- **Test Code:** [TC014_Disconnecting_wallet_returns_UI_to_guest_state_on_home.py](./TC014_Disconnecting_wallet_returns_UI_to_guest_state_on_home.py)
- **Test Error:** TEST BLOCKED

The test could not be run to completion because the application did not load and the wallet connect flow requires a browser extension which is not available in this environment.

Observations:
- The page is blank with 0 interactive elements (the SPA did not finish loading).
- Wallet connection flows require a browser extension and cannot be tested here.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/b4f45dcb-b19b-4fd4-95de-36f360d7fd97
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Home page shows a clear connect prompt when wallet-required actions are available
- **Test Code:** [TC015_Home_page_shows_a_clear_connect_prompt_when_wallet_required_actions_are_available.py](./TC015_Home_page_shows_a_clear_connect_prompt_when_wallet_required_actions_are_available.py)
- **Test Error:** TEST BLOCKED

The home page did not finish loading, so the connect-wallet call-to-action could not be verified.

Observations:
- The page rendered blank and shows 0 interactive elements.
- I waited the maximum allowed times (3s, 5s, 5s) but the SPA still did not load.
- Because the app did not render, I could not check for a connect-wallet CTA; wallet connection flows must not be attempted.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/975c0986-33a8-4f4f-8fe3-2dff9a2b9a30/8a7e11ee-48ad-4e84-9cdb-42ba9127491f
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **0.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---