/**
 * Minimal PMTL YAML-shaped data for PMTLResourceView / controller tests.
 */

export const defaultPmtlViewData = {
  introText: '<p>Unit test intro for PMTL resource page.</p>',
  pmtlContent: [
    {
      id: 'section_overview',
      topic: 'Overview Section',
      list: [
        {
          id: 'sub_first',
          subtopic: 'First Subsection',
          content: '<p>PMTL subsection body for testing.</p>',
        },
      ],
    },
  ],
};

export const pmtlViewWithWidgetsData = {
  introText: '<p>PMTL widgets intro.</p>',
  MCI_header: 'https://example.com/pmtl-header.png',
  MCI_header_mobile: 'https://example.com/pmtl-header-mobile.png',
  pmtlContent: [
    {
      id: 'pmtl_widgets',
      topic: 'PMTL Widgets',
      list: [
        {
          id: 'pmtl_sub_widgets',
          subtopic: 'PMTL Widget Sub',
          content: '<p>PMTL widget body.</p>',
          annotation: 'PMTL annotation.',
          table: {
            title: 'PMTL assay table',
            header: ['H1', 'H2', 'H3', 'H4'],
            body: ['r1c1', 'r1c2', 'r1c3', 'r1c4', 'r2c1', 'r2c2', 'r2c3', 'r2c4'],
            footer: 'PMTL table footer.',
          },
          diseaseTable: {
            title: 'PMTL disease',
            header: ['Category', 'Share', 'Notes'],
            body: [{ name: 'Flu', value: '5' }],
            footer: 'PMTL disease footer.',
          },
          map: {
            title: 'Enrollment by State',
            data: [['meta', 'meta', 'Texas', '45']],
          },
          searchTable: {
            title: 'PMTL gene search',
            body: 'TP53, BRAF',
          },
        },
      ],
    },
  ],
};
