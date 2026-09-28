jest.mock('@bento-core/tool-tip', () => ({ children }) => children);

jest.mock('../../../src/components/EllipsisText', () => ({
  MiddleEllipsisText: ({ text, onTruncate }) => {
    if (onTruncate && text && text.length > 8) {
      setTimeout(() => onTruncate(true), 0);
    }
    return <span>{text}</span>;
  },
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CohortListItem from '../../../src/components/CohortModal/components/CohortList/components/CohortListItem';

const theme = createMuiTheme();

function renderItem(overrides = {}) {
  const onCohortSelect = jest.fn();
  const onCohortDelete = jest.fn();
  const onCohortDuplicate = jest.fn();
  const utils = render(
    <ThemeProvider theme={theme}>
      <CohortListItem
        cohortData={{ cohortId: 'c1', cohortName: 'Alpha' }}
        isSelected={false}
        onCohortSelect={onCohortSelect}
        onCohortDelete={onCohortDelete}
        onCohortDuplicate={onCohortDuplicate}
        cohortLimitReached={false}
        {...overrides}
      />
    </ThemeProvider>,
  );
  return { ...utils, onCohortSelect, onCohortDelete, onCohortDuplicate };
}

describe('CohortListItem', () => {
  it('should render nothing when cohort data is invalid', () => {
    const { container } = renderItem({ cohortData: null });
    expect(container).toBeEmptyDOMElement();
  });

  it('should select the cohort when the row is clicked', () => {
    const { onCohortSelect } = renderItem();
    fireEvent.click(screen.getByRole('option', { name: /Alpha/ }));
    expect(onCohortSelect).toHaveBeenCalledWith('c1');
  });

  it('should delete and duplicate from action buttons', () => {
    const { onCohortDelete, onCohortDuplicate } = renderItem();
    fireEvent.click(screen.getByRole('button', { name: /Delete cohort Alpha/i }));
    fireEvent.click(screen.getByRole('button', { name: /Duplicate cohort Alpha/i }));
    expect(onCohortDelete).toHaveBeenCalled();
    expect(onCohortDuplicate).toHaveBeenCalled();
  });

  it('should disable duplicate when the cohort limit is reached', () => {
    const { onCohortDuplicate } = renderItem({ cohortLimitReached: true });
    fireEvent.click(screen.getByRole('button', { name: /Cohort limit reached/i }));
    expect(onCohortDuplicate).not.toHaveBeenCalled();
  });

  it('should fall back to Unnamed Cohort when the name is missing', () => {
    renderItem({ cohortData: { cohortId: 'c2' } });
    expect(screen.getByRole('option', { name: /Unnamed Cohort/ })).toBeInTheDocument();
  });
});
