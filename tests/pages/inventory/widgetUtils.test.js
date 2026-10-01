jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-key'),
}));

import { formatWidgetData } from '../../../src/pages/inventory/widget/WidgetUtils';

describe('WidgetUtils — formatWidgetData', () => {
  it('should remove donut slices with zero subjects', () => {
    const out = formatWidgetData(
      {
        myWidget: [
          { group: 'A', subjects: 2 },
          { group: 'B', subjects: 0 },
        ],
      },
      [{ type: 'donut', dataName: 'myWidget' }],
    );
    expect(out.myWidget).toEqual([{ group: 'A', subjects: 2 }]);
  });

  it('should treat missing donut data as empty', () => {
    const out = formatWidgetData({}, [{ type: 'donut', dataName: 'missing' }]);
    expect(out.missing).toEqual([]);
  });

  it('should build a nested sunburst tree', () => {
    const out = formatWidgetData(
      {
        armsByPrograms: [
          {
            program: 'ProgA',
            children: [
              { arm: 'Arm1', caseSize: 3 },
              { arm: 'Arm2', caseSize: 7 },
            ],
          },
        ],
      },
      [{
        type: 'sunburst',
        dataName: 'armsByPrograms',
        datatable_level1_field: 'program',
        datatable_level2_field: 'arm',
      }],
    );
    expect(out.armsByPrograms.key).toBe('test-uuid-key');
    expect(out.armsByPrograms.children[0].title).toBe('ProgA');
    expect(out.armsByPrograms.children[0].children[0].title).toBe('ProgA : Arm1');
  });
});
