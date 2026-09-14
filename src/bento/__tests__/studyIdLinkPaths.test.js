import { exploreParticipantsTabs, exploreFilesTabs } from '../dashboardTabData';
import { tableConfig as cohortAnalyzerTableConfig } from '../cohortAnalyzerPageData';

const getStudyIdColumns = (tabs) => tabs
  .flatMap((tab) => tab.columns || [])
  .filter((column) => column.header === 'Study ID' && column.linkAttr);

describe('Study ID link paths', () => {
  it('uses /studies/ path in dashboard tabs', () => {
    const studyIdColumns = [
      ...getStudyIdColumns(exploreParticipantsTabs),
      ...getStudyIdColumns(exploreFilesTabs),
    ];

    expect(studyIdColumns.length).toBeGreaterThan(0);
    studyIdColumns.forEach((column) => {
      expect(column.linkAttr.rootPath).toBe('/studies/');
    });
  });

  it('uses /studies/ path in cohort analyzer table', () => {
    const studyIdColumn = (cohortAnalyzerTableConfig.columns || [])
      .find((column) => column.header === 'Study ID');

    expect(studyIdColumn.linkAttr.linkAttr.rootPath).toBe('/studies/');
  });
});
