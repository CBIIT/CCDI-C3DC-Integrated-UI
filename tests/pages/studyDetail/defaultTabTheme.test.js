import customTheme from '../../../src/pages/studyDetail/overview/tabs/DefaultTabTheme';

describe('DefaultTabTheme', () => {
  it('should export the selected-tab underline style', () => {
    expect(customTheme.MuiTab.root['&.Mui-selected'].borderBottom).toContain('#0095A2');
  });
});
