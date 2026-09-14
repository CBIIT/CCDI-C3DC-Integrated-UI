import { makeStyles } from '@material-ui/core';

export const useHistogramPanelMuiStyles = makeStyles({
  cohortNameEllipsis: {
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
  },
  chartContentWrapper: {
    margin: 0,
    width: '100%',
    flex: '0 0 auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  chartPlotArea: {
    width: '100%',
    flex: '0 0 auto',
  },
  headerCloseButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: 4,
    color: '#1C2B33',
    lineHeight: 0,
    margin: 0,
    /* Optical: X glyph reads slightly right-heavy — nudge the art left without
       changing the shared action-icon flex gap. */
    '& img': {
      transform: 'translateX(-3px)',
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.06)',
    },
    '&:focus-visible': {
      outline: '2px solid #18677A',
      outlineOffset: 1,
    },
  },
});
