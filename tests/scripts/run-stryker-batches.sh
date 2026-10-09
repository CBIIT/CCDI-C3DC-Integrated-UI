#!/usr/bin/env bash
# Run named Stryker batches sequentially; skip batches that already have JSON
# unless STRYKER_FORCE=1.
#
# Usage (repo root):
#   ./tests/scripts/run-stryker-batches.sh
#   STRYKER_FORCE=1 ./tests/scripts/run-stryker-batches.sh resource-controllers studies-table
#
set -euo pipefail
cd "$(dirname "$0")/../.."

if [[ ! -x node_modules/.bin/stryker ]]; then
  echo "Install Stryker 5 first (see tests/STRYKER.md)."
  exit 1
fi

export CI=true TZ=UTC NODE_ENV=test BABEL_ENV=test

# Default queue: pending + expanded slices (fast → slow).
DEFAULT_BATCHES=(
  document-ellipsis
  resource-controllers
  studies-table
  cart-ui
  global-search-cards
  studies-view
  global-search-view
  explore-view
  explore-facets
  explore-table
  shared-util-heavy
)

BATCHES=("${@:-${DEFAULT_BATCHES[@]}}")

for batch in "${BATCHES[@]}"; do
  out="reports/mutation/batch-${batch}.json"
  if [[ -f "$out" && "${STRYKER_FORCE:-0}" != "1" ]]; then
    echo "==> skip $batch (exists $out)"
    continue
  fi
  echo "==> STRYKER_BATCH=$batch"
  rm -rf .stryker-tmp
  STRYKER_BATCH="$batch" ./node_modules/.bin/stryker run
done

python3 tests/scripts/rollup-stryker-batches.py
python3 tests/scripts/classify-stryker-survivors.py
