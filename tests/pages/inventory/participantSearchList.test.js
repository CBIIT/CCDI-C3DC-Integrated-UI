import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {
  LocalFindReducerGenerator,
  SearchBoxGenerator,
  SearchList,
} from '@bento-core/local-find';
import sortSearchEntries from '@bento-core/local-find/dist/SearchBox/sortSearchEntries';

const participantA = { type: 'participantIds', title: '0a6cc5a6d3d13aef9742' };
const participantB = { type: 'participantIds', title: '11588038aeb86b5ac1ce' };
const synonymA = { type: 'associatedIds', title: 'participant-syn-a', synonym: '4643529' };
const synonymB = { type: 'associatedIds', title: 'participant-syn-b', synonym: 'PAYHDF' };

const suggestions = [participantA, participantB, synonymA, synonymB];

function selectedText() {
  return document.getElementById('localFindCaseDropdown').textContent;
}

function positions() {
  const text = selectedText();
  return {
    participantA: text.indexOf(participantA.title),
    participantB: text.indexOf(participantB.title),
    synonymA: text.indexOf(synonymA.synonym),
    synonymB: text.indexOf(synonymB.synonym),
  };
}

beforeAll(() => {
  global.MutationObserver = class MutationObserver {
    observe() {}

    disconnect() {}
  };
  document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: document.body,
  });
});

describe('Participant ID search list', () => {
  describe('Rendering', () => {
    it('should list participant ids before synonyms on the first render', () => {
      const items = [synonymA, participantA, synonymB, participantB];
      render(<SearchList items={items} />);

      const order = positions();
      expect(order.participantA).toBeGreaterThanOrEqual(0);
      expect(order.participantA).toBeLessThan(order.participantB);
      expect(order.participantB).toBeLessThan(order.synonymA);
      expect(order.synonymA).toBeLessThan(order.synonymB);
      expect(screen.getAllByText('Synonym')).toHaveLength(2);
    });
  });

  describe('Selection order', () => {
    it('should keep participant ids and synonyms in their groups when the list renders again', () => {
      const items = [synonymB, participantB, synonymA, participantA];
      const { rerender } = render(<SearchList items={items} />);
      const firstPaint = selectedText();

      rerender(<SearchList items={items} />);

      expect(selectedText()).toBe(firstPaint);
      expect(items.map((item) => item.title)).toEqual([
        synonymB.title,
        participantB.title,
        synonymA.title,
        participantA.title,
      ]);
    });

    it('should place a new participant id with the participant ids and a new synonym after them', () => {
      const { rerender } = render(<SearchList items={[synonymA, participantA]} />);

      rerender(<SearchList items={[synonymA, participantA, synonymB, participantB]} />);

      const order = positions();
      expect(order.participantA).toBeLessThan(order.participantB);
      expect(order.participantB).toBeLessThan(order.synonymA);
      expect(order.synonymA).toBeLessThan(order.synonymB);
    });

    it('should group a selection before it is saved', () => {
      const mixed = [synonymA, participantB, synonymB, participantA];
      expect(sortSearchEntries(mixed)).toEqual([
        participantB,
        participantA,
        synonymA,
        synonymB,
      ]);
      expect(mixed.map((item) => item.title)).toEqual([
        synonymA.title,
        participantB.title,
        synonymB.title,
        participantA.title,
      ]);
    });
  });

  describe('Side effects', () => {
    it('should show a newly selected synonym under the participant ids', async () => {
      const savedSelections = [];
      const { localFind } = LocalFindReducerGenerator();
      const store = createStore(combineReducers({ localFind }), {
        localFind: {
          upload: [],
          autocomplete: [participantA],
          uploadMetadata: {},
        },
      });
      const { SearchBox } = SearchBoxGenerator({
        config: {
          inputPlaceholder: 'Participant ID Search',
          noOptionsText: 'No matching items found',
          searchType: ['participantIds', 'associatedIds'],
          ariaLabel: 'Participant ID Search',
        },
        functions: {
          getSuggestions: async () => suggestions,
          updateBrowserUrl: (_query, _navigate, nextValue) => {
            savedSelections.push(nextValue.map((item) => (
              item.type === 'associatedIds' ? item.synonym : item.title
            )));
          },
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SearchBox />
          </MemoryRouter>
        </Provider>,
      );

      expect(positions().participantA).toBeGreaterThanOrEqual(0);
      expect(selectedText()).not.toMatch(/4643529/);

      fireEvent.mouseDown(screen.getByLabelText('Participant ID Search'));
      fireEvent.click(await screen.findByText('4643529'));

      await waitFor(() => {
        const order = positions();
        expect(order.participantA).toBeGreaterThanOrEqual(0);
        expect(order.participantA).toBeLessThan(order.synonymA);
      });
      expect(savedSelections[savedSelections.length - 1]).toEqual([
        participantA.title,
        synonymA.synonym,
      ]);
    });
  });

  describe('Edge cases', () => {
    it('should render an empty selection without synonym or participant rows', () => {
      render(<SearchList items={[]} />);
      expect(selectedText()).toBe('');
    });

    it('should keep a legacy string entry with the participant ids', () => {
      render(<SearchList items={['INPUT SET', synonymA]} />);
      const text = selectedText();
      expect(text.indexOf('INPUT SET')).toBeLessThan(text.indexOf(synonymA.synonym));
    });
  });
});
