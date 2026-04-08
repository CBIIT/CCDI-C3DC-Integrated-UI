import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  exploreNavTo,
  EXPLORE_FILES_PATH,
  EXPLORE_PARTICIPANTS_PATH,
} from '../../../utils/exploreNavUtils.js';
import ToolTip from '@bento-core/tool-tip';
import helpIcon from '../../../assets/icons/Question_icon_2_white.svg';

const KNOB_TRAVEL_PX = 24;
const TRACK_W = 48;
const TRACK_H = 24;

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 16px;
  padding: 0 5px;
`;

const LabelTextButton = styled.button`
  margin: 0;
  padding: 4px 0 4px 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: left;

  &:focus-visible {
    outline: 2px solid #5d53f6;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const LabelRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
`;

const LabelText = styled.span`
  display: block;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.0color
  cursor: pointer;
  color: ${(p) => (p.$active ? '#ffffff' : '#dddddd')};
  text-transform: uppercase;
  transition: color 0.2s ease;
`;

const HelpIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  line-height: 0;
  flex-shrink: 0;

  &:focus-visible {
    outline: 2px solid #5d53f6;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const HelpIconImg = styled.img`
  width: 14px;
  height: 14px;
  display: block;
  color: #ffffff;
  &:hover {
    color: #9ca3af;
  }
`;

const Track = styled.div`
  position: relative;
  flex-shrink: 0;
  width: ${TRACK_W}px;
  height: ${TRACK_H}px;
  padding: 0;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: #ffffff;
  box-sizing: border-box;

  &:focus-visible {
    outline: 2px solid #5d53f6;
    outline-offset: 2px;
  }
`;

const Knob = styled.span`
  position: absolute;
  top: 1px;
  left: 1px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6b46c1;
  transition: transform 0.2s ease;
  transform: translateX(${(p) => (p.$files ? `${KNOB_TRAVEL_PX}px` : '0')});
  pointer-events: none;
`;

function SwitchNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isExploreFiles = location.pathname === EXPLORE_FILES_PATH;

  const goTo = useCallback(
    (files) => {
      const path = files ? EXPLORE_FILES_PATH : EXPLORE_PARTICIPANTS_PATH;
      navigate(exploreNavTo(path, location));
    },
    [navigate, location],
  );

  const onTrackActivate = useCallback(() => {
    goTo(!isExploreFiles);
  }, [goTo, isExploreFiles]);

  const onTrackKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onTrackActivate();
      }
    },
    [onTrackActivate],
  );

  return (
    <Root>
      <LabelRow>
        <LabelTextButton type="button" onClick={() => goTo(false)} aria-pressed={!isExploreFiles}>
          <LabelText $active={!isExploreFiles}>Explore participant</LabelText>
        </LabelTextButton>
        <ToolTip
          title="Search and filter inventory by participant."
          placement="top"
          arrow
        >
          <HelpIconButton type="button" aria-label="Explore participant">
            <HelpIconImg src={helpIcon} alt="" />
          </HelpIconButton>
        </ToolTip>
      </LabelRow>

      <Track
        role="switch"
        tabIndex={0}
        aria-checked={isExploreFiles}
        aria-label={isExploreFiles ? 'Explore files' : 'Explore participant'}
        onClick={onTrackActivate}
        onKeyDown={onTrackKeyDown}
      >
        <Knob $files={isExploreFiles} />
      </Track>

      <LabelRow>
        <LabelTextButton type="button" onClick={() => goTo(true)} aria-pressed={isExploreFiles}>
          <LabelText $active={isExploreFiles}>Explore files</LabelText>
        </LabelTextButton>
        <ToolTip
          title="Search and filter inventory by file."
          placement="top"
          arrow
        >
          <HelpIconButton type="button" aria-label="Explore files">
            <HelpIconImg src={helpIcon} alt="" />
          </HelpIconButton>
        </ToolTip>
      </LabelRow>
    </Root>
  );
}

export default SwitchNav;
