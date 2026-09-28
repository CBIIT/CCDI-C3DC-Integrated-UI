jest.mock('../../../src/components/CohortSelectorState/CohortStateContext', () => ({
  CohortStateContext: {},
  CohortStateProvider: ({ children }) => children,
}));

import {
  AboutCard,
  FilesCard,
  ModelsCard,
  ParticipantCard,
  SamplesCard,
  StudiesCard,
  ValueCard,
} from '../../../src/pages/globalSearch/Cards';

describe('Cards index', () => {
  it('should export the global search result cards', () => {
    expect(AboutCard).toBeDefined();
    expect(FilesCard).toBeDefined();
    expect(ModelsCard).toBeDefined();
    expect(ParticipantCard).toBeDefined();
    expect(SamplesCard).toBeDefined();
    expect(StudiesCard).toBeDefined();
    expect(ValueCard).toBeDefined();
  });
});
