/**
 * Minimal MCI YAML-shaped data for MCIResourceView / controller tests.
 * Matches the structure expected by MCIResourceView (mciContent, introText).
 */

export const defaultMciViewData = {
  introText: '<p>Unit test intro for MCI resource page.</p>',
  mciContent: [
    {
      id: 'section_overview',
      topic: 'Overview Section',
      list: [
        {
          id: 'sub_first',
          subtopic: 'First Subsection',
          content: '<p>Subsection body copy for testing.</p>',
        },
      ],
    },
  ],
};

export const mciViewWithWidgetsData = {
  introText: '<p>MCI widgets intro.</p>',
  MCI_header: 'https://example.com/mci-header.png',
  MCI_header_mobile: 'https://example.com/mci-header-mobile.png',
  MCI_CCDI_Data_Ecosystem: 'https://example.com/ecosystem.png',
  MCI_CCDI_Data_Ecosystem_Mobile: 'https://example.com/ecosystem-mobile.png',
  MCI_Workflow_Diagram_Caption: 'Workflow caption for unit test.',
  mciContent: [
    {
      id: 'section_widgets',
      topic: 'Widgets Section',
      list: [
        {
          id: 'sub_widgets',
          subtopic: 'Widgets Subsection',
          content: '<p>What is the CCDI Data Ecosystem?</p>',
          annotation: 'Widget annotation.',
          table: {
            title: 'Assay table',
            header: ['Col A', 'Col B', 'Col C'],
            body: ['a1', 'b1', 'c1', 'a2', 'b2', 'c2', 'a3', 'b3', 'c3'],
            footer: 'Table footer.',
          },
          diseaseTable: {
            title: 'Disease breakdown',
            header: ['Category', 'Share', 'Notes'],
            body: [{ name: 'Asthma', value: '10' }],
            footer: 'Disease footer.',
          },
          map: {
            title: 'Enrollment by State',
            data: [['meta', 'meta', 'California', '120']],
          },
          searchTable: {
            title: 'Gene search',
            body: 'GENE_AA, PIK3CA',
          },
        },
      ],
    },
  ],
};
