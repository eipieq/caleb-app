
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** caleb-app
- **Date:** 2026-04-17
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Monitor live trade feed and open a session
- **Test Code:** [TC001_Monitor_live_trade_feed_and_open_a_session.py](./TC001_Monitor_live_trade_feed_and_open_a_session.py)
- **Test Error:** TEST FAILURE

Opening a session detail did not work — clicking the session card arrow or link did not open the session detail page.

Observations:
- The home dashboard and live trade feed rendered and expanded successfully.
- Session cards and right-arrow controls are visible but clicking them produced stale/unavailable element errors and did not navigate.
- Multiple attempts to click a session card's link resulted in unavailable element indexes and no session detail page appeared.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/ab5d0b65-8507-4222-9a58-a61b7714c276
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Review a session’s audit steps, raw JSON, and copy a step hash
- **Test Code:** [TC002_Review_a_sessions_audit_steps_raw_JSON_and_copy_a_step_hash.py](./TC002_Review_a_sessions_audit_steps_raw_JSON_and_copy_a_step_hash.py)
- **Test Error:** TEST FAILURE

The session detail page allowed expanding each audit step and viewing the Policy raw JSON, but the expected reasoning text and a visible copy-to-clipboard confirmation are not present.

Observations:
- All five audit steps expanded, but each panel shows "No reasoning available for this step."
- The Policy "Raw JSON" disclosure opened and displays the payload (includes txHash and dataHash).
- Clicking "Copy hash" did not produce any visible confirmation (no toast or changed button label/icon).

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/89fde1af-d10f-44d2-9761-ad2790b768e2
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Open session detail from a session card
- **Test Code:** [TC003_Open_session_detail_from_a_session_card.py](./TC003_Open_session_detail_from_a_session_card.py)
- **Test Error:** TEST FAILURE

Clicking a session card did not open a session detail page because session cards appear to lack interactive link elements.

Observations:
- The feed displays session entries with truncated session hashes and a right-arrow visual, but the arrows are not interactive (no anchor elements for the cards were present).
- The page's interactive elements include only header links (e.g., 'caleb', 'feed', 'strategy') and the 'connect wallet' button; no per-card link was found.
- No navigation to a session detail page occurred after attempts to reveal and scroll to session entries.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/d78688e6-f19e-45f4-8214-b79e7725da65
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Portfolio summary renders value, P&L, holdings, and trade history
- **Test Code:** [TC004_Portfolio_summary_renders_value_PL_holdings_and_trade_history.py](./TC004_Portfolio_summary_renders_value_PL_holdings_and_trade_history.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/c9c7eee9-f078-4be7-bdc0-4346f37d1286
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Trade feed cards show core session summary fields
- **Test Code:** [TC005_Trade_feed_cards_show_core_session_summary_fields.py](./TC005_Trade_feed_cards_show_core_session_summary_fields.py)
- **Test Error:** TEST FAILURE

The live trade feed session cards do not show a trade amount. The test required each session card to present verdict, token, confidence, and amount so a guest can quickly assess recent activity.

Observations:
- Each visible session card shows a verdict (e.g., 'SKIP'), token (e.g., 'momentum'), and a signal/confidence value (e.g., '0.00').
- No trade amount is displayed on the session cards under the TODAY feed (amounts are not present for these entries).
- The session cards do show session id and timestamp, but the missing amount field means the feed does not meet the specified requirement.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/09a95983-9095-404a-b01e-d1e8fca69f57
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Portfolio trade history proof link drills into session detail
- **Test Code:** [TC006_Portfolio_trade_history_proof_link_drills_into_session_detail.py](./TC006_Portfolio_trade_history_proof_link_drills_into_session_detail.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/cec98f24-fb14-4af2-8c7e-ac85c2aa3f29
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Verify a session on-chain from session detail
- **Test Code:** [TC007_Verify_a_session_on_chain_from_session_detail.py](./TC007_Verify_a_session_on_chain_from_session_detail.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/b64d7424-2e6f-4365-bbac-6cfcfd373b64
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Live trade feed auto-refresh updates the session list
- **Test Code:** [TC008_Live_trade_feed_auto_refresh_updates_the_session_list.py](./TC008_Live_trade_feed_auto_refresh_updates_the_session_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/35f96ac4-d662-46d1-b31f-1b52fddeb571
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Connect wallet and see address and balance
- **Test Code:** [TC009_Connect_wallet_and_see_address_and_balance.py](./TC009_Connect_wallet_and_see_address_and_balance.py)
- **Test Error:** TEST BLOCKED

The wallet connection flow could not be completed because it requires a browser wallet extension or external approval that is not available in this test environment.

Observations:
- After selecting MetaMask, the UI did not show a connected address; the header still displays the 'connect wallet' button.
- The Sign In options open external/extension-based flows (MetaMask opens an external/extension flow) which cannot be completed here.
- A new tab was opened but no connection or approval completed in the app.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/e3da1526-4de8-42cf-9598-38ce3e560a92
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Open strategy page and see wallet-gated prompt when disconnected
- **Test Code:** [TC010_Open_strategy_page_and_see_wallet_gated_prompt_when_disconnected.py](./TC010_Open_strategy_page_and_see_wallet_gated_prompt_when_disconnected.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/56a4152e-1a36-4889-8bef-1df899f97863
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Return to the feed from session detail
- **Test Code:** [TC011_Return_to_the_feed_from_session_detail.py](./TC011_Return_to_the_feed_from_session_detail.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/c77bfd89-cd2c-4f34-ab7c-2c9a49a941bb
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 View attestations list and count for a session
- **Test Code:** [TC012_View_attestations_list_and_count_for_a_session.py](./TC012_View_attestations_list_and_count_for_a_session.py)
- **Test Error:** TEST FAILURE

The session detail page does not show an attestation count or a list of attestations for the opened session.

Observations:
- After opening the session detail and scrolling to the bottom, no attestations section or attestation count is visible on the page.
- There are no UI elements or labels indicating attestations for this session (no list, no empty-state message, and no control to reveal attestations).

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/967ae6e0-6818-4fcc-a811-b91aaf81328a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Connect wallet and load current policy
- **Test Code:** [TC013_Connect_wallet_and_load_current_policy.py](./TC013_Connect_wallet_and_load_current_policy.py)
- **Test Error:** TEST BLOCKED

The wallet connection could not be completed through the available in-app flows, so the test cannot proceed to verify policy settings.

Observations:
- The Sign In modal is still open on /strategy and the app did not show a connected wallet address after submitting the Email/Socials form.
- I submitted the email via the Privy auth flow, but no authenticated session was returned to the app (no address shown and connect prompts remain).
- External auth/extension steps (MetaMask / OAuth) did not complete or return to the app, so the connection cannot be finished from the current environment.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/dd303e51-1e0d-40ab-9735-9d9d652c9a54
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Disconnect wallet returns to guest state
- **Test Code:** [TC014_Disconnect_wallet_returns_to_guest_state.py](./TC014_Disconnect_wallet_returns_to_guest_state.py)
- **Test Error:** TEST BLOCKED

The wallet connect/disconnect flow cannot be fully exercised because an external browser wallet or provider is required to complete the connection.

Observations:
- Clicking the 'connect wallet' button opened the Sign In modal showing wallet options (Rabby, Phantom, Keplr, Leap, MetaMask).
- These wallet options rely on external wallet extensions or external pages and cannot complete a connection in this test environment.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/995a27ac-5cba-4d86-841b-1e6a6b77e8bc
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 View analytics overview with charts
- **Test Code:** [TC015_View_analytics_overview_with_charts.py](./TC015_View_analytics_overview_with_charts.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/b125b773-5656-4188-8f58-82163f73a94e
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Edit and save policy successfully
- **Test Code:** [TC016_Edit_and_save_policy_successfully.py](./TC016_Edit_and_save_policy_successfully.py)
- **Test Error:** TEST BLOCKED

The wallet connection could not be completed so the policy-edit flow cannot be run.

Observations:
- The Sign In modal is open but the Privy email sign-in repeatedly failed and showed an error.
- After multiple attempts (Submit and Google), the strategy page never reflected a connected wallet and Privy returned error state.
- External wallet options would open external tabs/popups which cannot be completed in this test environment.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/65cddd23-95ec-44a7-bd1c-4337e748b13d
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Collapse audit steps after expanding
- **Test Code:** [TC017_Collapse_audit_steps_after_expanding.py](./TC017_Collapse_audit_steps_after_expanding.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/b5031603-173a-4d5f-92b8-994778a87897
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 Prompt to connect wallet when attempting to attest while disconnected
- **Test Code:** [TC018_Prompt_to_connect_wallet_when_attempting_to_attest_while_disconnected.py](./TC018_Prompt_to_connect_wallet_when_attempting_to_attest_while_disconnected.py)
- **Test Error:** TEST BLOCKED

The test could not reach the attestation submission control. Attempts to open a session row's attestation controls failed because the expected row-action element(s) were not available in the UI (their indexes disappeared), so I could not attempt an attestation to verify the connect-wallet prompt.

Observations:
- The session detail page and many session rows are visible and expanded, but clicking the session-row action to open attestation controls failed (element index 544 was unavailable).
- I attempted to open the row action twice; both attempts reported the element as not available.
- Without access to the attestation controls, I could not trigger or confirm the 'connect wallet' prompt via a submission attempt.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/228d7400-8c8a-4f4c-90ae-ae09156fd147
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019 Persisted policy after reload
- **Test Code:** [TC019_Persisted_policy_after_reload.py](./TC019_Persisted_policy_after_reload.py)
- **Test Error:** TEST BLOCKED

The strategy page could not be reached — the UI fails to load so the saved-policy persistence test cannot run.

Observations:
- The /strategy page is blank and shows 0 interactive elements.
- Earlier attempts showed an error screen with 'Reload' and 'Back', and clicking 'Reload' left the page blank.
- There is no visible policy settings UI to configure or verify persistence.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/e980f534-8abc-40b2-b744-b1b253d7164a
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020 Analytics empty state when no session data
- **Test Code:** [TC020_Analytics_empty_state_when_no_session_data.py](./TC020_Analytics_empty_state_when_no_session_data.py)
- **Test Error:** TEST BLOCKED

The analytics dashboard does not provide a way in the UI to produce a 'no sessions' empty state, so I cannot verify the empty-state behavior through the app.

Observations:
- The analytics page shows populated charts and '200 sessions'.
- No date-range selectors, filters, or session-limiting controls were visible in the header or on the page to reduce sessions to zero.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/b9b1d747-be00-4192-bd72-c7bec303749a
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021 Analytics loading state during data fetch
- **Test Code:** [TC021_Analytics_loading_state_during_data_fetch.py](./TC021_Analytics_loading_state_during_data_fetch.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/5af8ad27-f44b-4aa3-97a1-643f39ebeda1
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022 Analytics chart rendering with minimal data
- **Test Code:** [TC022_Analytics_chart_rendering_with_minimal_data.py](./TC022_Analytics_chart_rendering_with_minimal_data.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/55cf7317-b6a8-483a-afc5-b875b1475fed
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC023 Validation prevents saving invalid policy values
- **Test Code:** [TC023_Validation_prevents_saving_invalid_policy_values.py](./TC023_Validation_prevents_saving_invalid_policy_values.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the in-app authentication step (Privy) failed and prevented loading the policy form.

Observations:
- Clicking 'Email / Socials' opens the Privy auth flow, but submitting the email produced a 'Something went wrong' error in Privy.
- The Sign In modal remains on the /strategy page and the policy form never loaded, so I cannot enter or save policy values.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/1d19a697-c480-4577-95c7-e5b2300f83fb
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC024 Analytics supports large datasets without UI breakage
- **Test Code:** [TC024_Analytics_supports_large_datasets_without_UI_breakage.py](./TC024_Analytics_supports_large_datasets_without_UI_breakage.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8367ce27-691a-4646-b91d-e13a66f2bdcf/88a7f950-68f7-4c4d-84f2-041f20ede71a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **45.83** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---