
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** caleb-app
- **Date:** 2026-04-17
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 View live trading dashboard status, stats, and sessions list
- **Test Code:** [TC001_View_live_trading_dashboard_status_stats_and_sessions_list.py](./TC001_View_live_trading_dashboard_status_stats_and_sessions_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/cb209284-f179-4a9c-a87d-59c173b66da5
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 View live sessions feed with agent status, stats, and portfolio summary
- **Test Code:** [TC002_View_live_sessions_feed_with_agent_status_stats_and_portfolio_summary.py](./TC002_View_live_sessions_feed_with_agent_status_stats_and_portfolio_summary.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/ba5f0cd7-a694-48e7-8679-97ae66ea079a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 View portfolio summary and trade history on the dashboard
- **Test Code:** [TC003_View_portfolio_summary_and_trade_history_on_the_dashboard.py](./TC003_View_portfolio_summary_and_trade_history_on_the_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/663f53cf-b0a8-4fbc-9ae5-58afacd6bf1a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Trade feed auto-refresh updates sessions without breaking page state
- **Test Code:** [TC004_Trade_feed_auto_refresh_updates_sessions_without_breaking_page_state.py](./TC004_Trade_feed_auto_refresh_updates_sessions_without_breaking_page_state.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/953a0109-381e-4796-a979-a0068070eefb
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Navigate from a trade proof link to the related session detail
- **Test Code:** [TC005_Navigate_from_a_trade_proof_link_to_the_related_session_detail.py](./TC005_Navigate_from_a_trade_proof_link_to_the_related_session_detail.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/8fea0d5c-20b5-43d5-a3b5-87373a7d43a2
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Auto-refresh feed updates sessions without losing browsing context
- **Test Code:** [TC006_Auto_refresh_feed_updates_sessions_without_losing_browsing_context.py](./TC006_Auto_refresh_feed_updates_sessions_without_losing_browsing_context.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/7b5c3eac-9b2e-4c2f-af2e-4931170ae4c9
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Open a session from the home feed and view audit timeline
- **Test Code:** [TC007_Open_a_session_from_the_home_feed_and_view_audit_timeline.py](./TC007_Open_a_session_from_the_home_feed_and_view_audit_timeline.py)
- **Test Error:** TEST BLOCKED

The session detail page could not be used to verify the 5-step audit timeline because the session is not available. The page shows a 'session not found' message indicating the trade likely failed to commit on-chain and no audit trail exists.

Observations:
- The session detail page displays 'session not found'.
- The page shows the message: 'this session may have failed to commit on-chain due to a nonce error. the trade was recorded in the portfolio but the audit trail could not be saved.'
- No 5-step audit timeline or session audit elements are present on the page.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/276721c1-5855-4819-ac61-e973969118ea
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Run on-chain verification and show per-step verification badges
- **Test Code:** [TC008_Run_on_chain_verification_and_show_per_step_verification_badges.py](./TC008_Run_on_chain_verification_and_show_per_step_verification_badges.py)
- **Test Error:** TEST BLOCKED

The session detail page could not be reached — session rows on the feed do not expose clickable right-arrow controls needed to open details and run verification.

Observations:
- The session feed is visible but none of the session row right-arrow buttons are present as interactive elements.
- Only top navigation links and the 'connect wallet' button are interactive on the page.
- Without opening a session detail we cannot run the verification to check per-step match/mismatch badges.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/d5ec1470-5824-43c6-91bb-bb0ed75eb3d5
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Open a session detail from a session card
- **Test Code:** [TC009_Open_a_session_detail_from_a_session_card.py](./TC009_Open_a_session_detail_from_a_session_card.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/59d69d91-a79a-4dd1-a764-af8fa8da8392
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 View portfolio analytics overview
- **Test Code:** [TC010_View_portfolio_analytics_overview.py](./TC010_View_portfolio_analytics_overview.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/2c066502-8dbb-453c-8c38-cce96636e7e6
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Inspect audit timeline by expanding a step to view reasoning and raw JSON
- **Test Code:** [TC011_Inspect_audit_timeline_by_expanding_a_step_to_view_reasoning_and_raw_JSON.py](./TC011_Inspect_audit_timeline_by_expanding_a_step_to_view_reasoning_and_raw_JSON.py)
- **Test Error:** TEST BLOCKED

The session cannot be inspected because its audit trail was not saved when the trade failed to commit on-chain.

Observations:
- The session detail page displays 'session not found' and explains the trade may have failed to commit on-chain.
- No audit timeline or expandable audit steps are present on the page (only Back and site footer links are visible).
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/71fb39c8-d230-43f4-931b-3d8b8b63deb8
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Inspect audit steps by expanding each step to view reasoning and raw JSON
- **Test Code:** [TC012_Inspect_audit_steps_by_expanding_each_step_to_view_reasoning_and_raw_JSON.py](./TC012_Inspect_audit_steps_by_expanding_each_step_to_view_reasoning_and_raw_JSON.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/3cc01e01-a833-4acd-b5d0-3fcd0fb5c528
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Return from session detail back to the feed
- **Test Code:** [TC013_Return_from_session_detail_back_to_the_feed.py](./TC013_Return_from_session_detail_back_to_the_feed.py)
- **Test Error:** TEST BLOCKED

Navigation back to the home feed could not be verified because the application rendered an empty DOM and session detail pages returned 'session not found', preventing completion of the test.

Observations:
- The current page DOM is empty (0 interactive elements) after attempting to return from a session detail.
- Direct navigation to session detail URLs (from main feed IDs tried) showed 'session not found'.
- Clicking the top 'feed' link sometimes produced a blank DOM, so the home feed could not be reliably confirmed.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/044c3d23-14cb-4588-8214-0896d0147958
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Return from session detail back to home feed and continue browsing
- **Test Code:** [TC014_Return_from_session_detail_back_to_home_feed_and_continue_browsing.py](./TC014_Return_from_session_detail_back_to_home_feed_and_continue_browsing.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/03c2c969-2c03-4767-b22b-756877e0c342
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Browse archived sessions and open a legacy session
- **Test Code:** [TC015_Browse_archived_sessions_and_open_a_legacy_session.py](./TC015_Browse_archived_sessions_and_open_a_legacy_session.py)
- **Test Error:** TEST FAILURE

Opening a session from the feed did not load the session detail view.

Observations:
- The session feed rendered and the 'show 45 more' control revealed archived session links (including /sessions/0xc20de7200aed6a1f).
- Navigating to the session URL occurred, but the resulting page is blank with 0 interactive elements and no visible session detail content.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/78b4bad3-6ecd-48bb-82f9-e368247528c8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Inspect cumulative P&L chart
- **Test Code:** [TC016_Inspect_cumulative_PL_chart.py](./TC016_Inspect_cumulative_PL_chart.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/6ab2c129-6a21-4b7c-b3ab-42f515e40717
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Attempt to attest without a connected wallet shows connect prompt
- **Test Code:** [TC017_Attempt_to_attest_without_a_connected_wallet_shows_connect_prompt.py](./TC017_Attempt_to_attest_without_a_connected_wallet_shows_connect_prompt.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the session detail page shows 'session not found', so I cannot access the attest control to verify a wallet-connect prompt.

Observations:
- The session detail page displays 'session not found' with explanatory text about a nonce error.
- No attest button or attest control is visible on the page; only a 'connect wallet' button appears in the header.
- I navigated directly to /sessions/0x8327794896b59f8f and could not reach a usable session detail view.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/bc5f7fbf-7be4-4816-8685-311f934e5b35
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 Inspect portfolio value chart
- **Test Code:** [TC018_Inspect_portfolio_value_chart.py](./TC018_Inspect_portfolio_value_chart.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/5ba604cb-29aa-410d-8798-e1ca534f4bec
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019 Copy a step hash from the audit timeline
- **Test Code:** [TC019_Copy_a_step_hash_from_the_audit_timeline.py](./TC019_Copy_a_step_hash_from_the_audit_timeline.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the session's audit trail is missing so there is no audit step hash to copy and no copy confirmation to verify.

Observations:
- The session detail page displays 'session not found' and explains the audit trail could not be saved.
- No audit timeline, step hashes, or copy controls are visible on the page.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/dd4cb373-450f-4890-b3fa-b91beb9109f6
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020 Open Strategy page as guest shows connect prompt and blocks editing
- **Test Code:** [TC020_Open_Strategy_page_as_guest_shows_connect_prompt_and_blocks_editing.py](./TC020_Open_Strategy_page_as_guest_shows_connect_prompt_and_blocks_editing.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/7cf83eab-d98e-4cf2-ba70-40fd03a00385
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021 View verdict distribution breakdown
- **Test Code:** [TC021_View_verdict_distribution_breakdown.py](./TC021_View_verdict_distribution_breakdown.py)
- **Test Error:** TEST FAILURE

The verdict distribution chart is present but does not show multiple decision categories, so it does not reveal how often each decision outcome occurs.

Observations:
- The 'decision breakdown' donut chart SVG is visible on the analytics page.
- The legend shows a single category: 'SKIP' with count 200.
- No other slices or categories are present in the chart.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/15729072-67a6-4ad4-8c72-691fbf06ddda
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022 View attestations section on session detail
- **Test Code:** [TC022_View_attestations_section_on_session_detail.py](./TC022_View_attestations_section_on_session_detail.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the session detail page for the given ID is not available, so the attestations section cannot be inspected.

Observations:
- The session detail page displays 'session not found'.
- No attestations section or attester list is visible on the page.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/75d9757b-f446-4d8e-905b-85810a0c0e1d
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC023 View confidence histogram
- **Test Code:** [TC023_View_confidence_histogram.py](./TC023_View_confidence_histogram.py)
- **Test Error:** TEST FAILURE

The confidence histogram is present but does not show a distribution across multiple bins.

Observations:
- The confidence distribution chart is visible as an SVG (element index 1016).
- The chart renders a single wide bar (one bin) rather than multiple histogram bins to show distribution.
- No multiple bars/bins are present to convey a confidence distribution.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/a3fffd54-d070-4cf8-9ad3-2705a3901994
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC024 Analytics page remains usable after scrolling through all sections
- **Test Code:** [TC024_Analytics_page_remains_usable_after_scrolling_through_all_sections.py](./TC024_Analytics_page_remains_usable_after_scrolling_through_all_sections.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/eaf1716a-9b66-40cd-b486-102d3e0c90cb
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC025 Display orphan trades with no proof label when present
- **Test Code:** [TC025_Display_orphan_trades_with_no_proof_label_when_present.py](./TC025_Display_orphan_trades_with_no_proof_label_when_present.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/a0d27bb0-cf0d-4190-b134-4edf28d458ad
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC026 Cancel wallet connect modal and remain in guest state
- **Test Code:** [TC026_Cancel_wallet_connect_modal_and_remain_in_guest_state.py](./TC026_Cancel_wallet_connect_modal_and_remain_in_guest_state.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/405de6c4-ef30-4862-a3c6-2c165ef64406/4f38e0d7-e602-4ac5-a20e-011ca263050e
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **61.54** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---