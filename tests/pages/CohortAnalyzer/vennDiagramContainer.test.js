jest.mock('@bento-core/tool-tip/dist/ToolTip', () => ({ children }) => children);
jest.mock('../../../src/pages/CohortAnalyzer/vennDiagram/ChartVenn', () => () => (
  <div>Venn chart</div>
));
jest.mock('react-redux', () => ({
  useSelector: (selector) => selector({
    cohortAnalyzerLayout: { sizes: { venn: { width: 400, height: 280 } } },
  }),
}));

const mockAnalyzer = {
  refreshTableContent: true,
  selectedCohorts: [],
  nodeIndex: 0,
  cohortData: {},
  setSelectedChart: jest.fn(),
  setRefreshSelectedChart: jest.fn(),
  setSelectedCohortSections: jest.fn(),
  selectedCohortSection: [],
  setGeneralInfo: jest.fn(),
  setNodeIndex: jest.fn(),
  setRowData: jest.fn(),
  setAlert: jest.fn(),
};

jest.mock('../../../src/pages/CohortAnalyzer/context/CohortAnalyzerContext', () => ({
  useCohortAnalyzer: () => mockAnalyzer,
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VennDiagramContainer from '../../../src/pages/CohortAnalyzer/vennDiagram/VennDiagramContainer';

const classes = {
  chartContainer: '',
  vennDiagramCard: '',
  vennToolbarRow: '',
  vennToolbarLeading: '',
  vennToolbarTitle: '',
  vennToolbarSpacer: '',
  vennToolbarTrailing: '',
  vennHeaderDivider: '',
};

const canvas = document.createElement('canvas');
canvas.width = 10;
canvas.height = 10;
canvas.getContext = () => ({
  fillStyle: '',
  fillRect: jest.fn(),
  drawImage: jest.fn(),
});
canvas.toDataURL = () => 'data:image/png;base64,abc';

global.ResizeObserver = class {
  observe() {}
  disconnect() {}
  unobserve() {}
};

describe('VennDiagramContainer', () => {
  let createElement;
  beforeEach(() => {
    mockAnalyzer.selectedCohorts = [];
    mockAnalyzer.cohortData = {};
    mockAnalyzer.setAlert.mockClear();
    global.ResizeObserver = class {
      observe() {}
      disconnect() {}
      unobserve() {}
    };
    createElement = document.createElement.bind(document);
    document.createElement = (tag) => {
      const el = createElement(tag);
      if (tag === 'canvas') {
        el.getContext = () => ({
          fillStyle: '',
          fillRect: jest.fn(),
          drawImage: jest.fn(),
        });
        el.toDataURL = () => 'data:image/png;base64,abc';
      }
      return el;
    };
  });
  afterEach(() => {
    document.createElement = createElement;
  });

  it('should show the empty state when no cohorts are selected', () => {
    render(
      <VennDiagramContainer
        classes={classes}
        state={{}}
        containerRef={{ current: document.createElement('div') }}
        canvasRef={{ current: canvas }}
      />,
    );
    expect(screen.getByText('No data available.')).toBeInTheDocument();
    expect(screen.queryByText('Venn chart')).not.toBeInTheDocument();
  });

  it('should render the venn chart and download it', () => {
    mockAnalyzer.selectedCohorts = ['c1'];
    mockAnalyzer.cohortData = {
      c1: { cohortName: 'Alpha', participants: [{ id: 'p1' }] },
    };
    render(
      <VennDiagramContainer
        classes={classes}
        state={mockAnalyzer.cohortData}
        containerRef={{ current: document.createElement('div') }}
        canvasRef={{ current: canvas }}
      />,
    );
    expect(screen.getByText('Venn chart')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Download Venn diagram'));
    expect(mockAnalyzer.setAlert).toHaveBeenCalled();
  });

  it('should collapse while dragging Venn and apply peer styles for survival', () => {
    mockAnalyzer.selectedCohorts = ['c1'];
    mockAnalyzer.cohortData = {
      c1: { cohortName: 'Alpha', participants: [{ id: 'p1' }] },
    };
    const { unmount } = render(
      <VennDiagramContainer
        classes={classes}
        state={mockAnalyzer.cohortData}
        containerRef={{ current: document.createElement('div') }}
        canvasRef={{ current: canvas }}
        besidePanelDragState={{ kind: 'venn', width: 420, height: 300 }}
        besideCardDrag={{ id: 'venn-card', draggable: true, onDragStart: jest.fn(), onDragEnd: jest.fn() }}
      />,
    );
    expect(document.getElementById('venn-card')).not.toBeNull();
    unmount();
    render(
      <VennDiagramContainer
        classes={classes}
        state={mockAnalyzer.cohortData}
        containerRef={{ current: document.createElement('div') }}
        canvasRef={{ current: canvas }}
        besidePanelDragState={{ kind: 'survival' }}
      />,
    );
    expect(screen.getByText('Venn chart')).toBeInTheDocument();
  });
});
