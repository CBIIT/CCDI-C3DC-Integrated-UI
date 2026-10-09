#!/usr/bin/env python3
"""
Classify Stryker *survived* mutants into nominal vs actionable buckets.

Usage (from repo root):
  python3 tests/scripts/classify-stryker-survivors.py
  python3 tests/scripts/classify-stryker-survivors.py reports/mutation/batch-explore-page.json

Writes reports/mutation/triage-summary.json and prints a console summary.
Heuristics are intentionally conservative: when unsure, survivors are
marked investigate, not nominal.
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORT_DIR = ROOT / 'reports/mutation'
def discover_batch_paths() -> list[Path]:
    return sorted(REPORT_DIR.glob('batch-*.json'))

STYLE_FILE_HINTS = ('Style.js', 'Theme.js', 'style.js', 'Styles.js', 'pdfReader.js', 'Error.js')
COLOR_HEX = re.compile(r'^["\']#?[0-9A-Fa-f]{3,8}["\']$')


def rel(path: str) -> str:
    marker = 'CCDI-C3DC-Integrated-UI/'
    if marker in path:
        return path.split(marker, 1)[1]
    return path.replace(str(ROOT) + '/', '')


def classify(mut: dict, file_rel: str, source_lines: list[str]) -> str:
    mutator = mut.get('mutatorName', '')
    repl = (mut.get('replacement') or '').strip()
    line = mut.get('location', {}).get('start', {}).get('line', 0)
    src = source_lines[line - 1] if line and line <= len(source_lines) else ''

    if mutator == 'StringLiteral':
        if any(h in file_rel for h in STYLE_FILE_HINTS) and (
            'styled' in src or 'background' in src.lower()
        ):
            return 'nominal_styling'
        if repl in ('""', "''") and ('COLORS_' in src or 'color' in src.lower() or '#' in src):
            return 'nominal_color_or_label'
        if 'cohortAnalyzerChartPreview.js' in file_rel or (
            'WidgetUtils.js' in file_rel and 'COLORS' in src
        ):
            return 'nominal_color_or_label'
        if 'sizes' in src and 'Bytes' in src:
            return 'nominal_unused_unit'
        if repl in ('""', "''") and ('level1' in src or 'level2' in src or "title = 'root'" in src):
            return 'nominal_default_param'
        if repl in ('""', "''") and ('||' in src or '&&' in src):
            return 'actionable_branch'
        return 'nominal_string_fallback'

    if mutator == 'ObjectLiteral' and repl == '{}':
        if 'Style' in src or 'style' in src or 'containerStyle' in src:
            return 'nominal_styling'
        return 'investigate'

    if mutator == 'BlockStatement' and repl == '{}':
        if re.search(r'\bdd\b|\bmm\b|hours|minutes|seconds', src):
            return 'nominal_boundary_padding'
        return 'actionable_branch'

    if mutator == 'EqualityOperator':
        if re.search(r'\bdd\b|\bmm\b|hours|minutes|seconds|decimals', src):
            return 'nominal_boundary_padding'
        if '1000000' in src or '1000000000' in src or '1000' in src:
            return 'actionable_boundary'
        return 'actionable_branch'

    if mutator == 'ArrayDeclaration' and repl.startswith('[') and 'useEffect' in src:
        return 'nominal_effect_deps'

    if mutator in ('ConditionalExpression', 'LogicalOperator', 'ArrowFunction'):
        if any(k in file_rel for k in ('CohortModal/utils', 'downloadJson', 'arrayToCSV')):
            return 'actionable_outcome'
        return 'actionable_branch'

    if mutator == 'BooleanLiteral':
        return 'actionable_branch'

    return 'investigate'


def analyze_report(data: dict) -> dict:
    cat: Counter = Counter()
    file_action: Counter = Counter()
    killed = survived = timeout = error = nocov = 0

    for fpath, rec in data['files'].items():
        fr = rel(fpath)
        source_lines = (rec.get('source') or '').splitlines()
        for m in rec.get('mutants', []):
            st = m['status']
            if st == 'Killed':
                killed += 1
            elif st == 'Survived':
                survived += 1
                c = classify(m, fr, source_lines)
                cat[c] += 1
                if c.startswith('actionable'):
                    file_action[fr] += 1
            elif st == 'Timeout':
                timeout += 1
            elif st in ('RuntimeError', 'Error'):
                error += 1
            elif st == 'NoCoverage':
                nocov += 1

    denom = killed + survived + nocov
    score = 100 * killed / denom if denom else 0.0
    nominal = sum(v for k, v in cat.items() if k.startswith('nominal'))
    actionable = sum(v for k, v in cat.items() if k.startswith('actionable'))

    return {
        'killed': killed,
        'survived': survived,
        'timeout': timeout,
        'error': error,
        'nocov': nocov,
        'score': score,
        'nominal': nominal,
        'actionable': actionable,
        'investigate': cat.get('investigate', 0),
        'categories': dict(cat),
        'top_action_files': file_action.most_common(12),
    }


def main() -> int:
    paths = [Path(p) for p in sys.argv[1:]] if len(sys.argv) > 1 else discover_batch_paths()
    batches = []
    global_action: Counter = Counter()

    for path in paths:
        if not path.exists():
            print(f'skip missing {path}')
            continue
        with open(path) as f:
            data = json.load(f)
        name = path.stem.replace('batch-', '')
        stats = analyze_report(data)
        stats['batch'] = name
        stats['report'] = str(path)
        batches.append(stats)
        for f, n in stats['top_action_files']:
            global_action[f] += n

    out = REPORT_DIR / 'triage-summary.json'
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    with open(out, 'w') as f:
        json.dump({'batches': batches, 'top_action_files': global_action.most_common(20)}, f, indent=2)

    print('Stryker survivor triage')
    print('-' * 72)
    for b in batches:
        surv = b['survived'] or 1
        print(
            f"{b['batch']:18s}  score {b['score']:5.1f}%  "
            f"survived {b['survived']:4d}  "
            f"nominal {b['nominal']:4d} ({100*b['nominal']/surv:4.0f}%)  "
            f"actionable {b['actionable']:4d}  "
            f"investigate {b['investigate']:3d}  "
            f"errors {b['error']:3d}"
        )
    print('-' * 72)
    print('Top files by actionable survivors (heuristic):')
    for f, n in global_action.most_common(12):
        print(f'  {n:4d}  {f}')
    print(f'\nWrote {out}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
