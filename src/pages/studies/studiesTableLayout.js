const clearSplitTableStyles = (tableContainer) => {
  const table = tableContainer.querySelector('.MuiTable-root');
  const thead = tableContainer.querySelector('.MuiTableHead-root');
  const tbody = tableContainer.querySelector('.MuiTableBody-root');

  if (table) {
    table.style.removeProperty('display');
    table.style.removeProperty('width');
    table.style.removeProperty('height');
    table.style.removeProperty('max-height');
    table.style.removeProperty('min-width');
    table.style.removeProperty('overflow');
  }

  if (thead) {
    thead.style.removeProperty('display');
    thead.style.removeProperty('width');
    thead.style.removeProperty('min-width');
    thead.style.removeProperty('table-layout');

    const headerCells = thead.querySelectorAll('.MuiTableCell-head');
    for (let i = 0; i < headerCells.length; i += 1) {
      headerCells[i].style.removeProperty('width');
      headerCells[i].style.removeProperty('min-width');
      headerCells[i].style.removeProperty('max-width');
      headerCells[i].style.removeProperty('box-sizing');
    }
  }

  if (tbody) {
    tbody.style.removeProperty('display');
    tbody.style.removeProperty('width');
    tbody.style.removeProperty('height');
    tbody.style.removeProperty('max-height');
    tbody.style.removeProperty('overflow-y');
    tbody.style.removeProperty('overflow-x');

    const bodyRows = tbody.querySelectorAll('.MuiTableRow-root');
    for (let r = 0; r < bodyRows.length; r += 1) {
      bodyRows[r].style.removeProperty('display');
      bodyRows[r].style.removeProperty('width');
      bodyRows[r].style.removeProperty('table-layout');
      bodyRows[r].style.removeProperty('min-width');

      const cells = bodyRows[r].querySelectorAll('td');
      for (let c = 0; c < cells.length; c += 1) {
        cells[c].style.removeProperty('width');
        cells[c].style.removeProperty('min-width');
        cells[c].style.removeProperty('max-width');
        cells[c].style.removeProperty('box-sizing');
      }
    }
  }
};

export const resetStudiesTableColumnWidths = () => {};

export const applyStudiesTableLayout = (tableContainer) => {
  if (!tableContainer) {
    return;
  }

  clearSplitTableStyles(tableContainer);

  tableContainer.style.setProperty('flex', '0 0 auto', 'important');
  tableContainer.style.setProperty('min-height', '0', 'important');
  tableContainer.style.setProperty('overflow-x', 'auto', 'important');
  tableContainer.style.setProperty('overflow-y', 'visible', 'important');
  tableContainer.style.removeProperty('height');
  tableContainer.style.removeProperty('max-height');
};

export const syncStudiesTableHeaderPadding = (tableContainer) => {
  if (!tableContainer) {
    return;
  }

  const thead = tableContainer.querySelector('.MuiTableHead-root');
  if (!thead) {
    return;
  }

  const scrollbarWidth = tableContainer.offsetWidth - tableContainer.clientWidth;
  thead.style.setProperty(
    'padding-right',
    scrollbarWidth > 0 ? `${scrollbarWidth}px` : '0',
    'important',
  );
};
