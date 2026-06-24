const rowGrid = {
  display: 'grid',
  gridTemplateColumns: 'minmax(140px, 34%) minmax(120px, 1fr) minmax(96px, auto)',
  columnGap: '12px',
  alignItems: 'center',
};

const styles = {
  chartWrapper: {
    width: '100%',
    marginTop: '12px',
  },
  chartWrapperModal: {
    width: '100%',
    marginTop: '8px',
  },
  chartHeader: {
    ...rowGrid,
    padding: '0 8px 8px',
    borderBottom: '1px solid #D9D9D9',
  },
  categoryHeader: {
    fontFamily: 'Open Sans',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#71767A',
  },
  barHeader: {
    display: 'block',
  },
  valueHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    textAlign: 'right',
    lineHeight: '13px',
  },
  valueHeaderLine: {
    display: 'block',
    fontFamily: 'Open Sans',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#71767A',
    whiteSpace: 'nowrap',
  },
  chartBody: {
    maxHeight: '360px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  chartBodyModal: {
    maxHeight: '520px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  chartRow: {
    ...rowGrid,
    minHeight: '32px',
    padding: '2px 8px',
    backgroundColor: '#FFFFFF',
  },
  rowLabel: {
    fontFamily: 'Open Sans',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#1B1B1B',
    wordBreak: 'break-word',
  },
  rowBarTrack: {
    position: 'relative',
    height: '26px',
    backgroundImage: 'linear-gradient(to right, #ECECEC 1px, transparent 1px)',
    backgroundSize: '20% 100%',
  },
  rowBar: {
    height: '100%',
    minWidth: '2px',
    borderRadius: '1px',
  },
  rowValue: {
    fontFamily: 'Open Sans',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '18px',
    color: '#1B1B1B',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
};

export default styles;
