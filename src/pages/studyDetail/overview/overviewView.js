import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ToolTip from '@bento-core/tool-tip/dist/ToolTip';
import exportIcon from '../../../assets/studies/exportIcon.svg';
import manifestIcon from '../../../assets/studies/manifestIcon.svg';
import questionIcon from '../../../assets/icons/Question_icon_2.svg';
import { studyDownloadLinks, studycBioPortalLinks, studyClinicalDataLinks } from '../../../bento/studiesData';
import TabsView from './tabs/TabsView';
import { styles } from './overviewStyle';

const CONSENT_CODE_LINK = 'https://www.ncbi.nlm.nih.gov/gap/docs/submissionguide/#consentgloss';

const CONSENT_CODES_TOOLTIP = (
    'Consent codes describe the permitted uses and restrictions for this data. '
    + 'The codes below link to dbGaP and include details on General access (GRU) '
    + 'and different types of request-only access (e.g. HMB-IRB-NPU, MDS, etc...).'
);

const stripCodeBrackets = (code) => {
    let value = String(code).trim();
    if (!value) {
        return '';
    }

    value = value.replace(/^["']|["']$/g, '').trim();

    while (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).trim();
        value = value.replace(/^["']|["']$/g, '').trim();
    }

    return value;
};

const parseConsentCodes = (consentCodes) => {
    const finalizeCodes = (codes) => codes
        .map(stripCodeBrackets)
        .filter(Boolean);

    if (!consentCodes) {
        return [];
    }

    if (Array.isArray(consentCodes)) {
        return finalizeCodes(consentCodes);
    }

    if (typeof consentCodes === 'string') {
        let trimmed = consentCodes.trim();
        if (!trimmed) {
            return [];
        }

        if (trimmed.startsWith('[')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    return finalizeCodes(parsed);
                }
            } catch (error) {
                if (trimmed.endsWith(']')) {
                    trimmed = trimmed.slice(1, -1);
                }
            }
        }

        return finalizeCodes(
            trimmed
                .split(/[;,]/)
                .map((code) => code.trim()),
        );
    }

    return [];
};

const getCBioPortalLinkLabel = (url) => {
    try {
        const studyParam = new URL(url).searchParams.get('id');
        if (studyParam === 'openpedcan_v15') {
            return 'Open Pediatric Cancer Project v15';
        }
        if (studyParam === 'phs002790') {
            return 'Molecular Characterization Initiative';
        }
        return studyParam || 'View Study';
    } catch (error) {
        return 'View Study';
    }
};

const OverviewView = ({ data, classes }) => {
    const clinicalDataLinks = studyClinicalDataLinks[data.study_id];
    const cBioPortalLink = studycBioPortalLinks[data.study_id];
    const manifestLink = studyDownloadLinks[data.study_id];
    const hasFileDownloads = manifestLink || (clinicalDataLinks && clinicalDataLinks.length > 0);
    const consentCodes = parseConsentCodes(data.consent_codes);

    return (
        <div className={classes.container}>
            {/* Left Container for Study Details */}
            <div className={classes.leftContainer}>
                <div className={classes.studyItem}>
                    <div className={classes.studyItemTitle}>dbGaP Accession</div>
                    <div className={classes.studyItemContent}>
                        <a href={`https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${data.study_id}`} target="_blank" rel="noopener noreferrer">
                            {data.study_id}
                            <img className={classes.exportIcon} src={exportIcon} alt="exportIcon" />
                        </a>
                    </div>
                </div>
                <div className={classes.studyItem}>
                    <div className={classes.studyItemTitle}>STUDY NAME</div>
                    <div className={classes.studyItemContent}>{data.study_name}</div>
                </div>
                <div className={classes.studyItem}>
                    <div className={classes.studyItemTitle}>Study Description</div>
                    <div className={classes.studyItemContent}>{data.study_description}</div>
                </div>
                <div className={classes.studyItem}>
                    <div className={classes.studyItemTitle}>Access Data</div>
                    {consentCodes.length > 0 && (
                        <div className={classes.consentCodesPanel}>
                            <div className={classes.consentCodesLabel}>
                                <span>Consent Codes:</span>
                                <span className={classes.consentCodesTooltipWrapper}>
                                <ToolTip
                                    maxWidth="335px"
                                    border="1px solid #598AC5"
                                    arrowBorder="1px solid #598AC5"
                                    fontFamily="Poppins"
                                    fontWeight="400"
                                    fontSize="13px"
                                    lineHeight="17.5px"
                                    title={(
                                        <span className={classes.consentCodesTooltipText}>
                                            {CONSENT_CODES_TOOLTIP}
                                        </span>
                                    )}
                                    placement="top-end"
                                    arrow
                                    interactive
                                    arrowSize="30px"
                                >
                                    <img
                                        src={questionIcon}
                                        alt="Consent codes information"
                                        className={classes.consentCodesTooltipIcon}
                                    />
                                </ToolTip>
                                </span>
                            </div>
                            <div className={classes.consentCodesList}>
                                {consentCodes.map((code) => (
                                    <div key={code}>
                                        <a
                                            href={CONSENT_CODE_LINK}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={classes.consentCodeLink}
                                        >
                                            {code}
                                            <img className={classes.exportIcon} src={exportIcon} alt="exportIcon" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {(hasFileDownloads || cBioPortalLink) && (
                    <div className={classes.studyItemContent}>
                        {hasFileDownloads && (
                            <div className={classes.accessDataSubsection}>
                                <div className={classes.accessDataSubsectionTitle}>File Downloads:</div>
                                <div className={classes.accessDataSubsectionContent}>
                                    {manifestLink && (
                                        <div>
                                            <a href={manifestLink}>
                                                Study Manifest
                                                <img className={classes.studyManifestIcon} src={manifestIcon} alt="manifestIcon" />
                                            </a>
                                        </div>
                                    )}
                                    {clinicalDataLinks && clinicalDataLinks.map((clinicalDataLink, idx) => {
                                        const fileName = clinicalDataLink.split('/').pop() || `File ${idx + 1}`;
                                        return (
                                            <div key={idx}>
                                                <a href={clinicalDataLink} style={{ whiteSpace: 'nowrap' }} target="_blank" rel="noopener noreferrer">
                                                    Source File - {fileName}
                                                    <img className={classes.studyManifestIcon} src={manifestIcon} alt="manifestIcon" />
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {cBioPortalLink && (
                            <div className={classes.accessDataSubsection}>
                                <div className={classes.accessDataSubsectionTitle}>More information:</div>
                                <div className={classes.accessDataSubsectionContent}>
                                    <div className={classes.accessDataInfoHeader}>
                                        View in CCDI cBioPortal Data Explorer:
                                    </div>
                                    <div>
                                        <a href={cBioPortalLink} target="_blank" rel="noopener noreferrer">
                                            {getCBioPortalLinkLabel(cBioPortalLink)}
                                            <img className={classes.exportIcon} src={exportIcon} alt="exportIcon" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    )}
                </div>
                <div className={classes.studyItem}>
                    <div className={classes.studyItemTitle}>Publications</div>
                    <div className={classes.studyItemContent}>
                        {
                            data.pubmed_ids !== '' ?
                            data.pubmed_ids.split(";").map((publicationItem, idx) => {
                                const key = `publication_${idx}`;
                                return (
                                    <div key={key}>
                                        <a href={`https://pubmed.ncbi.nlm.nih.gov/${publicationItem}`} target="_blank" rel="noopener noreferrer">
                                            PMID:{publicationItem}
                                            <img className={classes.exportIcon} src={exportIcon} alt="exportIcon" />
                                        </a>
                                    </div>
                                )
                            })
                            : <div>N/A</div>
                        }
                    </div>
                </div>
            </div>

            {/* Right Container for Study Details */}
            <div className={classes.rightContainer}>
                <div className={classes.studyItem}>
                    <div className={classes.studyItemTitle}>Participants Count</div>
                    <div className={classes.studyItemContent}>{data.num_of_participants.toLocaleString('en-US')}</div>
                </div>
                <div className={classes.studyItem}>
                    <div className={classes.studyItemTitle}>Samples Count</div>
                    <div className={classes.studyItemContent}>{data.num_of_samples.toLocaleString('en-US')}</div>
                </div>
                <div className={classes.studyItem}>
                    <div className={classes.studyItemTitle}>Files Count</div>
                    <div className={classes.studyItemContent}>{data.num_of_files.toLocaleString('en-US')}</div>
                </div>
                <div className={classes.studyItem}>
                    <div className={classes.studyItemTitle}>Study Profile</div>
                    <div className={classes.studyItemContent}>
                        <TabsView data={data}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withStyles(styles)(OverviewView);

