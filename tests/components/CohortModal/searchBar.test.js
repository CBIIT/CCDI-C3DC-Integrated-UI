import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import SearchBar from '../../../src/components/CohortModal/components/CohortDetails/components/ParticipantList/components/SearchBar';

const theme = createMuiTheme();

describe('SearchBar', () => {
  it('should call onSearchChange while typing and onSearchBlur on blur', () => {
    const onSearchChange = jest.fn();
    const onSearchBlur = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <SearchBar onSearchChange={onSearchChange} onSearchBlur={onSearchBlur} />
      </ThemeProvider>,
    );

    const input = screen.getByLabelText(/Search participants by ID/i);
    fireEvent.change(input, { target: { value: 'P1' } });
    expect(onSearchChange).toHaveBeenCalledWith('P1');
    fireEvent.blur(input);
    expect(onSearchBlur).toHaveBeenCalledWith('P1');
  });

  it('should clear the search and focus the input from the icon', () => {
    const onSearchChange = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <SearchBar initialSearchText="abc" onSearchChange={onSearchChange} />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(onSearchChange).toHaveBeenCalledWith('');
    fireEvent.click(screen.getByLabelText('Focus search input'));
    expect(screen.getByLabelText(/Search participants by ID/i)).toHaveFocus();
  });
});
