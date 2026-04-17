# caleb — hackathon progress

**project:** caleb. an autonomous trading agent with on-chain audit trails. every decision the agent makes is cryptographically committed to caleb-chain (a dedicated minievm rollup on initia) as a 5-step keccak256 sequence (policy → market → decision → check → execution). anyone can attest to a session on-chain with a wallet signature.

**hackathon:** testsprite season 2 — https://www.testsprite.com/hackathon-s2
**deadline:** 2026-04-17, 11:59 PM PST (**today**)
**live at:** app.caleb.sandpark.co

---

## status: ready to submit

core work is done. two rounds of testsprite testing complete, reports in canonical format, product bugs found by testsprite have been fixed.

---

## what's built

| module          | what it is                              | location                              |
|-----------------|-----------------------------------------|---------------------------------------|
| caleb-app       | next.js dashboard (primary test target) | `~/Documents/hackathon/caleb-app/`    |
| caleb-onchain   | node.js agent + DecisionLog.sol + chain | `~/Documents/hackathon/caleb-onchain/`|
| caleb-landing   | marketing page                          | `~/Documents/hackathon/caleb-landing/`|
| caleb/          | submission bundle (symlinks + testsprite artifacts) | `~/Documents/hackathon/caleb/` |

**agent runtime:** 34 real trades placed against live ETH prices. $1000 paper starting balance. running hourly on a VPS at `64.227.139.172:4000` since march 2026. realized + unrealized pnl sitting at +1.66%.

**contract:** `0x22679adc7475B922901137F22D120404c074044f` on caleb-chain.
**agent wallet:** `0x772a1f0c3e3856645FF9019Af5B077B08AA1AFa3`.

---

## testsprite results

| round | pass    | fail | blocked | pass rate | what happened                                              |
|-------|---------|------|---------|-----------|------------------------------------------------------------|
| R1    | 0 / 15  | 0    | 15      | 0.0%      | every test blocked. dev-mode hydration > 15s, runner gave up. |
| R2    | 5 / 15  | 3    | 7       | 33.3%     | fixed server config, real bugs surfaced.                    |

**+33.3pp delta** from one infrastructure change (`next dev` → `next build && next start`).

### bugs testsprite found, all fixed

1. **misleading `ExternalLinkIcon` on internal proof link** → swapped for `ArrowRightIcon` in `components/portfolio-card.tsx`.
2. **orphan trades** — portfolio had `sessionId`s for sessions that failed to commit (nonce race). ui now filters proof links through a `validSessionIds` set from home-feed, shows "no proof" tooltip for orphans.
3. **test-runner wallet extension gap** — 3 tests block on headless env (out of scope for this submission, noted as follow-up).

---

## remaining pre-submission tasks

| # | task                                              | status | owner  |
|---|---------------------------------------------------|--------|--------|
| 1 | install testsprite mcp                            | done   | me     |
| 2 | run round 1                                       | done   | me     |
| 3 | analyze R1, fix root cause (prod build)           | done   | me     |
| 4 | run round 2                                       | done   | me     |
| 5 | fix R2 product bugs (icon + orphan trades)        | done   | me     |
| 6 | write DELTA.md r1→r2 analysis                     | done   | me     |
| 7 | write canonical `testsprite-mcp-test-report.md`   | done   | me     |
| 8 | judges-facing readme at `caleb/README.md`         | done   | me     |
| 9 | record demo video (3-5 min)                       | todo   | user   |
| 10| push `caleb/` to public github repo               | todo   | user   |
| 11| submit on discord `#hackathon-s02-submission`     | todo   | user   |
| 12| engagement bonus: x share (5pt), polls (3pt), discord activity (2pt) | todo | user |

---

## scoring targets (out of 110)

- **50pt project quality** — caleb is multi-module: dashboard + agent + contract + dedicated rollup + landing. strong.
- **30pt test quality** — 0% → 33% delta is the scoring lever. r1→r2 is a clean narrative.
- **20pt innovation** — 5-step audit + dedicated rollup + dual-path trust is novel vs "log to a shared testnet."
- **10pt engagement bonus** — from discord + x activity.

---

## submission artifacts at a glance

```
caleb/
├── README.md                                  ← judges-facing 30-second pitch
├── PROGRESS.md                                ← this file
├── app/                                       ← symlink → caleb-app
├── onchain/                                   ← symlink → caleb-onchain
├── landing/                                   ← symlink → caleb-landing
└── testsprite_tests/
    ├── testsprite-mcp-test-report.md          ← canonical top-level report (combined R1 + R2)
    ├── DELTA.md                               ← narrative r1→r2 analysis
    ├── round-1/
    │   ├── testsprite-mcp-test-report.md      ← R1 canonical report
    │   ├── standard_prd.json
    │   ├── testsprite_frontend_test_plan.json
    │   └── TC001…TC015_*.py                   ← 15 generated scripts
    └── round-2/
        ├── testsprite-mcp-test-report.md      ← R2 canonical report
        ├── standard_prd.json
        ├── testsprite_frontend_test_plan.json
        ├── code_summary.yaml
        ├── test_results.json
        └── TC001…TC015_*.py
```

---

## links

- dashboard: https://app.caleb.sandpark.co
- hackathon: https://www.testsprite.com/hackathon-s2
- contract: `0x22679adc7475B922901137F22D120404c074044f`
- architecture: `caleb/onchain/ARCHITECTURE.md`
- chain config: `caleb/onchain/CHAIN.md`
- devlog: `caleb/onchain/DEVLOG.md`
