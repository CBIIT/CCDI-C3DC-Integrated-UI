import {
  measureDragCardElement,
  requiresCompactSpacing,
  chunkIntoStripRows,
  buildStripRowGridTemplateColumns,
  resolveStripRowTrackWidths,
  getStripRowMaxPanelWidth,
  getStripRowPinnedPanelId,
} from '../../../HistogramPanel/utils/histogramLayoutUtils';
import { HISTOGRAM_CARD_MIN_WIDTH } from '../../../HistogramPanel/histogramConstants';

describe('histogramLayoutUtils', () => {
  describe('measureDragCardElement', () => {
    it('returns null for missing element', () => {
      expect(measureDragCardElement(null)).toBeNull();
    });

    it('returns null when rect is too small', () => {
      const el = { getBoundingClientRect: () => ({ width: 4, height: 4 }) };
      expect(measureDragCardElement(el)).toBeNull();
    });

    it('returns rounded dimensions', () => {
      const el = { getBoundingClientRect: () => ({ width: 100.6, height: 200.4 }) };
      expect(measureDragCardElement(el)).toEqual({ width: 101, height: 200 });
    });
  });

  describe('requiresCompactSpacing', () => {
    it('returns true for race, treatmentType, response', () => {
      expect(requiresCompactSpacing('race')).toBe(true);
      expect(requiresCompactSpacing('treatmentType')).toBe(true);
      expect(requiresCompactSpacing('response')).toBe(true);
      expect(requiresCompactSpacing('sexAtBirth')).toBe(true);
    });
  });

  describe('chunkIntoStripRows', () => {
    it('splits panel ids into rows of three', () => {
      expect(chunkIntoStripRows(['a', 'b', 'c', 'd', 'e'])).toEqual([
        ['a', 'b', 'c'],
        ['d', 'e'],
      ]);
    });

    it('returns empty array for empty input', () => {
      expect(chunkIntoStripRows([])).toEqual([]);
    });
  });

  describe('getStripRowPinnedPanelId', () => {
    it('returns the most recent pin that belongs to the row', () => {
      expect(getStripRowPinnedPanelId(['a', 'b', 'c'], ['a', 'b'])).toBe('b');
      expect(getStripRowPinnedPanelId(['d', 'e'], ['a', 'b', 'd'])).toBe('d');
    });
  });

  describe('getStripRowMaxPanelWidth', () => {
    it('reserves min width for sibling panels', () => {
      expect(getStripRowMaxPanelWidth(900, 3)).toBe(872 - HISTOGRAM_CARD_MIN_WIDTH * 2);
    });
  });

  describe('resolveStripRowTrackWidths', () => {
    it('returns null when no explicit widths are stored', () => {
      expect(
        resolveStripRowTrackWidths(['a', 'b', 'c'], () => null, 900),
      ).toBeNull();
    });

    it('scales explicit widths down to fit the row', () => {
      const widths = resolveStripRowTrackWidths(
        ['a', 'b', 'c'],
        (id) => (id === 'a' ? 700 : null),
        900,
      );
      expect(widths).not.toBeNull();
      const sum = widths.reduce((a, b) => a + b, 0);
      expect(sum).toBeLessThanOrEqual(900 - 28);
      widths.forEach((w) => {
        expect(w).toBeGreaterThanOrEqual(HISTOGRAM_CARD_MIN_WIDTH);
      });
    });
  });

  describe('buildStripRowGridTemplateColumns', () => {
    it('uses equal fr tracks when no pin is set', () => {
      const template = buildStripRowGridTemplateColumns(
        ['a', 'b', 'c'],
        (id) => (id === 'a' ? 420 : null),
        900,
      );
      expect(template).toBe('repeat(3, minmax(0, 1fr))');
    });

    it('uses fixed px for pinned panel and flex for siblings', () => {
      const template = buildStripRowGridTemplateColumns(
        ['a', 'b', 'c'],
        (id) => (id === 'b' ? 420 : null),
        900,
        null,
        'b',
      );
      const maxW = getStripRowMaxPanelWidth(900, 3);
      expect(template).toBe(
        `minmax(${HISTOGRAM_CARD_MIN_WIDTH}px, 1fr) ${maxW}px minmax(${HISTOGRAM_CARD_MIN_WIDTH}px, 1fr)`,
      );
    });

    it('uses fixed px + stable 1fr tracks during an active resize drag', () => {
      const template = buildStripRowGridTemplateColumns(
        ['a', 'b', 'c'],
        () => null,
        0,
        { panelId: 'b', widthPx: 415.7 },
      );
      expect(template).toBe(
        `minmax(${HISTOGRAM_CARD_MIN_WIDTH}px, 1fr) 415.7px minmax(${HISTOGRAM_CARD_MIN_WIDTH}px, 1fr)`,
      );
    });
  });
});
