export const searchParticipantsFixture = {
  numberOfParticipants: 3,
  numberOfFiles: 8,
  sex: [
    { group: 'Female', subjects: 2 },
    { group: 'Male', subjects: 1 },
    { group: 'Unknown', subjects: 0 },
  ],
};

export const inventoryReduxState = {
  inventoryReducer: {
    initialLoading: true,
    isDataloading: false,
    importFromURL: null,
    importFromData: [],
    activeFilters: { sex_at_birth: ['Female'] },
    dashData: searchParticipantsFixture,
    return_2_page: false,
    return_query_url: '',
    tabParticipants: 0,
    tabFiles: 0,
    action_type: 'facet',
    exploreMode: 'participants',
  },
  statusReducer: {
    unknownAgesState: {},
    filterState: { sex_at_birth: ['Female'] },
  },
  localFind: {
    autocomplete: [],
    upload: [],
  },
};
