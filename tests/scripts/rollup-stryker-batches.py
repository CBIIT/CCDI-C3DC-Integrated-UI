#!/usr/bin/env python3
"""
Aggregate all reports/mutation/batch-*.json into one quality snapshot.

Usage (repo root):
  python3 tests/scripts/rollup-stryker-batches.py

Writes:
  reports/mutation/rollup.json
  reports/mutation/ROLLUP.md
"""
from __future__ import annotations

import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORT_DIR = ROOT / 'reports/mutation'


def rel(path: str) -> str:
    marker = 'CCDI-C3DC-Integrated-UI/'
    if marker in path:
        return path.split(marker, 1)[1]
    return path.replace(str(ROOT) + '/', '')


def load_batches() -> list[tuple[str, dict]]:
    out = []
    for path in sorted(REPORT_DIR.glob('batch-*.json')):
        name = path.stem.replace('batch-', '')
        with open(path) as f:
            out.append((name, json.load(f)))
    return out


def aggregate(batches: list[tuple[str, dict]]) -> dict:
    by_file: dict[str, dict] = {}
    by_batch = []
    totals = defaultdict(int)

    for batch_name, data in batches:
        b_killed = b_surv = b_timeout = b_error = b_nocov = b_mut = 0
        for fpath, rec in data['files'].items():
            fr = rel(fpath)
            if fr not in by_file:
                by_file[fr] = {
                    'killed': 0,
                    'survived': 0,
                    'timeout': 0,
                    'error': 0,
                    'nocov': 0,
                    'batches': [],
                }
            entry = by_file[fr]
            if batch_name not in entry['batches']:
                entry['batches'].append(batch_name)

            for m in rec.get('mutants', []):
                b_mut += 1
                st = m['status']
                key = st.lower().replace('runtimeerror', 'error')
                if key == 'killed':
                    entry['killed'] += 1
                    b_killed += 1
                elif key == 'survived':
                    entry['survived'] += 1
                    b_surv += 1
                elif key == 'timeout':
                    entry['timeout'] += 1
                    b_timeout += 1
                elif key == 'error':
                    entry['error'] += 1
                    b_error += 1
                elif key == 'nocoverage':
                    entry['nocov'] += 1
                    b_nocov += 1

        denom = b_killed + b_surv + b_nocov
        score = 100 * b_killed / denom if denom else 0.0
        by_batch.append({
            'batch': batch_name,
            'files': len(data.get('files', {})),
            'mutants': b_mut,
            'killed': b_killed,
            'survived': b_surv,
            'timeout': b_timeout,
            'error': b_error,
            'nocov': b_nocov,
            'score': round(score, 2),
        })
        for k, v in [
            ('mutants', b_mut),
            ('killed', b_killed),
            ('survived', b_surv),
            ('timeout', b_timeout),
            ('error', b_error),
            ('nocov', b_nocov),
        ]:
            totals[k] += v

    denom = totals['killed'] + totals['survived'] + totals['nocov']
    overall_score = 100 * totals['killed'] / denom if denom else 0.0

    file_rows = []
    for fr, e in by_file.items():
        d = e['killed'] + e['survived'] + e['nocov']
        sc = 100 * e['killed'] / d if d else 0.0
        file_rows.append({
            'file': fr,
            'score': round(sc, 2),
            **{k: e[k] for k in ('killed', 'survived', 'timeout', 'error', 'nocov')},
            'batches': e['batches'],
        })
    file_rows.sort(key=lambda r: (r['score'], -r['survived']))

    return {
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'batchCount': len(batches),
        'fileCount': len(by_file),
        'overall': {
            **dict(totals),
            'score': round(overall_score, 2),
        },
        'batches': by_batch,
        'files': file_rows,
        'weakestFiles': [r for r in file_rows if r['survived'] >= 20][:15],
        'strongestFiles': sorted(
            [r for r in file_rows if r['killed'] >= 10],
            key=lambda r: -r['score'],
        )[:15],
    }


def write_markdown(rollup: dict, path: Path) -> None:
    o = rollup['overall']
    lines = [
        '# Stryker rollup — overall mutation testing snapshot',
        '',
        f"Generated: {rollup['generatedAt']}",
        '',
        '## Overall (all completed batches)',
        '',
        '| Metric | Value |',
        '| --- | ---: |',
        f"| Batches | {rollup['batchCount']} |",
        f"| Source files mutated | {rollup['fileCount']} |",
        f"| Mutants | {o['mutants']} |",
        f"| Killed | {o['killed']} |",
        f"| Survived | {o['survived']} |",
        f"| Timeout (counted killed in score) | {o['timeout']} |",
        f"| Error | {o['error']} |",
        f"| No coverage | {o['nocov']} |",
        f"| **Mutation score** | **{o['score']}%** |",
        '',
        'Score formula: `killed / (killed + survived + no coverage)`.',
        'Timeouts and errors are excluded from the denominator.',
        '',
        '## Per batch',
        '',
        '| Batch | Files | Mutants | Score | Killed | Survived | Errors |',
        '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
    ]
    for b in rollup['batches']:
        lines.append(
            f"| `{b['batch']}` | {b['files']} | {b['mutants']} | {b['score']}% | "
            f"{b['killed']} | {b['survived']} | {b['error']} |"
        )
    lines.extend([
        '',
        '## Weakest files (≥20 survivors)',
        '',
        '| File | Score | Survived | Killed |',
        '| --- | ---: | ---: | ---: |',
    ])
    for r in rollup['weakestFiles']:
        lines.append(
            f"| `{r['file']}` | {r['score']}% | {r['survived']} | {r['killed']} |"
        )
    lines.extend([
        '',
        'Re-run after new batches:',
        '`python3 tests/scripts/rollup-stryker-batches.py`',
        '',
        'Triage survivors: `tests/STRYKER_TRIAGE.md`',
        '',
    ])
    path.write_text('\n'.join(lines))


def main() -> int:
    batches = load_batches()
    if not batches:
        print('No batch-*.json files in reports/mutation/')
        return 1
    rollup = aggregate(batches)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    json_path = REPORT_DIR / 'rollup.json'
    md_path = REPORT_DIR / 'ROLLUP.md'
    with open(json_path, 'w') as f:
        json.dump(rollup, f, indent=2)
    write_markdown(rollup, md_path)
    o = rollup['overall']
    print(
        f"Rollup: {rollup['batchCount']} batches, {rollup['fileCount']} files, "
        f"{o['mutants']} mutants, score {o['score']}% "
        f"({o['killed']} killed, {o['survived']} survived, {o['error']} errors)"
    )
    print(f'Wrote {json_path} and {md_path}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
