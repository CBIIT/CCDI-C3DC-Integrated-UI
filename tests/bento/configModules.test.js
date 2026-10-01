/**
 * Loads bento config modules that the app imports only from routed pages,
 * and executes their formatters, download helper, and toolbar renderers.
 */

jest.mock('../../src/pages/cart/customComponent/exportButton/exportButtonController', () => () => <button type="button">export</button>);
jest.mock('../../src/pages/cart/customComponent/userGuideButton/linkButton', () => () => <button type="button">guide</button>);

import React from 'react';
import { render } from '@testing-library/react';
import * as dashboardTabData from '../../src/bento/dashboardTabData';
import * as studiesData from '../../src/bento/studiesData';
import * as localSearchData from '../../src/bento/localSearchData';
import * as jbrowseDetailData from '../../src/bento/jbrowseDetailData';
import * as fileCentric from '../../src/bento/fileCentricCartWorkflowData';
import * as globalHeaderData from '../../src/bento/globalHeaderData';

function walkFormatters(node, visit, seen = new Set()) {
  if (!node || typeof node !== 'object' || seen.has(node) || node.$$typeof) return;
  seen.add(node);
  if (typeof node.dataFormatter === 'function') visit(node.dataFormatter);
  if (typeof node.customViewElem === 'function') visit(node.customViewElem);
  Object.keys(node).forEach((key) => {
    const value = node[key];
    if (Array.isArray(value)) value.forEach((item) => walkFormatters(item, visit, seen));
    else if (value && typeof value === 'object') walkFormatters(value, visit, seen);
  });
}

describe('bento config modules', () => {
  it('should evaluate dashboard tab queries and column formatters', () => {
    expect(dashboardTabData.exploreParticipantsTabs.length).toBeGreaterThan(0);
    expect(dashboardTabData.exploreFilesTabs.length).toBeGreaterThan(0);
    expect(dashboardTabData.GET_PARTICIPANTS_OVERVIEW_QUERY).toBeDefined();

    const samples = [
      [],
      ['A', null, ' B '],
      null,
      '',
      -999,
      '-999',
      'plain',
      '[Complete Response]',
      '[]',
      'White, Asian',
      ['[Complete Response]', ''],
      12,
    ];

    walkFormatters(dashboardTabData, (formatter) => {
      samples.forEach((sample) => {
        formatter(sample);
      });
    });
  });

  it('should download a study manifest and render availability cells', async () => {
    const createObjectURL = jest.fn(() => 'blob:manifest');
    const revokeObjectURL = jest.fn();
    window.URL.createObjectURL = createObjectURL;
    window.URL.revokeObjectURL = revokeObjectURL;
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, blob: () => Promise.resolve(new Blob(['x'])) })
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockRejectedValueOnce(new Error('network'));

    await studiesData.openDoubleLink('https://example.com/a.xlsx', 'a.xlsx');
    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:manifest');

    await studiesData.openDoubleLink('https://example.com/missing.xlsx', 'missing.xlsx');
    expect(warn).toHaveBeenCalled();

    await studiesData.openDoubleLink('https://example.com/bad.xlsx', 'bad.xlsx');
    expect(error).toHaveBeenCalled();

    const availability = studiesData.table.columns.find((column) => column.customColHeaderRender);
    render(availability.customColHeaderRender());
    render(availability.customCellRender({ row: {} }));
    expect(studiesData.GET_STUDIES_DATA_QUERY).toBeDefined();
    expect(studiesData.studyDownloadLinks.phs000463).toContain('phs000463');

    warn.mockRestore();
    error.mockRestore();
  });

  it('should expose local search, jbrowse, cart, and header config', () => {
    expect(localSearchData.GET_IDS_BY_TYPE().kind || localSearchData.GET_IDS_BY_TYPE().definitions).toBeDefined();
    expect(localSearchData.ageAtIndex).toBe(10);
    expect(localSearchData.widgetsSearchData.length).toBeGreaterThan(0);
    expect(jbrowseDetailData.caseIDField).toBe('subject_id');
    expect(jbrowseDetailData.jBrowseOptions.jBrowse).toBe(true);
    expect(jbrowseDetailData.GET_JBROWSE_DETAIL_DATA_QUERY).toBeDefined();
    expect(globalHeaderData.navbarSublists.About[1].link).toContain('faqs');
    expect(fileCentric.maximumNumberOfFilesAllowedInTheCart).toBe(200000);

    const elements = [];
    walkFormatters(fileCentric.myFilesPageData, (formatter) => {
      elements.push(formatter({ label: 'cart' }));
    });
    expect(elements.length).toBeGreaterThan(0);
    render(<div>{elements}</div>);
  });
});
