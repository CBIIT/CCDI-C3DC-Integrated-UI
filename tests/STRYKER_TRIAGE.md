# Stryker report triage — nominal vs real test gaps

Raw mutation scores and survivor counts are hard to act on. A batch with
400 survivors is not 400 broken tests. Many survivors are **nominal**
(equivalent edits, CSS, colors, or boundaries your fixtures never hit).
This guide is the repeatable workflow for sorting reports as you add
batches.

Companion docs: `tests/STRYKER.md` (how to run), `stryker.conf.js`
(batch names).

## After each batch

1. Open `reports/mutation/html-<batch>/index.html` for spot checks.
2. Run the classifier:

```bash
python3 tests/scripts/classify-stryker-survivors.py
```

3. Read `reports/mutation/triage-summary.json` for numbers per batch.
4. Update the **Batch register** table at the bottom of this file when a
   new batch completes.
5. Fix **P0** items first (see priority backlog); re-run the same
   `STRYKER_BATCH` to confirm survivors move to killed.

## Category definitions

| Category | Treat as | Typical mutator / pattern | Test response |
| --- | --- | --- | --- |
| **nominal_styling** | Ignore | `StringLiteral` / `ObjectLiteral` on `styled.*`, inline layout CSS | Do not add tests for pixel-perfect CSS |
| **nominal_color_or_label** | Ignore unless user-visible | Empty hex, chart month labels, sunburst palette entries | Assert label only if copy is a product requirement |
| **nominal_unused_unit** | Ignore | `formatBytes` size strings never used in tests (TB, PB, …) | Optional: one case if that unit is reachable in UI |
| **nominal_default_param** | Ignore | Default arg names `'program'`, `'arm'`, `'root'` | Tests already use real fixture keys |
| **nominal_string_fallback** | Low | `""` replacing a fallback string tests never read | Add assertion only if users see the string |
| **nominal_boundary_padding** | Low | `dd < 10` → `<= 10` with mocks never using `10` | One boundary example if formatting is contractual |
| **nominal_effect_deps** | Low | `useEffect` deps `[]` → `["…"]` when tests mount once | Usually not worth chasing |
| **actionable_outcome** | **Fix tests** | Download/export/CSV/JSON: side effect runs, **content not asserted** | Read `Blob` text or parse JSON; assert columns and escaping |
| **actionable_branch** | **Fix tests** | `if` → `true`/`false`, `&&` → `\|\|`, wrong `findIndex` predicate | Add fixture that fails if branch is wrong |
| **actionable_boundary** | **Fix tests** | `formatNumbers` `>= 1e9` → `> 1e9` at exactly 1e9 | One numeric boundary per function |
| **investigate** | Manual | Regex, rare mutators, unclear source | Open HTML report line; reclassify |

**Errors** (Stryker `error`, not `survived`) are not “missing tests.” They
often mean a mutant threw during render (undefined access). Fix test
mocks or accept as killed-by-crash; do not count them as nominal.

**Timeouts** count as killed in the score; long CA download batches had
many timeouts — treat as signal the mutant broke or hung behavior, not
as a gap to “assert harder.”

## Adjusted reading of scores

Use two numbers:

- **Reported score** — from Stryker (`killed / (killed + survived + no cov)`).
- **Triage load** — `actionable + investigate` survivors (from the script).

Example (completed batches, heuristic classifier):

| Batch | Reported score | Survived | ~Nominal | ~Actionable | Errors |
| --- | ---: | ---: | ---: | ---: | ---: |
| `shared-utils` | 85.2% | 61 | 21 (34%) | 30 | 0 |
| `feature-logic` | 64.6% | 439 | 110 (25%) | 270 | 0 |
| `cohort-analyzer` | 62.4% | 451 | 60 (13%) | 319 | 65 |
| `controllers` | 82.2% | 24 | 12 (50%) | 7 | 0 |
| `explore-page` | 34.4% | 280 | 66 (24%) | 174 | 8 |

Low **explore-page** score is real: many guards in `inventoryCover.js` are
not discriminated by tests, not just CSS noise. **controllers** looks
worse in survivors than it is: half of survivors are PDF/error styling.

## Priority backlog (where to add tests)

Ordered by impact and concentration of **actionable** survivors.

### P0 — assert outcomes, not side effects

| Source | Primary tests | Gap |
| --- | --- | --- |
| `src/components/CohortModal/utils.js` | `tests/components/CohortModal/utils.test.js` | CSV/JSON **blob body** (columns, escaping, `__typename`, nested participant fields). Filename/click alone leave ~160+ survivors. |
| `src/pages/cart/.../downloadJson.js` | `tests/pages/cart/.../downloadJson.test.js` | Same: assert exported JSON structure, not only `createObjectURL`. |
| `src/pages/inventory/inventoryCover.js` | `tests/pages/inventory/inventoryCover.test.js` | URL restore, import/upload, loading backdrop (`open={!initialLoading && isDataloading}`). Largest Explore gap. |

### P1 — branch coverage on domain logic

| Source | Primary tests | Gap |
| --- | --- | --- |
| `src/components/CohortSelectorState/store/reducer.js` | `tests/components/CohortSelectorState/store/reducer.test.js` | Extra reducer arms (rename, edge payloads, error paths). |
| `src/pages/CohortAnalyzer/store/cohortAnalyzerLayoutReducer.js` | `tests/pages/CohortAnalyzer/layoutReducer.test.js` | Panel size / migration arms called out in coverage notes. |
| `src/pages/CohortAnalyzer/CohortAnalyzerUtil/CohortDataTransform.js` | colocated + `tests/pages/CohortAnalyzer/` | Transform edge cases; 62 Stryker **errors** — stabilize mocks first. |
| `src/pages/globalSearch/searchViewController.js` | `tests/pages/globalSearch/searchViewController.test.js` | Admin vs public access when `state.login` shape mutates. |
| `src/utils/sampleFileTable.js` | `tests/utils/sampleFileTable.test.js` | Empty vs non-empty `files` guards (`length > 0` vs `>= 0`). |

### P2 — smaller or mostly nominal

| Source | Notes |
| --- | --- |
| `src/components/util/helpers.js` | Boundaries + `findIndex` — few tests fix many survivors. |
| `src/pages/inventory/widget/WidgetUtils.js` | Most survivors are color literals; behavior tests already solid. |
| `src/pages/pdfReader/pdfReader.js` | Survivors mostly inline styles; optional smoke on resolved PDF URL. |
| `src/pages/error/Error.js` | One styled-template survivor — nominal. |
| `src/utils/SuccessOutlined.js` | Display name only — nominal. |

### Strong slices (use as patterns)

These batches/files kill most mutants; copy their style (assert behavior,
use discriminating fixtures):

- Cart/export **controllers** — 100% on `cartController`, `exportButtonController`.
- `exploreNavUtils`, `classNameConcat`, `Date`, `localStorage` — 100% mutation score.
- `consentCodes.js`, cohort `action.js`, `InventoryState` — high 90s.

## Nominal patterns (do not chase)

When triaging HTML report diffs, deprioritize if you see:

- `styled.div` template emptied to `` styled.div`` `` (`Error.js`).
- `#057EBD`, `'6 Months'`, `'root'` → `""` in preview/widget utils.
- `formatBytes` / date stamp padding when mocks never use `10`.
- `decimals < 0` → `<= 0` (equivalent for integer `0` decimals).
- Emptied `containerStyle` / `iframeStyle` when tests only check iframe
  renders.

## Expand triage when adding batches

1. Add batch to `DEFAULT_BATCHES` in
   `tests/scripts/classify-stryker-survivors.py` (or pass the JSON path
   as a CLI argument).
2. Run classifier; add file-specific notes under **Priority backlog** if
   a new area dominates actionable count.
3. Extend `classify()` only when a pattern repeats across files (keep
   heuristics conservative — prefer `investigate` over false nominal).

## Batch register

| Batch | Report JSON | Triage (nominal / actionable surv.) | Notes |
| --- | --- | --- | --- |
| `shared-utils` | `batch-shared-utils.json` | 21 / 30 | Solid overall; sampleFileTable + env branches |
| `feature-logic` | `batch-feature-logic.json` | 110 / 270 | Dominated by CohortModal utils exports |
| `cohort-analyzer` | `batch-cohort-analyzer.json` | 60 / 319 | Many download timeouts; DataTransform errors |
| `controllers` | `batch-controllers.json` | 12 / 7 | PDF/error styling inflates nominal |
| `explore-page` | `batch-explore-page.json` | 66 / 174 | inventoryCover + TabsView need work |
| `explore-view` | — | — | Pending |
| `explore-facets` | — | — | Pending |
| `explore-table` | — | — | Pending |
| `resource-controllers` | — | — | Pending |
| `studies-table` | — | — | Pending |
