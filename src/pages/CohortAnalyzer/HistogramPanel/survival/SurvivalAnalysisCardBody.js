import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ToolTip from '@bento-core/tool-tip/dist/ToolTip';
import { KaplanMeierChart } from '@bento-core/kmplot';
import RiskTable from '@bento-core/risk-table';
import ExpandIcon from '../../../../assets/icons/Expand_Histogram_icon.svg';
import DownloadIcon from '../../../../assets/icons/Download_Histogram_icon.svg';
import DownloadIconBorderless from '../../../../assets/icons/download-icon-borderless.svg';
import questionIcon from '../../../../assets/icons/Question_icon_2.svg';
import histogramChartTitleHandle from '../../../../assets/icons/histogramChartTitleHandle.svg';
import histogramCloseIcon from '../../../../assets/icons/closeHistogramChart.svg';
import {
  SurvivalAnalysisHeader,
  SurvivalAnalysisContainer,
  KmChartWrapper,
  KmChartWrapperBesideVenn,
  RiskTableWrapper,
  RiskTableWrapperBesideVenn,
  ChartTitle,
  ChartTitleLabel,
  ChartActionButtons,
  DownloadDropdown,
  DownloadDropdownMenu,
  DownloadDropdownItem,
  HeaderSectionContainer
} from '../HistogramPanel.styled';
import {
  CA_SURVIVAL_CARD_MIN_HEIGHT as SURVIVAL_CARD_MIN_HEIGHT,
  CA_SURVIVAL_CARD_MAX_HEIGHT as SURVIVAL_CARD_MAX_HEIGHT,
} from '../../store/cohortAnalyzerLayoutConstants';
import {
  downloadKaplanMeierChart,
  downloadRiskTable,
  downloadSurvivalCombined,
} from '../utils/histogramSurvivalDownloads';
import { HistogramChartEmptyState } from '../chart/HistogramChartEmptyState';
import {
  buildPlaceholderSurvivalRiskCohorts,
  CHART_PREVIEW_KM_COLORS,
  CHART_PREVIEW_RISK_TIME_INTERVALS,
} from '../../utils/cohortAnalyzerChartPreview';

/**
 * Survival content layout by viewport width.
 * Large (≥1500) keeps the tuned desktop values; medium/small use shorter floors.
 * Breakpoints align with ChartWrapper (@media 1500 / 980).
 * SSR / first-paint fallback treats the viewport as medium-width.
 */
const SURVIVAL_VIEWPORT_FALLBACK_PX = 1200;

/** Extra KM plot size vs the %-based layout (width + height). */
const KM_SIZE_BONUS_PX = 65;

const SURVIVAL_CONTENT_LAYOUT_BREAKPOINTS = [
  {
    maxWidth: 979,
    headerChromePx: 30,
    bodyBottomPadPx: 8,
    kmMinPx: 90,
    riskMinPx: 56,
    kmBodyShare: 0.38,
    kmWidthPct: 88,
    kmRiskGapPx: 14,
    // Must stay ≥~40: kmplot draws Y ticks at (margin-10) and the rotated
    // "Survival Proportion" label at x=2 — tighter margins overlap them.
    kmPlotMarginPx: 40,
    shellMinH: 320,
    shellMaxH: 640,
  },
  {
    maxWidth: 1499,
    headerChromePx: 48,
    bodyBottomPadPx: 10,
    kmMinPx: 100,
    riskMinPx: 68,
    kmBodyShare: 0.40,
    kmWidthPct: 78,
    kmRiskGapPx: 16,
    kmPlotMarginPx: 42,
    shellMinH: 380,
    shellMaxH: 800,
  },
  {
    maxWidth: Infinity,
    headerChromePx: 48,
    bodyBottomPadPx: 12,
    kmMinPx: 110,
    riskMinPx: 80,
    kmBodyShare: 0.42,
    kmWidthPct: 80,
    kmRiskGapPx: 18,
    kmPlotMarginPx: 44,
    shellMinH: SURVIVAL_CARD_MIN_HEIGHT,
    shellMaxH: SURVIVAL_CARD_MAX_HEIGHT,
  },
];

function getSurvivalContentLayout(viewportWidth) {
  const width = typeof viewportWidth === 'number' && viewportWidth > 0
    ? viewportWidth
    : SURVIVAL_VIEWPORT_FALLBACK_PX;
  for (let i = 0; i < SURVIVAL_CONTENT_LAYOUT_BREAKPOINTS.length; i += 1) {
    const tier = SURVIVAL_CONTENT_LAYOUT_BREAKPOINTS[i];
    if (width <= tier.maxWidth) return tier;
  }
  return SURVIVAL_CONTENT_LAYOUT_BREAKPOINTS[SURVIVAL_CONTENT_LAYOUT_BREAKPOINTS.length - 1];
}

function clampSurvivalShellHeight(height, shellMinH, shellMaxH) {
  const minH = shellMinH != null ? shellMinH : SURVIVAL_CARD_MIN_HEIGHT;
  const maxH = shellMaxH != null ? shellMaxH : SURVIVAL_CARD_MAX_HEIGHT;
  return Math.min(maxH, Math.max(minH, Math.round(height)));
}

/**
 * Survival analysis card: header actions, KM plot, and risk table (inline or beside Venn).
 * Content height tracks the parent card shell via ResizeObserver (same idea as histograms).
 */
export function SurvivalAnalysisCardBody({
  besideVenn,
  classes,
  chartPreviewMode = false,
  c1Name = '',
  c2Name = '',
  c3Name = '',
  allInputsEmpty,
  besideCardDrag,
  survivalCardSize,
  kmChartRef,
  survivalAnalysisContainerRef,
  riskTableRef,
  filteredKmPlotData,
  kmLoading,
  kmError,
  cohortColors,
  cohorts,
  timeIntervals,
  showDownloadDropdown,
  setShowDownloadDropdown,
  dropdownRef,
  setExpandedChart,
  setActiveTab,
  handleRemoveHistogramDataset,
}) {
  const KmWrap = besideVenn ? KmChartWrapperBesideVenn : KmChartWrapper;
  const RiskWrap = besideVenn ? RiskTableWrapperBesideVenn : RiskTableWrapper;
  const rootRef = useRef(null);
  const [measuredShellH, setMeasuredShellH] = useState(null);
  const [measuredBodyH, setMeasuredBodyH] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(() => (
    typeof window !== 'undefined' && window.innerWidth > 0
      ? window.innerWidth
      : SURVIVAL_VIEWPORT_FALLBACK_PX
  ));

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onResize = () => setViewportWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const layout = getSurvivalContentLayout(viewportWidth);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const shell = root && root.parentElement;
    const body = survivalAnalysisContainerRef && survivalAnalysisContainerRef.current;
    if (!shell && !body) return undefined;

    const measure = () => {
      if (shell) {
        const nextShell = Math.round(shell.getBoundingClientRect().height);
        if (nextShell > 0) {
          setMeasuredShellH((prev) => (prev === nextShell ? prev : nextShell));
        }
      }
      if (body) {
        // clientHeight excludes border; includes padding — subtract bottom pad for usable area.
        const nextBody = Math.round(body.clientHeight);
        if (nextBody > 0) {
          setMeasuredBodyH((prev) => (prev === nextBody ? prev : nextBody));
        }
      }
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    if (shell) ro.observe(shell);
    if (body) ro.observe(body);
    return () => ro.disconnect();
  }, [besideVenn, survivalAnalysisContainerRef, layout.bodyBottomPadPx]);

  const sizedFromState =
    survivalCardSize && survivalCardSize.height != null
      ? clampSurvivalShellHeight(
        survivalCardSize.height,
        layout.shellMinH,
        layout.shellMaxH,
      )
      : null;
  // Prefer the live shell height so KM/risk track whatever the card actually is
  // (resize grip, stretch, or default) without a separate hard max on the plot.
  const effectiveSurvivalH = clampSurvivalShellHeight(
    measuredShellH != null
      ? measuredShellH
      : (sizedFromState != null ? sizedFromState : layout.shellMinH),
    layout.shellMinH,
    layout.shellMaxH,
  );
  // Prefer measured body so we don't double-count header / pad guesses.
  // Reserve space for the KM↔risk gap so the plot doesn't eat the spacer.
  const gapPx = layout.kmRiskGapPx;
  const availableBodyPx = Math.max(
    layout.kmMinPx + layout.riskMinPx + gapPx,
    measuredBodyH != null && measuredBodyH > 0
      ? Math.max(0, measuredBodyH - layout.bodyBottomPadPx)
      : effectiveSurvivalH - layout.headerChromePx - layout.bodyBottomPadPx,
  );
  const bodyForKm = Math.max(layout.kmMinPx, availableBodyPx - layout.riskMinPx - gapPx);
  const kmHeightBase = Math.max(
    layout.kmMinPx,
    Math.min(
      bodyForKm,
      Math.round(availableBodyPx * layout.kmBodyShare),
    ),
  );
  const kmHeight = Math.min(bodyForKm, kmHeightBase + KM_SIZE_BONUS_PX);
  const kmWrapStyle = {
    width: `calc(${layout.kmWidthPct}% + ${KM_SIZE_BONUS_PX}px)`,
    maxWidth: '100%',
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  };
  const riskWrapStyle = {
    marginTop: gapPx,
  };

  // @bento-core/kmplot only remasures width on window resize — nudge it after card drag.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const id = window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
    return () => window.cancelAnimationFrame(id);
  }, [kmHeight, effectiveSurvivalH, layout.kmWidthPct, survivalCardSize && survivalCardSize.width]);

  const survivalHasNoDisplayData =
    !chartPreviewMode
    && !kmLoading
    && !kmError
    && (!Array.isArray(filteredKmPlotData) || filteredKmPlotData.length === 0);

  const previewRiskCohorts = chartPreviewMode
    ? buildPlaceholderSurvivalRiskCohorts().map((row, index) => {
      const names = [c1Name || 'Cohort A', c2Name || 'Cohort B', c3Name || 'Cohort C'];
      return { ...row, name: names[index] || row.name };
    })
    : null;
  const survivalBodyMinHeight = availableBodyPx;
  const canBesideReorder = Boolean(
    besideVenn && besideCardDrag && besideCardDrag.draggable,
  );

  return (
    <div
      ref={rootRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <SurvivalAnalysisHeader>
        <HeaderSectionContainer>
        <ChartTitle className={!chartPreviewMode && survivalHasNoDisplayData ? 'empty' : ''}>
          <span
            role="button"
            tabIndex={0}
            data-ca-chart-title-drag
            aria-label={
              canBesideReorder
                ? 'Drag to swap with Venn diagram or drop on a histogram card below to show it beside this row'
                : 'Chart reorder handle'
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
            }}
            style={{
              cursor: (!chartPreviewMode && survivalHasNoDisplayData) ? 'not-allowed' : canBesideReorder ? 'grab' : 'default',
              opacity: (!chartPreviewMode && survivalHasNoDisplayData) ? 0.45 : 1,
            }}
            title={
              canBesideReorder
                ? 'Drag to swap with Venn or drop on a histogram card to link it beside this row'
                : undefined
            }
          >
            <img
              src={histogramChartTitleHandle}
              alt=""
              width={11}
              height={12}
              aria-hidden
              style={{ display: 'block', flexShrink: 0 }}
            />
          </span>
          <ChartTitleLabel>
            Overall Survival by Diagnosis
            <ToolTip
              maxWidth="235px"
              border="1px solid #598ac5"
              arrowBorder="1px solid #598AC5"
              title={(
                <div>
                  Participants with unreported age values or whose last diagnosis age is later than their last survival follow-up were excluded to ensure valid survival timelines.
                  <br />
                  <br />
                  Displays survival data based on the earliest diagnosis when multiple diagnoses exist.
                </div>
              )}
              placement="top-end"
              arrow
              interactive
              arrowSize="30px"
            >
              {/* Inline (not a flex sibling) so it hugs the last word of the
                  title in both the live view and html-to-image PNG/PDF export. */}
              <img
                alt=""
                src={questionIcon}
                width={10}
                style={{ border: '0px', display: 'inline', verticalAlign: 'text-top', marginLeft: '2px' }}
              />
            </ToolTip>
          </ChartTitleLabel>
          </ChartTitle>

        <ChartActionButtons>
          <button
            type="button"
            aria-label="Expand survival chart"
            disabled={allInputsEmpty || survivalHasNoDisplayData}
            onClick={() => {
              if (!allInputsEmpty && !survivalHasNoDisplayData) {
                setExpandedChart('survivalAnalysis');
                setActiveTab('survivalAnalysis');
              }
            }}
            style={{ padding: 0, background: 'none', border: 'none', cursor: (allInputsEmpty || survivalHasNoDisplayData) ? 'not-allowed' : 'pointer' }}
          >
            <img src={ExpandIcon} alt="" width={19} height={19} style={{ opacity: (allInputsEmpty || survivalHasNoDisplayData) ? 0.5 : 1, display: 'block' }} />
          </button>
          <DownloadDropdown ref={dropdownRef}>
            <button
              type="button"
              aria-label="Survival chart download options"
              aria-expanded={showDownloadDropdown}
              aria-haspopup="menu"
              disabled={allInputsEmpty || survivalHasNoDisplayData}
              onClick={() => !allInputsEmpty && !survivalHasNoDisplayData && setShowDownloadDropdown(!showDownloadDropdown)}
              style={{ padding: 0, background: 'none', border: 'none', cursor: (allInputsEmpty || survivalHasNoDisplayData) ? 'not-allowed' : 'pointer' }}
            >
              <img src={DownloadIcon} alt="" width={19} height={19} style={{ opacity: (allInputsEmpty || survivalHasNoDisplayData) ? 0.5 : 1, display: 'block' }} />
            </button>
            {showDownloadDropdown && !allInputsEmpty && !survivalHasNoDisplayData && (
              <DownloadDropdownMenu role="menu">
                <DownloadDropdownItem
                  role="menuitem"
                  onClick={() => {
                    setShowDownloadDropdown(false);
                    downloadKaplanMeierChart(kmChartRef);
                  }}
                >
                  <img src={DownloadIconBorderless} alt="" style={{ width: '10px', height: '12px' }} />
                  Kaplan Meier Plot
                </DownloadDropdownItem>
                <DownloadDropdownItem
                  role="menuitem"
                  onClick={() => {
                    setShowDownloadDropdown(false);
                    downloadRiskTable(riskTableRef);
                  }}
                >
                  <img src={DownloadIconBorderless} alt="" style={{ width: '10px', height: '12px' }} />
                  Risk Table
                </DownloadDropdownItem>
                <DownloadDropdownItem
                  role="menuitem"
                  onClick={() => downloadSurvivalCombined(
                    survivalAnalysisContainerRef,
                    () => setShowDownloadDropdown(false),
                    riskTableRef,
                  )}
                >
                  <img src={DownloadIconBorderless} alt="" style={{ width: '10px', height: '12px' }} />
                  Download Both
                </DownloadDropdownItem>
              </DownloadDropdownMenu>
            )}
          </DownloadDropdown>
          <button
            type="button"
            className={classes.headerCloseButton}
            aria-label="Remove survival chart from layout"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveHistogramDataset('survivalAnalysis');
            }}
          >
            <img src={histogramCloseIcon} alt="" width={19} height={19} style={{ opacity: allInputsEmpty ? 0.45 : 1, display: 'block' }} />
          </button>
        </ChartActionButtons>
        </HeaderSectionContainer>
       
      </SurvivalAnalysisHeader>

      <SurvivalAnalysisContainer
        ref={survivalAnalysisContainerRef}
        style={{ paddingBottom: layout.bodyBottomPadPx }}
      >
        {chartPreviewMode ? (
          <>
            <KmWrap ref={kmChartRef} style={kmWrapStyle}>
              <KaplanMeierChart
                data={[]}
                title=""
                width="100%"
                height={kmHeight}
                margin={layout.kmPlotMarginPx}
                loading={false}
                error={null}
                colors={CHART_PREVIEW_KM_COLORS}
                showLabels={false}
                showLegend={false}
              />
            </KmWrap>
            <RiskWrap ref={riskTableRef} style={riskWrapStyle}>
              <RiskTable
                classes={{ cohortName: classes.cohortNameEllipsis }}
                cohortNameCharLimit={7}
                cohorts={previewRiskCohorts}
                timeIntervals={CHART_PREVIEW_RISK_TIME_INTERVALS}
              />
            </RiskWrap>
          </>
        ) : survivalHasNoDisplayData ? (
          <div
            style={{
              width: '100%',
              flex: 1,
              minHeight: survivalBodyMinHeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            <HistogramChartEmptyState />
          </div>
        ) : (
          <>
            <KmWrap ref={kmChartRef} style={kmWrapStyle}>
              <KaplanMeierChart
                data={filteredKmPlotData}
                title=""
                width="100%"
                height={kmHeight}
                margin={layout.kmPlotMarginPx}
                loading={kmLoading}
                error={kmError}
                colors={cohortColors}
                showLabels={false}
                showLegend={false}
              />
            </KmWrap>
            <RiskWrap ref={riskTableRef} style={riskWrapStyle}>
              <RiskTable
                classes={{ cohortName: classes.cohortNameEllipsis }}
                cohortNameCharLimit={7}
                cohorts={cohorts}
                timeIntervals={timeIntervals}
              />
            </RiskWrap>
          </>
        )}
      </SurvivalAnalysisContainer>
    </div>
  );
}
