import styled, { css } from 'styled-components';
import { CA_SURVIVAL_CARD_MIN_HEIGHT } from '../../store/cohortAnalyzerLayoutConstants';
import {
  HISTOGRAM_CARD_MIN_WIDTH,
  HISTOGRAM_PLOT_MIN_HEIGHT,
  HISTOGRAM_CARD_CHROME_HEIGHT,
  HISTOGRAM_CHART_STROKE_COLOR,
} from '../histogramConstants';

export const barColors = {
  colorA: '#FAE69C',
  colorB: '#A4E9CB',
  colorC: '#A3CCE8',
};

export const kmplotColors = {
  colorA: '#B18A00',
  colorB: '#00A45C',
  colorC: '#008FF7',
};

/** Grid and axis strokes for Recharts-based charts (histogram + Kaplan–Meier). */
export const histogramChartGridAxisStrokeCss = css`
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line,
  & .recharts-cartesian-axis .recharts-cartesian-axis-line,
  & .recharts-cartesian-axis-tick line {
    stroke: ${HISTOGRAM_CHART_STROKE_COLOR};
  }
`;

export const HistogramContainer = styled.div`
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin-left: 0px;
  min-height: 0;
  height: auto;
  margin-top: 16px;
  overflow-x: hidden;
  @media (max-width: 1900px) {
    max-width: 100%;
    margin: 16px 0 0;
  }
`;

export const DatasetSelectionTitle = styled.div`
  font-family: Poppins;
  font-size: 16px;
  color: ${(props) => (props.disabled ? '#999999' : '#000000')};
  opacity: ${(props) => (props.disabled ? 0.8 : 1)};
  margin-bottom: 8px;
`;

export const CheckBoxSection = styled.div`
  margin-bottom: 14px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
`;

/**
 * Fixed header control row: grab hit-target matches expand/download so
 * grab + ChartActionButtons share one top edge (chart-type may be taller).
 */
export const CHART_HEADER_ACTION_ICON_PX = 19;
/** Chart-type selector size on strip cards (larger than sibling actions). */
export const CHART_HEADER_CHART_TYPE_ICON_PX = 22;

export const ChartTitle = styled.h2`
  font-family: Poppins;
  font-size: 18px;
  font-weight: 400;
  color: #000000;
  margin: 0;
  padding: 0;
  text-align: left;
  margin-left: 3px;
  flex: 1;
  min-width: 0;
  align-self: flex-start;
  line-height: 1;
  display: flex;
  flex-direction: row;
  /* Grab + title text + "?" share the same top edge as ChartActionButtons. */
  align-items: flex-start;
  flex-wrap: nowrap;
  /* 1px between title text and trailing "?" (grab has its own margin). */
  column-gap: 1px;
  overflow: hidden;
  height: 100%;

  & > [data-ca-chart-title-drag] {
    box-sizing: border-box;
    width: ${CHART_HEADER_ACTION_ICON_PX}px;
    height: ${CHART_HEADER_ACTION_ICON_PX}px;
    margin: 0 6px 0 0;
    padding: 0;
    display: inline-flex;
    /* Center the 12px grip inside the same 19px row as expand/download. */
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 0;
  }

  &.empty {
    opacity: 0.3;
  }
`;

/** Title string beside the drag handle — wraps independently so new lines
 *  still start at the same horizontal inset as the first line of text. */
export const ChartTitleLabel = styled.span`
  /* Shrink-wrap to text so the "?" sits 1px away (not pushed by flex-grow). */
  flex: 0 1 auto;
  min-width: 0;
  /* Size to the text, not the available track. Without this a -webkit-box is
     laid out at full width during html-to-image (PNG/PDF) export, pushing the
     trailing "?" tooltip far from the title. Capped at 100% so it still wraps. */
  width: fit-content;
  max-width: 100%;
  align-self: flex-start;
  margin: 0;
  padding: 0;
  line-height: 1;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  /* Stay inside the fixed header; extra wrap lines are clipped, not grown into. */
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  height: 100%;

  /* Help "?" sits on the top of the title line (not vertically centered). */
  & img {
    vertical-align: text-top;
  }
`;

export const ChartActionButtons = styled.div`
  display: flex;
  /* Same top edge as ChartTitle / grab — no extra pad or self-centering. */
  align-items: flex-start;
  align-self: flex-start;
  gap: 8px;
  flex-shrink: 0;
  justify-content: flex-end;
  margin: 0;
  padding: 0 0 0 8px;
  height: fit-content;

  & > * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    flex-shrink: 0;
    display: inline-flex;
    align-items: flex-start;
    justify-content: center;
    align-self: flex-start;
    line-height: 0;
  }
`;
export const CenterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  /* flex-start so vertical resize of one card does not stretch siblings in the row */
  align-items: flex-start;
  align-content: flex-start;
  gap: 14px;
  @media (min-width: 1900px) {
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

export const ChartWrapper = styled.div`
  position: relative;
  width: calc((100% - 28px) / 3);
  min-width: clamp(${HISTOGRAM_CARD_MIN_WIDTH}px, 17vw, 100%);
  /* Content-based floor — avoid vh mins that leave slack under the plot on tall screens. */
  min-height: ${HISTOGRAM_PLOT_MIN_HEIGHT + HISTOGRAM_CARD_CHROME_HEIGHT}px;
  max-height: none;
  margin-bottom: 0;
  padding: 0px;
  border: 1px solid #b8c7cc;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: stretch;
  /* Keep each card's width independent: growing one via resize must not
     squeeze siblings. Extra cards wrap to the next row instead. */
  flex-shrink: 0;
  flex-grow: 0;
  border-radius: 10px;
  box-shadow: none;
  transition: none;
  ${histogramChartGridAxisStrokeCss}
  &:hover {
    transform: none;
    box-shadow: none;
  }
  /**
   * Keep three cards per row (1/3 − gap) until a narrow viewport; the old 1500px breakpoint
   * forced two columns and made cards look stretched. Stack to one column on small screens only.
   */
  @media (max-width: 980px) {
    width: 100%;
    min-width: 0;
  }
`;

/** Bottom-right grip: black triangle + hit target for diagonal resize */
export const ChartResizeHandle = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 32px;
  height: 32px;
  cursor: nwse-resize;
  z-index: 6;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  box-sizing: border-box;
  padding: 0 6px 2px 0;
  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-left: 16px solid transparent;
    border-bottom: 16px solid #525252;
  }
`;

/** Full-row card (e.g. survival / KM plot). */
export const FullWidthChartWrapper = styled(ChartWrapper)`
  width: 100%;
  flex: 0 0 100%;
  min-width: 0;
  @media (max-width: 1500px) {
    width: 100%;
    flex: 0 0 100%;
  }
  @media (max-width: 980px) {
    width: 100%;
    flex: 0 0 100%;
  }
`;

/** Survival card when mounted beside the Venn. */
export const SurvivalBesideVennCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  flex: 1 1 auto;
  align-self: stretch;
  min-height: ${CA_SURVIVAL_CARD_MIN_HEIGHT}px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
  border: 1px solid #b8c7cc;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: none;
  transition: none;
  &:hover {
    transform: none;
    box-shadow: none;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  /* Fixed chrome — wrap mode must not grow the header past this size. */
  height: 58px;
  min-height: 58px;
  max-height: 58px;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  /* Extra top padding so top-aligned header content reads as centered in the bar. */
  padding: 14px 12px 8px 15px;
  margin-left: 0;
  border-bottom: 1px solid #e5e5e5;
  /* Visible so the chart-type dropdown can paint below the header chrome. */
  overflow: visible;
  
`;

export const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  /* Sit directly under the widget title (header left inset is 15px). */
  margin: 0 0 2px 15px;
  gap: 16px;
  justify-content: flex-start;
  flex-direction: row;
  width: auto;
  max-width: 100%;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: start;
  font-family: Poppins;
  font-size: 13px;
  line-height: 1.0;
  color: #494949;
  cursor: pointer;
  margin-top: 4px;
`;

export const RadioInput = styled.input`
  margin: 0 6px 0 0;
  accent-color: #3A7587;
  width: 16px;
  height: 16px;
  
`;
