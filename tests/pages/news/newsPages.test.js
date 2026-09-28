jest.mock('axios', () => ({
  get: (...args) => global.__newsAxiosGet(...args),
}));

jest.mock('js-yaml', () => ({
  safeLoad: (data) => global.__newsYamlLoad(data),
}));

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewsController from '../../../src/pages/news/newsController';
import NewsView from '../../../src/pages/news/newsView';
import NewsDetailView from '../../../src/pages/news/newsDetailView';

function newsItem(id, type, title, date = '2024-06-01') {
  return {
    id,
    type,
    title,
    date,
    highlight: '<p>Highlight</p>',
    fullText: '<p>Full</p>',
    img: 'shot',
    version: '1.2',
  };
}

const newsList = [
  newsItem('a', 'News', 'Alpha', '2099-01-01'),
  newsItem('b', 'CCDI Application Updates', 'Beta', '2098-01-01'),
  ...Array.from({ length: 10 }, (_, i) => newsItem(`n${i}`, 'News', `Story ${i}`)),
];

const releaseNotesList = [
  newsItem('r1', 'Release Notes', 'Release 1'),
];

const srcList = { shot: '/shot.png' };
const altList = { shot: 'shot alt' };

describe('news pages', () => {
  beforeEach(() => {
    window.open = jest.fn(() => ({ opener: {} }));
    window.scrollTo = jest.fn();
  });

  it('should render news after the yaml loads and an empty shell on failure', async () => {
    global.__newsYamlLoad = jest.fn(() => ({
      newsList,
      newsImgUrlList: srcList,
      altList,
      releaseNotesList,
    }));
    global.__newsAxiosGet = jest.fn(() => Promise.resolve({ data: 'yaml-body' }));
    const { unmount } = render(<NewsController />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getAllByText('Alpha').length).toBeGreaterThan(0);
    unmount();

    global.__newsAxiosGet = jest.fn(() => Promise.reject(new Error('missing')));
    render(<NewsController />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.queryAllByText('Alpha')).toHaveLength(0);
  });

  it('should filter tabs, paginate, and open release notes', () => {
    render(
      <NewsView
        classes={{
          noticeText: 'notice',
          paginationContainer: 'pager',
          perPageContainer: 'per',
          flexPageContainer: 'flex',
          pageSizeContainer: 'size',
          pageSizeArrowUp: 'up',
          pageSizeArrowDown: 'down',
          pageSizeList: 'list',
          pageSizeItem: 'item',
          showingContainer: 'showing',
          showingRangeContainer: 'range',
          pageContainer: 'pages',
          prevButtonDisabledContainer: 'prev-off',
          prevButtonContainer: 'prev',
          prevButtonDisabled: 'prev-btn-off',
          prevButton: 'prev-btn',
          nextButtonDisabledContainer: 'next-off',
          nextButtonContainer: 'next',
          nextButtonDisabled: 'next-btn-off',
          nextButton: 'next-btn',
          paginationUl: 'ul',
          paginationRoot: 'root',
        }}
        newsList={newsList}
        releaseNotesList={releaseNotesList}
        srcList={srcList}
        altList={altList}
      />,
    );

    expect(screen.getAllByText('Alpha').length).toBeGreaterThan(0);
    const tab = (label) => Array.from(document.querySelectorAll('.tabListItem, .tabListItemActive'))
      .find((node) => node.textContent === label);
    fireEvent.click(tab('News'));
    expect(screen.queryAllByText('Beta')).toHaveLength(0);
    fireEvent.click(tab('CCDI Application Updates'));
    expect(screen.getAllByText('Beta').length).toBeGreaterThan(0);
    fireEvent.click(tab('Release Notes'));
    expect(screen.getAllByText('Release 1').length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByText('View PDF')[0]);
    expect(window.open).toHaveBeenCalledWith('/CCDI_Hub_Release_Notes.pdf', '_blank');
    fireEvent.click(screen.getAllByText('Read More')[0]);

    fireEvent.click(tab('All'));
    fireEvent.click(document.querySelector('.tabDropdownItem.first'));
    expect(screen.getByText('Select a category')).toBeInTheDocument();
    const newsChoices = screen.getAllByText('News');
    fireEvent.click(newsChoices[newsChoices.length - 1]);

    fireEvent.click(document.getElementById('pageSizeBlock'));
    fireEvent.click(screen.getByText('20'));
    fireEvent.mouseDown(document.body);

    const next = document.querySelector('[class*="next"]');
    if (next) fireEvent.click(next);
    const prev = document.querySelector('[class*="prev"]');
    if (prev) fireEvent.click(prev);
  });

  it('should render a news detail article and the empty-id branch', () => {
    window.history.pushState({}, '', '/newsdetail/n1');
    render(<NewsDetailView />);
    expect(screen.getByText('Trial opens')).toBeInTheDocument();
    expect(screen.getByAltText('Trial opens')).toBeInTheDocument();

    window.history.pushState({}, '', '/newsdetail/n2');
    render(<NewsDetailView />);
    expect(screen.getByText('No image')).toBeInTheDocument();

    window.history.pushState({}, '', '/newsdetail/');
    expect(() => render(<NewsDetailView />)).toThrow();
  });
});
