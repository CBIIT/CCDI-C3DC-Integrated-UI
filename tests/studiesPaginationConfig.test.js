import { table } from '../src/bento/studiesData';

describe('studies table pagination configuration', () => {
  it('enables top pagination in extended view while retaining existing table config', () => {
    expect(table.extendedViewConfig.pagination).toBe(true);
    expect(table.extendedViewConfig.hasExport).toBe(false);
  });
});
