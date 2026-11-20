import gql from 'graphql-tag';
import studiesLogo from '../assets/stats/Studies_Logo.svg';
import participantsLogo from '../assets/stats/Participants_Logo.svg';
import samplesLogo from '../assets/stats/Samples_Logo.svg';
import fileLogo from '../assets/stats/Files_Logo.svg';

export const statsStyling = {
  global: {
    horizontalStyle: false,
    statTitleFirst: false,
    height: '56px',
    background: '#A2E0D2',
    top: '0',
    position: 'relative',
  },
  statsGroup: {
    borderRight: '1px solid #80ADA9',
    // Override the package's wider first/last groups as well as its defaults.
    '&&, &&:first-child, &&:last-child': {
      display: 'flex',
      alignItems: 'center',
      flex: '0 0 209px',
      width: '209px',
      minWidth: '209px',
      maxWidth: '209px',
      boxSizing: 'border-box',
      margin: '6px 0',
      padding: '0 35px',
      gap: '16px',
    },
  },
  statsIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 40px',
    width: '40px',
    height: 'auto',
    margin: 0,
    position: 'static',
    float: 'none',
  },
  statCount: {
    color: '#003D3D',
    fontFamily: 'Poppins',
    fontSize: '20px',
    fontWeight: '275',
    lineHeight: '17px',
    letterSpacing: '0.02em',
    margin: '4px 0 2px',
    float: 'none',
  },
  statTitle: {
    color: '#000000',
    fontFamily: 'Poppins',
    fontSize: '11px',
    fontWeight: '500',
    lineHeight: '16px',
    textTransform: 'uppercase',
    margin: 0,
    width: 'auto',
    float: 'none',
  },
};

/**
 * @property {statAPI} numberOfPrograms Used to index a stat value
 */
export const globalStatsData = [
  // A maximum of 6 stats are allowed
  {
    statTitle: 'Studies',
    type: 'field',
    statAPI: 'numberOfStudies',
    statIconSrc: studiesLogo,
    statIconAlt: 'An open notebook representing studies',
  },
  {
    statTitle: 'Participants',
    type: 'field',
    statAPI: 'numberOfParticipants',
    statIconSrc: participantsLogo,
    statIconAlt: 'A teddy bear representing participants'
  },
  {
    statTitle: 'Samples',
    type: 'field',
    statAPI: 'numberOfSamples',
    statIconSrc: samplesLogo,
    statIconAlt: 'A test tube holder with three test tubes in the holder representing samples'
  },
  {
    statTitle: 'Files',
    type: 'field',
    statAPI: 'numberOfFiles',
    statIconSrc: fileLogo,
    statIconAlt: 'An open file drawer representing files'
  },
];

// --------------- GraphQL query - Retrieve stats details --------------

export const GET_GLOBAL_STATS_DATA_QUERY = gql`{
  searchParticipants {
    numberOfStudies
    numberOfParticipants
    numberOfSamples
    numberOfFiles
  }
  }
  `;

export const GET_PARTICIPANTS_STATS_QUERY = gql`{
  numberOfParticipants
}`
