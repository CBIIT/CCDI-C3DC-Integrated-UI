import {
  applyStudiesTableLayout,
  resetStudiesTableColumnWidths,
  syncStudiesTableHeaderPadding,
} from '../../../src/pages/studies/studiesTableLayout';

function setSplitStyles(element) {
  [
    'display',
    'width',
    'height',
    'max-height',
    'min-width',
    'overflow',
    'overflow-x',
    'overflow-y',
    'table-layout',
    'max-width',
    'box-sizing',
  ].forEach((property) => element.style.setProperty(property, '10px'));
}

function createTableContainer() {
  const container = document.createElement('div');
  container.innerHTML = `
    <table class="MuiTable-root">
      <thead class="MuiTableHead-root">
        <tr><th class="MuiTableCell-head">Study</th></tr>
      </thead>
      <tbody class="MuiTableBody-root">
        <tr class="MuiTableRow-root"><td>phs001</td></tr>
      </tbody>
    </table>
  `;
  container.querySelectorAll('*').forEach(setSplitStyles);
  return container;
}

describe('studiesTableLayout', () => {
  describe('applyStudiesTableLayout', () => {
    it('should remove split-table sizing and configure scrolling on the container', () => {
      const container = createTableContainer();

      applyStudiesTableLayout(container);

      expect(container.style.getPropertyValue('flex')).toBe('0 0 auto');
      expect(container.style.getPropertyValue('min-height')).toBe('0');
      expect(container.style.getPropertyValue('overflow-x')).toBe('auto');
      expect(container.style.getPropertyValue('overflow-y')).toBe('visible');
      expect(container.style.getPropertyValue('height')).toBe('');
      expect(container.querySelector('.MuiTable-root').style.display).toBe('');
      expect(container.querySelector('.MuiTableHead-root').style.width).toBe('');
      expect(container.querySelector('.MuiTableCell-head').style.maxWidth).toBe('');
      expect(container.querySelector('.MuiTableBody-root').style.overflowY).toBe('');
      expect(container.querySelector('.MuiTableRow-root').style.tableLayout).toBe('');
      expect(container.querySelector('td').style.boxSizing).toBe('');
    });

    it('should tolerate a missing container and partial table markup', () => {
      expect(() => applyStudiesTableLayout(undefined)).not.toThrow();

      const container = document.createElement('div');
      expect(() => applyStudiesTableLayout(container)).not.toThrow();
      expect(container.style.getPropertyValue('overflow-x')).toBe('auto');
    });
  });

  describe('syncStudiesTableHeaderPadding', () => {
    it('should add padding for a vertical scrollbar', () => {
      const container = createTableContainer();
      Object.defineProperty(container, 'offsetWidth', { value: 500 });
      Object.defineProperty(container, 'clientWidth', { value: 480 });

      syncStudiesTableHeaderPadding(container);

      expect(
        container.querySelector('.MuiTableHead-root').style.paddingRight,
      ).toBe('20px');
    });

    it('should remove padding when no vertical scrollbar exists', () => {
      const container = createTableContainer();
      Object.defineProperty(container, 'offsetWidth', { value: 500 });
      Object.defineProperty(container, 'clientWidth', { value: 500 });

      syncStudiesTableHeaderPadding(container);

      expect(
        container.querySelector('.MuiTableHead-root').style.paddingRight,
      ).toBe('0px');
    });

    it('should tolerate missing containers and table headers', () => {
      expect(() => syncStudiesTableHeaderPadding(undefined)).not.toThrow();
      expect(() => syncStudiesTableHeaderPadding(document.createElement('div'))).not.toThrow();
    });
  });

  it('should expose a safe column-width reset hook', () => {
    expect(resetStudiesTableColumnWidths()).toBeUndefined();
  });
});
