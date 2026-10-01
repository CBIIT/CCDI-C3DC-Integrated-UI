jest.mock('../../../src/bento/landingPageData', () => ({
  carouselList: [
    { content: 'About', img: '/about.png', link: '/about', mobile: '/about-m.png' },
    { content: 'External', img: '/ext.png', link: 'https://example.com', mobile: '/ext-m.png' },
  ],
  titleData: { latestUpdatesTitle: 'Latest Updates' },
}));

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Carousel from '../../../src/pages/landing/component/carousel';
import HeroMobile from '../../../src/pages/landing/component/heroMobile';
import LatestUpdate from '../../../src/pages/landing/component/latestUpdate';
import usePageVisibility from '../../../src/pages/landing/component/PageVisibility';

function VisibilityProbe() {
  const visible = usePageVisibility();
  return <div>{visible ? 'visible' : 'hidden'}</div>;
}

const updates = [
  { id: '1', date: '2020-01-01', latestUpdate: true, title: 'One', slug: 'short', img: 'i1' },
  { id: '2', date: '2021-01-01', latestUpdate: true, title: 'Two', slug: 'x'.repeat(105), img: 'i1' },
  { id: '3', date: '2022-01-01', latestUpdate: true, title: 'Three', slug: 'y'.repeat(120), img: 'i1' },
];

describe('landing carousels', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should rotate the desktop carousel and pause it', () => {
    render(
      <MemoryRouter>
        <Carousel />
      </MemoryRouter>,
    );
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('External')).toBeInTheDocument();
    fireEvent.click(document.querySelector('.downButton'));
    fireEvent.click(document.querySelector('.upButton'));
    fireEvent.click(screen.getByText('PAUSE'));
    fireEvent.click(screen.getByText('START'));
    fireEvent.keyPress(screen.getByText('PAUSE'), { code: 'Enter', key: 'Enter' });
    fireEvent.mouseEnter(document.querySelector('.downButton').parentElement);
    fireEvent.mouseLeave(document.querySelector('.downButton').parentElement);
    jest.advanceTimersByTime(4000);
  });

  it('should rotate the mobile hero', () => {
    const { rerender } = render(<HeroMobile />);
    expect(screen.getByText('About')).toBeInTheDocument();
    fireEvent.click(document.querySelectorAll('.arrowButtonContainer')[1]);
    fireEvent.click(document.querySelectorAll('.arrowButtonContainer')[0]);
    fireEvent.click(document.querySelector('.pauseButtonContainer'));
    fireEvent.mouseEnter(screen.getByAltText('About'));
    fireEvent.mouseLeave(screen.getByAltText('About'));
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 500 });
    rerender(<HeroMobile />);
    expect(screen.getByText(/Discover/)).toBeInTheDocument();
  });

  it('should render latest updates and respond to width', () => {
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 600 });
    render(
      <LatestUpdate
        newsList={updates}
        releaseNotesList={[]}
        srcList={{ i1: '/i.png' }}
        altList={{ i1: 'one' }}
      />,
    );
    expect(screen.getByText('Latest Updates')).toBeInTheDocument();
    const titles = screen.getAllByText('Three');
    expect(titles.length).toBeGreaterThan(0);
    fireEvent.mouseEnter(titles[0].closest('.latestUpdatesListItem'));
    fireEvent.mouseLeave(titles[0].closest('.latestUpdatesListItem'));
    fireEvent.click(document.querySelectorAll('.arrowButtonContainer')[0]);
    fireEvent.click(document.querySelector('.pauseButtonContainer'));
    fireEvent.click(document.querySelectorAll('.arrowButtonContainer')[1]);
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1200 });
    fireEvent(window, new Event('resize'));
  });

  it('should follow document visibility across vendor prefixes', () => {
    render(<VisibilityProbe />);
    expect(screen.getByText('visible')).toBeInTheDocument();
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(screen.getByText('hidden')).toBeInTheDocument();

    delete document.hidden;
    Object.defineProperty(document, 'msHidden', { configurable: true, get: () => true });
    render(<VisibilityProbe />);
    delete document.msHidden;
    Object.defineProperty(document, 'webkitHidden', { configurable: true, get: () => false });
    render(<VisibilityProbe />);
    delete document.webkitHidden;
  });
});
