import {
  DEFERRED_EXPLORE_PARTICIPANT_TAB_NAMES,
  deferredExploreParticipantsTabs,
  deferredExploreParticipantTableProperties,
  exploreParticipantsTabs,
  exploreFilesTabs,
  GET_FILES_OVERVIEW_QUERY,
  GET_FILENAMES_QUERY,
  GET_PARTICIPANTS_OVERVIEW_QUERY,
} from '../../src/bento/dashboardTabData';

const queryBody = (document) => document.loc.source.body;

describe('explore participant table tabs', () => {
  it('should hide deferred tables from the visible exploreParticipants tabs', () => {
    const visibleNames = exploreParticipantsTabs.map((tab) => tab.name);

    expect(visibleNames).toEqual([
      'Participants',
      'Studies',
      'Genetic Analyses',
      'Samples',
    ]);

    DEFERRED_EXPLORE_PARTICIPANT_TAB_NAMES.forEach((name) => {
      expect(visibleNames).not.toContain(name);
    });
  });

  it('should retain deferred table configs for property inventory', () => {
    const deferredNames = deferredExploreParticipantsTabs.map((tab) => tab.name);
    expect(deferredNames.sort()).toEqual([...DEFERRED_EXPLORE_PARTICIPANT_TAB_NAMES].sort());

    expect(deferredExploreParticipantTableProperties.Diagnosis).toEqual(
      expect.arrayContaining(['diagnosis', 'diagnosis_classification_system']),
    );
    expect(deferredExploreParticipantTableProperties.Treatments).toEqual(
      expect.arrayContaining(['treatment_type', 'treatment_agent']),
    );
    expect(deferredExploreParticipantTableProperties['Treatment Responses']).toEqual(
      expect.arrayContaining(['response', 'response_category']),
    );
    expect(deferredExploreParticipantTableProperties.Survival).toEqual(
      expect.arrayContaining(['last_known_survival_status']),
    );
  });

  it('should keep exploreFiles limited to the Files table', () => {
    expect(exploreFilesTabs.map((tab) => tab.name)).toEqual(["Files", "Imaging Data"]);
  });

  it('should send cause_of_death with the exploreFiles download query', () => {
    const fileQuery = queryBody(GET_FILES_OVERVIEW_QUERY);
    const filenameQuery = queryBody(GET_FILENAMES_QUERY);
    const participantQuery = queryBody(GET_PARTICIPANTS_OVERVIEW_QUERY);

    expect(exploreFilesTabs[0].api).toBe(GET_FILES_OVERVIEW_QUERY);
    expect(fileQuery).toContain('$cause_of_death: [String]');
    expect(fileQuery).toContain('cause_of_death: $cause_of_death');
    expect(filenameQuery).toContain('cause_of_death: $cause_of_death');
    expect(participantQuery).toContain('cause_of_death: $cause_of_death');
  });
});

describe('consolidated participant table', () => {
  const participantsTab = exploreParticipantsTabs.find((tab) => tab.name === 'Participants');
  const dataColumns = participantsTab.columns.filter((column) => column.dataField);
  const query = queryBody(GET_PARTICIPANTS_OVERVIEW_QUERY);

  const headers = (predicate) => dataColumns.filter(predicate).map((column) => column.header);

  it('shows, locks, and hides columns to match the consolidated layout', () => {
    expect(headers((column) => column.display)).toEqual([
      'Participant ID',
      'Available CPI Mapping',
      'Sex at Birth',
      'Diagnosis',
      'Diagnosis Category',
      'Age at Diagnosis (days)',
      'Anatomic Site',
      'Last Known Survival Status',
      'Age at Last Known Survival Status',
      'Treatment Type',
      'Age at Treatment Start',
    ]);

    expect(headers((column) => column.hideable === false && !column.downloadOnly)).toEqual([
      'Participant ID',
      'Available CPI Mapping',
      'Diagnosis',
    ]);

    expect(headers((column) => column.downloadOnly)).toEqual([
      'Study ID',
      'Diagnosis Comment',
      'Tumor Classification',
      'Toronto Childhood Cancer Staging',
      'Tumor Grade',
      'Tumor Stage Clinical T',
      'Tumor Stage Clinical N',
      'Tumor Stage Clinical M',
      'Chemotherapy Treatment Agent',
      'Radiation Therapy Type',
      'Beam Radiation Type',
      'Surgery Type',
      'Other Treatment Type',
    ]);
  });

  it('requests every participant column from participantOverview', () => {
    dataColumns
      .filter((column) => column.dataField !== 'cpi_data')
      .forEach((column) => {
        expect(query).toContain(column.dataField);
      });
    expect(query).toContain('cpi_data {');
  });

  it('joins diagnosis records with semicolons and keeps age alignment', () => {
    const diagnosis = dataColumns.find((column) => column.dataField === 'diagnosis');
    const age = dataColumns.find((column) => column.dataField === 'age_at_diagnosis');
    const site = dataColumns.find((column) => column.dataField === 'diagnosis_anatomic_site');
    const phase = dataColumns.find((column) => column.dataField === 'disease_phase');

    expect(diagnosis.dataFormatter(['Ewing sarcoma', 'Sarcoma, NOS'])).toBe('Ewing sarcoma; Sarcoma, NOS');
    expect(site.dataFormatter([['leg', 'limb bone'], 'arm'])).toBe('leg, limb bone; arm');
    expect(phase.dataFormatter(['Initial Diagnosis', 'Unknown'])).toBe('Initial Diagnosis; Unknown');
    expect(age.dataFormatter(['4201', '-999', '6317'])).toBe('4201; Not Reported; 6317');
    [diagnosis, age, site, phase].forEach((column) => {
      expect(column.valueDelimiter).toBe('; ');
    });
  });

  it('joins treatment records with semicolons and keeps ages aligned', () => {
    const type = dataColumns.find((column) => column.dataField === 'treatment_type');
    const start = dataColumns.find((column) => column.dataField === 'age_at_treatment_start');
    const end = dataColumns.find((column) => column.dataField === 'age_at_treatment_end');

    expect(type.dataFormatter(['Surgery', 'Chemotherapy', 'Radiation'])).toBe('Surgery; Chemotherapy; Radiation');
    expect(start.dataFormatter(['10', '-999', 'Not Reported'])).toBe('10; Not Reported; Not Reported');
    expect(end.dataFormatter(['20', '30', '-999'])).toBe('20; 30; Not Reported');
    [type, start, end].forEach((column) => {
      expect(column.valueDelimiter).toBe('; ');
    });
  });
});
