/**
 * Default Modal Styles
 */
export default (theme) => ({
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '100%',
    height: 'auto',
    minWidth: '437.5px',
    minHeight: '472px',
    maxHeight: '100%',
    maxWidth: '944px',
    borderRadius: '10px',
    border: '1px solid #598AC5',
    boxShadow: theme.shadows[5],
    backgroundColor: theme.palette.background.paper,
    // Outer container scrolls so the title's close (X) and the bottom action
    // buttons are reachable when content overflows. Mirrors the inner cohort /
    // participant boxes: style only the ::-webkit-scrollbar pseudo-elements
    // (no standard scrollbar-width/color) so Chromium renders a classic,
    // non-overlay scrollbar that stays visible whenever it is applicable.
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#CECECE',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#8B98AF',
      borderRadius: '10px',
    },
  },
  modalTitle: {
    fontFamily: 'Poppins',
    borderBottom: '1px solid #BDBFC2',
    fontSize: 20,
    color: '#000000',
    padding: '16px 34px 13px 30px',
    margin: '0px',
    lineHeight: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '400',
  },
  alert: {
    position: 'absolute',
    width: '20%',
    height: 'auto',
    top: '6%',
    left: '40%',
  },
  closeRoot: {
    height: 13,
    marginBottom: 2,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '34px 51px 79px 32px',
    gap: '37px',
    width: '100%',
    flexGrow: 1,
  },
});
