import {
  CA_PANEL_DRAG_MIME,
  encodePanelDragPayload,
  decodePanelDragPayload,
  parseDragDataTransfer,
  parseDragDataTransferForDrop,
} from '../../../src/pages/CohortAnalyzer/store/panelDnD';

describe('panel drag payload', () => {
  it('should encode and decode known panel kinds', () => {
    expect(decodePanelDragPayload(encodePanelDragPayload({ kind: 'venn' }))).toEqual({
      kind: 'venn',
      dataset: null,
    });
    expect(decodePanelDragPayload(encodePanelDragPayload({ kind: 'survival' }))).toEqual({
      kind: 'survival',
      dataset: null,
    });
    expect(decodePanelDragPayload(encodePanelDragPayload({ kind: 'histogram', dataset: 'race' }))).toEqual({
      kind: 'histogram',
      dataset: 'race',
    });
    expect(decodePanelDragPayload('')).toBe(null);
    expect(decodePanelDragPayload(12)).toBe(null);
    expect(decodePanelDragPayload('{')).toBe(null);
    expect(decodePanelDragPayload('[]')).toBe(null);
    expect(decodePanelDragPayload(JSON.stringify({ kind: 'histogram' }))).toBe(null);
    expect(decodePanelDragPayload(JSON.stringify({ kind: 'other' }))).toBe(null);
  });

  it('should parse live and drop transfers including legacy text', () => {
    expect(parseDragDataTransfer(null)).toBe(null);
    expect(parseDragDataTransferForDrop(null)).toBe(null);

    const mime = {
      getData: (type) => (type === CA_PANEL_DRAG_MIME ? encodePanelDragPayload({ kind: 'venn' }) : ''),
      types: [CA_PANEL_DRAG_MIME],
    };
    expect(parseDragDataTransfer(mime).kind).toBe('venn');

    const plainVenn = {
      getData: (type) => (type === 'text/plain' ? 'venn' : ''),
      types: ['text/plain'],
    };
    expect(parseDragDataTransfer(plainVenn).kind).toBe('venn');

    const histogram = {
      getData: (type) => (type === 'text/plain' ? 'sexAtBirth' : ''),
      types: ['text/plain'],
    };
    expect(parseDragDataTransfer(histogram)).toEqual({ kind: 'histogram', dataset: 'sexAtBirth' });

    const jsonText = {
      getData: (type) => (type === 'text/plain' ? '{"kind":"venn"}' : ''),
      types: ['text/plain'],
    };
    expect(parseDragDataTransfer(jsonText)).toBe(null);

    const dropTypes = {
      getData: (type) => {
        if (type === CA_PANEL_DRAG_MIME) return '';
        if (type === 'text/plain') return '';
        if (type === 'Files') throw new Error('denied');
        if (type === 'application/json') return encodePanelDragPayload({ kind: 'survival' });
        return '';
      },
      types: ['Files', 'application/json'],
    };
    expect(parseDragDataTransferForDrop(dropTypes).kind).toBe('survival');

    const dropPlain = {
      getData: (type) => (type === 'custom' ? ' survival ' : ''),
      types: [null, 'custom'],
    };
    expect(parseDragDataTransferForDrop(dropPlain).kind).toBe('survival');

    const emptyDrop = {
      getData: () => '',
      types: ['unused'],
    };
    expect(parseDragDataTransferForDrop(emptyDrop)).toBe(null);

    const throwing = {
      getData: () => {
        throw new Error('blocked');
      },
      types: ['custom'],
    };
    expect(() => parseDragDataTransfer(throwing)).toThrow('blocked');

    const throwInDropLoop = {
      getData: (type) => {
        if (type === CA_PANEL_DRAG_MIME || type === 'text/plain') return '';
        throw new Error('blocked');
      },
      types: ['custom'],
    };
    expect(parseDragDataTransferForDrop(throwInDropLoop)).toBe(null);
  });
});
