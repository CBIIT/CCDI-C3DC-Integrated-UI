import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import DownloadIcon from '../../../../assets/icons/Download_Histogram_icon.svg';
import ExpandIcon from '../../../../assets/icons/Expand_Histogram_icon.svg';
import histogramChartTitleHandle from '../../../../assets/icons/histogramChartTitleHandle.svg';
import histogramCloseIcon from '../../../../assets/icons/closeHistogramChart.svg';
import { requiresCompactSpacing, HISTOGRAM_DRAG_SOURCE_COLLAPSED_STYLE, histogramHeaderIconScale } from '../utils/histogramLayoutUtils';
import { HistogramChartEmptyState } from '../chart/HistogramChartEmptyState';
import { getChartPreviewContentStyle } from '../../utils/cohortAnalyzerChartPreview';
import {
  HISTOGRAM_CARD_CHROME_HEIGHT,
  HISTOGRAM_CARD_CONTENT_BOTTOM_PAD_PX,
  HISTOGRAM_HEADER_BASE_HEIGHT_PX,
  HISTOGRAM_HEADER_PAD_TOP_PX,
  HISTOGRAM_HEADER_PAD_BOTTOM_PX,
} from '../histogramConstants';
import {
  ChartWrapper,
  HeaderSection,
  ChartTitle,
  ChartTitleLabel,
  ChartActionButtons,
  ChartResizeHandle,
  ChartTypeDropdownRoot,
  ChartTypeDropdownPanel,
  ChartTypeOption,
  ChartTypeTriggerButton,
  CHART_HEADER_ACTION_ICON_PX,
  CHART_HEADER_CHART_TYPE_ICON_PX,
} from '../HistogramPanel.styled';
import { HistogramDatasetChart, DEFAULT_CHART_TYPE } from '../chart/HistogramDatasetChart';
import { ChartTypeIcon, CHART_TYPE_OPTIONS } from '../chart/HistogramChartTypeIcons';
import {
  encodePanelDragPayload,
  CA_PANEL_DRAG_MIME,
} from '../../store/panelDnD';

export function HistogramBesideVennHistogramPortal({
  survivalSelected,
  besideDatasetForColumn,
  survivalBesideVennTarget,
  chartRef,
  histogramCardSizes,
  allInputsEmpty,
  chartPreviewMode = false,
  beginStripChartDrag,
  endStripChartDrag,
  setDragOverDataset,
  captureHistogramDragCardSize,
  clearHistogramDragSize,
  getChartTitle,
  data,
  filteredData,
  viewType,
  chartVisualByPanelId,
  besideHistogramBarSums,
  besideStripPlotHeight,
  defaultPlotHeightPx,
  /** Same outer size as survival strip / top-row survival card when shown beside Venn. */
  besidePeerShellBox = null,
  besideColumnPlotHeightPx,
  cellHover,
  handleMouseEnter,
  handleMouseLeave,
  classes,
  setExpandedChart,
  setActiveTab,
  downloadChart,
  handleRemoveHistogramDataset,
  handleHistogramCardResizeStart,
  c1Name,
  c2Name,
  c3Name,
  draggingDataset,
  chartTypeMenuDataset,
  setChartTypeMenuDataset,
  chartTypeMenuRef,
  setChartVisualForPanel,
  sharedStripHeaderHeightPx = HISTOGRAM_HEADER_BASE_HEIGHT_PX,
  sharedStripChromeHeightPx = HISTOGRAM_CARD_CHROME_HEIGHT,
  reportStripHeaderHeight,
}) {
  if (survivalSelected || !besideDatasetForColumn || survivalBesideVennTarget == null) {
    return null;
  }

  return createPortal(
    <BesideVennHistogramCard
      d={besideDatasetForColumn}
      chartRef={chartRef}
      histogramCardSizes={histogramCardSizes}
      allInputsEmpty={allInputsEmpty}
      chartPreviewMode={chartPreviewMode}
      beginStripChartDrag={beginStripChartDrag}
      endStripChartDrag={endStripChartDrag}
      setDragOverDataset={setDragOverDataset}
      captureHistogramDragCardSize={captureHistogramDragCardSize}
      clearHistogramDragSize={clearHistogramDragSize}
      getChartTitle={getChartTitle}
      data={data}
      filteredData={filteredData}
      viewType={viewType}
      chartVisualByPanelId={chartVisualByPanelId}
      besideHistogramBarSums={besideHistogramBarSums}
      besideStripPlotHeight={besideStripPlotHeight}
      defaultPlotHeightPx={defaultPlotHeightPx}
      besidePeerShellBox={besidePeerShellBox}
      besideColumnPlotHeightPx={besideColumnPlotHeightPx}
      cellHover={cellHover}
      handleMouseEnter={handleMouseEnter}
      handleMouseLeave={handleMouseLeave}
      classes={classes}
      setExpandedChart={setExpandedChart}
      setActiveTab={setActiveTab}
      downloadChart={downloadChart}
      handleRemoveHistogramDataset={handleRemoveHistogramDataset}
      handleHistogramCardResizeStart={handleHistogramCardResizeStart}
      c1Name={c1Name}
      c2Name={c2Name}
      c3Name={c3Name}
      draggingDataset={draggingDataset}
      chartTypeMenuDataset={chartTypeMenuDataset}
      setChartTypeMenuDataset={setChartTypeMenuDataset}
      chartTypeMenuRef={chartTypeMenuRef}
      setChartVisualForPanel={setChartVisualForPanel}
      sharedStripHeaderHeightPx={sharedStripHeaderHeightPx}
      sharedStripChromeHeightPx={sharedStripChromeHeightPx}
      reportStripHeaderHeight={reportStripHeaderHeight}
    />,
    survivalBesideVennTarget,
  );
}

function BesideVennHistogramCard({
  d,
  chartRef,
  histogramCardSizes,
  allInputsEmpty,
  chartPreviewMode = false,
  beginStripChartDrag,
  endStripChartDrag,
  setDragOverDataset,
  captureHistogramDragCardSize,
  clearHistogramDragSize,
  getChartTitle,
  data,
  filteredData,
  viewType,
  chartVisualByPanelId,
  besideHistogramBarSums,
  besideStripPlotHeight,
  defaultPlotHeightPx,
  besidePeerShellBox = null,
  besideColumnPlotHeightPx,
  cellHover,
  handleMouseEnter,
  handleMouseLeave,
  classes,
  setExpandedChart,
  setActiveTab,
  downloadChart,
  handleRemoveHistogramDataset,
  handleHistogramCardResizeStart,
  c1Name,
  c2Name,
  c3Name,
  draggingDataset,
  chartTypeMenuDataset,
  setChartTypeMenuDataset,
  chartTypeMenuRef,
  setChartVisualForPanel,
  sharedStripHeaderHeightPx,
  sharedStripChromeHeightPx,
  reportStripHeaderHeight,
}) {
  const chartTitleRef = useRef(null);
  const actionButtonsRef = useRef(null);
  const isDragSourceHere = draggingDataset === d;
  const plotHeightPx =
    besidePeerShellBox && besideColumnPlotHeightPx != null
      ? besideColumnPlotHeightPx
      : besideStripPlotHeight;
  const iconScale = histogramHeaderIconScale(plotHeightPx, defaultPlotHeightPx);
  const actionIconPx = Math.round(CHART_HEADER_ACTION_ICON_PX * iconScale);
  const chartTypeIconPx = Math.round(CHART_HEADER_CHART_TYPE_ICON_PX * iconScale);
  const hasDatasetData = Array.isArray(data[d]) && data[d].length > 0;
  const showChartBody = chartPreviewMode || hasDatasetData;
  const chartPreviewStyle = getChartPreviewContentStyle(chartPreviewMode);

  useLayoutEffect(() => {
    if (typeof reportStripHeaderHeight !== 'function') return undefined;
    const titleEl = chartTitleRef.current;
    const actionsEl = actionButtonsRef.current;
    if (!titleEl && !actionsEl) return undefined;

    const measure = () => {
      const contentH = Math.max(
        titleEl ? titleEl.offsetHeight : 0,
        actionsEl ? actionsEl.offsetHeight : 0,
        CHART_HEADER_ACTION_ICON_PX,
      );
      reportStripHeaderHeight(
        d,
        contentH + HISTOGRAM_HEADER_PAD_TOP_PX + HISTOGRAM_HEADER_PAD_BOTTOM_PX,
      );
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    if (titleEl) ro.observe(titleEl);
    if (actionsEl) ro.observe(actionsEl);
    return () => ro.disconnect();
  }, [d, reportStripHeaderHeight, getChartTitle, filteredData, histogramCardSizes]);

  return (
    <ChartWrapper
      data-ca-histogram-strip-dataset={d}
      ref={(el) => { chartRef.current[d] = el; }}
      style={{
        ...(isDragSourceHere
          ? HISTOGRAM_DRAG_SOURCE_COLLAPSED_STYLE
          : besidePeerShellBox && besidePeerShellBox.width != null && besidePeerShellBox.height != null
            ? {
              width: besidePeerShellBox.width,
              minWidth: besidePeerShellBox.width,
              height: besidePeerShellBox.height,
              minHeight: besidePeerShellBox.height,
              flexShrink: 0,
              alignSelf: 'flex-start',
              maxWidth: 'none',
              boxSizing: 'border-box',
            }
            : {
              ...(histogramCardSizes[d] && histogramCardSizes[d].width != null
                ? {
                  width: histogramCardSizes[d].width,
                  maxWidth: 'none',
                }
                : {}),
              height: plotHeightPx + sharedStripChromeHeightPx,
              minHeight: plotHeightPx + sharedStripChromeHeightPx,
              flexShrink: 0,
              alignSelf: 'flex-start',
              boxSizing: 'border-box',
            }),
        ...chartPreviewStyle,
        cursor: allInputsEmpty ? 'default' : 'grab',
      }}
      draggable={!allInputsEmpty}
      onDragStart={(event) => {
        setDragOverDataset(null);
        captureHistogramDragCardSize(event, d);
        const payload = encodePanelDragPayload({ kind: 'histogram', dataset: d });
        event.dataTransfer.setData(CA_PANEL_DRAG_MIME, payload);
        event.dataTransfer.setData('text/plain', d);
        event.dataTransfer.effectAllowed = 'move';
        const imgEl = event.currentTarget || chartRef.current[d];
        if (imgEl) {
          event.dataTransfer.setDragImage(imgEl, 32, 20);
        }
        beginStripChartDrag(d);
      }}
      onDragEnd={() => {
        endStripChartDrag();
      }}
    >
      <HeaderSection
        style={{
          height: sharedStripHeaderHeightPx,
          minHeight: sharedStripHeaderHeightPx,
        }}
      >
        <ChartTitle ref={chartTitleRef} className={`${showChartBody ? '' : 'empty'}`}>
          <span
            role="button"
            tabIndex={0}
            data-ca-chart-title-drag
            aria-label={`Drag ${getChartTitle(d) || 'chart'}`}
            style={{
              cursor: allInputsEmpty ? 'not-allowed' : 'grab',
              opacity: allInputsEmpty ? 0.45 : 1,
            }}
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
            <span data-ca-chart-title-text>{getChartTitle(d)}</span>
          </ChartTitleLabel>
        </ChartTitle>
        <ChartActionButtons ref={actionButtonsRef}>
          <ChartTypeDropdownRoot
            ref={chartTypeMenuDataset === d ? chartTypeMenuRef : undefined}
          >
            <ChartTypeTriggerButton
              type="button"
              $hitTarget={chartTypeIconPx}
              disabled={allInputsEmpty}
              aria-haspopup="listbox"
              aria-expanded={chartTypeMenuDataset === d}
              aria-label="Chart type"
              onClick={() => {
                if (allInputsEmpty) return;
                setChartTypeMenuDataset((prev) => (prev === d ? null : d));
              }}
            >
              <ChartTypeIcon
                type={chartVisualByPanelId[d] || DEFAULT_CHART_TYPE}
                size={chartTypeIconPx}
              />
            </ChartTypeTriggerButton>
            {chartTypeMenuDataset === d && !allInputsEmpty && (
              <ChartTypeDropdownPanel role="listbox" aria-label="Choose chart type">
                {CHART_TYPE_OPTIONS.map(({ type, label }) => (
                  <ChartTypeOption
                    key={type}
                    type="button"
                    $active={(chartVisualByPanelId[d] || DEFAULT_CHART_TYPE) === type}
                    aria-label={label}
                    aria-selected={(chartVisualByPanelId[d] || DEFAULT_CHART_TYPE) === type}
                    onClick={() => {
                      setChartVisualForPanel(d, type);
                      setChartTypeMenuDataset(null);
                    }}
                  >
                    <ChartTypeIcon type={type} size={Math.max(20, chartTypeIconPx - 2)} />
                  </ChartTypeOption>
                ))}
              </ChartTypeDropdownPanel>
            )}
          </ChartTypeDropdownRoot>
          <span style={{ cursor: allInputsEmpty ? 'default' : 'pointer' }} onClick={() => { if (!allInputsEmpty) { setExpandedChart(d); setActiveTab(d); } }}>
            <img src={ExpandIcon} alt="" width={actionIconPx} height={actionIconPx} style={{ opacity: allInputsEmpty ? 0.5 : 1, display: 'block' }} />
          </span>
          <span style={{ cursor: allInputsEmpty ? 'default' : 'pointer' }} onClick={() => !allInputsEmpty && downloadChart(d, false)}>
            <img src={DownloadIcon} alt="" width={actionIconPx} height={actionIconPx} style={{ opacity: allInputsEmpty ? 0.5 : 1, display: 'block' }} />
          </span>
          <button
            type="button"
            className={classes.headerCloseButton}
            aria-label={`Remove ${getChartTitle(d) || 'chart'} from layout`}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveHistogramDataset(d);
            }}
          >
            <img src={histogramCloseIcon} alt="" width={actionIconPx} height={actionIconPx} style={{ opacity: allInputsEmpty ? 0.45 : 1, display: 'block' }} />
          </button>
        </ChartActionButtons>
      </HeaderSection>
      <div
        className={classes.chartContentWrapper}
        style={{ paddingBottom: `${HISTOGRAM_CARD_CONTENT_BOTTOM_PAD_PX}px` }}
      >
        {showChartBody ? (
          <div
            id={`chart-beside-${d}`}
            className={classes.chartPlotArea}
            style={{
              minHeight: plotHeightPx,
              height: plotHeightPx,
            }}
          >
            <HistogramDatasetChart
              rows={chartPreviewMode ? [] : filteredData[d]}
              viewType={viewType[d] || 'percentage'}
              chartType={chartVisualByPanelId[d] || DEFAULT_CHART_TYPE}
              valueA={besideHistogramBarSums.valueA}
              valueB={besideHistogramBarSums.valueB}
              valueC={besideHistogramBarSums.valueC}
              compact={requiresCompactSpacing(d)}
              height={plotHeightPx}
              width="100%"
              estimatedChartWidth={
                besidePeerShellBox && besidePeerShellBox.width != null
                  ? Math.max(280, besidePeerShellBox.width - 48)
                  : histogramCardSizes[d] && histogramCardSizes[d].width != null
                    ? Math.max(280, histogramCardSizes[d].width - 48)
                    : 400
              }
              cellHover={cellHover}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              xAxisHeight={50}
              c1Name={c1Name || 'Cohort A'}
              c2Name={c2Name || 'Cohort B'}
              c3Name={c3Name || 'Cohort C'}
              previewShell={chartPreviewMode}
              relaxedHorizontalBarSpacing
            />
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              minHeight: plotHeightPx,
              height: plotHeightPx,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxSizing: 'border-box',
            }}
          >
            <HistogramChartEmptyState />
          </div>
        )}
      </div>
      <ChartResizeHandle
        aria-label="Resize chart beside Venn"
        title="Drag to resize chart"
        onMouseDown={(ev) => handleHistogramCardResizeStart(ev, d)}
        style={{ opacity: allInputsEmpty ? 0.35 : 1, pointerEvents: allInputsEmpty ? 'none' : 'auto' }}
      />
    </ChartWrapper>
  );
}
