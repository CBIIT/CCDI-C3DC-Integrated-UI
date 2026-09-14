import styled, { css } from 'styled-components';
import {
  HISTOGRAM_EXPANDED_AXIS_FONT_SIZE,
  HISTOGRAM_EXPANDED_AXIS_FONT_FAMILY,
  HISTOGRAM_EXPANDED_AXIS_FONT_WEIGHT,
  HISTOGRAM_EXPANDED_AXIS_TICK_COLOR,
} from '../histogramConstants';
import {
  SURVIVAL_RISK_TABLE_DOWNLOAD_ATTR,
  SURVIVAL_RISK_TABLE_DOWNLOAD_TEXT_COLOR,
} from '../utils/survivalRiskTableDownloadCapture';
import { RadioGroup, histogramChartGridAxisStrokeCss } from './histogramPanelCore.styled';
import {
  CohortAnalyzerRadioFieldset,
} from '../../styling/cohortAnalyzerRadio.styled';

/** Risk table body text only — month header row (thead) keeps @bento-core/risk-table colors. */
const survivalRiskTableDownloadTextCss = css`
  &[${SURVIVAL_RISK_TABLE_DOWNLOAD_ATTR}='true'] tbody td,
  &[${SURVIVAL_RISK_TABLE_DOWNLOAD_ATTR}='true'] tbody td * {
    color: ${SURVIVAL_RISK_TABLE_DOWNLOAD_TEXT_COLOR} !important;
  }
`;

/** Expanded modal ({@link HistogramPopup}) Recharts axis tick labels — X and Y. */
const histogramExpandedModalAxisTickCss = css`
  & .recharts-cartesian-axis-tick text,
  & .recharts-cartesian-axis-tick-value {
    font-size: ${HISTOGRAM_EXPANDED_AXIS_FONT_SIZE}px !important;
    font-family: ${HISTOGRAM_EXPANDED_AXIS_FONT_FAMILY}, sans-serif !important;
    font-weight: ${HISTOGRAM_EXPANDED_AXIS_FONT_WEIGHT} !important;
    fill: ${HISTOGRAM_EXPANDED_AXIS_TICK_COLOR} !important;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
  overflow: hidden;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 1220px;
  max-width: calc(100vw - 48px);
  height: 80%;
  max-height: 800px;
  position: relative;
  z-index: 2000px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
`;

/** Shared hit target for chart-type, download, and close so flex gap reads evenly between items. */
const MODAL_HEADER_ICON_CONTROL_PX = 38;

/** Horizontal inset where header tab labels begin; popup content aligns to the same left edge. */
export const MODAL_HEADER_TAB_INSET_PX = 44;
export const MODAL_HEADER_TAB_INSET_RIGHT_PX = 44;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 44px;
  line-height: 1;
  padding: 0;
  width: ${MODAL_HEADER_ICON_CONTROL_PX}px;
  height: ${MODAL_HEADER_ICON_CONTROL_PX}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  flex-shrink: 0;
  margin: 0;
  box-sizing: border-box;
  &:hover {
    color: #333;
  }
`;

export const ModalChartWrapper = styled.div`
  width: 100%;
  height: calc(100% - 72.5px);
  margin-top: 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 0;
  position: relative;
  z-index: 1;
  ${histogramChartGridAxisStrokeCss}
  ${histogramExpandedModalAxisTickCss}
`;

export const TabContainer = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  width: 100%;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: stretch;
  gap: 30px;
  padding-right: 4px;
  position: relative;
  z-index: 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
`;

export const Tab = styled.button`
  background: transparent;
  border: none;
  padding: 10px 0px;
  cursor: pointer;
  font-family: Poppins;
  font-size: 16px;
  line-height: 1.25;
  white-space: nowrap;
  flex: 0 0 auto;
  font-weight: ${(props) => (props.active ? '600' : '400')};
  color: ${(props) => (props.active ? '#3A7587' : '#4A5C5E')};
  /* Always reserve underline height so bold/active state does not shift the label up */
  border-bottom: 5px solid ${(props) => (props.active ? '#3A7587' : 'transparent')};
`;

/**
 * Chart type selector (pie / vertical bar / horizontal bar / line).
 * Strip cards pass `$hitTarget` matching expand/download/close (19px).
 * Expanded modal keeps the default 38px hit-target.
 */
export const ChartTypeDropdownRoot = styled.div`
  position: relative;
  display: inline-flex;
  /* Top-align with expand/download/close on the title row. */
  align-items: flex-start;
  justify-content: center;
  margin: 0;
  padding: 0;
  /* Above sibling cards / chrome so the open menu isn’t buried. */
  z-index: 40;
`;

export const ChartTypeDropdownPanel = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 3px 2px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  min-width: 41px;
  box-sizing: border-box;
  ${(p) =>
    p.$heightPx != null
      ? `
    height: ${p.$heightPx}px;
    align-items: stretch;
    & > button {
      flex: 1 1 0;
      min-height: 0;
      width: 100%;
      height: auto;
    }
  `
      : ''}
`;

export const ChartTypeOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${MODAL_HEADER_ICON_CONTROL_PX}px;
  height: ${MODAL_HEADER_ICON_CONTROL_PX}px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: ${(p) => (p.$active ? '#e8e8e8' : 'transparent')};
  cursor: pointer;
  &:hover {
    background: ${(p) => (p.$active ? '#e0e0e0' : '#f5f5f5')};
  }
  &:focus-visible {
    outline: 2px solid #3a7587;
    outline-offset: 1px;
  }
`;

export const ChartTypeTriggerButton = styled.button`
  display: inline-flex;
  box-sizing: border-box;
  /* Flush with sibling action icons / grab / title (no vertical centering). */
  align-items: flex-start;
  justify-content: center;
  width: ${(p) => (p.$hitTarget != null ? p.$hitTarget : MODAL_HEADER_ICON_CONTROL_PX)}px;
  height: ${(p) => (p.$hitTarget != null ? p.$hitTarget : MODAL_HEADER_ICON_CONTROL_PX)}px;
  min-width: ${(p) => (p.$hitTarget != null ? p.$hitTarget : MODAL_HEADER_ICON_CONTROL_PX)}px;
  min-height: ${(p) => (p.$hitTarget != null ? p.$hitTarget : MODAL_HEADER_ICON_CONTROL_PX)}px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  line-height: 0;
  margin: 0;
  &:hover {
    background: #f5f5f5;
  }
  &:focus-visible {
    outline: 2px solid #3a7587;
    outline-offset: 1px;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const DownloadDropdown = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1;
`;
export const DownloadDropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background: white;
  border: 1.5px solid #4E8191;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  overflow: hidden;
  padding-left: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  pointer-events: auto;
`;

export const DownloadDropdownItem = styled.div`
  padding: 2px;
  font-family: Poppins;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
  &:hover {
    background-color: #f5f5f5;
  }
`;

export const SurvivalAnalysisWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SurvivalAnalysisHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* Fixed chrome — slightly tighter than histogram strip headers. */
  height: 48px;
  min-height: 48px;
  max-height: 48px;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 12px;
  border-bottom: 1px solid #e5e5e5;
  /* Visible so header menus (download) aren’t clipped by the fixed chrome. */
  overflow: visible;
`;

export const HeaderSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  height: 100%;

  /* Shared ChartTitle / ChartActionButtons default to flex-start for strip cards —
     center them in the survival header only. */
  & > h2 {
    align-self: center;
    align-items: center;
    height: auto;
    /* line-height: 1 + overflow:hidden on shared ChartTitle clips descenders (g, y). */
    line-height: 1.25;
    overflow: visible;
  }

  & > h2 > [data-ca-chart-title-drag] {
    align-self: center;
  }

  /* ChartTitleLabel only — drop the -webkit-box height clamp that cuts off “g”. */
  & > h2 > span:not([data-ca-chart-title-drag]) {
    align-self: center;
    line-height: 1.25;
    height: auto;
    overflow: visible;
    display: block;
    -webkit-line-clamp: unset;
    -webkit-box-orient: unset;

    /* Keep the “?” top-aligned to the title text (not vertically centered). */
    & img {
      vertical-align: text-top;
    }
  }

  & > div:last-of-type {
    align-self: center;
    align-items: center;
  }
`;

export const SurvivalAnalysisContainer = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
`;

export const KmChartWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  flex-shrink: 0;
  padding-left: 4px;
  padding-right: 12px;
  margin-top: 0;
  /* Visible so the rotated Y-axis title at the SVG left edge isn’t clipped. */
  overflow: visible;
  box-sizing: border-box;
  /* @bento-core/kmplot always renders an empty <h3> title row + 8px margin when
     title="" — collapse it so the SVG height matches our kmHeight allocation. */
  & > div > div:first-child {
    display: none !important;
    margin: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
  }
  ${histogramChartGridAxisStrokeCss}
`;

export const RiskTableWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  padding-left: 50px;
  padding-right: 50px;
  margin-top: 0;
  min-width: 0;
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  box-sizing: border-box;
  /* Library defaults table to margin 30px top+bottom — that ate the card body and clipped. */
  & table {
    margin-top: 0 !important;
    margin-bottom: 8px !important;
  }
  ${survivalRiskTableDownloadTextCss}
`;

export const KmChartWrapperBesideVenn = styled(KmChartWrapper)`
  padding-left: 8px;
  padding-right: 8px;
  margin-top: 0;
`;

export const RiskTableWrapperBesideVenn = styled(RiskTableWrapper)`
  padding-left: 8px;
  padding-right: 8px;
  margin-top: 0;
  overflow: hidden;
`;

export const SurvivalAnalysisModalContainer = styled.div`
  width: 100%;
  max-width: min(1100px, 100%);
  height: 100%;
  flex: 1;
  min-height: 0;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 48px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
`;

export const SurvivalAnalysisModalContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  gap: 5px;
`;

export const KmChartModalWrapper = styled.div`
  width: 100%;
  padding-left: 120px;
  padding-right: 100px;
  margin-right: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;

  /* KaplanMeierChart axis ticks/labels are 11px in @bento-core/kmplot; match expanded modal spec. */
  & svg text {
    font-size: ${HISTOGRAM_EXPANDED_AXIS_FONT_SIZE}px !important;
    font-family: ${HISTOGRAM_EXPANDED_AXIS_FONT_FAMILY}, sans-serif !important;
    font-weight: ${HISTOGRAM_EXPANDED_AXIS_FONT_WEIGHT} !important;
    fill: ${HISTOGRAM_EXPANDED_AXIS_TICK_COLOR} !important;
  }

  ${histogramChartGridAxisStrokeCss}
`;

export const RiskTableModalWrapper = styled.div`
  width: 75.5%;
  padding-right: 5px;
  overflow-x: auto;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 280px;
  padding-bottom: 15px;
  ${survivalRiskTableDownloadTextCss}
`;

export const ModalHeaderContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 12px;
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 16.5px ${MODAL_HEADER_TAB_INSET_RIGHT_PX}px 0 ${MODAL_HEADER_TAB_INSET_PX}px;
  box-sizing: border-box;
  min-height: 50px;
  overflow: visible;
  border-bottom: 1px solid #969696;
  border-top-left-radius: 8px;
`;

export const ModalActionButtons = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  position: relative;
  z-index: 3;
  isolation: isolate;
  pointer-events: auto;
`;

/** Stacks download control + dropdown anchor in one fixed-size cell so flex gap to close isn’t widened. */
export const DownloadButtonWrapper = styled.div`
  position: relative;
  display: inline-grid;
  grid-template: ${MODAL_HEADER_ICON_CONTROL_PX}px / ${MODAL_HEADER_ICON_CONTROL_PX}px;
  place-items: stretch;
  flex-shrink: 0;
  & > * {
    grid-area: 1 / 1;
  }
`;

export const DownloadButton = styled.span`
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${MODAL_HEADER_ICON_CONTROL_PX}px;
  height: ${MODAL_HEADER_ICON_CONTROL_PX}px;
  flex-shrink: 0;
  box-sizing: border-box;
  cursor: pointer;
`;

export const DownloadIconImage = styled.img`
  width: 28px;
  height: 28px;
  display: block;
`;

export const DownloadIconSmall = styled.img`
  width: 10px;
  height: 12px;
`;

/** Histogram expanded tab: full-width header (radios); use {@link ModalHistogramChartInset} for padded graph. */
export const ModalChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0;
  align-items: stretch;
  justify-content: flex-start;
`;

/** Horizontal inset + max-width for the expanded histogram plot only (not # / % radios). */
export const ModalHistogramChartInset = styled.div`
  width: 100%;
  max-width: min(1100px, 100%);
  margin-left: auto;
  margin-right: auto;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 clamp(20px, 4vw, 48px);
  box-sizing: border-box;
`;

export const ModalRadioFieldset = styled(CohortAnalyzerRadioFieldset)`
  border: none;
  flex-shrink: 0;
  width: 100%;
  padding: 0 ${MODAL_HEADER_TAB_INSET_RIGHT_PX}px 0 ${MODAL_HEADER_TAB_INSET_PX}px;
  margin: 20px 0;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: flex-start;
`;

export const ModalRadioGroup = styled(RadioGroup)`
  width: 100%;
  margin: 0;
  padding: 0;
  display: contents;
   
`;

/** Expanded modal: # / % of Participants — radio stays on the first line when label wraps. */
export const ModalRadioLabel = styled.label`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 0;
  font-family: Poppins, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.25;
  color: #5C5C5C;
  cursor: pointer;
  max-width: 100%;
 

  & > input {
    flex-shrink: 0;
    align-self: flex-start;
    /* Flush with the top of the first text line (no centering nudge). */
    margin-top: 0;
  }

  & > span {
    min-width: 0;
  }
`;

/** Wraps popup controls (e.g. Venn category radios) so they align with the first header tab. */
export const ModalPopupContentInset = styled.div`
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 ${MODAL_HEADER_TAB_INSET_RIGHT_PX}px 0 ${MODAL_HEADER_TAB_INSET_PX}px;
`;

/** Venn expanded tab shell (full width); chart area uses {@link ModalVennChartInset}. */
export const ModalVennTabRoot = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: auto;
  box-sizing: border-box;
`;

/** Venn diagram plot area — centered with chart inset; radios sit in {@link ModalPopupContentInset}. */
export const ModalVennChartInset = styled.div`
  width: 100%;
  max-width: min(1100px, 100%);
  flex: 1;
  min-height: 0;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const ModalNoDataContainer = styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-family: Poppins;
  color: #999;
  padding: 2rem;
`;
