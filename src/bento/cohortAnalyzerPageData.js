import { cellTypes } from "@bento-core/table";
import { GET_COHORT_MANIFEST_QUERY } from "./dashboardTabData";
import gql from "graphql-tag";

export const tableConfig = {
  name: 'Participants',
  dataField: 'dataParticipant',
  api: GET_COHORT_MANIFEST_QUERY,
  paginationAPIField: 'participantOverview',
  count: 'numberOfParticipants',
  fileCount: 'participantsFileCount',
  dataKey: 'participant_id',
  hiddenDataKeys: ['participant_id', 'id', 'study_id'],
  defaultSortField: 'participant_id',
  defaultSortDirection: 'asc',
  toolTipText: 'Count of Participant Record',
  buttonText: 'Add Selected Files',
  tableID: 'participant_tab_table',
  hasToolTip: true,
  extendedViewConfig: {
    pagination: true,
    manageViewColumns: false,
    download: true,
    downloadButtonConfig: {
      title: 'DOWNLOAD DATA',
      cloudIcon: true,
    },
    hasExport: false,
  },
  columns: [
    {
      dataField: 'participant_id',
      header: 'Participant Id',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },

    {
      dataField: 'study_id',
      header: 'Study ID',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
      linkAttr: {
        linkAttr: {
          rootPath: '/studies/',
        },
        cellType: cellTypes.CUSTOM_ELEM,
      },
      doNotDownload: true,
    },
    {
      dataField: 'race',
      header: 'Race',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'sex_at_birth',
      header: 'Sex at Birth',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: "cohort",
      header: "Cohorts",
      display: true,
      tooltipText: "This entry is found in the following cohorts",
      role: cellTypes.DISPLAY,
      cellType: cellTypes.CUSTOM_ELEM,
      stripSurroundingBrackets: false,
    }
  ],
  id: 'participant_tab',
  tableDownloadCSV: {},
  tabIndex: '0',
  downloadFileName: 'CCDI Hub Participants Download',
  tableMsg: {
    noMatch: 'To proceed, please select a cohort from the Cohort List (Left Panel).',
  },
};

export const diagnosesTableConfig =
{
  name: 'Diagnosis',
  dataField: 'dataParticipant',
  api: GET_COHORT_MANIFEST_QUERY,
  paginationAPIField: 'diagnosisOverview',
  count: 'numberOfDiagnosis',
  fileCount: 'diagnosisFileCount',
  dataKey: 'participant_id',
  hiddenDataKeys: ['participant_id', 'id', 'study_id'],
  defaultSortField: 'participant_id',
  defaultSortDirection: 'asc',
  toolTipText: 'Count of Diagnosis Record',
  buttonText: 'Add Selected Files',
  tableID: 'diagnosis_tab_table',
  hasToolTip: true,
  extendedViewConfig: {
    pagination: true,
    manageViewColumns: false,
    download: true,
    downloadButtonConfig: {
      title: 'DOWNLOAD DATA',
      cloudIcon: true,
    },
    hasExport: false,
  },
  columns: [
    {
      dataField: 'participant_id',
      header: 'Participant Id',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'diagnosis',
      header: 'Diagnosis',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'anatomic_site',
      header: 'Anatomic Sites',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'age_at_diagnosis',
      header: 'Age At Diagnosis',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: "cohort",
      header: "Cohorts",
      display: true,
      tooltipText: "This entry is found in the following cohorts",
      role: cellTypes.DISPLAY,
      cellType: cellTypes.CUSTOM_ELEM,
      stripSurroundingBrackets: false,
    }
  ],
  id: 'participant_tab',
  tableDownloadCSV: {},
  tabIndex: '0',
  downloadFileName: 'C3DC Participants Download',
  tableMsg: {
    noMatch: 'To proceed, please select a cohort from the Cohort List (Left Panel).',
  },
}

const participant_query = gql`query participantOverview(
    $id: [String],
    # Table config
    $first: Int,
    $offset: Int,
    $order_by: String,
    $sort_direction: String
) {
participantOverview(
    # Demographics
    id: $id,

    # Table config
    first: $first,
    offset: $offset,
    order_by: $order_by,
    sort_direction: $sort_direction
) { 
    id
    participant_id
    race
    sex_at_birth
    study_id
    __typename
}}`;

// Cohort Analyzer only ever filters diagnoses/treatments by the selected cohort's
// participants. diagnosisOverview's top-level `id` argument filters by DIAGNOSIS
// id, not participant id. Participants can be filtered two ways:
//   `pid`             — internal participant UUIDs (what cohort state stores)
//   `participant_ids` — display participant_ids such as "PBBWJX"
// The backend ANDs every supplied filter, so callers send only one. An empty
// list is ignored (no filter). Response is flat (no nested participant).
const diagnosis_query = gql`query diagnosisOverview(
    $pid: [String],
    $id: [String],

    # Table config
    $first: Int,
    $offset: Int,
    $order_by: String,
    $sort_direction: String
) {
    diagnosisOverview(
        # Demographics — do not bind top-level id (that is diagnosis id)
        pid: $pid,
        participant_ids: $id,

        # Table config
        first: $first,
        offset: $offset,
        order_by: $order_by,
        sort_direction: $sort_direction
    ) {
        id
        diagnosis_id
        participant_id
        sample_id
        dbgap_accession
        study_id
        diagnosis
        anatomic_site
        disease_phase
        diagnosis_classification_system
        diagnosis_category
        diagnosis_basis
        age_at_diagnosis
        diagnosis_comment
        tumor_spatial_extent
        toronto_childhood_cancer_staging
        tumor_grade
        tumor_stage_clinical_t
        tumor_stage_clinical_n
        tumor_stage_clinical_m
        files
        __typename
    }
}`;

// treatmentOverview's top-level `id` argument filters by TREATMENT id, not
// participant id. Participants can be filtered two ways:
//   `pid`             — internal participant UUIDs (what cohort state stores)
//   `participant_ids` — display participant_ids such as "PBBWJX"
// Both are supported; callers pick one. The backend ANDs every supplied filter,
// so sending both only narrows the result. An empty list is ignored (no filter).
// Response is flat (no nested participant), and treatment_type / treatment_agent
// come back as arrays.
const treatment_query = gql`query treatmentOverview(
    $pid: [String],
    $id: [String],

    # Table config
    $first: Int,
    $offset: Int,
    $order_by: String,
    $sort_direction: String
) {
    treatmentOverview(
        # Demographics — do not bind top-level id (that is treatment id)
        pid: $pid,
        participant_ids: $id,

        # Table config
        first: $first,
        offset: $offset,
        order_by: $order_by,
        sort_direction: $sort_direction
    ) {
        id
        dbgap_accession
        participant_id
        study_id
        treatment_id
        age_at_treatment_end
        age_at_treatment_start
        treatment_agent
        treatment_type
        __typename
    }
}`;

export const treatmentsTableConfig =
{
  name: 'Treatment',
  dataField: 'dataParticipant',
  api: GET_COHORT_MANIFEST_QUERY,
  paginationAPIField: 'treatmentOverview',
  count: 'numberOfTreatments',
  fileCount: 'treatmentFileCount',
  dataKey: 'participant_id',
  hiddenDataKeys: ['participant_id', 'id', 'study_id'],
  defaultSortField: 'participant_id',
  defaultSortDirection: 'asc',
  toolTipText: 'Count of Treatment Record',
  buttonText: 'Add Selected Files',
  tableID: 'treatment_tab_table',
  hasToolTip: true,
  extendedViewConfig: {
    pagination: true,
    manageViewColumns: false,
    download: true,
    downloadButtonConfig: {
      title: 'DOWNLOAD DATA',
      cloudIcon: true,
    },
    hasExport: false,
  },
  columns: [
    {
      dataField: 'participant_id',
      header: 'Participant Id',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'treatment_type',
      header: 'Treatment Type',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'treatment_agent',
      header: 'Treatment Agent',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: "cohort",
      header: "Cohorts",
      display: true,
      tooltipText: "This entry is found in the following cohorts",
      role: cellTypes.DISPLAY,
      cellType: cellTypes.CUSTOM_ELEM,
      stripSurroundingBrackets: false,
    }
  ],
  id: 'treatment_tab',
  tableDownloadCSV: {},
  tabIndex: '0',
  downloadFileName: 'C3DC Treatments Download',
  tableMsg: {
    noMatch: 'To proceed, please select a cohort from the Cohort List (Left Panel).',
  },
}

export const analyzer_query = [participant_query, diagnosis_query, treatment_query];
export const analyzer_tables = [tableConfig, diagnosesTableConfig, treatmentsTableConfig];
// Table download/pagination must hit the overview query that matches paginationAPIField
// (not cohortManifest, which uses id and a different response shape).
analyzer_tables.forEach((cfg, index) => {
  cfg.api = analyzer_query[index];
});
export const responseKeys = ["participantOverview", "diagnosisOverview", "treatmentOverview"];