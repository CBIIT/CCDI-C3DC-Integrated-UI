export const customTheme = {
  MuiTabs: {
    root: {
      borderBottom: '2px solid #71767A',
    },
  },
  MuiTab: {
    root: {
      marginTop: '40px',
      color: '#6E6E6E',
      height: '45px',
      overflow: 'hidden',
      background: '#D7D7D7',
      borderTop: '6px solid #8B8B8B',
      borderLeft: '1px solid #8B8B8B',
      borderRight: '1px solid #8B8B8B',
      fontWeight: '400',
      lineHeight: '19px',
      letterSpacing: '0.25px',
      marginRight: '10px',
      fontSize: '18px',
      width: '203px',
      textTransform: 'none',
      fontFamily: 'Poppins',
      '& span': {
        color: '#000000',
      },
      '&.Mui-selected': {
        fontWeight: '500',
        '&.participants': {
          background: '#B3D6EA',
          color: '#000000',
          borderTop: '6px solid #07679C',
        },
        '&.samples': {
          background: '#B3D6EA',
          color: '#000000',
          borderTop: '6px solid #07679C',
        },
        '&.files': {
          background: '#B3D6EA',
          color: '#000000',
          borderTop: '6px solid #07679C',
        },
        '&.diagnosis': {
          background: '#B3D6EA',
          color: '#000000',
          borderTop: '6px solid #07679C',
        },
        '&.studies': {
          background: '#B3D6EA',
          color: '#000000',
          borderTop: '6px solid #07679C',
        },
        '&.genetic_analyses': {
          background: '#B3D6EA',
          color: '#000000',
          borderTop: '6px solid #07679C',
        },
        '&.treatments': {
          background: '#B3D6EA',
          color: '#000000',
          borderTop: '6px solid #07679C',
        },
        '&.treatment_responses': {
          background: '#B3D6EA',
          color: '#000000',
          borderTop: '6px solid #07679C',
        },
        '&.survival': {
          background: '#B3D6EA',
          color: '#000000',
          borderTop: '6px solid #07679C',
        },
        '&.MuiTypography-body1': {
          color: 'red',
        },
      },
      '& span.participants_count': {
        marginLeft: '5px',
        fontSize: '16px',
        fontWeight: '300',
      },
      '& span.samples_count': {
        marginLeft: '5px',
        fontSize: '16px',
        fontWeight: '300',
      },
      '& span.files_count': {
        marginLeft: '5px',
        fontSize: '16px',
        fontWeight: '300',
      },
      '& span.diagnosis_count': {
        marginLeft: '5px',
        fontSize: '16px',
        fontWeight: '300',
      },
      '& span.studies_count': {
        marginLeft: '5px',
        fontSize: '16px',
        fontWeight: '300',
      },
      '& span.genetic_analyses_count': {
        marginLeft: '5px',
        fontSize: '16px',
        fontWeight: '300',
      },
      '& span.treatments_count': {
        marginLeft: '5px',
        fontSize: '16px',
        fontWeight: '300',
      },
      '& span.treatment_responses_count': {
        marginLeft: '5px',
        fontSize: '16px',
        fontWeight: '300',
      },
      '& span.survival_count': {
        marginLeft: '5px',
        fontSize: '16px',
        fontWeight: '300',
      },
    },
  },
  MuiList: {
    root: {
      '&.popover-list': {
        padding: 0,
      },
    },
  },
  MuiListItem: {
    root: {
      '&.popover-list-item': {
        minWidth: '200px',
        padding: '7.5px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '&:first-child': {
          paddingTop: '10px',
        },
        '&:last-child': {
          paddingBottom: '10px',
        },
        '& .popover-tab-name': {
          fontFamily: 'Poppins',
          fontWeight: 300,
          fontSize: '14px',
          color: 'black',
          lineHeight: '107%',
          textTransform: 'capitalize',
          flex: 1,
          textAlign: 'left',
        },
        '& .popover-tab-count': {
          fontFamily: 'Poppins',
          fontWeight: 300,
          fontSize: '14px',
          color: 'black',
          lineHeight: '107%',
          textAlign: 'right',
          marginLeft: '16px',
        },
      },
    },
  },
  MuiButton: {
    root: {
      '&.more-button': {
        width: '125px',
        height: '45px',
        marginTop: '40px',
        marginRight: '10px',
        fontFamily: 'Poppins',
        fontWeight: 300,
        fontSize: '14px',
        lineHeight: '107%',
        letterSpacing: '-2%',
        textTransform: 'capitalize',
        color: 'black',
        background: 'transparent',
        border: 'none',
        '&:hover': {
          background: 'transparent',
        },
        '& span': {
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        },
        '& img': {
          height: '15px',
        },
      },
    },
  },
};
