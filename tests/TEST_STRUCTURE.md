# Frontend unit tests — structure and agent guide

This is the source of truth for unit tests in Integrated. It mirrors the
conventions used by `CCDI-Portal-WebPortal/tests/TEST_STRUCTURE.md` while
keeping examples specific to this repository.

## File placement

- Put page-level tests under root `tests/`, mirroring `src/`.
  - `src/pages/landing/landingView.js`
  - `tests/pages/landing/landingView.test.js`
- Put stable test data under `tests/fixtures/<area>/`.
- Put reusable network or client mocks under `tests/helpers/`.
- Small component tests may be colocated under `src/**`, but page suites
  should use the root test tree.
- Name files `ComponentName.test.js`, `viewName.test.js`, or
  `controllerName.test.js`.

## Test organization

Use a top-level `describe` for the component and organize cases in this order:

1. `Rendering` — smoke tests and required props.
2. Feature sections — visible content, links, formatting, and interactions.
3. `Side effects` — browser APIs, navigation, and data requests.
4. `Edge cases` — empty, missing, zero, loading, and error states.

Test names start with `should` and describe observable behavior.

## Rules

- Use React Testing Library and prefer queries in this order:
  `getByRole` → `getByLabelText` → `getByText`.
- Wrap routed components in `MemoryRouter`.
- Add Redux, Apollo, theme, or context providers only when required by the
  subject under test.
- Never call a live backend. Mock `fetch`, axios, Apollo, and other clients.
- Keep API response shapes and repeated values in fixtures; keep repeated mock
  wiring in helpers.
- Assert both the request contract and rendered result in controller tests.
- For interactions, state the behavior before input, perform the action, then
  assert the updated UI/state/request.
- Use `findBy*` or `waitFor` for asynchronous changes.
- Mock heavy children when their implementation is not the test subject.
- Polyfill unsupported JSDOM APIs only where needed.
- Avoid snapshots for behavior that can be expressed with accessible queries.

## Baseline: Home page

The initial Home coverage slice is under `tests/pages/landing/`:

- `landingView.test.js` tests the page from static fixture props.
- `landingController.test.js` tests loading, GraphQL success/error, query
  options, and count formatting with a mocked Apollo hook.
- `tests/fixtures/landing/landingViewProps.js` owns stable Home-page values.

Use these as the pattern for the next page. Split view and controller tests so
data-fetch behavior does not make presentational tests slow or brittle.

## Coverage strategy

The long-term target is approximately 90% coverage, built page by page.

- CI always runs the complete suite with coverage.
- New page work should target at least 90% statements, branches, functions,
  and lines for the files in that page slice where practical.
- Review page-level coverage while developing and treat approximately 90% as
  a goal, not an enforced Jest threshold.
- Do not add broad exclusions merely to raise the percentage.
- Add repository-wide thresholds only after enough page slices are covered;
  setting a global 90% gate at the start would block all incremental work.

## Repeatable coverage workflow

Use this workflow in Integrated and in other frontend repositories. It keeps
agent requests bounded, reduces repeated codebase discovery, and leaves each
slice independently reviewable.

### 1. Define one slice

A slice is one routed page plus the components and utilities required for its
behavior. Do not request repository-wide coverage work in a single pass.

For each slice, record:

- route and entry component;
- controller, view, direct functional children, and pure utilities;
- Redux, Apollo, router, theme, and browser API dependencies;
- existing tests and a reference implementation in a related repository;
- starting statements, branches, functions, and lines.

### 2. Build the test map once

Inspect the complete slice before writing tests. Batch file searches and reads
so the agent does not repeatedly rediscover dependencies. Store stable API
responses and repeated values in `tests/fixtures/<area>/`; store provider,
network, and JSDOM setup in `tests/helpers/`.

Test in this order:

1. Pure functions and reducers.
2. Presentational children from fixture props.
3. Controllers and hooks with mocked clients.
4. Page integration with heavy children mocked.
5. Empty, loading, error, zero, and malformed-data branches.

Mock third-party tables, charts, and Bento generators at their boundaries.
Test the application contract passed to them, then test custom child
components separately.

### 3. Use a fixed implementation loop

For every slice:

1. Run the existing focused tests.
2. Add the smallest coherent group of behavior tests.
3. Run only those tests while developing.
4. Run focused coverage for the source files in the slice.
5. Read uncovered branches and add meaningful cases.
6. Stop near 90% in all four metrics where practical.
7. Run `npm run test:ci` once before handoff.
8. Record final coverage and remaining intentional gaps.

Do not repeatedly run the complete suite while authoring one test file.

### 4. Slice completion criteria

A slice is complete when:

- observable rendering, interactions, requests, and navigation are covered;
- live backends are never called;
- loading, error, empty, and important branch states are covered;
- focused coverage is approximately 90% for statements, branches, functions,
  and lines, or documented technical gaps explain why not;
- focused tests and the full CI suite pass;
- no new linter errors or unhandled React warnings are introduced.

### 5. Reusable agent request

Use one request per slice:

```text
Cover <slice> using tests/TEST_STRUCTURE.md.
First inspect the route, entry point, direct functional children, existing
tests, and fixtures in one batched pass. Reuse tests from <reference repo>
where behavior matches, but verify route and data-contract differences.
Implement tests from pure utilities upward, mock external clients and heavy
third-party UI, run focused coverage, fill meaningful uncovered branches
toward 90%, then run the full CI suite. Report the four focused metrics and
remaining gaps. Do not add coverage thresholds or broad exclusions.
```

## Coverage roadmap

The repository-wide percentage includes all collected `src/` files. Track
both focused slice coverage and the repository total; the slice metric is the
working acceptance criterion.

Complete slices in this order:

1. **Shared chrome:** responsive Header, Navbar, search bars, cart badge,
   Footer, Layout, and Stats.
2. **Studies:** listing table cells/layout, Study Detail overview, charts,
   supporting data, and controller states.
3. **Cart:** controller, wrapper, column renderers, export flows, download
   utilities, and user-guide link.
4. **Global Search:** extract and test tab-query helpers, search/count effects,
   API wrappers, result cards, cart/cohort actions, and edge states.
5. **Explore:** URL/filter utilities, inventory state, cover data flow,
   query bar, widgets, tabs, facets, guide, and route synchronization.
6. **Cohort Analyzer UI:** selector, table section, Histogram hooks/rendering,
   Venn interactions, survival analysis, and downloads. Pure page/store logic
   already has substantial coverage.
7. **Remaining routed/shared code:** error/PDF pages, cohort modal/state,
   shared utilities, notifications, and resource pages (`src/pages/resource/`).

Review generated configuration and pure style modules separately. Exclude a
file only when it is demonstrably generated or contains no executable product
behavior; never exclude application logic merely to improve the percentage.
Add a repository-wide threshold only after active slices consistently meet the
goal.

## Coverage progress

Record completed slices here so future work starts from known measurements
instead of repeating repository discovery.

| Slice | Statements | Branches | Functions | Lines | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| Responsive Header + Footer + Studies | 100% | 94.06% | 100% | 100% | Complete |
| Layout + Stats + Study Detail | 97.2% | 92.44% | 98.63% | 97% | Complete |
| Cart | 96.96% | 90.82% | 100% | 96.67% | Complete |
| Global Search | 94.34% | 86.27% | 92.81% | 94.32% | Target met |
| Explore | 95.19% | 86.25% | 96.77% | 94.96% | Target met |
| Cohort Analyzer UI | 90.11% | 74.12% | 90.02% | 92.64% | Target met |
| Remaining routed/shared | 93.48% | 78.10% | 93.19% | 94.12% | Target met |
| Resource pages | 97.24% | 91.71% | 100% | 97.24% | Target met |

The first slice includes all files under:

- `src/components/ResponsiveHeader/`
- `src/components/ResponsiveFooter/`
- `src/pages/studies/`

The unused, unrouted `src/pages/studies/studiesDetail.js` stub was removed
rather than adding tests for dead code.

The second slice includes:

- `src/components/Layout/`
- `src/components/Stats/`
- `src/pages/studyDetail/`

The third slice includes all files under `src/pages/cart/`. Remaining
uncovered branches are default arms in the export dropdown (`exportButton.js`)
that the two available menu options never reach.

The fourth slice includes all files under `src/pages/globalSearch/`. Card
title truncation, cart-limit, autocomplete/count effects, and
`AddSelectedFilesController` (virtual mocks for missing Explore table
modules) are covered. Remaining gaps are unused Redux connect arms and a
few JSDOM-only width branches.

The fifth slice includes:

- `src/pages/inventory/`
- `src/components/Inventory/`
- `src/utils/exploreNavUtils.js`

The Explore table row is `src/pages/inventory/` (95.19% / 86.25% / 96.77% /
94.96%). `CustomDropDown.js` GraphQL create/add flows, facet-filter
generator closures, and `inventoryCover.js` URL restore / import_from /
upload branches are covered. `InventoryState.js` is at 100% statements.
Remaining gaps are `Wrapper.js` / `customButton.js` paginated-table wiring,
user-guide modal layout, and `exploreNavUtils.js` alternate path helpers.

The sixth slice includes all files under `src/pages/CohortAnalyzer/` except
colocated `__tests__` and `testSupport`. Selector, table section, chart area,
header/radios, histogram strip/popup/survival cards, add-chart, and download
menus have UI tests under `tests/pages/CohortAnalyzer/`. The target pass also
covers Chart.js Venn rendering and label plugins, GraphQL histogram/KM/risk
hooks, PNG/PDF and survival downloads, histogram/beside-panel drag and resize
hooks, chart axis labels, beside-Venn histogram/survival portals, layout
reducer migration, panel drag payloads, and analyzer util helpers. Cohort
Analyzer branch coverage is about 82%; remaining gaps are the page controller,
histogram bootstrap hook, and dataset-chart color/layout arms. Statement,
function, and line coverage exceed 90%.

The seventh slice includes:

- `src/pages/error/` and `src/pages/pdfReader/`
- `src/components/CohortModal/` and `src/components/CohortSelectorState/`
- `src/components/Notifications/`, `App.js`, `ThemeContext.js`, `Global/`
- Overlay, ScrollButton, session timeout, DocumentDownload, EllipsisText, Wrappers
- `src/utils/` and `src/components/util/`

Resource pages under `src/pages/resource/` are covered by YAML-mocked
controller tests and view tests under `tests/pages/resource/` (axios +
`js-yaml.safeLoad`, CPI stats `fetch`, Federation DMN iframe URL). The
routed/shared pass covers middle-ellipsis measurement, Apollo link routing
in `graphqlClient.js`, the unused legacy documents in `graphqlQueries.js`,
and cohort-list copy numbering plus confirmation handlers. Statement,
function, and line coverage are above 90%. Branches stay near 78% because
of dashboard filter transforms, table helpers, and defensive cohort-detail
arms.

Repository-wide coverage is 94.44% statements (9661/10230), 83.44% branches
(5564/6668), 93.96% functions, and 95.31% lines across 258 suites / 1146 tests.
Statements, functions, and lines are above 90%. Branches still need about 438
more covered paths to reach 90%. Cohort Analyzer is about 82% branches
(2481/3035); the largest remaining CA pools are histogram bootstrap, dataset
charts, and the page controller.

## Mutation testing

Line coverage does not prove tests check outcomes. Use Stryker 5 (not
current Stryker) against this Jest 23 suite to see whether a change in
production code would fail a test. Setup, commands, and how to read
killed vs survived mutants are in `tests/STRYKER.md`.

## Commands

From the repository root:

```bash
npm test
npm run test:ci
npm test -- tests/pages/landing/landingView.test.js
```

To inspect only the Home slice while developing:

```bash
npm test -- --ci --coverage --runInBand \
  --collectCoverageFrom='src/pages/landing/landing{View,Controller}.js' \
  tests/pages/landing
```

General focused-coverage template:

```bash
npm test -- --ci --coverage --runInBand \
  --collectCoverageFrom='src/<slice>/**/*.{js,jsx}' \
  tests/<slice>
```

