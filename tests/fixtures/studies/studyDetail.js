export const studyDetail = {
  study_id: 'phs002790',
  study_name: 'Molecular Characterization Initiative',
  study_description: 'A national molecular characterization study.',
  num_of_participants: 1234,
  num_of_samples: 2345,
  num_of_files: 3456,
  consent_codes: ['GRU', 'HMB'],
  pubmed_ids: ['12345678'],
  diagnoses: [
    { group: 'Leukemia', subjects: 10 },
    { group: 'Neuroblastoma', subjects: 4 },
  ],
  anatomic_site: [
    { group: 'Blood', subjects: 8 },
  ],
  data_categories: [
    { group: 'Genomics', subjects: 12 },
  ],
  supporting_data: [
    {
      data_category: 'IDC',
      data_object: '{"collection_name":"<b>IDC collection</b>"}',
    },
  ],
};

export const studyDetailWithoutSupportingData = {
  ...studyDetail,
  supporting_data: [],
};

export const studyDetailWithMalformedCodes = {
  ...studyDetail,
  consent_codes: '["GRU","MDS"]',
  pubmed_ids: '[]',
};
