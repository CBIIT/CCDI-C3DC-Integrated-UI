const styles = {
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px',
  },
  modalControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '8px',
  },
  dropdown: {
    flex: '1 1 auto',
    minWidth: 0,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Open Sans',
      fontSize: '16px',
      fontWeight: 600,
      color: '#1B1B1B',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#71767A',
    },
    '& .MuiSelect-select:focus': {
      backgroundColor: '#FFFFFF',
    },
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: '0 0 auto',
  },
  actionButton: {
    padding: '4px',
    border: 'none',
    borderRadius: '4px',
    width: '42px',
    height: '42px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  actionIcon: {
    width: '22px',
    height: '22px',
    display: 'block',
  },
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff',
    outline: 'none',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    width: 'min(960px, calc(100vw - 48px))',
    maxHeight: 'calc(100vh - 48px)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #BDBFC2',
    padding: '16px 30px 8px 50px',
    marginBottom: '16px',
    flex: '0 0 auto',
  },
  modalTitle: {
    margin: '0px',
    fontSize: '19px',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  titleSpan: {
    fontWeight: '700',
  },
  closeButton: {
    minWidth: '0px',
    padding: '4px',
  },
  modalBody: {
    padding: '0 50px 24px',
    overflowY: 'auto',
    flex: '1 1 auto',
  },
};

export default styles;
