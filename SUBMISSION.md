# TestSprite Season 2 Submission

## caleb -- verifiable autonomous trading agent

**Description:**
caleb is an autonomous DCA trading agent with cryptographic audit trails, built with Next.js 16, React 19, and a custom EVM L2 on Initia. It is designed to solve the trust problem with AI agents: every decision the agent makes is hashed and committed on-chain, and anyone can verify or attest it.

Unlike most web apps submitted here, caleb's frontend tests against a live autonomous system -- real trades, real on-chain state, real transaction hashes that change every hour. You can't mock this. TestSprite had to navigate a testing surface that includes polling real-time data, resolving on-chain session hashes, and handling wallet-gated attestation flows.

**Key Features:**

Feature 1: 5-step cryptographic audit trail (Policy -> Market -> Decision -> Check -> Execution). Each step produces a keccak256 hash committed on-chain in order. Users can expand each step to view reasoning and raw JSON, copy hashes, and verify against on-chain state.

Feature 2: On-chain verification in one click. The dashboard re-hashes session payloads client-side and compares them to what's committed on caleb-chain. Per-step match/mismatch badges show exactly where the agent's claims hold up -- or don't.

Feature 3: Independent attestation. Anyone can connect a wallet and attest a verified session on-chain via DecisionLog.sol. Trust is peer-signed, not self-claimed.

**TestSprite Integration:**

5 rounds of automated testing. 8 real bugs found and fixed. TestSprite tested against a live trading agent on a custom L2 -- not a CRUD app with seeded data.

Most impactful finding: our entire deployment strategy was wrong. Round 1 returned 0% -- every test saw a blank page because `next dev` took 8-31s to hydrate the heavy crypto bundle. We'd been developing this way for weeks with hot browser caches and never noticed. TestSprite caught a production-readiness issue hiding in plain sight. Switching to `next build && next start` fixed it in one change.

Cross-layer discovery: truncated session hashes. The feed UI displays `sessionId.slice(0, 18)...` for readability, but the detail page needs the full 66-char hash. Any user who bookmarks a session, shares a URL, or copies the visible hash gets "session not found". This single bug blocked 7 of 26 tests in Round 3. We added prefix matching fallback and TestSprite confirmed zero "session not found" errors in Round 4.

5-round progression:
- Round 1: 0% pass rate -> exposed broken deployment strategy
- Round 2: 33% -> caught misleading icon + orphan session errors
- Round 3: 62% -> truncated hash routing failure found
- Round 4: 46% (new plan) -> prefix fix validated, new UX gaps found
- Round 5: 46% -> collapse, copy feedback, loading state fixes confirmed
- Effective pass rate (excluding untestable wallet flows): 69%

**Links:**
- GitHub: https://github.com/eipieq/caleb-app
- Live app: https://app.caleb.sandpark.co
- Demo video: TBD
- TestSprite email: ba24anil@mse.ac.in
