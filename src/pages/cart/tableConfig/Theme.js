const COLUMN_MIN_WIDTH = '150px';

export const tblHeader = {
  MuiTableSortLabel: {
    root: {
      color: 'var(--Primary-Primary-4, #0F253A)',
      position: 'relative',
      fontSize: '17px',
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: '17px',
      letterSpacing: '0.06em',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      '&:hover': {
        color: 'var(--Primary-Primary-4, #0F253A)',
      },
    },
  },
  MuiTableCell: {
    root: {
      padding: '0px 0px 0px 25px',
      paddingRight: '5px',
      color: '#13344A',
      minWidth: COLUMN_MIN_WIDTH,
      '&.del_all_row': {
        cursor: 'pointer',
      },
    },
  },
  MuiTooltip: {
    tooltipPlacementBottom: {
      '@media (min-width: 600px)': {
        marginTop: '-10px',
        marginLeft: '-20px',
        background: 'none',
      },
    },
    popper: {
      '&#header-tooltip div': {
        background: '#61614F',
        marginTop: '0px',
        marginLeft: '0px',
      },
    },
  },
  MuiIconButton: {
    root: {
      '&.del_all_row_btn': {
        paddingLeft: '5px',
      },
    },
  },
  MuiTypography: {
    root: {
      color: '#A61401',
      '&.remove_all_tooltip': {
        width: '110px',
        border: '2px solid #A61401',
        height: '48px',
        padding: '5px 10px',
        fontSize: '12px',
        background: '#fff',
        textAlign: 'center',
        fontWeight: '500',
        borderRadius: '7px',
      },
      '&.del_all_row_text': {
        float: 'left',
        fontSize: '11pt',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Lato Regular, Raleway, sans-serif',
        lineHeight: '47px',
      },
    },
  },
};

export const tblPgn = {
  MuiTablePagination: {
    root: {
      paddingRight: '50px',
      marginLeft: 'auto',
      // borderTop: '5px solid #e7e5e5',
      // borderBottom: '3px solid #e7e5e5',
    },
    toolbar: {
      minHeight: '45px',
    },
    caption: {
      textTransform: 'none',
      fontFamily: 'Poppins',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: '600',
      '&:first-of-type': {
        fontSize: 0,
        '&:before': {
          content: '"ROWS PER PAGE:"',
          fontSize: '12px',
          fontStyle: 'normal',
          fontWeight: '600',
        },
      },
    },
    select: {
      fontFamily: 'Poppins',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: '600',
    },
  },
  MuiSelect: {
    root: {
      fontFamily: 'Open Sans',
      fontSize: '14px',
    },
    select: {
      '&:focus': {
        backgroundColor: '#FFFFFF'
      }
    },
    icon: {
      padding: '2px 0 0 3px',
    },
    iconOpen: {
      padding: '2px 0 0 3px',
    },
  },
  MuiMenu: {
    paper: {
      boxShadow: 'none',
      border: '1px solid #99A1B7',
      background: '#F5F5F5',
    },
    list: {
      paddingTop: '0',
      paddingBottom: '0',
    }
  },
  MuiMenuItem: {
    root: {
      fontFamily: 'Open Sans',
      fontSize: '14px',
      padding: '2px 8px',
      paddingTop: '2px',
      paddingBottom: '2px',
      minHeight: '24px',
    }
  },
  MuiListItem: {
    button: {
      '&:hover': {
        backgroundColor: '#F5F5F5',
        color: 'rgb(96, 121, 123)',
      }
    },
  },
};

export const tblBody = {
  MuiTableBody: {
    root: {
      margin: 'auto 3% auto 3%',
      maxWidth: '100%',
    },
  },
  MuiTableCell: {
    body: {
      color: '#004C73',
      borderBottom: 'none',
      '& p': {
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: '400',
        color: '#0F253A',
      },
      '&.file_name': {
        '& p': {
          overflowWrap: 'anywhere',
          paddingTop: '10px',
          paddingBottom: '10px',
        },
      },
      '&.participant_id, &.sample_id': {
        color: 'var(--Primary-Primary-4, #0F253A)',
      },
      '&.delete_row': {
        padding: '0px',
        textAlign: 'center',
        verticalAlign: 'middle',
      },
    },
    root: {
      minHeight: '45px',
      padding: '0px 0px 0px 25px',
      paddingRight: '20px',
      color: '#004C73',
      borderBottom: 'none',
      minWidth: COLUMN_MIN_WIDTH,
      '& .del_row_btn': {
        padding: '0px',
      },
      '& .del_row_btn_icon': {
        display: 'block',
        margin: '0 auto',
      },
    },
  },
};

export const tblContainer = {
  MuiTableContainer: {
    root: {
      width: '100%',
      overflowX: 'auto',
      transform: 'rotateX(180deg)',
      boxShadow: 'none',
      borderRadius: '0',
    }
  },
  MuiTable: {
    root: {
      transform: 'rotateX(180deg)',
      width: '100%',
      display: 'table',
      borderSpacing: '0',
      borderCollapse: 'collapse',
    },
  },
};

export const themeConfig = {
  tblHeader,
  tblPgn,
  tblBody,
  tblContainer,
};
