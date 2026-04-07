/* eslint-disable */
import gql from 'graphql-tag';
import { cellTypes, cellStyles } from '@bento-core/table';
import { customParticipantsTabDownloadCSV, customFilesTabDownloadCSV, customSamplesTabDownloadCSV, customStudyTabDownloadCSV, customDiagnosisTabDownloadCSV, customGeneticAnalysisTabDownloadCSV, customTreatmentTabDownloadCSV, customTreatmentResponseTabDownloadCSV, customSurvivalTabDownloadCSV } from './tableDownloadCSV';
import { dataFormatTypes } from '@bento-core/table';
import questionIcon from '../assets/icons/Question_Icon.svg';
import React from 'react';

// --------------- Tooltip configuration --------------
const createNewCohortToolTip = 
  <p style={{ fontFamily: "Poppins", fontWeight: 400, margin: 0 }}>
    Create a new cohort using the selected Participant IDs.
    <br/> 
    <div style={{height: 10}}/>
    <b>
      Note:&nbsp;
    </b> 
    The optimal number of participants in a cohort is =&lt; 4000 participants
  </p>;
const addExistingCohortToolTip = 
  <p style={{ fontFamily: "Poppins", fontWeight: 400, margin: 0 }}>
    Add selected Participant IDs to an existing cohort.
    <br/>
    <div style={{height: 10}}/>
    <b>
      Note:&nbsp;
    </b>
    The optimal number of participants in a cohort is =&lt; 4000 participants
  </p>;
  
export const tooltipContentAddAll = {
  icon: questionIcon,
  alt: 'tooltipIcon',
  Participants: 'Click button to add all files associated with the filtered row(s).',
  Studies: 'Click button to add all files associated with the filtered row(s).',
  Samples: 'Click button to add all files associated with the filtered row(s).',
  Files: 'Click button to add all files associated with the filtered row(s).',
  arrow: true,
  styles: {
    border: '#03A383 1px solid',
  }
};

export const tooltipContent = {
  icon: questionIcon,
  alt: 'tooltipIcon',
  Participants: 'Click button to add files associated with the selected row(s).',
  Studies: 'Click button to add files associated with the selected row(s).',
  Samples: 'Click button to add files associated with the selected row(s).',
  Files: 'Click button to add files associated with the selected row(s).',
  arrow: true,
  styles: {
    border: '#03A383 1px solid',
  }
};
export const tooltipContentAddToNewCohort = {
  icon: questionIcon,
  alt: 'tooltipIcon',
  Participants: createNewCohortToolTip,
  Studies: createNewCohortToolTip,
  Treatment: createNewCohortToolTip,
  Survival: createNewCohortToolTip,
  "Treatment Response": createNewCohortToolTip,
  arrow: true,
  styles: {
    border: '1px red solid'
  }
}

export const tooltipContentAddToExistingCohort = {
  icon: questionIcon,
  alt: 'tooltipIcon',
  Participants: addExistingCohortToolTip,
  Studies: addExistingCohortToolTip,
  Survival: addExistingCohortToolTip,
  Treatment: addExistingCohortToolTip,
  "Treatment Response": addExistingCohortToolTip,
  arrow: true,
  styles: {
  }
}

export const tooltipContentListAll = {
  icon: questionIcon,
  alt: 'tooltipIcon',
  Participants: 'Click to view the complete list of all cohorts',
  Studies: 'Click to view the complete list of all cohorts',
  Treatment: 'Click to view the complete list of all cohorts',
  Survival: 'Click to view the complete list of all cohorts',
  "Treatment Response": 'Click to view the complete list of all cohorts',
  arrow: true,
  styles: {
  }
}

// --------------- Dahboard Table external link configuration --------------
// Ideal size for externalLinkIcon is 16x16 px
export const externalLinkIcon = {
  src: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/externalLinkIcon.svg',
  alt: 'External link icon',
};

// --------------- Responsive Tab Breakpoint Configuration --------------
// These breakpoints are calculated by multiplying the width of each tab
// including the padding/margin (203px)
// and counting the more button as a tab (203px)
// We will have enough space for tabs + more button + empty tab space
// e.g. 2 tabs: (203 * 2) + 203 + 203 = 812px
export const tabResponsiveBreakpoints = {
  breakpoints: [
    { maxWidth: 812, tabLimit: 2 },
    { maxWidth: 1015, tabLimit: 3 },
    { maxWidth: 1281, tabLimit: 4 },
    { maxWidth: 1421, tabLimit: 5 },
  ],
  defaultTabLimit: 6,
};

// --------------- Tabs Header Data configuration --------------
export const tabs = [
  {
    id: 'participant_tab',
    title: 'Participants',
    dataField: 'dataParticipant',
    count: 'numberOfParticipants',
  },
  {
    id: 'study_tab',
    title: 'Studies',
    dataField: 'dataStudy',
    count: 'numberOfStudies',
  },
  {
    id: 'sample_tab',
    title: 'Samples',
    dataField: 'dataSample',
    count: 'numberOfSamples',
  },
  {
    id: 'file_tab',
    title: 'Files',
    dataField: 'dataFile',
    count: 'numberOfFiles',
  },
];

// --------------- Tabs Header Style configuration --------------
export const tabIndex = [
  {
    title: 'Participants',
    primaryColor: '#D6F2EA',
    secondaryColor: '#FFDFB8',
    selectedColor: '#10A075',
  },
  {
    title: 'Samples',
    primaryColor: '#CFEDF9',
    secondaryColor: '#C9F1F1',
    selectedColor: '#0DAFEC',
  },
  {
    title: 'Files',
    primaryColor: '#F7D7F7',
    secondaryColor: '#86D6F0',
    selectedColor: '#C92EC7',
  },
  {
    title: 'Studies',
    primaryColor: '#F7D7F7',
    secondaryColor: '#86D6F0',
    selectedColor: '#C92EC7',
  },
];

export const DASHBOARD_QUERY_NEW = gql`
query search (
    $import_data: [String],    
    $participant_ids: [String],
    $sex_at_birth: [String] ,
    $race: [String] ,
    $age_at_diagnosis: [Int] ,
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String] ,
    $disease_phase: [String] ,
    $diagnosis: [String] ,
    $diagnosis_classification_system: [String] ,
    $diagnosis_category: [String],
    $diagnosis_basis: [String] ,
    $alteration: [String],
    $alteration_type: [String],
    $fusion_partner_gene: [String],
    $gene_symbol: [String],
    $reported_significance: [String],
    $reported_significance_system: [String],
    $status: [String],
    $last_known_survival_status: [String] ,
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $cause_of_death: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int] ,
    $age_at_treatment_start_unknownAges: [String],
    $age_at_treatment_end: [Int],
    $age_at_treatment_end_unknownAges: [String],
    $response: [String],
    $response_category: [String] ,
    $response_system: [String],
    $age_at_response: [Int] ,
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String] ,
    $participant_age_at_collection: [Int] ,
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String] ,
    $tumor_classification: [String] ,
    $data_category: [String],
    $file_type: [String],
    $file_mapping_level: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
){
    searchParticipants (
        import_data: $import_data,          
        participant_ids: $participant_ids,
        sex_at_birth: $sex_at_birth,
        race: $race,
        age_at_diagnosis: $age_at_diagnosis,
        age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
        diagnosis_anatomic_site: $diagnosis_anatomic_site,
        disease_phase: $disease_phase,
        diagnosis: $diagnosis,
        diagnosis_classification_system: $diagnosis_classification_system,
        diagnosis_category: $diagnosis_category,
        diagnosis_basis: $diagnosis_basis,
        alteration: $alteration,
        alteration_type: $alteration_type,
        fusion_partner_gene: $fusion_partner_gene,
        gene_symbol: $gene_symbol,
        reported_significance: $reported_significance,
        reported_significance_system: $reported_significance_system,
        status: $status,
        last_known_survival_status: $last_known_survival_status,
        age_at_last_known_survival_status: $age_at_last_known_survival_status,
        age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
        first_event: $first_event,
        cause_of_death: $cause_of_death,
        treatment_type: $treatment_type,
        treatment_agent: $treatment_agent,
        age_at_treatment_start: $age_at_treatment_start,
        age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
        age_at_treatment_end: $age_at_treatment_end,
        age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
        response: $response,
        response_category: $response_category,
        response_system: $response_system,
        age_at_response: $age_at_response,
        age_at_response_unknownAges: $age_at_response_unknownAges,
        sample_anatomic_site: $sample_anatomic_site,
        participant_age_at_collection: $participant_age_at_collection,
        participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
        sample_tumor_status: $sample_tumor_status,
        tumor_classification: $tumor_classification,
        data_category: $data_category,
        file_type: $file_type,
        file_mapping_level: $file_mapping_level,
        dbgap_accession: $dbgap_accession,       
        study_name: $study_name,
        study_status: $study_status,
        library_selection: $library_selection,
        library_source_material: $library_source_material,
        library_source_molecule: $library_source_molecule,
        library_strategy: $library_strategy,
    ) {
        numberOfDiagnosis
        numberOfGeneticAnalyses
        numberOfFiles
        numberOfParticipants
        numberOfSamples
        numberOfStudies
        numberOfSurvivals
        numberOfTreatments
        numberOfTreatmentResponses
        participantsFileCount
        
        # Widget counts
        participantCountByDiagnosis {
            group
            subjects
        }
        participantCountByDiagnosisAge {
            group
            subjects
        }
        participantCountBySexAtBirth {
            group
            subjects
        }
        participantCountByRace {
            group
            subjects
        }
        participantCountByStudy {
            group
            subjects
        }
        participantCountByDataCategory{
            group
            subjects
        }

        # Diagnosis filter counts
        filterParticipantCountByDiagnosisAnatomicSite{
            group
            subjects
        }
        filterParticipantCountByDiseasePhase{
            group
            subjects
        }
        filterParticipantCountByDiagnosis{
            group
            subjects
        }
        filterParticipantCountByDiagnosisAge{
            lowerBound
            upperBound
            subjects
        }
        filterParticipantCountByDiagnosisClassificationSystem{
            group
            subjects
        }
        filterParticipantCountByDiagnosisBasis{
          group
          subjects
        }
        filterParticipantCountByDiagnosisCategory{
          group
          subjects
        }
        # Demographic filter counts
        filterParticipantCountBySexAtBirth{
            group
            subjects
        }
        filterParticipantCountByRace{
          group
          subjects
        }
        # Genetic Analysis filter counts
        filterParticipantCountByAlteration {
          group
          subjects
        }
        filterParticipantCountByAlterationType {
          group
          subjects
        }
        filterParticipantCountByFusionPartnerGene {
          group
          subjects
        }
        filterParticipantCountByGeneSymbol {
          group
          subjects
        }
        filterParticipantCountByReportedSignificance {
          group
          subjects
        }
        filterParticipantCountByReportedSignificanceSystem {
          group
          subjects
        }
        filterParticipantCountByStatus {
          group
          subjects
        }
        # Survival filter counts
        filterParticipantCountBySurvivalStatus{
          group
          subjects
        } 
        filterParticipantCountByFirstEvent{
          group
          subjects
        }
        filterParticipantCountByCauseOfDeath{
          group
          subjects
        }
        filterParticipantCountByAgeAtLastKnownSurvivalStatus{
          lowerBound
          upperBound
          subjects
        }
        # Treatment filter counts
        filterParticipantCountByTreatmentType{
          group
          subjects
        }
        filterParticipantCountByTreatmentAgent{
          group
          subjects
        }
        filterParticipantCountByAgeAtTreatmentStart {
          lowerBound
          upperBound
          subjects
        }
        filterParticipantCountByAgeAtTreatmentEnd {
          lowerBound
          upperBound
          subjects
        }
        # Treatment Response filter counts
        filterParticipantCountByResponse{
          group
          subjects
        }
        filterParticipantCountByResponseCategory{
          group
          subjects
        }
        filterParticipantCountByResponseSystem{
          group
          subjects
        }
        filterParticipantCountByAgeAtResponse{
          lowerBound
          upperBound
          subjects
        }
        # Sample filter counts
        filterParticipantCountBySampleAnatomicSite{
          group
          subjects
        }
        filterParticipantCountBySampleAge{
          lowerBound
          upperBound
          subjects
        }
        filterParticipantCountByTumorClassification{
          group
          subjects
        }
        filterParticipantCountByTumorStatus{
          group
          subjects
        }
        # Data Category filter counts
        filterParticipantCountByDataCategory{
            group
            subjects
        }
        filterParticipantCountByFileType{
            group
            subjects
        }
        filterParticipantCountByFileMappingLevel{
            group
            subjects
        }
        # Study filter counts
        filterParticipantCountByDBGAPAccession{
            group
            subjects
        }
        filterParticipantCountByStudyTitle{
          group
          subjects
        }
        filterParticipantCountByStudyStatus{
          group
          subjects
        }
        # Sequencing Library filter counts
        filterParticipantCountByLibrarySelection{
            group
            subjects
        }
        filterParticipantCountByLibrarySourceMaterial{
            group
            subjects
        }
        filterParticipantCountByLibrarySourceMolecule{
            group
            subjects
        }
        filterParticipantCountByLibraryStrategy{
            group
            subjects
        }
    }
}
`;

export const GET_FILES_OVERVIEW_QUERY = gql`
query fileOverview(
    $import_data: [String],
    $participant_ids: [String],
    $sex_at_birth: [String] ,
    $race: [String] ,
    $age_at_diagnosis: [Int] ,
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String] ,
    $disease_phase: [String] ,
    $diagnosis: [String] ,
    $diagnosis_classification_system: [String] ,
    $diagnosis_category: [String],
    $diagnosis_basis: [String] ,
    $last_known_survival_status: [String] ,
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int] ,
    $age_at_treatment_start_unknownAges: [String],
    $response_category: [String] ,
    $age_at_response: [Int] ,
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String] ,
    $participant_age_at_collection: [Int] ,
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String] ,
    $tumor_classification: [String] ,
    $data_category: [String],
    $file_type: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
    $file_mapping_level: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String ){
    fileOverview(
        import_data: $import_data,
        participant_ids: $participant_ids,
        sex_at_birth: $sex_at_birth,
        race: $race,
        age_at_diagnosis: $age_at_diagnosis,
        age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
        diagnosis_anatomic_site: $diagnosis_anatomic_site,
        disease_phase: $disease_phase,
        diagnosis: $diagnosis,
        diagnosis_classification_system: $diagnosis_classification_system,
        diagnosis_category: $diagnosis_category,
        diagnosis_basis: $diagnosis_basis,
        last_known_survival_status: $last_known_survival_status,
        age_at_last_known_survival_status: $age_at_last_known_survival_status,
        age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
        first_event: $first_event,
        treatment_type: $treatment_type,
        treatment_agent: $treatment_agent,
        age_at_treatment_start: $age_at_treatment_start,
        age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
        response_category: $response_category,
        age_at_response: $age_at_response,
        age_at_response_unknownAges: $age_at_response_unknownAges,
        sample_anatomic_site: $sample_anatomic_site,
        participant_age_at_collection: $participant_age_at_collection,
        participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
        sample_tumor_status: $sample_tumor_status,
        tumor_classification: $tumor_classification,
        data_category: $data_category,
        file_type: $file_type,
        dbgap_accession: $dbgap_accession,       
        study_name: $study_name,
        study_status: $study_status,
        library_selection: $library_selection,
        library_source_material: $library_source_material,
        library_source_molecule: $library_source_molecule,
        library_strategy: $library_strategy,
        file_mapping_level: $file_mapping_level
        first: $first, 
        offset: $offset, 
        order_by: $order_by,
        sort_direction: $sort_direction
    ){
        id
        file_name
        data_category
        file_description
        file_type
        file_size
        study_id
        participant_id
        sample_id
        file_id
        guid
        md5sum
        library_selection
        library_source_material
        library_source_molecule
        library_strategy
        file_access
        file_mapping_level
    }
}
`;

export const GET_COHORT_METADATA_QUERY = gql`
query cohortMetadata(
    $id: [String],
    $first: Int,
    $offset: Int,
    $order_by: String,
    $sort_direction: String
) {

cohortMetadata(
    id: $id,
    first: $first,
    offset: $offset,
    order_by: $order_by,
    sort_direction: $sort_direction
) {
    dbgap_accession

    participants {
        participant_id
        dbgap_accession  
        race
        sex_at_birth
        diagnoses {
            diagnosis_id
            diagnosis
            diagnosis_classification_system
            diagnosis_category,
            diagnosis_basis
            disease_phase
            anatomic_site
            age_at_diagnosis
        }
        survivals {
            survival_id
            age_at_event_free_survival_status
            age_at_last_known_survival_status
            cause_of_death
            event_free_survival_status
            first_event
            last_known_survival_status
        }
        treatments {
            treatment_id
            age_at_treatment_end
            age_at_treatment_start
            treatment_agent
            treatment_type
        }
        treatment_responses {    
            treatment_response_id
            age_at_response
            response
            response_category
            response_system
        }
        samples {
            sample_id
            anatomic_site
            participant_age_at_collection
            sample_tumor_status
            tumor_classification
        }
        files {
            file_name
            data_category
            file_description
            file_type
            file_size
            study_id
            participant_id
            sample_id
            file_id
            guid
            md5sum
            library_selection
            library_source_material
            library_source_molecule
            library_strategy
            file_access
            file_mapping_level
        }
    }
}}
`;

export const GET_COHORT_MANIFEST_QUERY = gql`
  query cohortManifest(
    $id: [String],
    $first: Int,
    $offset: Int,
    $order_by: String,
    $sort_direction: String) {
      cohortManifest(
        id: $id,
        first: $first,
        offset: $offset,
        order_by: $order_by,
        sort_direction: $sort_direction
      ) {
        participant_id
        dbgap_accession  
        race
        sex_at_birth
        diagnosis
      }
    }
`

export const GET_SAMPLES_OVERVIEW_QUERY = gql`
query sampleOverview(
    $import_data: [String],
    $participant_ids: [String],
    $sex_at_birth: [String] ,
    $race: [String] ,
    $age_at_diagnosis: [Int] ,
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String] ,
    $disease_phase: [String] ,
    $diagnosis: [String] ,
    $diagnosis_classification_system: [String] ,
    $diagnosis_category: [String],
    $diagnosis_basis: [String] ,
    $alteration: [String],
    $alteration_type: [String],
    $fusion_partner_gene: [String],
    $gene_symbol: [String],
    $reported_significance: [String],
    $reported_significance_system: [String],
    $status: [String],
    $last_known_survival_status: [String] ,
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $cause_of_death: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int] ,
    $age_at_treatment_start_unknownAges: [String],
    $age_at_treatment_end: [Int],
    $age_at_treatment_end_unknownAges: [String],
    $response: [String],
    $response_category: [String] ,
    $response_system: [String],
    $age_at_response: [Int] ,
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String] ,
    $participant_age_at_collection: [Int] ,
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String] ,
    $tumor_classification: [String] ,
    $data_category: [String],
    $file_type: [String],
    $file_mapping_level: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String ){
    sampleOverview(
        import_data: $import_data,
        participant_ids: $participant_ids,
        sex_at_birth: $sex_at_birth,
        race: $race,
        age_at_diagnosis: $age_at_diagnosis,
        age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
        diagnosis_anatomic_site: $diagnosis_anatomic_site,
        disease_phase: $disease_phase,
        diagnosis: $diagnosis,
        diagnosis_classification_system: $diagnosis_classification_system,
        diagnosis_category: $diagnosis_category,
        diagnosis_basis: $diagnosis_basis,
        alteration: $alteration,
        alteration_type: $alteration_type,
        fusion_partner_gene: $fusion_partner_gene,
        gene_symbol: $gene_symbol,
        reported_significance: $reported_significance,
        reported_significance_system: $reported_significance_system,
        status: $status,
        last_known_survival_status: $last_known_survival_status,
        age_at_last_known_survival_status: $age_at_last_known_survival_status,
        age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
        first_event: $first_event,
        cause_of_death: $cause_of_death,
        treatment_type: $treatment_type,
        treatment_agent: $treatment_agent,
        age_at_treatment_start: $age_at_treatment_start,
        age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
        age_at_treatment_end: $age_at_treatment_end,
        age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
        response: $response,
        response_system: $response_system,
        response_category: $response_category,
        age_at_response: $age_at_response,
        age_at_response_unknownAges: $age_at_response_unknownAges,
        sample_anatomic_site: $sample_anatomic_site,
        participant_age_at_collection: $participant_age_at_collection,
        participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
        sample_tumor_status: $sample_tumor_status,
        tumor_classification: $tumor_classification,
        data_category: $data_category,
        file_type: $file_type,
        file_mapping_level: $file_mapping_level,
        dbgap_accession: $dbgap_accession,       
        study_name: $study_name,
        study_status: $study_status,
        library_selection: $library_selection,
        library_source_material: $library_source_material,
        library_source_molecule: $library_source_molecule,
        library_strategy: $library_strategy,
        first: $first, 
        offset: $offset, 
        order_by: $order_by,
        sort_direction: $sort_direction
    ){
        id
        sample_id
        participant_id
        study_id
        anatomic_site
        participant_age_at_collection
        sample_tumor_status
        tumor_classification
    }
}
`;

export const GET_PARTICIPANTS_OVERVIEW_QUERY = gql`
query participantOverview(
    $import_data: [String],
    $participant_ids: [String],
    $sex_at_birth: [String] ,
    $race: [String] ,
    $age_at_diagnosis: [Int] ,
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String] ,
    $disease_phase: [String] ,
    $diagnosis: [String] ,
    $diagnosis_classification_system: [String] ,
    $diagnosis_category: [String],
    $diagnosis_basis: [String] ,
    $alteration: [String],
    $alteration_type: [String],
    $fusion_partner_gene: [String],
    $gene_symbol: [String],
    $reported_significance: [String],
    $reported_significance_system: [String],
    $status: [String],
    $last_known_survival_status: [String] ,
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $cause_of_death: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int] ,
    $age_at_treatment_start_unknownAges: [String],
    $age_at_treatment_end: [Int],
    $age_at_treatment_end_unknownAges: [String],
    $response: [String],
    $response_category: [String] ,
    $response_system: [String],
    $age_at_response: [Int] ,
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String] ,
    $participant_age_at_collection: [Int] ,
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String] ,
    $tumor_classification: [String] ,
    $data_category: [String],
    $file_type: [String],
    $file_mapping_level: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String ){
    participantOverview(
        import_data: $import_data,
        participant_ids: $participant_ids,
        sex_at_birth: $sex_at_birth,
        race: $race,
        age_at_diagnosis: $age_at_diagnosis,
        age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
        diagnosis_anatomic_site: $diagnosis_anatomic_site,
        disease_phase: $disease_phase,
        diagnosis: $diagnosis,
        diagnosis_classification_system: $diagnosis_classification_system,
        diagnosis_category: $diagnosis_category,
        diagnosis_basis: $diagnosis_basis,
        alteration: $alteration,
        alteration_type: $alteration_type,
        fusion_partner_gene: $fusion_partner_gene,
        gene_symbol: $gene_symbol,
        reported_significance: $reported_significance,
        reported_significance_system: $reported_significance_system,
        status: $status,
        last_known_survival_status: $last_known_survival_status,
        age_at_last_known_survival_status: $age_at_last_known_survival_status,
        age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
        first_event: $first_event,
        cause_of_death: $cause_of_death,
        treatment_type: $treatment_type,
        treatment_agent: $treatment_agent,
        age_at_treatment_start: $age_at_treatment_start,
        age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
        age_at_treatment_end: $age_at_treatment_end,
        age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
        response: $response,
        response_system: $response_system,
        response_category: $response_category,
        age_at_response: $age_at_response,
        age_at_response_unknownAges: $age_at_response_unknownAges,
        sample_anatomic_site: $sample_anatomic_site,
        participant_age_at_collection: $participant_age_at_collection,
        participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
        sample_tumor_status: $sample_tumor_status,
        tumor_classification: $tumor_classification,
        data_category: $data_category,
        file_type: $file_type,
        file_mapping_level: $file_mapping_level,
        dbgap_accession: $dbgap_accession,       
        study_name: $study_name,
        study_status: $study_status,
        library_selection: $library_selection,
        library_source_material: $library_source_material,
        library_source_molecule: $library_source_molecule,
        library_strategy: $library_strategy,
        first: $first, 
        offset: $offset, 
        order_by: $order_by,
        sort_direction: $sort_direction
    ) {
        id
        participant_id
        dbgap_accession
        study_id
        race
        sex_at_birth
        cpi_data {
          associated_id
          repository_of_synonym_id
          domain_description
          domain_category
          data_location
          data_type
          p_id
        }
    }
}
`;

export const GET_STUDY_OVERVIEW_QUERY = gql`
query studyOverview(
    $import_data: [String],
    $participant_ids: [String],
    $sex_at_birth: [String] ,
    $race: [String] ,
    $age_at_diagnosis: [Int] ,
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String] ,
    $disease_phase: [String] ,
    $diagnosis: [String] ,
    $diagnosis_basis: [String] ,
    $diagnosis_classification_system: [String] ,
    $diagnosis_category: [String],
    $alteration: [String],
    $alteration_type: [String],
    $fusion_partner_gene: [String],
    $gene_symbol: [String],
    $reported_significance: [String],
    $reported_significance_system: [String],
    $status: [String],
    $last_known_survival_status: [String] ,
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $cause_of_death: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int] ,
    $age_at_treatment_start_unknownAges: [String],
    $age_at_treatment_end: [Int],
    $age_at_treatment_end_unknownAges: [String],
    $response: [String],
    $response_category: [String] ,
    $response_system: [String],
    $age_at_response: [Int] ,
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String] ,
    $participant_age_at_collection: [Int] ,
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String] ,
    $tumor_classification: [String] ,
    $data_category: [String],
    $file_type: [String],
    $file_mapping_level: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String ){
    studyOverview(
        import_data: $import_data,
        participant_ids: $participant_ids,
        sex_at_birth: $sex_at_birth,
        race: $race,
        age_at_diagnosis: $age_at_diagnosis,
        age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
        diagnosis_anatomic_site: $diagnosis_anatomic_site,
        disease_phase: $disease_phase,
        diagnosis: $diagnosis,
        diagnosis_classification_system: $diagnosis_classification_system,
        diagnosis_category: $diagnosis_category,
        diagnosis_basis: $diagnosis_basis,
        alteration: $alteration,
        alteration_type: $alteration_type,
        fusion_partner_gene: $fusion_partner_gene,
        gene_symbol: $gene_symbol,
        reported_significance: $reported_significance,
        reported_significance_system: $reported_significance_system,
        status: $status,
        last_known_survival_status: $last_known_survival_status,
        age_at_last_known_survival_status: $age_at_last_known_survival_status,
        age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
        first_event: $first_event,
        cause_of_death: $cause_of_death,
        treatment_type: $treatment_type,
        treatment_agent: $treatment_agent,
        age_at_treatment_start: $age_at_treatment_start,
        age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
        age_at_treatment_end: $age_at_treatment_end,
        age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
        response: $response,
        response_system: $response_system,
        response_category: $response_category,
        age_at_response: $age_at_response,
        age_at_response_unknownAges: $age_at_response_unknownAges,
        sample_anatomic_site: $sample_anatomic_site,
        participant_age_at_collection: $participant_age_at_collection,
        participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
        sample_tumor_status: $sample_tumor_status,
        tumor_classification: $tumor_classification,
        data_category: $data_category,
        file_type: $file_type,
        file_mapping_level: $file_mapping_level,
        dbgap_accession: $dbgap_accession,       
        study_name: $study_name,
        study_status: $study_status,
        library_selection: $library_selection,
        library_source_material: $library_source_material,
        library_source_molecule: $library_source_molecule,
        library_strategy: $library_strategy,
        first: $first, 
        offset: $offset, 
        order_by: $order_by,
        sort_direction: $sort_direction
    ) {
        id
        study_id
        pubmed_id
        grant_id
        dbgap_accession
        study_name
        study_status
        personnel_name
        diagnosis
        anatomic_site
        num_of_participants
        num_of_samples
        num_of_files
        file_type
    }
}
`;

export const GET_DIAGNOSIS_OVERVIEW_QUERY = gql`
query diagnosisOverview(
    $import_data: [String],
    $participant_ids: [String],
    $sex_at_birth: [String] ,
    $race: [String] ,
    $age_at_diagnosis: [Int] ,
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String] ,
    $disease_phase: [String] ,
    $diagnosis: [String] ,
    $diagnosis_basis: [String] ,
    $diagnosis_classification_system: [String] ,
    $diagnosis_category: [String],
    $alteration: [String],
    $alteration_type: [String],
    $fusion_partner_gene: [String],
    $gene_symbol: [String],
    $reported_significance: [String],
    $reported_significance_system: [String],
    $status: [String],
    $last_known_survival_status: [String] ,
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $cause_of_death: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int] ,
    $age_at_treatment_start_unknownAges: [String],
    $age_at_treatment_end: [Int],
    $age_at_treatment_end_unknownAges: [String],
    $response: [String],
    $response_category: [String] ,
    $response_system: [String],
    $age_at_response: [Int] ,
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String] ,
    $participant_age_at_collection: [Int] ,
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String] ,
    $tumor_classification: [String] ,
    $data_category: [String],
    $file_type: [String],
    $file_mapping_level: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String
  ){
    diagnosisOverview(
        import_data: $import_data,
        participant_ids: $participant_ids,
        sex_at_birth: $sex_at_birth,
        race: $race,
        age_at_diagnosis: $age_at_diagnosis,
        age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
        diagnosis_anatomic_site: $diagnosis_anatomic_site,
        disease_phase: $disease_phase,
        diagnosis: $diagnosis,
        diagnosis_classification_system: $diagnosis_classification_system,
        diagnosis_category: $diagnosis_category,
        diagnosis_basis: $diagnosis_basis,
        alteration: $alteration,
        alteration_type: $alteration_type,
        fusion_partner_gene: $fusion_partner_gene,
        gene_symbol: $gene_symbol,
        reported_significance: $reported_significance,
        reported_significance_system: $reported_significance_system,
        status: $status,
        last_known_survival_status: $last_known_survival_status,
        age_at_last_known_survival_status: $age_at_last_known_survival_status,
        age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
        first_event: $first_event,
        cause_of_death: $cause_of_death,
        treatment_type: $treatment_type,
        treatment_agent: $treatment_agent,
        age_at_treatment_start: $age_at_treatment_start,
        age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
        age_at_treatment_end: $age_at_treatment_end,
        age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
        response: $response,
        response_system: $response_system,
        response_category: $response_category,
        age_at_response: $age_at_response,
        age_at_response_unknownAges: $age_at_response_unknownAges,
        sample_anatomic_site: $sample_anatomic_site,
        participant_age_at_collection: $participant_age_at_collection,
        participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
        sample_tumor_status: $sample_tumor_status,
        tumor_classification: $tumor_classification,
        data_category: $data_category,
        file_type: $file_type,
        file_mapping_level: $file_mapping_level,
        dbgap_accession: $dbgap_accession,       
        study_name: $study_name,
        study_status: $study_status,
        library_selection: $library_selection,
        library_source_material: $library_source_material,
        library_source_molecule: $library_source_molecule,
        library_strategy: $library_strategy,
        first: $first,
        offset: $offset,
        order_by: $order_by,
        sort_direction: $sort_direction
      ) {
        # Demographics
        participant_id

        # Diagnosis
        id
        diagnosis_id
        age_at_diagnosis
        anatomic_site
        diagnosis_basis
        diagnosis
        diagnosis_classification_system
        diagnosis_comment
        diagnosis_id
        disease_phase
        toronto_childhood_cancer_staging
        tumor_classification
        tumor_grade
        tumor_stage_clinical_m
        tumor_stage_clinical_n
        tumor_stage_clinical_t

        # Study
        dbgap_accession
    }
  }
  `;

export const GET_GENETIC_ANALYSIS_OVERVIEW_QUERY = gql`
  query geneticAnalysisOverview(
    $import_data: [String],
    $participant_ids: [String],
    $sex_at_birth: [String] ,
    $race: [String] ,
    $age_at_diagnosis: [Int] ,
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String] ,
    $disease_phase: [String] ,
    $diagnosis: [String] ,
    $diagnosis_basis: [String] ,
    $diagnosis_classification_system: [String] ,
    $diagnosis_category: [String],
    $alteration: [String],
    $alteration_type: [String],
    $fusion_partner_gene: [String],
    $gene_symbol: [String],
    $reported_significance: [String],
    $reported_significance_system: [String],
    $status: [String],
    $last_known_survival_status: [String] ,
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $cause_of_death: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int] ,
    $age_at_treatment_start_unknownAges: [String],
    $age_at_treatment_end: [Int],
    $age_at_treatment_end_unknownAges: [String],
    $response: [String],
    $response_category: [String] ,
    $response_system: [String],
    $age_at_response: [Int] ,
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String] ,
    $participant_age_at_collection: [Int] ,
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String] ,
    $tumor_classification: [String] ,
    $data_category: [String],
    $file_type: [String],
    $file_mapping_level: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String
  ) {
    geneticAnalysisOverview(
      import_data: $import_data,
      participant_ids: $participant_ids,
      sex_at_birth: $sex_at_birth,
      race: $race,
      age_at_diagnosis: $age_at_diagnosis,
      age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
      diagnosis_anatomic_site: $diagnosis_anatomic_site,
      disease_phase: $disease_phase,
      diagnosis: $diagnosis,
      diagnosis_classification_system: $diagnosis_classification_system,
      diagnosis_category: $diagnosis_category,
      diagnosis_basis: $diagnosis_basis,
      alteration: $alteration,
      alteration_type: $alteration_type,
      fusion_partner_gene: $fusion_partner_gene,
      gene_symbol: $gene_symbol,
      reported_significance: $reported_significance,
      reported_significance_system: $reported_significance_system,
      status: $status,
      last_known_survival_status: $last_known_survival_status,
      age_at_last_known_survival_status: $age_at_last_known_survival_status,
      age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
      first_event: $first_event,
      cause_of_death: $cause_of_death,
      treatment_type: $treatment_type,
      treatment_agent: $treatment_agent,
      age_at_treatment_start: $age_at_treatment_start,
      age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
      age_at_treatment_end: $age_at_treatment_end,
      age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
      response: $response,
      response_system: $response_system,
      response_category: $response_category,
      age_at_response: $age_at_response,
      age_at_response_unknownAges: $age_at_response_unknownAges,
      sample_anatomic_site: $sample_anatomic_site,
      participant_age_at_collection: $participant_age_at_collection,
      participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
      sample_tumor_status: $sample_tumor_status,
      tumor_classification: $tumor_classification,
      data_category: $data_category,
      file_type: $file_type,
      file_mapping_level: $file_mapping_level,
      dbgap_accession: $dbgap_accession,       
      study_name: $study_name,
      study_status: $study_status,
      library_selection: $library_selection,
      library_source_material: $library_source_material,
      library_source_molecule: $library_source_molecule,
      library_strategy: $library_strategy,
      first: $first,
      offset: $offset,
      order_by: $order_by,
      sort_direction: $sort_direction
    ) {
      # Study
      dbgap_accession
      participant_id

      # Genetic Analysis
      id
      genetic_analysis_id
      alteration
      cytoband
      gene_symbol
      genomic_source_category
      hgvs_coding
      hgvs_genome
      hgvs_protein
      status
      test
      reported_significance
      reported_significance_system

      # Additional properties for download
      alteration_effect
      alteration_type
      chromosome
      exon
      fusion_partner_exon
      fusion_partner_gene
      reference_genome
    }
  }
  `;

export const GET_TREATMENT_OVERVIEW_QUERY = gql`
  query treatmentOverview(
    $import_data: [String],
    $participant_ids: [String],
    $sex_at_birth: [String] ,
    $race: [String] ,
    $age_at_diagnosis: [Int] ,
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String] ,
    $disease_phase: [String] ,
    $diagnosis: [String] ,
    $diagnosis_basis: [String] ,
    $diagnosis_classification_system: [String] ,
    $diagnosis_category: [String],
    $alteration: [String],
    $alteration_type: [String],
    $fusion_partner_gene: [String],
    $gene_symbol: [String],
    $reported_significance: [String],
    $reported_significance_system: [String],
    $status: [String],
    $last_known_survival_status: [String] ,
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $cause_of_death: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int] ,
    $age_at_treatment_start_unknownAges: [String],
    $age_at_treatment_end: [Int],
    $age_at_treatment_end_unknownAges: [String],
    $response: [String],
    $response_category: [String] ,
    $response_system: [String],
    $age_at_response: [Int] ,
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String] ,
    $participant_age_at_collection: [Int] ,
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String] ,
    $tumor_classification: [String] ,
    $data_category: [String],
    $file_type: [String],
    $file_mapping_level: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String
  ) {
    treatmentOverview(
      import_data: $import_data,
      participant_ids: $participant_ids,
      sex_at_birth: $sex_at_birth,
      race: $race,
      age_at_diagnosis: $age_at_diagnosis,
      age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
      diagnosis_anatomic_site: $diagnosis_anatomic_site,
      disease_phase: $disease_phase,
      diagnosis: $diagnosis,
      diagnosis_classification_system: $diagnosis_classification_system,
      diagnosis_category: $diagnosis_category,
      diagnosis_basis: $diagnosis_basis,
      alteration: $alteration,
      alteration_type: $alteration_type,
      fusion_partner_gene: $fusion_partner_gene,
      gene_symbol: $gene_symbol,
      reported_significance: $reported_significance,
      reported_significance_system: $reported_significance_system,
      status: $status,
      last_known_survival_status: $last_known_survival_status,
      age_at_last_known_survival_status: $age_at_last_known_survival_status,
      age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
      first_event: $first_event,
      cause_of_death: $cause_of_death,
      treatment_type: $treatment_type,
      treatment_agent: $treatment_agent,
      age_at_treatment_start: $age_at_treatment_start,
      age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
      age_at_treatment_end: $age_at_treatment_end,
      age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
      response: $response,
      response_system: $response_system,
      response_category: $response_category,
      age_at_response: $age_at_response,
      age_at_response_unknownAges: $age_at_response_unknownAges,
      sample_anatomic_site: $sample_anatomic_site,
      participant_age_at_collection: $participant_age_at_collection,
      participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
      sample_tumor_status: $sample_tumor_status,
      tumor_classification: $tumor_classification,
      data_category: $data_category,
      file_type: $file_type,
      file_mapping_level: $file_mapping_level,
      dbgap_accession: $dbgap_accession,       
      study_name: $study_name,
      study_status: $study_status,
      library_selection: $library_selection,
      library_source_material: $library_source_material,
      library_source_molecule: $library_source_molecule,
      library_strategy: $library_strategy,
      first: $first,
      offset: $offset,
      order_by: $order_by,
      sort_direction: $sort_direction
    ) {
      participant_id
      dbgap_accession

      # Treatment
      id
      treatment_id
      age_at_treatment_start
      age_at_treatment_end
      treatment_type
      treatment_agent
    }
  }
  `;

export const GET_TREATMENT_RESPONSE_OVERVIEW_QUERY = gql`
  query treatmentResponseOverview(
    $import_data: [String],
    $participant_ids: [String],
    $sex_at_birth: [String] ,
    $race: [String] ,
    $age_at_diagnosis: [Int] ,
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String] ,
    $disease_phase: [String] ,
    $diagnosis: [String] ,
    $diagnosis_basis: [String] ,
    $diagnosis_classification_system: [String] ,
    $diagnosis_category: [String],
    $alteration: [String],
    $alteration_type: [String],
    $fusion_partner_gene: [String],
    $gene_symbol: [String],
    $reported_significance: [String],
    $reported_significance_system: [String],
    $status: [String],
    $last_known_survival_status: [String] ,
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $cause_of_death: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int] ,
    $age_at_treatment_start_unknownAges: [String],
    $age_at_treatment_end: [Int],
    $age_at_treatment_end_unknownAges: [String],
    $response: [String],
    $response_category: [String] ,
    $response_system: [String],
    $age_at_response: [Int] ,
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String] ,
    $participant_age_at_collection: [Int] ,
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String] ,
    $tumor_classification: [String] ,
    $data_category: [String],
    $file_type: [String],
    $file_mapping_level: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String
  ) {
    treatmentResponseOverview(
      import_data: $import_data,
      participant_ids: $participant_ids,
      sex_at_birth: $sex_at_birth,
      race: $race,
      age_at_diagnosis: $age_at_diagnosis,
      age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
      diagnosis_anatomic_site: $diagnosis_anatomic_site,
      disease_phase: $disease_phase,
      diagnosis: $diagnosis,
      diagnosis_classification_system: $diagnosis_classification_system,
      diagnosis_category: $diagnosis_category,
      diagnosis_basis: $diagnosis_basis,
      alteration: $alteration,
      alteration_type: $alteration_type,
      fusion_partner_gene: $fusion_partner_gene,
      gene_symbol: $gene_symbol,
      reported_significance: $reported_significance,
      reported_significance_system: $reported_significance_system,
      status: $status,
      last_known_survival_status: $last_known_survival_status,
      age_at_last_known_survival_status: $age_at_last_known_survival_status,
      age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
      first_event: $first_event,
      cause_of_death: $cause_of_death,
      treatment_type: $treatment_type,
      treatment_agent: $treatment_agent,
      age_at_treatment_start: $age_at_treatment_start,
      age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
      age_at_treatment_end: $age_at_treatment_end,
      age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
      response: $response,
      response_system: $response_system,
      response_category: $response_category,
      age_at_response: $age_at_response,
      age_at_response_unknownAges: $age_at_response_unknownAges,
      sample_anatomic_site: $sample_anatomic_site,
      participant_age_at_collection: $participant_age_at_collection,
      participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
      sample_tumor_status: $sample_tumor_status,
      tumor_classification: $tumor_classification,
      data_category: $data_category,
      file_type: $file_type,
      file_mapping_level: $file_mapping_level,
      dbgap_accession: $dbgap_accession,       
      study_name: $study_name,
      study_status: $study_status,
      library_selection: $library_selection,
      library_source_material: $library_source_material,
      library_source_molecule: $library_source_molecule,
      library_strategy: $library_strategy,
      first: $first,
      offset: $offset,
      order_by: $order_by,
      sort_direction: $sort_direction
    ) {
      participant_id
      dbgap_accession

      # Treatment Response
      id
      treatment_response_id
      response
      age_at_response
      response_category
      response_system
    }
  }
  `;

export const GET_SURVIVAL_OVERVIEW_QUERY = gql`
  query survivalOverview(
    $import_data: [String],
    $participant_ids: [String],
    $sex_at_birth: [String] ,
    $race: [String] ,
    $age_at_diagnosis: [Int] ,
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String] ,
    $disease_phase: [String] ,
    $diagnosis: [String] ,
    $diagnosis_basis: [String] ,
    $diagnosis_classification_system: [String] ,
    $diagnosis_category: [String],
    $alteration: [String],
    $alteration_type: [String],
    $fusion_partner_gene: [String],
    $gene_symbol: [String],
    $reported_significance: [String],
    $reported_significance_system: [String],
    $status: [String],
    $last_known_survival_status: [String] ,
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $cause_of_death: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int] ,
    $age_at_treatment_start_unknownAges: [String],
    $age_at_treatment_end: [Int],
    $age_at_treatment_end_unknownAges: [String],
    $response: [String],
    $response_category: [String] ,
    $response_system: [String],
    $age_at_response: [Int] ,
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String] ,
    $participant_age_at_collection: [Int] ,
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String] ,
    $tumor_classification: [String] ,
    $data_category: [String],
    $file_type: [String],
    $file_mapping_level: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String
  ) {
    survivalOverview(
      import_data: $import_data,
      participant_ids: $participant_ids,
      sex_at_birth: $sex_at_birth,
      race: $race,
      age_at_diagnosis: $age_at_diagnosis,
      age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
      diagnosis_anatomic_site: $diagnosis_anatomic_site,
      disease_phase: $disease_phase,
      diagnosis: $diagnosis,
      diagnosis_classification_system: $diagnosis_classification_system,
      diagnosis_category: $diagnosis_category,
      diagnosis_basis: $diagnosis_basis,
      alteration: $alteration,
      alteration_type: $alteration_type,
      fusion_partner_gene: $fusion_partner_gene,
      gene_symbol: $gene_symbol,
      reported_significance: $reported_significance,
      reported_significance_system: $reported_significance_system,
      status: $status,
      last_known_survival_status: $last_known_survival_status,
      age_at_last_known_survival_status: $age_at_last_known_survival_status,
      age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
      first_event: $first_event,
      cause_of_death: $cause_of_death,
      treatment_type: $treatment_type,
      treatment_agent: $treatment_agent,
      age_at_treatment_start: $age_at_treatment_start,
      age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
      age_at_treatment_end: $age_at_treatment_end,
      age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
      response: $response,
      response_system: $response_system,
      response_category: $response_category,
      age_at_response: $age_at_response,
      age_at_response_unknownAges: $age_at_response_unknownAges,
      sample_anatomic_site: $sample_anatomic_site,
      participant_age_at_collection: $participant_age_at_collection,
      participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
      sample_tumor_status: $sample_tumor_status,
      tumor_classification: $tumor_classification,
      data_category: $data_category,
      file_type: $file_type,
      file_mapping_level: $file_mapping_level,
      dbgap_accession: $dbgap_accession,       
      study_name: $study_name,
      study_status: $study_status,
      library_selection: $library_selection,
      library_source_material: $library_source_material,
      library_source_molecule: $library_source_molecule,
      library_strategy: $library_strategy,
      first: $first,
      offset: $offset,
      order_by: $order_by,
      sort_direction: $sort_direction
    ) {
      participant_id
      dbgap_accession

      # Survival
      id
      age_at_event_free_survival_status
      age_at_last_known_survival_status
      cause_of_death
      event_free_survival_status
      first_event
      last_known_survival_status
      survival_id
    }
  }
  `;

export const GET_ALL_FILEIDS_PARTICIPANTSTAB_FOR_SELECT_ALL = gql`
query search (          
  $participant_ids: [String],
){
  fileIDsFromList (          
      participant_ids: $participant_ids,
  ) 
}
  `;

export const GET_ALL_FILEIDS_SAMPLESTAB_FOR_SELECT_ALL = gql`
query search (          
  $sample_ids: [String],
){
  fileIDsFromList (          
    sample_ids: $sample_ids,
  ) 
}
  `;

export const GET_ALL_FILEIDS_FILESTAB_FOR_SELECT_ALL = gql`
query search (          
  $file_ids: [String] 
){
  fileIDsFromList (          
      file_ids: $file_ids
  ) 
}
  `;

export const GET_ALL_FILEIDS_STUDYISTAB_FOR_SELECT_ALL = gql`
query search (          
  $study_ids: [String] 
){
  fileIDsFromList (          
      study_ids: $study_ids
  ) 
}
  `;

export const GET_ALL_FILEIDS_FROM_PARTICIPANTSTAB_FOR_ADD_ALL_CART = gql`
query participantsAddAllToCart(
    $import_data: [String],
    $participant_ids: [String],
    $sex_at_birth: [String] ,
    $race: [String] ,
    $age_at_diagnosis: [Int] ,
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String] ,
    $disease_phase: [String] ,
    $diagnosis: [String] ,
    $diagnosis_classification_system: [String] ,
    $diagnosis_category: [String],
    $diagnosis_basis: [String] ,
    $alteration: [String],
    $alteration_type: [String],
    $fusion_partner_gene: [String],
    $gene_symbol: [String],
    $reported_significance: [String],
    $reported_significance_system: [String],
    $status: [String],
    $cause_of_death: [String],
    $last_known_survival_status: [String] ,
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int] ,
    $age_at_treatment_start_unknownAges: [String],
    $age_at_treatment_end: [Int],
    $age_at_treatment_end_unknownAges: [String],
    $response: [String],
    $response_system: [String],
    $response_category: [String] ,
    $age_at_response: [Int] ,
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String] ,
    $participant_age_at_collection: [Int] ,
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String] ,
    $tumor_classification: [String] ,
    $data_category: [String],
    $file_type: [String],
    $file_mapping_level: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
    $first: Int,
    $offset: Int= 0, 
    $order_by: String = "file_id",
    $sort_direction: String = "asc" 
  ){
    participantOverview(
      import_data: $import_data,
      participant_ids: $participant_ids,
      sex_at_birth: $sex_at_birth,
      race: $race,
      age_at_diagnosis: $age_at_diagnosis,
      age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
      diagnosis_anatomic_site: $diagnosis_anatomic_site,
      disease_phase: $disease_phase,
      diagnosis: $diagnosis,
      diagnosis_classification_system: $diagnosis_classification_system,
      diagnosis_category: $diagnosis_category,
      diagnosis_basis: $diagnosis_basis,
      alteration: $alteration,
      alteration_type: $alteration_type,
      fusion_partner_gene: $fusion_partner_gene,
      gene_symbol: $gene_symbol,
      reported_significance: $reported_significance,
      reported_significance_system: $reported_significance_system,
      status: $status,
      cause_of_death: $cause_of_death,
      last_known_survival_status: $last_known_survival_status,
      age_at_last_known_survival_status: $age_at_last_known_survival_status,
      age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
      first_event: $first_event,
      treatment_type: $treatment_type,
      treatment_agent: $treatment_agent,
      age_at_treatment_start: $age_at_treatment_start,
      age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
      age_at_treatment_end: $age_at_treatment_end,
      age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
      response: $response,
      response_system: $response_system,
      response_category: $response_category,
      age_at_response: $age_at_response,
      age_at_response_unknownAges: $age_at_response_unknownAges,
      sample_anatomic_site: $sample_anatomic_site,
      participant_age_at_collection: $participant_age_at_collection,
      participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
      sample_tumor_status: $sample_tumor_status,
      tumor_classification: $tumor_classification,
      data_category: $data_category,
      file_type: $file_type,
      file_mapping_level: $file_mapping_level,
      dbgap_accession: $dbgap_accession,       
      study_name: $study_name,
      study_status: $study_status,
      library_selection: $library_selection,
      library_source_material: $library_source_material,
      library_source_molecule: $library_source_molecule,
      library_strategy: $library_strategy,
      first: $first,
      offset: $offset,
      order_by: $order_by,
      sort_direction: $sort_direction
      ) {
      files
  }
}
    `;

export const GET_ALL_FILEIDS_FROM_SAMPLETAB_FOR_ADD_ALL_CART = gql`
    query samplesAddAllToCart(
      $import_data: [String],
      $participant_ids: [String],
      $sex_at_birth: [String] ,
      $race: [String] ,
      $age_at_diagnosis: [Int] ,
      $age_at_diagnosis_unknownAges: [String],
      $diagnosis_anatomic_site: [String] ,
      $disease_phase: [String] ,
      $diagnosis: [String] ,
      $diagnosis_basis: [String] ,
      $diagnosis_classification_system: [String] ,
      $diagnosis_category: [String],
      $alteration: [String],
      $alteration_type: [String],
      $fusion_partner_gene: [String],
      $gene_symbol: [String],
      $reported_significance: [String],
      $reported_significance_system: [String],
      $status: [String],
      $last_known_survival_status: [String] ,
      $age_at_last_known_survival_status: [Int],
      $age_at_last_known_survival_status_unknownAges: [String],
      $first_event: [String],
      $cause_of_death: [String],
      $treatment_type: [String],
      $treatment_agent: [String],
      $age_at_treatment_start: [Int] ,
      $age_at_treatment_start_unknownAges: [String],
      $age_at_treatment_end: [Int],
      $age_at_treatment_end_unknownAges: [String],
      $response: [String],
      $response_system: [String],
      $response_category: [String] ,
      $age_at_response: [Int] ,
      $age_at_response_unknownAges: [String],
      $sample_anatomic_site: [String] ,
      $participant_age_at_collection: [Int] ,
      $participant_age_at_collection_unknownAges: [String],
      $sample_tumor_status: [String] ,
      $tumor_classification: [String] ,
      $data_category: [String],
      $file_type: [String],
      $file_mapping_level: [String],
      $dbgap_accession: [String],
      $study_name: [String],
      $study_status: [String],
      $library_selection: [String],
      $library_source_material: [String],
      $library_source_molecule: [String],
      $library_strategy: [String],
      $first: Int,
      $offset: Int= 0, 
      $order_by: String = "file_id",
      $sort_direction: String = "asc" ){
      sampleOverview(
          import_data: $import_data,
          participant_ids: $participant_ids,
          sex_at_birth: $sex_at_birth,
          race: $race,
          age_at_diagnosis: $age_at_diagnosis,
          age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
          diagnosis_anatomic_site: $diagnosis_anatomic_site,
          disease_phase: $disease_phase,
          diagnosis: $diagnosis ,
          diagnosis_basis: $diagnosis_basis ,
          diagnosis_classification_system: $diagnosis_classification_system ,
          diagnosis_category: $diagnosis_category,
          alteration: $alteration,
          alteration_type: $alteration_type,
          fusion_partner_gene: $fusion_partner_gene,
          gene_symbol: $gene_symbol,
          reported_significance: $reported_significance,
          reported_significance_system: $reported_significance_system,
          status: $status,
          last_known_survival_status: $last_known_survival_status,
          age_at_last_known_survival_status: $age_at_last_known_survival_status,
          age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
          cause_of_death: $cause_of_death,
          first_event: $first_event,
          treatment_type: $treatment_type,
          treatment_agent: $treatment_agent,
          age_at_treatment_start: $age_at_treatment_start,
          age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
          age_at_treatment_end: $age_at_treatment_end,
          age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
          response: $response,
          response_system: $response_system,
          response_category: $response_category,
          age_at_response: $age_at_response,
          age_at_response_unknownAges: $age_at_response_unknownAges,
          sample_anatomic_site: $sample_anatomic_site,
          participant_age_at_collection: $participant_age_at_collection,
          participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
          sample_tumor_status: $sample_tumor_status,
          tumor_classification: $tumor_classification,
          data_category: $data_category,
          file_type: $file_type,
          file_mapping_level: $file_mapping_level,
          dbgap_accession: $dbgap_accession,       
          study_name: $study_name,
          study_status: $study_status,
          library_selection: $library_selection,
          library_source_material: $library_source_material,
          library_source_molecule: $library_source_molecule,
          library_strategy: $library_strategy,
          first: $first,
          offset: $offset,
          order_by: $order_by,
          sort_direction: $sort_direction
          ) {
          files
      }
    }
        `;

export const GET_ALL_FILEIDS_FROM_FILESTAB_FOR_ADD_ALL_CART = gql`
query fileAddAllToCart(
  $import_data: [String],
  $participant_ids: [String],
  $sex_at_birth: [String] ,
  $race: [String] ,
  $age_at_diagnosis: [Int] ,
  $age_at_diagnosis_unknownAges: [String],
  $diagnosis_anatomic_site: [String] ,
  $disease_phase: [String] ,
  $diagnosis: [String] ,
  $diagnosis_classification_system: [String] ,
  $diagnosis_category: [String],
  $diagnosis_basis: [String] ,
  $alteration: [String],
  $alteration_type: [String],
  $fusion_partner_gene: [String],
  $gene_symbol: [String],
  $reported_significance: [String],
  $reported_significance_system: [String],
  $status: [String],
  $last_known_survival_status: [String] ,
  $age_at_last_known_survival_status: [Int],
  $age_at_last_known_survival_status_unknownAges: [String],
  $first_event: [String],
  $cause_of_death: [String],
  $treatment_type: [String],
  $treatment_agent: [String],
  $age_at_treatment_start: [Int] ,
  $age_at_treatment_start_unknownAges: [String],
  $age_at_treatment_end: [Int],
  $age_at_treatment_end_unknownAges: [String],
  $response: [String],
  $response_system: [String],
  $response_category: [String] ,
  $age_at_response: [Int] ,
  $age_at_response_unknownAges: [String],
  $sample_anatomic_site: [String] ,
  $participant_age_at_collection: [Int] ,
  $participant_age_at_collection_unknownAges: [String],
  $sample_tumor_status: [String] ,
  $tumor_classification: [String] ,
  $data_category: [String],
  $file_type: [String],
  $file_mapping_level: [String],
  $dbgap_accession: [String],
  $study_name: [String],
  $study_status: [String],
  $library_selection: [String],
  $library_source_material: [String],
  $library_source_molecule: [String],
  $library_strategy: [String],
  $first: Int,
  $offset: Int= 0, 
  $order_by: String = "file_id",
  $sort_direction: String = "asc"
 ){
  fileOverview(
      import_data: $import_data,
      participant_ids: $participant_ids,
      sex_at_birth: $sex_at_birth,
      race: $race,
      age_at_diagnosis: $age_at_diagnosis,
      age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
      diagnosis_anatomic_site: $diagnosis_anatomic_site,
      disease_phase: $disease_phase,
      diagnosis: $diagnosis,
      diagnosis_classification_system: $diagnosis_classification_system,
      diagnosis_category: $diagnosis_category,
      diagnosis_basis: $diagnosis_basis,
      alteration: $alteration,
      alteration_type: $alteration_type,
      fusion_partner_gene: $fusion_partner_gene,
      gene_symbol: $gene_symbol,
      reported_significance: $reported_significance,
      reported_significance_system: $reported_significance_system,
      status: $status,
      cause_of_death: $cause_of_death,
      last_known_survival_status: $last_known_survival_status,
      age_at_last_known_survival_status: $age_at_last_known_survival_status,
      age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
      first_event: $first_event,
      treatment_type: $treatment_type,
      treatment_agent: $treatment_agent,
      age_at_treatment_start: $age_at_treatment_start,
      age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
      age_at_treatment_end: $age_at_treatment_end,
      age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
      response: $response,
      response_system: $response_system,
      response_category: $response_category,
      age_at_response: $age_at_response,
      age_at_response_unknownAges: $age_at_response_unknownAges,
      sample_anatomic_site: $sample_anatomic_site,
      participant_age_at_collection: $participant_age_at_collection,
      participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
      sample_tumor_status: $sample_tumor_status,
      tumor_classification: $tumor_classification,
      data_category: $data_category,
      file_type: $file_type,
      file_mapping_level: $file_mapping_level,
      dbgap_accession: $dbgap_accession,       
      study_name: $study_name,
      study_status: $study_status,
      library_selection: $library_selection,
      library_source_material: $library_source_material,
      library_source_molecule: $library_source_molecule,
      library_strategy: $library_strategy,
      first: $first,
      offset: $offset,
      order_by: $order_by,
      sort_direction: $sort_direction
  ){
    files
  }
}
`;

export const GET_ALL_FILEIDS_FROM_STUDYTAB_FOR_ADD_ALL_CART = gql`
query studyAddAllToCart(
  $import_data: [String],
  $participant_ids: [String],
  $sex_at_birth: [String] ,
  $race: [String] ,
  $age_at_diagnosis: [Int] ,
  $age_at_diagnosis_unknownAges: [String],
  $diagnosis_anatomic_site: [String] ,
  $disease_phase: [String] ,
  $diagnosis: [String] ,
  $diagnosis_classification_system: [String] ,
  $diagnosis_category: [String],
  $diagnosis_basis: [String] ,
  $alteration: [String],
  $alteration_type: [String],
  $fusion_partner_gene: [String],
  $gene_symbol: [String],
  $reported_significance: [String],
  $reported_significance_system: [String],
  $status: [String],
  $cause_of_death: [String],
  $last_known_survival_status: [String] ,
  $age_at_last_known_survival_status: [Int],
  $age_at_last_known_survival_status_unknownAges: [String],
  $first_event: [String],
  $treatment_type: [String],
  $treatment_agent: [String],
  $age_at_treatment_start: [Int] ,
  $age_at_treatment_start_unknownAges: [String],
  $age_at_treatment_end: [Int],
  $age_at_treatment_end_unknownAges: [String],
  $response: [String],
  $response_system: [String],
  $response_category: [String] ,
  $age_at_response: [Int] ,
  $age_at_response_unknownAges: [String],
  $sample_anatomic_site: [String] ,
  $participant_age_at_collection: [Int] ,
  $participant_age_at_collection_unknownAges: [String],
  $sample_tumor_status: [String] ,
  $tumor_classification: [String] ,
  $data_category: [String],
  $file_type: [String],
  $file_mapping_level: [String],
  $dbgap_accession: [String],
  $study_name: [String],
  $study_status: [String],
  $library_selection: [String],
  $library_source_material: [String],
  $library_source_molecule: [String],
  $library_strategy: [String],
  $first: Int,
  $offset: Int= 0, 
  $order_by: String = "file_id",
  $sort_direction: String = "asc" ){
  studyOverview(
      import_data: $import_data,
      participant_ids: $participant_ids,
      sex_at_birth: $sex_at_birth,
      race: $race,
      age_at_diagnosis: $age_at_diagnosis,
      age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
      diagnosis_anatomic_site: $diagnosis_anatomic_site,
      disease_phase: $disease_phase,
      diagnosis: $diagnosis,
      diagnosis_classification_system: $diagnosis_classification_system,
      diagnosis_category: $diagnosis_category,
      diagnosis_basis: $diagnosis_basis,
      alteration: $alteration,
      alteration_type: $alteration_type,
      fusion_partner_gene: $fusion_partner_gene,
      gene_symbol: $gene_symbol,
      reported_significance: $reported_significance,
      reported_significance_system: $reported_significance_system,
      status: $status,
      cause_of_death: $cause_of_death,
      last_known_survival_status: $last_known_survival_status,
      age_at_last_known_survival_status: $age_at_last_known_survival_status,
      age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
      first_event: $first_event,
      treatment_type: $treatment_type,
      treatment_agent: $treatment_agent,
      age_at_treatment_start: $age_at_treatment_start,
      age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
      age_at_treatment_end: $age_at_treatment_end,
      age_at_treatment_end_unknownAges: $age_at_treatment_end_unknownAges,
      response: $response,
      response_system: $response_system,
      response_category: $response_category,
      age_at_response: $age_at_response,
      age_at_response_unknownAges: $age_at_response_unknownAges,
      sample_anatomic_site: $sample_anatomic_site,
      participant_age_at_collection: $participant_age_at_collection,
      participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
      sample_tumor_status: $sample_tumor_status,
      tumor_classification: $tumor_classification,
      data_category: $data_category,
      file_type: $file_type,
      file_mapping_level: $file_mapping_level,
      dbgap_accession: $dbgap_accession,       
      study_name: $study_name,
      study_status: $study_status,
      library_selection: $library_selection,
      library_source_material: $library_source_material,
      library_source_molecule: $library_source_molecule,
      library_strategy: $library_strategy,
      first: $first,
      offset: $offset,
      order_by: $order_by,
      sort_direction: $sort_direction
      ) {
      files
  }
}
    `;

// --------------- GraphQL query - Retrieve files tab details --------------
export const GET_FILES_NAME_QUERY = gql`
query fileOverview($file_ids: [String], $offset: Int = 0, $first: Int = 100000, $order_by:String ="file_name"){
  fileOverview(file_ids: $file_ids, offset: $offset,first: $first, order_by: $order_by) {
    file_name
  }
}
  `;

export const GET_FILE_IDS_FROM_FILE_NAME = gql`
  query (
      $file_name: [String],
      $offset: Int,
      $first: Int,
      $order_by: String
  )
  {
      fileIdsFromFileNameDesc(
          file_name:$file_name, 
          offset:$offset,
          first:$first,
          order_by:$order_by
      )
      {
          file_id
      }
  }`;

// --------------- GraphQL query - Search files by filename --------------
export const GET_FILENAMES_QUERY = gql`
query getFilenames(
    $filename: String,
    $import_data: [String],
    $participant_ids: [String],
    $sex_at_birth: [String],
    $race: [String],
    $age_at_diagnosis: [Int],
    $age_at_diagnosis_unknownAges: [String],
    $diagnosis_anatomic_site: [String],
    $disease_phase: [String],
    $diagnosis: [String],
    $diagnosis_classification_system: [String],
    $diagnosis_category: [String],
    $diagnosis_basis: [String],
    $last_known_survival_status: [String],
    $age_at_last_known_survival_status: [Int],
    $age_at_last_known_survival_status_unknownAges: [String],
    $first_event: [String],
    $treatment_type: [String],
    $treatment_agent: [String],
    $age_at_treatment_start: [Int],
    $age_at_treatment_start_unknownAges: [String],
    $response_category: [String],
    $age_at_response: [Int],
    $age_at_response_unknownAges: [String],
    $sample_anatomic_site: [String],
    $participant_age_at_collection: [Int],
    $participant_age_at_collection_unknownAges: [String],
    $sample_tumor_status: [String],
    $tumor_classification: [String],
    $data_category: [String],
    $file_type: [String],
    $dbgap_accession: [String],
    $study_name: [String],
    $study_status: [String],
    $library_selection: [String],
    $library_source_material: [String],
    $library_source_molecule: [String],
    $library_strategy: [String],
    $file_mapping_level: [String],
    $first: Int,
    $offset: Int,
    $order_by: String,
    $sort_direction: String
){
    getFilenames(
        filename: $filename,
        import_data: $import_data,
        participant_ids: $participant_ids,
        sex_at_birth: $sex_at_birth,
        race: $race,
        age_at_diagnosis: $age_at_diagnosis,
        age_at_diagnosis_unknownAges: $age_at_diagnosis_unknownAges,
        diagnosis_anatomic_site: $diagnosis_anatomic_site,
        disease_phase: $disease_phase,
        diagnosis: $diagnosis,
        diagnosis_classification_system: $diagnosis_classification_system,
        diagnosis_category: $diagnosis_category,
        diagnosis_basis: $diagnosis_basis,
        last_known_survival_status: $last_known_survival_status,
        age_at_last_known_survival_status: $age_at_last_known_survival_status,
        age_at_last_known_survival_status_unknownAges: $age_at_last_known_survival_status_unknownAges,
        first_event: $first_event,
        treatment_type: $treatment_type,
        treatment_agent: $treatment_agent,
        age_at_treatment_start: $age_at_treatment_start,
        age_at_treatment_start_unknownAges: $age_at_treatment_start_unknownAges,
        response_category: $response_category,
        age_at_response: $age_at_response,
        age_at_response_unknownAges: $age_at_response_unknownAges,
        sample_anatomic_site: $sample_anatomic_site,
        participant_age_at_collection: $participant_age_at_collection,
        participant_age_at_collection_unknownAges: $participant_age_at_collection_unknownAges,
        sample_tumor_status: $sample_tumor_status,
        tumor_classification: $tumor_classification,
        data_category: $data_category,
        file_type: $file_type,
        dbgap_accession: $dbgap_accession,
        study_name: $study_name,
        study_status: $study_status,
        library_selection: $library_selection,
        library_source_material: $library_source_material,
        library_source_molecule: $library_source_molecule,
        library_strategy: $library_strategy,
        file_mapping_level: $file_mapping_level,
        first: $first,
        offset: $offset,
        order_by: $order_by,
        sort_direction: $sort_direction
    ){
        totalCount
        files {
            id
            file_name
            data_category
            file_description
            file_type
            file_size
            study_id
            participant_id
            sample_id
            file_id
            guid
            md5sum
            library_selection
            library_source_material
            library_source_molecule
            library_strategy
            file_access
            file_mapping_level
        }
    }
}
`;

// --------------- Tabs Table configuration --------------
export const exploreParticipantsTabs = [
  {
    name: 'Participants',
    dataField: 'dataParticipant',
    api: GET_PARTICIPANTS_OVERVIEW_QUERY,
    paginationAPIField: 'participantOverview',
    count: 'numberOfParticipants',
    fileCount: 'participantsFileCount',
    dataKey: 'id',
    hiddenDataKeys: ['id', 'participant_id', 'study_id'],
    defaultSortField: 'participant_id',
    defaultSortDirection: 'asc',
    toolTipText: "Count of Participant Record",
    buttonText: 'Add Selected Files',
    tableID: 'participant_tab_table',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'Displayed Columns',
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      // {
      //   dataField: 'participant_id',
      //   header: 'Participant ID',
      //   cellType: cellTypes.LINK,
      //   linkAttr : {
      //     rootPath: '/participant',
      //     pathParams: ['participant_id'],
      //   },
      //   display: true,
      //   tooltipText: 'sort',
      // },
      {
        dataField: 'participant_id',
        header: 'Participant ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'cpi_data',
        header: 'Available CPI Mapping',
        display: true,
        sortable: false,
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CPI_MAPPING,
        cellStyle: cellStyles.EXCLUDE_FROM_DOWNLOAD,
      },
      {
        dataField: 'study_id',
        header: 'Study ID',
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
        hideable: true,
      },
      {
        dataField: 'race',
        header: 'Race',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
    ],
    id: 'participant_tab',
    tableID: 'participant_tab_table',
    tableDownloadCSV: customParticipantsTabDownloadCSV,
    tabIndex: '0',
    downloadFileName: 'CCDI Participants Download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'participant_ids',
    addFilesResponseKeys: ['fileIDsFromList'],
    addAllFilesResponseKeys: ['participantOverview', 'files'],
    addAllFileQuery: GET_ALL_FILEIDS_FROM_PARTICIPANTSTAB_FOR_ADD_ALL_CART,
    addSelectedFilesQuery: GET_ALL_FILEIDS_PARTICIPANTSTAB_FOR_SELECT_ALL,
  },
  {
    name: 'Studies',
    dataField: 'dataStudy',
    api: GET_STUDY_OVERVIEW_QUERY,
    paginationAPIField: 'studyOverview',
    defaultSortField: 'study_name',
    defaultSortDirection: 'asc',
    toolTipText: "Count of Study Record",
    count: 'numberOfStudies',
    fileCount: 'studiesFileCount',
    dataKey: 'id',
    tableID: 'study_tab_table',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'Displayed Columns',
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'study_name',
        header: 'Study Name',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'study_id',
        header: 'Study ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
        cellStyle: cellStyles.DBGAP,
      },
      {
        dataField: 'study_status',
        header: 'Study Status',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'dbgap_accession',
        header: 'Manifest',
        display: true,
        sortable: false,
        tooltipText: 'sort',
        cellType: cellTypes.CUSTOM_ELEM,
        cellStyle: cellStyles.STUDY_DOWNLOAD,
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'diagnosis',
        header: 'Diagnosis (Top 5)',
        downloadHeader: 'Diagnosis',
        display: true,
        sortable: false,
        headerType: cellTypes.CUSTOM_ELEM,
        cellType: cellTypes.CUSTOM_ELEM,
        cellStyle: cellStyles.EXPAND,
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'anatomic_site',
        header: 'Diagnosis Anatomic Site (Top 5)',
        downloadHeader: 'Diagnosis Anatomic Site',
        display: true,
        sortable: false,
        cellType: cellTypes.CUSTOM_ELEM,
        cellStyle: cellStyles.EXPAND,
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'num_of_participants',
        header: 'Number of Participants',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'num_of_samples',
        header: 'Number of Samples',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'num_of_files',
        header: 'Number of Files',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'file_type',
        header: 'File Type (Top 5)',
        downloadHeader: 'File Type',
        display: true,
        sortable: false,
        cellType: cellTypes.CUSTOM_ELEM,
        cellStyle: cellStyles.EXPAND,
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'pubmed_id',
        header: 'PubMed ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'personnel_name',
        header: 'Principal Investigator(s)',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'grant_id',
        header: 'Grant ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
    ],
    id: 'study_tab',
    tableID: 'study_tab_table',
    tabIndex: '4',
    selectableRows: true,
    tableDownloadCSV: customStudyTabDownloadCSV,
    downloadFileName: 'CCDI Studies Download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'study_ids',
    addFilesResponseKeys: ['fileIDsFromList'],
    addAllFilesResponseKeys: ['studyOverview', 'files'],
    addAllFileQuery: GET_ALL_FILEIDS_FROM_STUDYTAB_FOR_ADD_ALL_CART,
    addSelectedFilesQuery: GET_ALL_FILEIDS_STUDYISTAB_FOR_SELECT_ALL,
  },
  {
    name: 'Diagnosis',
    dataField: 'dataDiagnosis',
    api: GET_DIAGNOSIS_OVERVIEW_QUERY,
    paginationAPIField: 'diagnosisOverview',
    count: 'numberOfDiagnosis',
    fileCount: 'diagnosisFileCount',
    dataKey: 'id',
    hiddenDataKeys: ['id', 'participant_id', 'study_id'],
    defaultSortField: 'participant_id',
    defaultSortDirection: 'asc',
    toolTipText: "Count of Diagnosis Record",
    tableID: 'diagnosis_tab_table',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'Displayed Columns',
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'participant_id',
        header: 'Participant ID',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'diagnosis_id',
        header: 'Diagnosis ID',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'diagnosis',
        header: 'Diagnosis',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'age_at_diagnosis',
        header: 'Age at Diagnosis (days)',
        display: true,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.COMMA,
        cellType: cellTypes.COMMA,
      },
      {
        dataField: 'anatomic_site',
        header: 'Anatomic Site',
        display: true,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      // Add 'Diagnosis Category' here once the data is available
      {
        dataField: 'diagnosis_classification_system',
        header: 'Diagnosis Classification System',
        display: true,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'dbgap_accession',
        header: 'dbGaP Accession',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        linkAttr: {
          rootPath: 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=',
        },
        cellType: cellTypes.CUSTOM_ELEM,
        doNotDownload: true,
      },
      {
        dataField: 'diagnosis_basis',
        header: 'Diagnosis Basis',
        display: false,
        hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
      },
      {
        dataField: "diagnosis_comment",
        header: "Diagnosis Comment",
        display: false,
          hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
      },
      {
        dataField: "disease_phase",
        header: "Disease Phase",
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'tumor_classification',
        header: 'Tumor Classification',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'toronto_childhood_cancer_staging',
        header: 'Toronto Childhood Cancer Staging',
        display: false,
        hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
      },
      {
        dataField: "tumor_grade",
        header: "Tumor Grade",
        display: false,
          hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
      },
      {
        dataField: "tumor_stage_clinical_t",
        header: "Tumor Stage Clinical T",
        display: false,
          hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
      },
      {
        dataField: "tumor_stage_clinical_n",
        header: "Tumor Stage Clinical N",
        display: false,
          hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
      },
      {
        dataField: "tumor_stage_clinical_m",
        header: "Tumor Stage Clinical M",
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
    ],
    id: 'diagnosis_tab',
    tableID: 'diagnosis_tab_table',
    tableDownloadCSV: customDiagnosisTabDownloadCSV,
    tabIndex: '2',
    downloadFileName: 'CCDI Diagnoses Download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
  },
  {
    name: 'Samples',
    dataField: 'dataSample',
    api: GET_SAMPLES_OVERVIEW_QUERY,
    count: 'numberOfSamples',
    fileCount: 'samplesFileCount',
    paginationAPIField: 'sampleOverview',
    dataKey: 'id',
    defaultSortField: 'sample_id',
    defaultSortDirection: 'asc',
    toolTipText: "Count of Sample Record",
    tableID: 'sample_tab_table',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'Displayed Columns',
      },
    },
    saveButtonDefaultStyle: {
      color: '#fff',
      backgroundColor: '#00AEEF',
      opacity: '1',
      border: '0px',
      cursor: 'pointer',
    },
    DeactiveSaveButtonDefaultStyle: {
      opacity: '0.3',
      cursor: 'auto',
    },
    ActiveSaveButtonDefaultStyle: {
      cursor: 'pointer',
      opacity: 'unset',
      border: 'unset',
    },

    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'sample_id',
        header: 'Sample ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'participant_id',
        header: 'Participant ID',
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
      },
      {
        dataField: 'anatomic_site',
        header: 'Sample Anatomic Site',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'participant_age_at_collection',
        header: 'Age at Sample Collection (days)',
        display: true,
        tooltipText: 'sort',
        cellType: cellTypes.CUSTOM_ELEM,
        cellStyle: cellStyles.TRANSFORM,
        dataFormatter: (dt) => {
          if (!dt || dt === -999) {
            return 'Not Reported';
          }
          return dt.toString();
        },
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'sample_tumor_status',
        header: 'Sample Tumor Status',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'tumor_classification',
        header: 'Sample Tumor Classification',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'diagnosis',
        header: 'Sample Diagnosis',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'diagnosis_category',
        header: 'Diagnosis Category',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
    ],
    id: 'sample_tab',
    tableID: 'sample_tab_table',
    tabIndex: '3',
    tableDownloadCSV: customSamplesTabDownloadCSV,
    downloadFileName: 'CCDI Hub Samples Download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'sample_ids',
    addFilesResponseKeys: ['fileIDsFromList'],
    addAllFilesResponseKeys: ['sampleOverview', 'files'],
    addAllFileQuery: GET_ALL_FILEIDS_FROM_SAMPLETAB_FOR_ADD_ALL_CART,
    addSelectedFilesQuery: GET_ALL_FILEIDS_SAMPLESTAB_FOR_SELECT_ALL,
  },
  {
    name: 'Genetic Analyses',
    dataField: 'dataGeneticAnalysis',
    api: GET_GENETIC_ANALYSIS_OVERVIEW_QUERY,
    paginationAPIField: 'geneticAnalysisOverview',
    defaultSortField: 'participant_id',
    defaultSortDirection: 'asc',
    toolTipText: "Count of Genetic Analysis Record",
    count: 'numberOfGeneticAnalyses',
    fileCount: 'geneticAnalysesFileCount',
    dataKey: 'id',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'Displayed Columns',
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'participant_id',
        header: 'Participant ID',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'genetic_analysis_id',
        header: 'Genetic Analysis ID',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'gene_symbol',
        header: 'Gene Symbol',
        display: true,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'status',
        header: 'Status',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'reported_significance',
        header: 'Reported Significance',
        display: true,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'reported_significance_system',
        header: 'Reported Significance System',
        display: true,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'hgvs_genome',
        header: 'HGVS Genome',
        display: true,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'alteration',
        header: 'Alteration',
        display: true,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'dbgap_accession',
        header: 'dbGaP Accession',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        linkAttr: {
          rootPath: 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=',
        },
        cellType: cellTypes.CUSTOM_ELEM,
        doNotDownload: true,
      },
      {
        dataField: 'hgvs_coding',
        header: 'HGVS Coding',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'hgvs_protein',
        header: 'HGVS Protein',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'reference_genome',
        header: 'Reference Genome',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'chromosome',
        header: 'Chromosome',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'cytoband',
        header: 'Cytoband',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'exon',
        header: 'Exon',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'fusion_partner_gene',
        header: 'Fusion Partner Gene',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'fusion_partner_exon',
        header: 'Fusion Partner Exon',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'alteration_type',
        header: 'Alteration Type',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'alteration_effect',
        header: 'Alteration Effect',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'genomic_source_category',
        header: 'Genomic Source Category',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'test',
        header: 'Test',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
    ],
    id: 'genetic_analysis_tab',
    tableID: 'genetic_analysis_tab_table',
    tableDownloadCSV: customGeneticAnalysisTabDownloadCSV,
    tabIndex: '4',
    downloadFileName: 'CCDI Genetic Analyses Download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
  },
  {
    name: 'Treatments',
    dataField: 'dataTreatment',
    api: GET_TREATMENT_OVERVIEW_QUERY,
    paginationAPIField: 'treatmentOverview',
    defaultSortField: 'participant_id',
    defaultSortDirection: 'asc',
    toolTipText: "Count of Treatment Record",
    count: 'numberOfTreatments',
    fileCount: 'treatmentFileCount',
    dataKey: 'id',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'Displayed Columns',
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'participant_id',
        header: 'Participant ID',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM
      },
      {
        dataField: "treatment_id",
        header: "Treatment ID",
        display: true,
        hideable: false,
        tooltipText: "sort",
        role: cellTypes.DISPLAY
      },
      {
        dataField: "age_at_treatment_start",
        header: "Age at Treatment Start",
        display: true,
        hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
        cellType: cellTypes.COMMA,
      },
      {
        dataField: "age_at_treatment_end",
        header: "Age at Treatment End",
        display: true,
          hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
        cellType: cellTypes.COMMA,
      },
      {
        dataField: "treatment_type",
        header: "Treatment Type",
        display: true,
          hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
      },
      {
        dataField: "treatment_agent",
        header: "Treatment Agent",
        display: true,
        hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'dbgap_accession',
        header: 'dbGaP Accession',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        linkAttr: {
          rootPath: 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=',
        },
        cellType: cellTypes.CUSTOM_ELEM,
        doNotDownload: true,
      },
    ],
    id: 'treatment_tab',
    tableID: 'treatment_tab_table',
    tableDownloadCSV: customTreatmentTabDownloadCSV,
    tabIndex: '5',
    downloadFileName: 'CCDI Treatments Download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
  },
  {
    name: 'Treatment Responses',
    dataField: 'dataTreatmentResponse',
    api: GET_TREATMENT_RESPONSE_OVERVIEW_QUERY,
    paginationAPIField: 'treatmentResponseOverview',
    defaultSortField: 'participant_id',
    defaultSortDirection: 'asc',
    toolTipText: "Count of Treatment Response Record",
    count: 'numberOfTreatmentResponses',
    fileCount: 'treatmentResponseFileCount',
    dataKey: 'treatment_response_id',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'Displayed Columns',
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'participant_id',
        header: 'Participant ID',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM
      },
      {
        dataField: "treatment_response_id",
        header: "Treatment Response ID",
        display: true,
        hideable: false,
        tooltipText: "sort",
        role: cellTypes.DISPLAY
      },
      {
        dataField: 'response',
        header: 'Response',
        display: true,
        hideable: true,
      tooltipText: "sort",
      role: cellTypes.DISPLAY,
    },
    {
      dataField: "age_at_response",
      header: "Age at Response",
      display: true,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.COMMA,
      },
      {
        dataField: 'dbgap_accession',
        header: 'dbGaP Accession',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        linkAttr: {
          rootPath: 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=',
        },
        cellType: cellTypes.CUSTOM_ELEM,
        doNotDownload: true,
      },
      {
        dataField: "response_category",
        header: "Response Category",
        display: false,
        hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY
      },
      {
        dataField: "response_system",
        header: "Response System",
        display: false,
        hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY
      },
    ],
    id: 'treatment_response_tab',
    tableID: 'treatment_response_tab_table',
    tableDownloadCSV: customTreatmentResponseTabDownloadCSV,
    tabIndex: '6',
    downloadFileName: 'CCDI Treatment Responses Download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
  },
  {
    name: 'Survival',
    dataField: 'dataSurvival',
    api: GET_SURVIVAL_OVERVIEW_QUERY,
    paginationAPIField: 'survivalOverview',
    defaultSortField: 'participant_id',
    defaultSortDirection: 'asc',
    toolTipText: "Count of Survival Record",
    count: 'numberOfSurvivals',
    fileCount: 'survivalFileCount',
    dataKey: 'id',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'Displayed Columns',
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'participant_id',
        header: 'Participant ID',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM
      },
      {
        dataField: "survival_id",
        header: "Survival ID",
        display: true,
        hideable: false,
        tooltipText: "sort",
        role: cellTypes.DISPLAY
      },
      {
        dataField: 'last_known_survival_status',
        header: 'Last Known Survival Status',
        display: true,
        hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
      },
      {
        dataField: "age_at_last_known_survival_status",
        header: "Age at Last Known Survival Status",
        display: true,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.COMMA,
      },
      {
        dataField: 'dbgap_accession',
        header: 'dbGaP Accession',
        display: true,
        hideable: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        linkAttr: {
          rootPath: 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=',
        },
        cellType: cellTypes.CUSTOM_ELEM,
        doNotDownload: true,
      },
      {
        dataField: "event_free_survival_status",
        header: "Event-Free Survival Status",
        display: false,
        hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
      },
      {
        dataField: "age_at_event_free_survival_status",
        header: "Age at Event-Free Survival Status",
        display: false,
        hideable: true,
        tooltipText: "sort",
        role: cellTypes.DISPLAY,
        cellType: cellTypes.COMMA,
      },
      {
        dataField: 'first_event',
        header: 'First Event',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'cause_of_death',
        header: 'Cause of Death',
        display: false,
        hideable: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
    ],
    id: 'survival_tab',
    tableID: 'survival_tab_table',
    tableDownloadCSV: customSurvivalTabDownloadCSV,
    tabIndex: '7',
    downloadFileName: 'CCDI Survivals Download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
  },
];

export const exploreFilesTabs = [
  {
    name: 'Files',
    dataField: 'dataFile',
    api: GET_FILES_OVERVIEW_QUERY,
    paginationAPIField: 'fileOverview',
    defaultSortField: 'file_name',
    defaultSortDirection: 'asc',
    toolTipText: "Count of File Record",
    count: 'numberOfFiles',
    fileCount: 'filesFileCount',
    dataKey: 'id',
    tableID: 'file_tab_table',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'Displayed Columns',
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'file_name',
        header: 'File Name',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'data_category',
        header: 'Data Category',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
        cellStyle: cellStyles.TRANSFORM,
        dataFormatter: (dt) => {
          if (dt instanceof Array) {
            return dt.join(',')
          }
          else if (dt === null) {
            return "";
          }
          else if (dt.toString().charAt(0) === '[' && dt.toString().charAt(dt.toString().length - 1) === ']') {
            return dt.toString().substring(1, dt.length - 1)
          }
          return dt.toString();
        },
        hideable: true,
      },
      {
        dataField: 'file_description',
        header: 'File Description',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'file_type',
        header: 'File Type',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'file_size',
        header: 'File Size',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        dataFormatType: dataFormatTypes.FORMAT_BYTES,
        cellType: cellTypes.FORMAT_DATA,
        hideable: true,
      },
      {
        dataField: 'file_access',
        header: 'File Access',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'study_id',
        header: 'Study ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'participant_id',
        header: 'Participant ID',
        display: true,
        tooltipText: 'sort',
        cellType: cellTypes.CUSTOM_ELEM,
        cellStyle: cellStyles.MODAL,
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'sample_id',
        header: 'Sample ID',
        display: true,
        tooltipText: 'sort',
        cellType: cellTypes.CUSTOM_ELEM,
        cellStyle: cellStyles.MODAL,
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'guid',
        header: 'GUID',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'md5sum',
        header: 'MD5sum',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'library_selection',
        header: 'Library Selection',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'library_source_material',
        header: 'Library Source Material',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'library_strategy',
        header: 'Library Strategy',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'library_source_molecule',
        header: 'Library Source Molecule',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
      {
        dataField: 'file_mapping_level',
        header: 'File Mapping',
        display: false,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        hideable: true,
      },
    ],
    id: 'file_tab',
    tableID: 'file_tab_table',
    tabIndex: '8',
    selectableRows: true,
    tableDownloadCSV: customFilesTabDownloadCSV,
    downloadFileName: 'CCDI Hub Files Download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'file_ids',
    addFilesResponseKeys: ['fileIDsFromList'],
    addAllFilesResponseKeys: ['fileOverview', 'files'],
    addAllFileQuery: GET_ALL_FILEIDS_FROM_FILESTAB_FOR_ADD_ALL_CART,
    addSelectedFilesQuery: GET_ALL_FILEIDS_FILESTAB_FOR_SELECT_ALL,
  },
];
