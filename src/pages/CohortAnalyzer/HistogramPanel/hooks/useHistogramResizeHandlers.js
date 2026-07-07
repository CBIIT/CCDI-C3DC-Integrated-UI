import { useCallback } from 'react';
import { setPanelSize, setStripResizePin } from '../../store/cohortAnalyzerLayoutActions';
import {
  CA_SURVIVAL_CARD_MIN_WIDTH as SURVIVAL_CARD_MIN_WIDTH,
  CA_SURVIVAL_CARD_MAX_WIDTH as SURVIVAL_CARD_MAX_WIDTH,
  CA_SURVIVAL_CARD_MIN_HEIGHT as SURVIVAL_CARD_MIN_HEIGHT,
  CA_SURVIVAL_CARD_MAX_HEIGHT as SURVIVAL_CARD_MAX_HEIGHT,
} from '../../store/cohortAnalyzerLayoutConstants';
import {
  HISTOGRAM_CARD_CHROME_HEIGHT,
  HISTOGRAM_CARD_MIN_WIDTH,
  HISTOGRAM_CARD_MAX_WIDTH,
  HISTOGRAM_PLOT_MIN_HEIGHT,
  HISTOGRAM_PLOT_MAX_HEIGHT,
} from '../histogramConstants';
import { clampSurvivalPanelSize } from '../../store/cohortAnalyzerLayoutReducer';
import {
  getStripRowMaxPanelWidth,
  readStripRowPanelIdsFromElement,
} from '../utils/histogramLayoutUtils';

function scheduleStripResizeFrame(onFrame) {
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(onFrame);
  }
  return setTimeout(onFrame, 16);
}

function cancelStripResizeFrame(id) {
  if (typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(id);
    return;
  }
  clearTimeout(id);
}

/**
 * Drag-to-resize handlers for histogram strip cards and survival card.
 *
 * When {@link besideHistogramDataset} matches, the docked-beside-Venn shell is driven by
 * survival dimensions ({@link HistogramBesideVennHistogramPortal}); we mirror the drag into
 * survival size so the grip stays effective after flex wrap / column layout changes.
 */
export function useHistogramResizeHandlers({
  allInputsEmpty,
  histogramCardSizes,
  setHistogramCardSizes,
  survivalCardSize,
  setSurvivalCardSize,
  dispatch,
  defaultPlotHeightPx,
  besideHistogramDataset = null,
  setStripResizeSession = null,
}) {
  const handleHistogramCardResizeStart = useCallback((e, dataset) => {
    if (allInputsEmpty) return;
    e.preventDefault();
    e.stopPropagation();
    const card =
      (typeof e.currentTarget.closest === 'function'
        && e.currentTarget.closest('[data-ca-histogram-strip-dataset]'))
      || e.currentTarget.parentElement;
    if (!card) return;
    const rowEl =
      typeof card.closest === 'function' ? card.closest('[data-ca-strip-row]') : null;
    const rowRect = rowEl && typeof rowEl.getBoundingClientRect === 'function'
      ? rowEl.getBoundingClientRect()
      : null;
    const rowPanelCount = rowEl && typeof rowEl.querySelectorAll === 'function'
      ? rowEl.querySelectorAll('[data-ca-histogram-strip-dataset]').length
      : 3;
    const rowMaxW = rowRect
      ? getStripRowMaxPanelWidth(rowRect.width, rowPanelCount)
      : (typeof window !== 'undefined' ? window.innerWidth - 24 : HISTOGRAM_CARD_MAX_WIDTH);
    const rect = card.getBoundingClientRect();
    const current = histogramCardSizes[dataset];
    const startWidth = current && current.width != null ? current.width : rect.width;
    const startPlot = current && current.plotHeight != null ? current.plotHeight : defaultPlotHeightPx;
    const maxW = typeof window !== 'undefined'
      ? Math.min(HISTOGRAM_CARD_MAX_WIDTH, rowMaxW, window.innerWidth - 24)
      : Math.min(HISTOGRAM_CARD_MAX_WIDTH, rowMaxW);
    const startX = e.clientX;
    const startY = e.clientY;

    document.body.style.userSelect = 'none';

    const syncSurvivalShell =
      besideHistogramDataset != null && dataset === besideHistogramDataset;

    let lastW;
    let lastPh;
    let frameId = null;
    let pendingMove = null;

    const applyFrame = () => {
      frameId = null;
      const moveEvent = pendingMove;
      pendingMove = null;
      if (!moveEvent) return;

      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const w = Math.min(maxW, Math.max(HISTOGRAM_CARD_MIN_WIDTH, startWidth + dx));
      const ph = Math.min(
        HISTOGRAM_PLOT_MAX_HEIGHT,
        Math.max(HISTOGRAM_PLOT_MIN_HEIGHT, startPlot + dy),
      );
      lastW = Math.round(w);
      lastPh = Math.round(ph);

      if (typeof setStripResizeSession === 'function') {
        setStripResizeSession({
          panelId: dataset,
          widthPx: w,
          plotHeightPx: ph,
        });
      }

      if (syncSurvivalShell) {
        const outerH = ph + HISTOGRAM_CARD_CHROME_HEIGHT;
        setSurvivalCardSize((prev) =>
          clampSurvivalPanelSize({ ...(prev || {}), width: Math.round(w), height: outerH }),
        );
      }
    };

    const onMove = (moveEvent) => {
      pendingMove = moveEvent;
      if (frameId != null) return;
      frameId = scheduleStripResizeFrame(applyFrame);
    };

    const onUp = () => {
      if (frameId != null) {
        cancelStripResizeFrame(frameId);
        frameId = null;
        applyFrame();
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
      if (typeof setStripResizeSession === 'function') {
        setStripResizeSession(null);
      }
      if (lastW != null && lastPh != null) {
        let rowPanelIds = readStripRowPanelIdsFromElement(rowEl);
        if (rowPanelIds.length === 0) {
          rowPanelIds = [dataset];
        }
        setHistogramCardSizes((prev) => ({
          ...prev,
          [dataset]: { width: lastW, plotHeight: lastPh },
        }));
        dispatch(setStripResizePin({ panelId: dataset, rowPanelIds }));
        dispatch(setPanelSize({
          panel: 'histogram',
          dataset,
          size: { width: lastW, plotHeight: lastPh },
        }));
        if (syncSurvivalShell) {
          const outerH = lastPh + HISTOGRAM_CARD_CHROME_HEIGHT;
          dispatch(
            setPanelSize({
              panel: 'survival',
              size: clampSurvivalPanelSize({ width: lastW, height: outerH }),
            }),
          );
        }
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [
    allInputsEmpty,
    histogramCardSizes,
    setHistogramCardSizes,
    setSurvivalCardSize,
    dispatch,
    defaultPlotHeightPx,
    besideHistogramDataset,
    setStripResizeSession,
  ]);

  const handleSurvivalCardResizeStart = useCallback((e, options = {}) => {
    const { fillColumnWidth = false } = options;
    if (allInputsEmpty) return;
    e.preventDefault();
    e.stopPropagation();
    const card = e.currentTarget.parentElement;
    if (!card) return;
    const rowEl =
      typeof card.closest === 'function' ? card.closest('[data-ca-strip-row]') : null;
    const rowRect = rowEl && typeof rowEl.getBoundingClientRect === 'function'
      ? rowEl.getBoundingClientRect()
      : null;
    const rowPanelCount = rowEl && typeof rowEl.querySelectorAll === 'function'
      ? rowEl.querySelectorAll('[data-ca-histogram-strip-dataset]').length
      : 1;
    const rowMaxW = rowRect
      ? getStripRowMaxPanelWidth(rowRect.width, rowPanelCount)
      : (typeof window !== 'undefined' ? window.innerWidth - 24 : SURVIVAL_CARD_MAX_WIDTH);
    const rect = card.getBoundingClientRect();
    const startWidth = Math.max(
      SURVIVAL_CARD_MIN_WIDTH,
      survivalCardSize && survivalCardSize.width != null ? survivalCardSize.width : rect.width,
    );
    const startHeight = Math.max(
      SURVIVAL_CARD_MIN_HEIGHT,
      survivalCardSize && survivalCardSize.height != null ? survivalCardSize.height : rect.height,
    );
    const maxW = typeof window !== 'undefined'
      ? Math.max(
        SURVIVAL_CARD_MIN_WIDTH,
        Math.min(SURVIVAL_CARD_MAX_WIDTH, rowMaxW, window.innerWidth - 24),
      )
      : Math.min(SURVIVAL_CARD_MAX_WIDTH, rowMaxW);
    const startX = e.clientX;
    const startY = e.clientY;

    document.body.style.userSelect = 'none';

    let lastSurvivalW;
    let lastSurvivalH;
    let frameId = null;
    let pendingMove = null;

    const applyFrame = () => {
      frameId = null;
      const moveEvent = pendingMove;
      pendingMove = null;
      if (!moveEvent) return;

      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const h = Math.min(
        SURVIVAL_CARD_MAX_HEIGHT,
        Math.max(SURVIVAL_CARD_MIN_HEIGHT, startHeight + dy),
      );
      lastSurvivalH = Math.round(h);

      if (fillColumnWidth) {
        setSurvivalCardSize((prev) => ({ ...(prev || {}), height: lastSurvivalH }));
        return;
      }

      const w = Math.min(maxW, Math.max(SURVIVAL_CARD_MIN_WIDTH, startWidth + dx));
      lastSurvivalW = Math.round(w);

      if (typeof setStripResizeSession === 'function') {
        setStripResizeSession({
          panelId: 'survivalAnalysis',
          widthPx: w,
          plotHeightPx: null,
        });
      }
      setSurvivalCardSize({ width: lastSurvivalW, height: lastSurvivalH });
    };

    const onMove = (moveEvent) => {
      pendingMove = moveEvent;
      if (frameId != null) return;
      frameId = scheduleStripResizeFrame(applyFrame);
    };

    const onUp = () => {
      if (frameId != null) {
        cancelStripResizeFrame(frameId);
        frameId = null;
        applyFrame();
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
      if (typeof setStripResizeSession === 'function') {
        setStripResizeSession(null);
      }
      if (fillColumnWidth) {
        const hToSave = lastSurvivalH != null ? lastSurvivalH : startHeight;
        const wPx = Math.round(card.getBoundingClientRect().width);
        dispatch(
          setPanelSize({
            panel: 'survival',
            size: { width: wPx, height: hToSave },
          }),
        );
        return;
      }
      if (lastSurvivalW != null && lastSurvivalH != null) {
        let rowPanelIds = readStripRowPanelIdsFromElement(rowEl);
        if (rowPanelIds.length === 0) {
          rowPanelIds = ['survivalAnalysis'];
        }
        dispatch(setStripResizePin({ panelId: 'survivalAnalysis', rowPanelIds }));
        dispatch(
          setPanelSize({
            panel: 'survival',
            size: { width: lastSurvivalW, height: lastSurvivalH },
          }),
        );
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [allInputsEmpty, survivalCardSize, setSurvivalCardSize, dispatch, setStripResizeSession]);

  return { handleHistogramCardResizeStart, handleSurvivalCardResizeStart };
}
