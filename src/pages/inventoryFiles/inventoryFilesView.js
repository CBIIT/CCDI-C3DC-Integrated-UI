import React from 'react';
import {
  Grid,
  withStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { landingPageData } from '../../bento/landingPageData';

const InventoryFilesView = ({ classes }) => (
  <div className={classes.page}>
    <div className={classes.container}>
      <div className={classes.inventoryFilesContainer}>
        Working in progress...
      </div>
    </div>
  </div>
);
const styles = () => ({
  "@keyframes heartbeatPulse": {
    "0%": {
      clipPath: "inset(0px 100% 0px 0px)" 
    },
    "32.33%": { //left
      clipPath: "inset(0px 47.1% 0px 0px)" 
    },
    "39.67%": { //peak
      clipPath: "inset(0px 45.2% 0px 0px)" 
    },
    "47%": { //drop -3
      clipPath: "inset(0px 43% 0px 0px)" 
    },
    "51.56%": { //left -4
      clipPath: "inset(0px 31.0% 0px 0px)" 
    },
    "58.89%": { //peak -5
      clipPath: "inset(0px 29.0% 0px 0px)" 
    },
    "66.22%": { //drop -6
      clipPath: "inset(0px 26.8% 0px 0px)" 
    },
    "70.78%": { //left -7
      clipPath: "inset(0px 14.8% 0px 0px)" 
    },
    "78.11%": { //peak -8
      clipPath: "inset(0px 12.9% 0px 0px)" 
    },
    "85.44%": { //drop -9 
      clipPath: "inset(0px 10.7% 0px 0px)" 
    },
    "88%": {
      clipPath: "inset(0px 1.7% 0px 0px)",
      opacity: '1'
    },
    "100%": {
      clipPath: "inset(0px 1.7% 0px 0px)",
      opacity: '0'
    },
  },
  heartbeatPulse:{
    '--svg-width': '618px',
    '--svg-height': '67px',
    position: 'absolute',
    left: '50%',
    marginLeft: '-720px',
    top: '515px',
    animation: '6s $heartbeatPulse infinite linear',
  },
  heartlineTracker:{
    position: 'absolute',
    top: '570px',
    left: '50%',
    marginLeft: "-726px",
    animation: '6s $heartlineTracking infinite linear'
  },
  page: {
    marginTop: '0px',
  },
  heroImage: {
    width: '100%',
    maxWidth: '100%',
    height: '670px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundImage: `url(${landingPageData.landingPageHero.img})`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroFrame: {
    height: '614px',
    width: '1440px',
    border: 'solid 3.25px #f7fbfd',
    borderRadius: '12px'
  },
  container: {
    fontFamily: 'Raleway, sans-serif',
    margin: '0 auto',
  },
  inventoryFilesContainer: {
    display: 'flex',
    maxWidth: '1800px',
    padding: '33px 100px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#000000',
    margin: '0 auto',
  },
});
export default withStyles(styles, { withTheme: true })(InventoryFilesView);
