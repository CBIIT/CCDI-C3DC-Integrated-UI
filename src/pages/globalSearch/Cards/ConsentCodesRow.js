import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { cn } from 'bento-components';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { ReactComponent as DownArrowIcon } from '../assets/Down_Arrow.svg';
import { ReactComponent as UpArrowIcon } from '../assets/Up_Arrow.svg';
import {
  CONSENT_GLOSSARY_URL,
  parseConsentCodes,
  getConsentCodesMaxLength,
} from './utils/consentCodes';


/**
 * Consent codes property row for global search cards (participant / studies).
 * Expects parent `classes` to include: propertyLine, keyAndValueRow, key,
 * consentCodesRow, consentCodesContainer, treatmentTextContainer, clickableText,
 * consentCodeItem, consentCodeLink, consentExternalIcon, expandToggle, expandIcon.
 */
const ConsentCodesRow = ({ consentCodes, classes }) => {
  const [consentCodesExpanded, setConsentCodesExpanded] = useState(false);
  const [maxLength, setMaxLength] = useState(getConsentCodesMaxLength);

  useEffect(() => {
    const handleResize = () => {
      setMaxLength(getConsentCodesMaxLength());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const codes = parseConsentCodes(consentCodes);
  if (codes.length === 0) {
    return null;
  }

  const joined = codes.join('; ');
  const shouldTruncate = joined.length > maxLength;

  const getDisplayItems = () => {
    if (!shouldTruncate || consentCodesExpanded) {
      return codes.map((c) => ({ text: c, fullCode: c }));
    }
    let acc = '';
    const visible = [];
    for (let i = 0; i < codes.length; i += 1) {
      const code = codes[i];
      const sep = visible.length ? '; ' : '';
      const next = acc + sep + code;
      if (next.length > maxLength) {
        if (visible.length === 0) {
          return [{ text: `${code.substring(0, maxLength)}...`, fullCode: code }];
        }
        break;
      }
      visible.push(code);
      acc = next;
    }
    return visible.map((c) => ({ text: c, fullCode: c }));
  };

  const displayItems = getDisplayItems();
  const showMoreIndicator = shouldTruncate && !consentCodesExpanded && displayItems.length < codes.length;

  const handleToggleExpand = () => {
    setConsentCodesExpanded(!consentCodesExpanded);
  };

  return (
    <div className={classes.propertyLine}>
      <div className={cn(classes.keyAndValueRow, classes.consentCodesRow)}>
        <Typography variant="h6" className={classes.key} component="div">
          CONSENT CODES:
        </Typography>
        <div className={classes.consentCodesContainer}>
          <div className={classes.treatmentTextContainer}>
            <span
              className={shouldTruncate ? classes.clickableText : undefined}
              style={{ display: 'inline', paddingLeft: 0 }}
              onClick={shouldTruncate ? handleToggleExpand : undefined}
              onKeyDown={
                shouldTruncate
                  ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggleExpand();
                    }
                  }
                  : undefined
              }
              role={shouldTruncate ? 'button' : undefined}
              tabIndex={shouldTruncate ? 0 : undefined}
            >
              {displayItems.map((item, i) => (
                <React.Fragment key={`${item.fullCode}-${i}`}>
                  {i > 0 ? '; ' : ''}
                  <span className={classes.consentCodeItem}>
                    <a
                      href={CONSENT_GLOSSARY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.consentCodeLink}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${item.fullCode} (opens dbGaP consent glossary in a new tab)`}
                    >
                      {item.text}
                    </a>
                    <OpenInNewIcon className={classes.consentExternalIcon} fontSize="small" aria-hidden />
                  </span>
                </React.Fragment>
              ))}
              {showMoreIndicator ? '...' : null}
            </span>
          </div>
        </div>
      </div>
      {shouldTruncate ? (
        <span
          className={classes.expandToggle}
          onClick={handleToggleExpand}
        >
          {consentCodesExpanded
            ? <UpArrowIcon className={classes.expandIcon} />
            : <DownArrowIcon className={classes.expandIcon} />}
        </span>
      ) : null}
    </div>
  );
};

export default ConsentCodesRow;
