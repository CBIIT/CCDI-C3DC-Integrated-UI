export const customTheme = {
  MuiContainer: {
    root: {
      paddingTop: '5px',
      '&.container_outer_layout': {
        maxWidth: '100%',
        height: '75px',
        paddingLeft: '0px',
        borderBottom: '#98ADC4 1px solid',
        display: 'flex',
        alignItems: 'center',
        gap: '0px',
        '& img': {
          flex: '0 0 auto',
          transform: 'translateY(-7px)',
          filter: 'drop-shadow(-3px 2px 6px rgba(27,28,28,0.29))',
        },
        '& span': {
          color: 'var(--Purple-Purple-1, #455299)',
          fontSize: '40px',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '45px',
          '&.cart_header_text': {
            letterSpacing: '0.017em',
          },
          '&.cart_sel_files_text': {
            letterSpacing: '0.025em',
            marginLeft: '0px',
          },
        },
      },
      '&.container_header': {
        maxWidth: '100%',
        padding: '15px 25px',
        position: 'relative',
        textAlign: 'left',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '22px',
        '& a.link': {
          display: 'inline-flex',
          marginLeft: 'auto',
        },
        '& .cart_description_text': {
          flex: '1 1 auto',
          maxWidth: '620px',
          color: 'var(--Neutral-Black, #1B1B1B)',
          fontFamily: 'Inter',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '24px',
          letterSpacing: '-0.32px',
        },
        '& img.tooltip_icon': {
          marginTop: '5px',
          marginLeft: '5px',
          marginRight: '7px',
          verticalAlign: 'top',
        },
      },
      '&.tooltip_icon': {
        width: '25px',
      },
      '&.container_footer': {
        maxWidth: '100%',
        textAlign: 'left',
        paddingLeft: '0px',
        '& textarea.manifest_comments': {
          color: '#000',
          border: '1.5px solid #707070',
          height: '170px',
          resize: 'none',
          padding: '15px',
          fontSize: '10px',
          minWidth: '412px',
          background: '#ebebeb',
          fontFamily: 'Open Sans',
          marginRight: '10px',
          borderRadius: '10px',
        },
      },
    },
  },
  MuiButton: {
    text: {
      padding: '10px 16px',
    },
    root: {
      color: '#fff',
      backgroundColor: '#2A6E93',
      fontFamily: 'Poppins',
      fontWeight: '600',
      fontSize: '12px',
      borderRadius: '5px',
      margin: '5px 0px',
      textTransform: 'uppercase',
      '&:hover': {
        backgroundColor: '#2A6E93',
      },
      '&.Mui-disabled': {
        color: '#fff',
        backgroundColor: '#B3D6EA',
      },
    },
  },
  MuiLink: {
    root: {
      height: '65px',
      color: '#3E6886',
      fontSize: '12px',
      fontFamily: 'Lato',
      borderBottom: '1px solid #3E6886',
      textDecoration: 'none',
    },
  },
  MuiDialog: {
    paper: {
      width: '431px',
      height: '170px',
      borderRadius: '25px !important',
      textAlign: 'center',
      backgroundColor: '#E8DFDC !important',
      border: '2px solid #A61401',
    },
  },
  MuiDialogContent: {
    root: {
      padding: '40px 20px 0px 20px',
      '&.alter-content': {
        fontFamily: 'Lato',
        size: '16px',
      },
    },
  },
  MuiDialogActions: {
    root: {
      justifyContent: 'center',
      paddingBottom: '25px',
    },
  },
};

export const themeConfig = {
  customTheme,
};
