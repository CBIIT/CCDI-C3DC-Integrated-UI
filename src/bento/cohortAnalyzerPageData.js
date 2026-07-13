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
      cellType: cellTypes.CUSTOM_ELEM
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
      cellType: cellTypes.CUSTOM_ELEM
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
// participant ids — we don't want the multi-filter Explore Dashboard shape here,
// because every unused variable would be sent to the backend as `null` and blow up
// the OpenSearch `terms` filter ("No value specified for terms query").
// diagnosisOverview's top-level `id` argument filters by DIAGNOSIS id, not
// participant id — passing participant ids there returns an empty list. The
// backend's participant filter on this endpoint is `participant_ids`, so we map
// our JS-side `$id` variable to that argument below.
const diagnosis_query = gql`query diagnosisOverview(
  $import_data: [String]
  # Demographics
  $id: [String]
  $race: [String]
  $sex_at_birth: [String]
  # Diagnoses
  $age_at_diagnosis: [Int]
  $age_at_diagnosis_unknownAges: [String]
  $diagnosis_anatomic_site: [String]
  $disease_phase: [String]
  $diagnosis_classification_system: [String]
  $diagnosis_basis: [String]
  $diagnosis: [String]
  $diagnosis_category: [String]
  # Genetic Analyses
  $alteration: [String]
  $alteration_type: [String]
  $fusion_partner_gene: [String]
  $gene_symbol: [String]
  $reported_significance: [String]
  $reported_significance_system: [String]
  $status: [String]
  # Survivals
  $age_at_last_known_survival_status: [Int]
  $age_at_last_known_survival_status_unknownAges: [String]
  $cause_of_death: [String]
  $first_event: [String]
  $last_known_survival_status: [String]
  # Treatments
  $age_at_treatment_start: [Int]
  $age_at_treatment_start_unknownAges: [String]
  $age_at_treatment_end: [Int]
  $age_at_treatment_end_unknownAges: [String]
  $treatment_type: [String]
  $treatment_agent: [String]
  # Treatment Responses
  $response: [String]
  $age_at_response: [Int]
  $age_at_response_unknownAges: [String]
  $response_category: [String]
  $response_system: [String]
  # Samples
  $sample_anatomic_site: [String]
  $participant_age_at_collection: [Int]
  $participant_age_at_collection_unknownAges: [String]
  $sample_tumor_status: [String]
  # Files
  $data_category: [String]
  $file_type: [String]
  $file_mapping_level: [String]
  $library_selection: [String]
  $library_source_material: [String]
  $library_source_molecule: [String]
  $library_strategy: [String]
  $anatomic_site: [String]
  $tumor_spatial_extent: [String]
  $sample_description: [String]
  $percent_tumor: [String]
  $percent_necrosis: [String]
  $file_size: [String]
  $file_description: [String]
  $consent_codes: [String]
  $file_access: [String]
  $fixation_embedding_method: [String]
  $staining_method: [String]
  # Studies
  $dbgap_accession: [String]
  $study_name: [String]
  $study_phase: [String]
  # Table config
  $first: Int
  $offset: Int
  $order_by: String
  $sort_direction: String
) {
  diagnosisOverview(
    import_data: $import_data

    # Demographics
    # NOTE: the top-level 'id' argument on this endpoint filters by diagnosis id,
    # not participant id. We deliberately do not bind it — participants are
    # filtered via participant_ids below.
    participant_ids: $id
    race: $race
    sex_at_birth: $sex_at_birth

    # Diagnoses
    age_at_diagnosis: $age_at_diagnosis
    age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges
    diagnosis_anatomic_site: $diagnosis_anatomic_site
    disease_phase: $disease_phase
    diagnosis_classification_system: $diagnosis_classification_system
    diagnosis_basis: $diagnosis_basis
    diagnosis: $diagnosis
    diagnosis_category: $diagnosis_category

    # Genetic Analyses
    alteration: $alteration
    alteration_type: $alteration_type
    fusion_partner_gene: $fusion_partner_gene
    gene_symbol: $gene_symbol
    reported_significance: $reported_significance
    reported_significance_system: $reported_significance_system
    status: $status

    # Survivals
    age_at_last_known_survival_status: $age_at_last_known_survival_status
    age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges
    cause_of_death: $cause_of_death
    first_event: $first_event
    last_known_survival_status: $last_known_survival_status

    # Treatments
    age_at_treatment_start: $age_at_treatment_start
    age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges
    age_at_treatment_end: $age_at_treatment_end
    age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges
    treatment_type: $treatment_type
    treatment_agent: $treatment_agent

    # Treatment Responses
    response: $response
    age_at_response: $age_at_response
    age_at_response_unknownAges: $age_at_response_unknownAges
    response_category: $response_category
    response_system: $response_system

    # Samples
    sample_anatomic_site: $sample_anatomic_site
    participant_age_at_collection: $participant_age_at_collection
    participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges
    sample_tumor_status: $sample_tumor_status

    # Files
    data_category: $data_category
    file_type: $file_type
    file_mapping_level: $file_mapping_level
    library_selection: $library_selection
    library_source_material: $library_source_material
    library_source_molecule: $library_source_molecule
    library_strategy: $library_strategy
    anatomic_site: $anatomic_site
    tumor_spatial_extent: $tumor_spatial_extent
    sample_description: $sample_description
    percent_tumor: $percent_tumor
    percent_necrosis: $percent_necrosis
    file_size: $file_size
    file_description: $file_description
    consent_codes: $consent_codes
    file_access: $file_access
    fixation_embedding_method: $fixation_embedding_method
    staining_method: $staining_method

    # Studies
    dbgap_accession: $dbgap_accession
    study_name: $study_name
    study_phase: $study_phase

    # Table config
    first: $first
    offset: $offset
    order_by: $order_by
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
}
`;

// treatmentOverview accepts `participant_pk` (per the Postman collection that
// currently succeeds against the backend). We keep the JS variable name `$id`
// so all callers stay uniform; only the field-argument name differs per endpoint.
const treatment_query = gql`query treatmentOverview(
    $id: [String],

    # Table config
    $first: Int,
    $offset: Int,
    $order_by: String,
    $sort_direction: String
) {
    treatmentOverview(
        # Demographics
        participant_pk: $id,

        # Table config
        first: $first,
        offset: $offset,
        order_by: $order_by,
        sort_direction: $sort_direction
    ) {
        # Participant
        participant {
            participant_id
        }

        # Treatment
        id
        treatment_type
        treatment_agent

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
      cellType: cellTypes.CUSTOM_ELEM
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
export const responseKeys = ["participantOverview", "diagnosisOverview", "treatmentOverview"];