# TestSprite Testing Summary — caleb-app

three rounds of automated testing using the testsprite MCP server.

| round | tests | pass | fail | blocked | pass rate | notes |
|-------|-------|------|------|---------|-----------|-------|
| R1    | 15    | 0    | 0    | 15      | 0.0%      | broken setup: `next dev` hydration timeout |
| R2    | 15    | 5    | 3    | 7       | 33.3%     | first real run. found 2 bugs. |
| R3    | 26    | 16   | 3    | 7       | 61.5%     | post-fix. both R2 bugs confirmed fixed. |

R1 was a setup error (dev mode). R2 was the first real test. R3 ran after fixing the bugs R2 found.

## bugs found and fixed

1. **misleading icon on proof link** (R2, fixed) — `ExternalLinkIcon` on an internal `<Link>`. swapped to `ArrowRightIcon`.
2. **orphan trades with broken links** (R2, fixed) — trades referencing sessions that didn't commit on-chain. added `validSessionIds` filter, orphans now show "no proof" with tooltip.

both fixes verified passing in R3 (TC005, TC025).

## open issues from R3

3. **legacy sessions render blank** (TC015) — archived session URL appears truncated.
4. **verdict chart shows single SKIP slice** (TC021) — data skew, not a rendering bug. agent skips ~83% of cycles.
5. **confidence histogram is one bar** (TC023) — same data skew. needs forced bin ranges.

## per-round reports

- [round-1/testsprite-mcp-test-report.md](round-1/testsprite-mcp-test-report.md)
- [round-2/testsprite-mcp-test-report.md](round-2/testsprite-mcp-test-report.md)
- [round-3/testsprite-mcp-test-report.md](round-3/testsprite-mcp-test-report.md)
- [DELTA.md](DELTA.md) — R1→R2 narrative analysis
