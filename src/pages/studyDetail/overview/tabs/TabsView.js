import React, { useMemo, useState, useEffect } from 'react';
import {
  withStyles,
  Select,
  MenuItem,
  FormControl,
  Modal,
  IconButton,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ExpandIcon from '../../../../assets/icons/Expand_Histogram_icon.svg';
import DownloadIcon from '../../../../assets/icons/Download_Histogram_icon.svg';
import TabPanel from './TabPanel';
import styles from './TabsStyle';
import ChartView from '../chart/ChartView';

const PROFILE_OPTIONS = [
  {
    key: 'diagnoses',
    label: 'Diagnosis',
    headerLabel: 'DIAGNOSIS',
    valueHeaderLines: ['Number of', 'Participants'],
    valueColumnLabel: 'Number of Participants',
    dataKey: 'diagnoses',
  },
  {
    key: 'anatomic_site',
    label: 'Anatomic Site',
    headerLabel: 'ANATOMIC SITE',
    valueHeaderLines: ['Number of', 'Participants'],
    valueColumnLabel: 'Number of Participants',
    dataKey: 'anatomic_site',
  },
  {
    key: 'data_categories',
    label: 'Data Category',
    headerLabel: 'DATA CATEGORY',
    valueHeaderLines: ['Number of', 'Files'],
    valueColumnLabel: 'Number of Files',
    dataKey: 'data_categories',
  },
];

const filterValidItems = (arr) => {
  if (Array.isArray(arr)) {
    return arr.filter((item) => item.group !== 0 && item.subjects !== 0);
  }
  return arr;
};

const createProfileData = (name, data) => {
  if (Array.isArray(data) && data.length > 20) {
    return { name: `Top 20 ${name}`, data: data.slice(0, 20) };
  }
  return { name, data };
};

const downloadProfileCsv = (studyId, categoryLabel, valueColumnLabel, rows) => {
  const header = `${categoryLabel},${valueColumnLabel}`;
  const lines = rows.map((row) => {
    const label = `"${String(row.group).replace(/"/g, '""')}"`;
    return `${label},${row.subjects}`;
  });
  const csv = [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${studyId || 'study'}-${categoryLabel.replace(/\s+/g, '-').toLowerCase()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const Tabs = ({ data, classes, isModalView = false }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const profileOptions = useMemo(() => PROFILE_OPTIONS.map((option) => {
    const rawData = filterValidItems(data && data[option.dataKey]);
    const profileData = createProfileData(option.label, rawData);
    return {
      ...option,
      data: profileData.data,
    };
  }).filter((option) => Array.isArray(option.data) && option.data.length > 0), [data]);

  const [selectedKey, setSelectedKey] = useState('');

  useEffect(() => {
    if (profileOptions.length === 0) {
      return;
    }
    if (!profileOptions.some((option) => option.key === selectedKey)) {
      setSelectedKey(profileOptions[0].key);
    }
  }, [profileOptions, selectedKey]);

  const activeOption = profileOptions.find((option) => option.key === selectedKey)
    || profileOptions[0];

  const handleSelectChange = (event) => {
    setSelectedKey(event.target.value);
  };

  const handleDownload = () => {
    if (!activeOption) {
      return;
    }
    downloadProfileCsv(
      data.study_id,
      activeOption.label,
      activeOption.valueColumnLabel,
      activeOption.data,
    );
  };

  if (!activeOption) {
    return null;
  }

  const controls = (
    <div className={isModalView ? classes.modalControls : classes.controls}>
      <FormControl variant="outlined" className={classes.dropdown}>
        <Select
          value={activeOption.key}
          onChange={handleSelectChange}
          displayEmpty
          MenuProps={{
            anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
            transformOrigin: { vertical: 'top', horizontal: 'left' },
            getContentAnchorEl: null,
          }}
        >
          {profileOptions.map((option) => (
            <MenuItem key={option.key} value={option.key}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!isModalView && (
        <div className={classes.actionButtons}>
          <IconButton
            className={classes.actionButton}
            onClick={() => setModalOpen(true)}
            aria-label="Expand study profile"
          >
            <img src={ExpandIcon} alt="" className={classes.actionIcon} />
          </IconButton>
          <IconButton
            className={classes.actionButton}
            onClick={handleDownload}
            aria-label="Download study profile data"
          >
            <img src={DownloadIcon} alt="" className={classes.actionIcon} />
          </IconButton>
        </div>
      )}

      {isModalView && (
        <div className={classes.actionButtons}>
          <IconButton
            className={classes.actionButton}
            onClick={handleDownload}
            aria-label="Download study profile data"
          >
            <img src={DownloadIcon} alt="" className={classes.actionIcon} />
          </IconButton>
        </div>
      )}
    </div>
  );

  const chart = (
    <ChartView
      data={activeOption.data}
      categoryHeader={activeOption.headerLabel}
      valueHeaderLines={activeOption.valueHeaderLines}
      isModalView={isModalView}
      chartId={isModalView ? 'study-profile-chart-modal' : 'study-profile-chart'}
    />
  );

  if (isModalView) {
    return (
      <>
        {controls}
        {chart}
      </>
    );
  }

  return (
    <>
      {controls}
      <TabPanel value={0} index={0}>
        {chart}
      </TabPanel>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className={classes.modalContainer}>
          <div className={classes.modalHeader}>
            <h2 className={classes.modalTitle}>
              Study Profile:{' '}
              <span className={classes.titleSpan}>{data.study_id}</span>
            </h2>
            <Button onClick={() => setModalOpen(false)} className={classes.closeButton}>
              <CloseIcon />
            </Button>
          </div>
          <div className={classes.modalBody}>
            <Tabs data={data} classes={classes} isModalView />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default withStyles(styles)(Tabs);
