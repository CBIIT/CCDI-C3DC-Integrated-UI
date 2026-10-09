# Mutation testing with Stryker

Coverage shows which lines ran. Mutation testing asks a harder question:
**if this code were wrong, would a test fail?**

StrykerJS answers that by changing production source in small ways
(mutants) and re-running Jest. A test suite is doing its job when those
changes make tests fail. This document is the source of truth for using
Stryker in Integrated.

Jest in this repository is **23.6.0**. Current Stryker (9.x / 10.x) is
built against Jest 30 and does not fit. Use **Stryker 5.6.1** with
`@stryker-mutator/jest-runner@5.6.1`, which still declares
`jest: ">= 22.0.0"`. The plugin prints a deprecation warning for Jest
&lt; 24 and then continues.

## How Stryker works

1. **Select files.** The `mutate` glob in `stryker.conf.js` is the only
   production code Stryker will change. Keep this list small.
2. **Instrument.** Stryker copies the project into `.stryker-tmp` and
   inserts mutants: flipped operators (`<` → `<=`), emptied strings,
   always-true conditions, changed return values, and similar edits.
3. **Dry run.** It runs the related Jest tests against **unmutated**
   code. If the dry run fails, mutation testing stops. That run also
   measures how long a healthy suite takes, which sets per-mutant
   timeouts.
4. **Test each mutant.** For every mutant, Stryker runs the related
   tests (see `enableFindRelatedTests` below).
5. **Score the mutant.**

| Outcome | Meaning |
| --- | --- |
| **Killed** | At least one test failed. The suite detected the change. |
| **Survived** | All tests still passed. The suite does not check that behavior. |
| **No coverage** | No test even executed the mutated line. |
| **Timeout** | Tests ran longer than the budget. Treated as killed (the change likely hung the app). |
| **Error** | Jest or the process crashed while testing that mutant. |

**Mutation score** is:

```text
killed / (killed + survived + no coverage)
```

Timeouts and errors are not counted as survivors. A high coverage
percentage with a low mutation score usually means tests execute code
without asserting the outcomes that matter.

Stryker does **not** call live backends. It runs the same Jest suite,
the same mocks, and the same `tests/` tree as `npm test`.

## Install

Stryker 5 is not a saved `package.json` dependency. Install it when you
need a run. From the Integrated repository root, using Node 16:

```bash
npm install --no-save --legacy-peer-deps \
  @stryker-mutator/core@5.6.1 \
  @stryker-mutator/jest-runner@5.6.1
```

`--legacy-peer-deps` is required because other packages in this repo
already have peer conflicts. `--no-save` keeps `package.json` unchanged.
The next `npm ci` / `npm install` will remove Stryker from
`node_modules`.

Do not install current `@stryker-mutator/core` (9.x / 10.x) against this
Jest version.

## Configuration

Root config: `stryker.conf.js`.

Important fields:

| Field | Why it is set this way |
| --- | --- |
| `testRunner: 'jest'` | Use the Jest plugin. |
| `jest.projectType: 'custom'` | This app is ejected CRA. It has `scripts/test.js` and Jest config in `package.json`, not `react-scripts`. |
| `jest.enableFindRelatedTests: true` | Jest `--findRelatedTests` runs only tests that import the mutated file. Much faster than the full suite. |
| `coverageAnalysis: 'off'` | Stryker 5 can wrap Jest environments to skip tests per mutant. That path is brittle on Jest 23, so every related test runs for every mutant. |
| `mutate` | **The main knob.** Only listed files are mutated. |
| `timeoutMS` / `timeoutFactor` | Per-mutant budget: `timeoutFactor * dryRunTime + timeoutMS`. |
| `concurrency: 2` | Two Jest workers. Raise only if the machine has headroom. |
| `htmlReporter.baseDir` / `jsonReporter.fileName` | Reports go under `.stryker-tmp/` (gitignored). |

This project’s Jest wrapper adds `--watch` unless `CI` is set,
`--coverage` is present, `--no-watch` is present, or argv contains exact
`--watchAll`. Stryker talks to Jest through the plugin, not
`scripts/test.js`, but always export `CI=true` anyway so nothing falls
back into watch mode.

## How to run

Run **one named batch** at a time. A combined `src/` mutate list takes
hours and is not supported by the config.

```bash
STRYKER_BATCH=controllers CI=true TZ=UTC NODE_ENV=test BABEL_ENV=test \
  ./node_modules/.bin/stryker run
```

`STRYKER_BATCH` is required. `CI=true` is required. `TZ=UTC` matches
`npm run test:ci`. Reports write to
`reports/mutation/batch-<name>.json` and `reports/mutation/html-<name>/`.

| Batch | Status | What it covers |
| --- | --- | --- |
| `shared-utils` | Done (85.2%) | `src/utils` + small `src/components/util` |
| `feature-logic` | Done (64.8%) | Cohort modal/store, cart export utils, inventory helpers, search tab query |
| `cohort-analyzer` | Done (64.3%) | CA util, layout reducer, histogram/download helpers |
| `controllers` | Done (82.2%) | Landing/error/PDF/cart/search/study/inventory controllers |
| `resource-controllers` | Pending | Resource page controllers only |
| `studies-table` | Pending | Studies table layout and data-availability cells |
| `document-ellipsis` | Pending | DocumentDownload + EllipsisText |
| `explore-page` | Done (34.4%) | Explore cover, switch nav, tabs, cohort component |
| `explore-view` | Pending | inventoryView, WidgetView, TabPanel |
| `explore-facets` | Pending | Query bar + facet filters |
| `explore-table` | Pending | Explore table columns, dropdown, wrapper, add-to-cart |
| `cart-ui` | Pending | Cart view, wrapper, column, export button UI |
| `global-search-cards` | Pending | Consent row, property/value cards, wrapper service, add-files controller |
| `global-search-view` | Pending | `searchView.js` only (~20–40 min) |
| `studies-view` | Pending | Studies listing view |
| `shared-util-heavy` | Pending | `tables.js` + `dashboardUtilFunctions.js` (slow) |
| `landing-view` | Optional | `landingView.js` only; very long run |

Explore helpers already scored in earlier batches: `exploreNavUtils`, `InventoryState`, `BentoFilterUtils`, `WidgetUtils`, `useGenerateTabData`, and the inventory controllers.

### Overall quality (before triage)

Run every batch you care about, then aggregate:

```bash
chmod +x tests/scripts/run-stryker-batches.sh
./tests/scripts/run-stryker-batches.sh
```

Skips batches that already have `reports/mutation/batch-<name>.json`.
Set `STRYKER_FORCE=1` to re-run. One batch only:

```bash
STRYKER_BATCH=studies-table CI=true TZ=UTC ./node_modules/.bin/stryker run
python3 tests/scripts/rollup-stryker-batches.py
```

Read **`reports/mutation/ROLLUP.md`** for repository-wide mutation score and
per-batch table. Use **`tests/STRYKER_TRIAGE.md`** only after you have the
rollup snapshot you need.

Add a new key to `batches` in `stryker.conf.js` when you start another
slice. Keep each batch under a few hundred mutants (about 15–25 minutes).
Do not add `landingView.js` or other 300+ line React trees to an existing
batch. Explore is split into `explore-page`, `explore-view`,
`explore-facets`, and `explore-table`.

Do not mutate test files, fixtures, or `tests/`. Those are the oracle,
not the subject.

### What you should see

1. `Found N of M file(s) to be mutated` — if N is huge, stop and
   shrink `mutate`.
2. `Instrumented … with K mutant(s)`.
3. Deprecation warning: Jest version 23.6.0. Expected.
4. `Initial test run succeeded. Ran T tests in …` — dry run passed.
5. Progress: `Mutation testing 45% … (3 survived, 0 timed out)`.
6. A clear-text table of survivors, then a score table, then paths to
   the HTML and JSON reports.

If the dry run fails, fix the Jest suite first. Stryker will not produce
a useful score on a red baseline.

## Triage (nominal vs real gaps)

Survivor counts are noisy. After each batch, run
`tests/scripts/classify-stryker-survivors.py` and read
`tests/STRYKER_TRIAGE.md` for category definitions, adjusted priorities,
and which files need stronger **outcome** assertions vs which survivors
you can ignore (CSS, colors, unused literals).

## How to interpret results

Open the HTML report:

```text
reports/mutation/html-<batch>/index.html
```

JSON for scripting or diffs:

```text
reports/mutation/batch-<batch>.json
```

### Score table

```text
File        | % score | # killed | # timeout | # survived | # no cov | # error
helpers.js  |   82.72 |       67 |         0 |         14 |        0 |       0
```

- **High killed, low survived** — tests check real outcomes for that
  file.
- **Survived** — a behavior change the suite does not notice. This is
  the actionable list.
- **No cov** — no test executed that line. Add a test that reaches it,
  then re-run Stryker. Coverage reports help find these first.
- **Timeout** — usually a mutant that created an infinite loop. Counted
  as killed; still worth a glance if timeouts are common.
- **Error** — environment or syntax problem, not a test-quality signal.
  Investigate before treating the score as meaningful.

### Per-test lines in the console

After the run, Stryker lists tests as:

- **killed N** — this test failed for N mutants. It is pulling its
  weight.
- **covered 0** — the test ran (find-related picked it up) but never
  failed for any mutant in this `mutate` set. Re-exports, smoke renders,
  and tests of a *different* module often look like this. They are not
  automatically bad; they just do not protect the file you mutated.

### Survived mutants (the useful part)

Each survivor is a diff Stryker applied that **all tests still accepted**.
Read the original line, the mutant, and ask what assertion is missing.

Worked examples from the trial run on `src/components/util/helpers.js`
(82.72% score, 67 killed, 14 survived):

**Boundary operators.** Tests used day `9` and `28`, never `10`:

```diff
- if (dd < 10) { dd = `0${dd}`; }
+ if (dd <= 10) { dd = `0${dd}`; }
```

The suite still passed. A test with `getDate()` returning `10` would
kill it (unpadded `10` vs padded `010`).

**Unused literals.** Tests formatted bytes as `KB` / `Bytes` only:

```diff
- const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', …];
+ const sizes = ['Bytes', 'KB', "", 'GB', 'TB', …];
```

Emptying `MB` survived because nothing asserted a megabyte label.

**Predicate replaced with `true`.** `findIndex` no longer matches
`dataField` to the `{placeholder}` key. Survivors like this mean the
tests do not check `actualLinkId` against the correct column when the
match is not the first row.

**What not to chase.** Equivalent mutants look like bugs but preserve
behavior for every input the function can actually see (for example,
mutating a unit string the product never uses). You can leave those, or
add one assertion if the label is part of the contract. Do not add tests
whose only purpose is to “kill” a mutant that cannot affect users.

### Suggested response to survivors

1. Prefer one behavior test that would fail on the mutant (boundary
   value, extra column, missing unit).
2. Follow `tests/TEST_STRUCTURE.md`: `should …` names, RTL queries,
   no live backends.
3. Re-run Stryker on the **same** `mutate` glob and confirm the mutant
   moves from survived to killed.
4. Do not add snapshots or tautological `toBeDefined()` checks just to
   raise the score.

## Trial baseline

A scoped run against `src/components/util/helpers.js` (Stryker 5.6.1,
Jest 23.6.0) completed in about 2 minutes:

| Metric | Value |
| --- | ---: |
| Mutants | 81 |
| Killed | 67 |
| Survived | 14 |
| No coverage | 0 |
| Timeouts / errors | 0 |
| Mutation score | 82.72% |
| Related tests in dry run | 27 |

That run is the proof that Stryker 5 works with this Jest version. It is
not a repository-wide quality gate. Treat 80%+ on a focused file as a
useful signal, not a CI threshold, until more slices have been mutated
the same way.

## Practical limits

- **Scope first.** One util or one analyzer helper folder, not all of
  `src/`.
- **Related tests only.** If `--findRelatedTests` misses a test file
  (unusual import path, dynamic `require`), either add a static import
  or set `enableFindRelatedTests: false` for that run. The latter runs
  every test Jest would load and is much slower.
- **Do not use current Stryker.** It expects Jest 30.
- **Reports are gitignored.** `.stryker-tmp/` and `/reports` are in
  `.gitignore`. Copy a score into a PR description if you need it
  preserved.
- **Not a substitute for coverage.** Use `npm run test:ci` for
  statement/branch coverage. Use Stryker when you want to know whether
  those tests actually catch mistakes.

## Agent request (optional)

```text
Run Stryker using tests/STRYKER.md. Keep mutate scoped to <files>.
Install Stryker 5.6.1 with --no-save --legacy-peer-deps if missing.
Use CI=true. Report killed / survived / no coverage / score and list
actionable survivors. Do not mutate src/ wholesale. Do not add current
Stryker. Do not commit unless asked.
```
