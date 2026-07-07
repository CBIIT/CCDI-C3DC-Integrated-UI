import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HistogramStripRow } from '../HistogramPanel.styled';
import { buildStripRowGridTemplateColumns, getStripRowPinnedPanelId } from '../utils/histogramLayoutUtils';

/**
 * Measures row width and builds a grid template that keeps all panels within the row.
 * During an active strip resize, freezes row-width observation and uses a stable
 * fixed-px + 1fr template so siblings do not jump on every mousemove.
 */
export function HistogramStripRowContainer({
  rowPanelIds,
  getStripPanelWidth,
  stripResizeSession = null,
  stripResizePins = [],
  children,
}) {
  const rowRef = useRef(null);
  const [rowWidth, setRowWidth] = useState(0);
  const stripResizeSessionRef = useRef(stripResizeSession);
  stripResizeSessionRef.current = stripResizeSession;

  const rowResizeActive = Boolean(
    stripResizeSession &&
    stripResizeSession.panelId &&
    rowPanelIds.includes(stripResizeSession.panelId),
  );

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return undefined;

    const measure = () => {
      if (stripResizeSessionRef.current) return;
      const w = el.getBoundingClientRect().width;
      setRowWidth((prev) => {
        const next = Number.isFinite(w) ? Math.round(w) : 0;
        return prev === next ? prev : next;
      });
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rowPanelIds.join('|')]);

  const resizePanelId = stripResizeSession ? stripResizeSession.panelId : null;
  const resizeWidthPx = stripResizeSession ? stripResizeSession.widthPx : null;
  const pinnedPanelId = rowResizeActive
    ? null
    : getStripRowPinnedPanelId(rowPanelIds, stripResizePins);

  const gridTemplate = useMemo(() => {
    if (rowResizeActive) {
      return buildStripRowGridTemplateColumns(
        rowPanelIds,
        getStripPanelWidth,
        0,
        stripResizeSession,
      );
    }
    return buildStripRowGridTemplateColumns(
      rowPanelIds,
      getStripPanelWidth,
      rowWidth,
      null,
      pinnedPanelId,
    );
  }, [
    rowPanelIds,
    rowWidth,
    getStripPanelWidth,
    rowResizeActive,
    resizePanelId,
    resizeWidthPx,
    stripResizeSession,
    pinnedPanelId,
  ]);

  return (
    <HistogramStripRow
      ref={rowRef}
      data-ca-strip-row
      $gridTemplate={gridTemplate}
      $isResizing={rowResizeActive}
    >
      {children}
    </HistogramStripRow>
  );
}
