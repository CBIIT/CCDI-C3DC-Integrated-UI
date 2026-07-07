import { HISTOGRAM_CARD_MIN_WIDTH } from '../histogramConstants';

/** Default number of chart cards per strip row (matches legacy ChartWrapper 1/3 width). */
export const HISTOGRAM_STRIP_COLUMNS_PER_ROW = 3;

/**
 * Split ordered strip panel ids into fixed-width rows for grid layout.
 */
export function chunkIntoStripRows(
  panelIds,
  columnsPerRow = HISTOGRAM_STRIP_COLUMNS_PER_ROW,
) {
  if (!Array.isArray(panelIds) || panelIds.length === 0) return [];
  const cols = Math.max(1, columnsPerRow);
  const rows = [];
  for (let i = 0; i < panelIds.length; i += cols) {
    rows.push(panelIds.slice(i, i + cols));
  }
  return rows;
}

export const HISTOGRAM_STRIP_ROW_GAP_PX = 14;

/**
 * Max width a single panel may occupy so every sibling can still meet minWidth.
 */
export function getStripRowMaxPanelWidth(
  rowWidthPx,
  panelCount,
  minWidthPx = HISTOGRAM_CARD_MIN_WIDTH,
  gapPx = HISTOGRAM_STRIP_ROW_GAP_PX,
) {
  const n = Math.max(1, panelCount);
  const gaps = Math.max(0, n - 1) * gapPx;
  const available = Math.max(0, Math.round(rowWidthPx - gaps));
  return Math.max(minWidthPx, available - minWidthPx * (n - 1));
}

/**
 * Resolve per-panel track widths (px) that fit inside the row, honoring stored
 * sizes proportionally while enforcing HISTOGRAM_CARD_MIN_WIDTH on every column.
 */
export function resolveStripRowTrackWidths(
  rowPanelIds,
  getWidthForPanel,
  rowWidthPx,
  {
    gapPx = HISTOGRAM_STRIP_ROW_GAP_PX,
    minWidthPx = HISTOGRAM_CARD_MIN_WIDTH,
  } = {},
) {
  const n = rowPanelIds.length;
  if (n === 0) return [];

  const gaps = Math.max(0, n - 1) * gapPx;
  const available = Math.max(0, Math.round(rowWidthPx - gaps));
  if (available <= 0) {
    return rowPanelIds.map(() => minWidthPx);
  }

  const equalShare = available / n;
  const hasExplicit = rowPanelIds.some((id) => {
    const w = getWidthForPanel(id);
    return w != null && Number.isFinite(Number(w));
  });

  if (!hasExplicit) {
    return null;
  }

  const desired = rowPanelIds.map((id) => {
    const w = getWidthForPanel(id);
    return w != null && Number.isFinite(Number(w)) ? Math.round(Number(w)) : equalShare;
  });

  let widths = [...desired];
  const sum = widths.reduce((a, b) => a + b, 0);
  if (sum > available) {
    widths = widths.map((w) => (w / sum) * available);
  }

  for (let pass = 0; pass < n + 1; pass += 1) {
    const below = widths.map((w) => w < minWidthPx);
    if (!below.some(Boolean)) break;

    const next = widths.map((w, i) => (below[i] ? minWidthPx : w));
    const lockedSum = next.reduce((a, b) => a + b, 0);
    if (lockedSum > available) {
      const even = available / n;
      return rowPanelIds.map(() => even);
    }

    const flexIndices = next
      .map((_, i) => (!below[i] ? i : -1))
      .filter((i) => i >= 0);
    const flexRoom = available - lockedSum;
    const flexDesired = flexIndices.reduce((s, i) => s + desired[i], 0);

    flexIndices.forEach((i) => {
      next[i] = flexDesired > 0
        ? (desired[i] / flexDesired) * flexRoom
        : flexRoom / flexIndices.length;
    });
    widths = next;
  }

  return widths.map((w) => Math.round(w));
}

/**
 * Most recently resized panel in this row (last matching entry in stripResizePins).
 */
export function getStripRowPinnedPanelId(rowPanelIds, stripResizePins) {
  if (!Array.isArray(rowPanelIds) || rowPanelIds.length === 0) return null;
  if (!Array.isArray(stripResizePins) || stripResizePins.length === 0) return null;
  for (let i = stripResizePins.length - 1; i >= 0; i -= 1) {
    const id = stripResizePins[i];
    if (rowPanelIds.includes(id)) return id;
  }
  return null;
}

export function readStripRowPanelIdsFromElement(rowEl) {
  if (!rowEl || typeof rowEl.querySelectorAll !== 'function') return [];
  return Array.from(rowEl.querySelectorAll('[data-ca-histogram-strip-dataset]'))
    .map((el) => el.getAttribute('data-ca-histogram-strip-dataset'))
    .filter(Boolean);
}

/**
 * CSS grid-template-columns for one strip row. When rowWidthPx is known, stored
 * panel widths are normalized to fit; otherwise equal fr tracks are used.
 *
 * During an active resize drag, pass {@link activeResize} so only the dragged
 * column uses a fixed px track and siblings stay on stable 1fr — avoids
 * recomputing every column ratio on each mousemove (jitter).
 */
export function buildStripRowGridTemplateColumns(
  rowPanelIds,
  getWidthForPanel,
  rowWidthPx = 0,
  activeResize = null,
  pinnedPanelId = null,
) {
  if (!Array.isArray(rowPanelIds) || rowPanelIds.length === 0) return '1fr';

  const minTrack = 'minmax(0, 1fr)';
  const minFloor = HISTOGRAM_CARD_MIN_WIDTH;
  const flexTrack = `minmax(${minFloor}px, 1fr)`;

  if (
    activeResize &&
    activeResize.panelId &&
    rowPanelIds.includes(activeResize.panelId) &&
    activeResize.widthPx != null &&
    Number.isFinite(Number(activeResize.widthPx))
  ) {
    const w = Math.max(minFloor, Number(activeResize.widthPx));
    return rowPanelIds
      .map((id) => (id === activeResize.panelId ? `${w}px` : flexTrack))
      .join(' ');
  }

  if (
    pinnedPanelId &&
    rowPanelIds.includes(pinnedPanelId) &&
    typeof getWidthForPanel === 'function'
  ) {
    const stored = getWidthForPanel(pinnedPanelId);
    if (stored != null && Number.isFinite(Number(stored))) {
      const rowMax = rowWidthPx > 0
        ? getStripRowMaxPanelWidth(rowWidthPx, rowPanelIds.length)
        : Number(stored);
      const w = Math.max(minFloor, Math.min(Number(stored), rowMax));
      return rowPanelIds
        .map((id) => (id === pinnedPanelId ? `${Math.round(w)}px` : flexTrack))
        .join(' ');
    }
  }

  if (!rowWidthPx || rowWidthPx <= 0) {
    if (rowPanelIds.length === 1) return minTrack;
    return `repeat(${rowPanelIds.length}, ${minTrack})`;
  }

  if (rowPanelIds.length === 1) return minTrack;
  return `repeat(${rowPanelIds.length}, ${minTrack})`;
}

/** Inline styles so strip cards fill their grid cell instead of a fixed flex width. */
export const STRIP_GRID_CELL_CHART_STYLE = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  boxSizing: 'border-box',
};

/** Wrapper around each grid cell so cards shrink with the row instead of overflowing. */
export const STRIP_GRID_CELL_WRAPPER_STYLE = {
  position: 'relative',
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  overflow: 'hidden',
};

/**
 * Measure a dragged card for strip drop-slot sizing.
 */
export function measureDragCardElement(el) {
  if (!el || typeof el.getBoundingClientRect !== 'function') return null;
  const r = el.getBoundingClientRect();
  const width = Math.round(r.width);
  const height = Math.round(r.height);
  if (width < 8 || height < 8) return null;
  return { width, height };
}

export function requiresCompactSpacing(dataset) {
  return dataset === 'sexAtBirth' || dataset === 'race' || dataset === 'treatmentType' || dataset === 'response';
}

/**
 * Collapse the strip item being dragged so its slot is freed. Avoid display:none so native
 * drag + setDragImage stay reliable; drag image is captured in dragstart before this applies.
 */
export const HISTOGRAM_DRAG_SOURCE_COLLAPSED_STYLE = {
  width: 0,
  minWidth: 0,
  maxWidth: 0,
  flexGrow: 0,
  flexShrink: 1,
  flexBasis: 0,
  opacity: 0,
  overflow: 'hidden',
  margin: 0,
  padding: 0,
  border: 'none',
  pointerEvents: 'none',
  boxShadow: 'none',
  transition: 'none',
};

/**
 * Hide the native drag source while keeping its footprint so `vennSurvivalRow` does not
 * reflow (`flex-wrap: wrap`) into a stacked layout. Merge with explicit `width` / `height`
 * from the drag session (`besidePanelDragState`).
 */
export const BESIDE_TOP_ROW_DRAG_SOURCE_COLLAPSED_STYLE = {
  opacity: 0,
  visibility: 'hidden',
  overflow: 'hidden',
  pointerEvents: 'none',
  margin: 0,
  padding: 0,
  border: 'none',
  boxShadow: 'none',
  transition: 'none',
  flexShrink: 0,
};
