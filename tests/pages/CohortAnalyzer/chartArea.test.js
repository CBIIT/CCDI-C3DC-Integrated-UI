const mockDispatch = jest.fn();
let mockUserLayoutChanged = true;
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({
    cohortAnalyzerLayout: {
      topRowOrder: ['venn', 'survival'],
      stripOrder: ['sexAtBirth'],
      besideStripPanelId: null,
      panelRegistry: {},
      visibility: {},
      sizes: {},
      uiFlags: {},
      chartVisuals: {},
      workspaceGrid: null,
      userLayoutChanged: mockUserLayoutChanged,
    },
  }),
}));
jest.mock('@bento-core/tool-tip/dist/ToolTip', () => ({ children }) => children);
jest.mock('../../../src/pages/CohortAnalyzer/vennDiagram/VennDiagramContainer', () => () => (
  <div>Venn column</div>
));
jest.mock('../../../src/pages/CohortAnalyzer/HistogramPanel', () => (props) => (
  <div>
    <span>Histogram strip</span>
    <button type="button" onClick={() => props.onAllAddableChartsAddedChange(true)}>
      All added
    </button>
    <button type="button" onClick={() => props.onAllAddableChartsAddedChange(false)}>
      Charts available
    </button>
    <button type="button" onClick={props.onExpandVenn}>
      Expand Venn from strip
    </button>
    <button type="button" onClick={props.onTopRowStripDropComplete}>
      Complete top-row drop
    </button>
  </div>
));
jest.mock('../../../src/pages/CohortAnalyzer/components/CohortAnalyzerDownloadAllDropdown', () => ({
  CohortAnalyzerDownloadAllDropdown: (props) => (
    <button type="button" onClick={() => props.getExportPayload && props.getExportPayload()}>
      Download all
    </button>
  ),
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CohortAnalyzerChartArea } from '../../../src/pages/CohortAnalyzer/components/CohortAnalyzerChartArea';

const classes = {
  chartTopControlRow: '',
  categoryPills: '',
  categoryPillButton: '',
  chartActionButtons: '',
  addChartButton: '',
  addChartButtonLabel: '',
  addChartButtonIcon: '',
  chartSummaryMain: '',
  vennSurvivalRow: '',
  vennColumn: '',
  survivalBesideVennColumn: '',
  rightSideAnalyzerInnerContainer: '',
  rightSideAnalyzerHeader2: '',
  chartSummaryHistogramFooter: '',
};

function renderArea(overrides = {}) {
  return render(
    <CohortAnalyzerChartArea
      classes={classes}
      state={{
        c1: { cohortName: 'Alpha', participants: [{ id: 'p1' }] },
      }}
      containerRef={{ current: document.createElement('div') }}
      canvasRef={{ current: document.createElement('canvas') }}
      selectedCohorts={['c1']}
      hasParticipantData
      survivalBesideTopRowUsesOrder
      topRowOrder={['venn', 'survival']}
      besideDropTarget={null}
      besideColumnDropTargetStyle={{}}
      handleBesideRowDragLeave={jest.fn()}
      handleBesideColumnDragOver={() => jest.fn()}
      handleBesidePanelDrop={() => jest.fn()}
      survivalBesideDrag={undefined}
      besidePanelDragging={null}
      besidePanelDraggingRef={{ current: null }}
      endBesidePanelDrag={jest.fn()}
      survivalBesideVennEl={null}
      setSurvivalBesideVennEl={jest.fn()}
      setSurvivalBesideColumnActive={jest.fn()}
      inlineAddChartOpen={false}
      setInlineAddChartOpen={jest.fn()}
      inlineAddChartNonce={0}
      setInlineAddChartNonce={jest.fn()}
      resetVennWorkspaceUi={jest.fn()}
      {...overrides}
    />,
  );
}

describe('CohortAnalyzerChartArea', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockUserLayoutChanged = true;
  });

  it('should open add-chart and reset the layout', () => {
    const setInlineAddChartOpen = jest.fn();
    const resetVennWorkspaceUi = jest.fn();
    renderArea({ setInlineAddChartOpen, resetVennWorkspaceUi });
    expect(screen.getByText('Venn column')).toBeInTheDocument();
    expect(screen.getByText('Histogram strip')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Add chart'));
    expect(setInlineAddChartOpen).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByText('Reset View'));
    expect(mockDispatch).toHaveBeenCalled();
    expect(resetVennWorkspaceUi).toHaveBeenCalled();
  });

  it('should disable add chart when no cohort is selected', () => {
    renderArea({ hasParticipantData: false, selectedCohorts: [] });
    expect(screen.getByLabelText('Add chart')).toBeDisabled();
  });

  it('should disable add-chart after all catalog charts are present and expand Venn', () => {
    const endBesidePanelDrag = jest.fn();
    renderArea({ endBesidePanelDrag });
    fireEvent.click(screen.getByText('All added'));
    expect(screen.getByLabelText('Add chart')).toBeDisabled();
    fireEvent.click(screen.getByText('Charts available'));
    expect(screen.getByLabelText('Add chart')).not.toBeDisabled();
    fireEvent.click(screen.getByText('Expand Venn from strip'));
    fireEvent.click(screen.getByText('Complete top-row drop'));
    expect(endBesidePanelDrag).toHaveBeenCalled();
  });

  it('should render drag previews and preview-mode cohort placeholders', () => {
    const { container } = renderArea({
      hasParticipantData: false,
      selectedCohorts: [],
      besideDropTarget: 'survival',
      besidePanelDragging: {
        kind: 'venn',
        width: 450,
        height: 360,
      },
      topRowOrder: ['survival', 'venn'],
    });
    expect(screen.getByText('Venn column')).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('should support nested participant IDs and scroll to a newly opened panel', () => {
    window.requestAnimationFrame = (callback) => {
      callback();
      return 1;
    };
    window.cancelAnimationFrame = jest.fn();
    Element.prototype.scrollIntoView = jest.fn();
    const setInlineAddChartOpen = jest.fn();
    const setInlineAddChartNonce = jest.fn((updater) => updater(2));
    renderArea({
      state: {
        c1: {
          cohortName: 'Alpha',
          participants: [{ participant: { id: 'nested-p1' } }],
        },
      },
      inlineAddChartOpen: true,
      inlineAddChartNonce: 1,
      setInlineAddChartOpen,
      setInlineAddChartNonce,
    });
    fireEvent.click(screen.getByLabelText('Add chart'));
    expect(setInlineAddChartOpen).toHaveBeenCalledWith(true);
    expect(setInlineAddChartNonce).toHaveBeenCalled();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('should skip reset when the layout is pristine and export missing cohort names', () => {
    mockUserLayoutChanged = false;
    renderArea({
      selectedCohorts: ['c1', 'missing'],
      state: {
        c1: {
          cohortName: '',
          participants: [{ participant: { id: 'nested-p1' } }],
        },
      },
    });
    fireEvent.click(screen.getByText('Reset View'));
    expect(mockDispatch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Download all'));
  });

  it('should hide the top row and enable reset while the add panel is open', () => {
    mockUserLayoutChanged = false;
    renderArea({
      topRowOrder: [],
      inlineAddChartOpen: true,
    });
    expect(screen.queryByText('Venn column')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Reset View'));
    expect(mockDispatch).toHaveBeenCalled();
  });
});
