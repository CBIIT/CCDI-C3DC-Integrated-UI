import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, withStyles } from '@material-ui/core';
import styles from './ExploreUserGuideStyle';
import userguideIcon from '../../../assets/icons/Explore_User_Guide_Icon.svg';
import userguideIconWhite from '../../../assets/icons/Explore_User_Guide_Icon_White.svg';
import { useUserGuide } from './UserGuideContext';

const UseGuideButtonContainer = styled.div`
  background-color: #337478;

  .buttonContainer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12.5px 0;
  }

  .buttonText {
    color: #ffffff;
    font-family: "Nunito";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 8px;
  }
`;

const ExploreUserGuide = ({ classes }) => {
  const { openUserGuide } = useUserGuide();
  const [isHover, setIsHover] = useState(false);

  return (
    <UseGuideButtonContainer>
      <div className="buttonContainer">
        <Button
          variant="outlined"
          onClick={() => openUserGuide()}
          className={classes.customButton}
          classes={{ root: classes.clearAllButtonRoot }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <img src={isHover ? userguideIcon : userguideIconWhite} alt="user guide icon" />
        </Button>
        <div className="buttonText">Explore the CCDI User Guide</div>
      </div>
    </UseGuideButtonContainer>
  );
};

export default withStyles(styles)(ExploreUserGuide);
