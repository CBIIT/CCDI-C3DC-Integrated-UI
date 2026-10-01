/**
 * RareCancerResourceView — YAML HTML content, download links, hash scroll, nav.
 */

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RareCancerResourceView from '../../../../src/pages/resource/RareCancerResourcePage/RareCancerResourceView';
import {
  clickTopicNav,
  clickSubtopicNav,
  triggerResourceScroll,
  triggerResourceScrollAbsolute,
  triggerResourceScrollToTop,
} from '../shared/resourceViewTestUtils';
import { minimalRareCancerResourceData } from '../../../fixtures/resource/resourceDataViewProps';
import {
  multiTopicRareCancerData,
  rareCancerWithDownloadData,
  rareCancerCrossOriginDownloadData,
} from '../../../fixtures/resource/resourceInteractionData';

function renderRareCancerView(data = minimalRareCancerResourceData, initialEntries = ['/explore']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <RareCancerResourceView data={data} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.scrollTo = jest.fn();
  for (let i = 0; i < 3; i += 1) {
    document.body.appendChild(document.createElement('footer'));
  }
});

afterEach(() => {
  document.querySelectorAll('footer').forEach((el) => el.remove());
  jest.restoreAllMocks();
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });
});

describe('RareCancerResourceView', () => {
  describe('Rendering', () => {
    it('should render title, breadcrumb home link, intro, and topics', () => {
      renderRareCancerView();
      expect(
        screen.getByText(/Pediatric, Adolescent, and Young Adult Rare Cancer Study/i),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Home/i, hidden: true })).toHaveAttribute('href', '/');
      expect(screen.getByText(/Rare cancer intro for unit test/i)).toBeInTheDocument();
      expect(screen.getAllByText('Rare Cancer Topic').length).toBeGreaterThan(0);
    });

    it('should quote a remote header URL in generated CSS', () => {
      renderRareCancerView({
        ...minimalRareCancerResourceData,
        RCI_Header: 'https://example.com/rare-cancer-header.png',
      });
      const css = Array.from(document.querySelectorAll('style'))
        .map((el) => el.textContent)
        .join('\n');
      expect(css).toContain('url(https://example.com/rare-cancer-header.png)');
    });

    it('should use a custom data-flow image URL when provided', () => {
      renderRareCancerView(rareCancerWithDownloadData);
      expect(screen.getByAltText('RCI data flow')).toHaveAttribute(
        'src',
        'https://example.com/custom-rci-flow-chart.png',
      );
    });
  });

  describe('Contact form download', () => {
    it('should trigger same-origin download when the contact form link is clicked', () => {
      renderRareCancerView(rareCancerWithDownloadData);
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');

      fireEvent.click(screen.getByText(/Download contact form/i));

      const appendedLink = appendChildSpy.mock.calls.find(
        ([node]) => node && node.tagName === 'A',
      );
      expect(appendedLink).toBeDefined();
      expect(appendedLink[0].download).toBe('rare-cancer-contact.pdf');
    });

    it('should download a cross-origin PDF via fetch when the request succeeds', async () => {
      const blob = new Blob(['pdf-bytes'], { type: 'application/pdf' });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(blob),
      });
      URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = jest.fn();

      renderRareCancerView(rareCancerCrossOriginDownloadData);
      fireEvent.click(screen.getByText(/Download contact form/i));

      await act(async () => {
        await Promise.resolve();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://cdn.example.com/rare-cancer-contact.pdf',
        { mode: 'cors' },
      );
      expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should treat a malformed download URL as same-origin', () => {
      renderRareCancerView({
        ...rareCancerWithDownloadData,
        RCI_DOWNLOAD_CONFIG: { url: 'http://', filename: 'bad.pdf' },
      });
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      fireEvent.click(screen.getByText(/Download contact form/i));
      expect(appendChildSpy).toHaveBeenCalled();
    });

    it('should open the PDF in a new tab when cross-origin fetch fails', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch = jest.fn().mockRejectedValue(new Error('network'));
      window.open = jest.fn();

      renderRareCancerView(rareCancerCrossOriginDownloadData);
      fireEvent.click(screen.getByText(/Download contact form/i));

      await act(async () => {
        await Promise.resolve();
      });

      expect(window.open).toHaveBeenCalledWith(
        'https://cdn.example.com/rare-cancer-contact.pdf',
        '_blank',
      );
    });

    it('should fall back to window.open when cross-origin fetch is not ok', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
      window.open = jest.fn();

      renderRareCancerView(rareCancerCrossOriginDownloadData);
      fireEvent.click(screen.getByText(/Download contact form/i));

      await act(async () => {
        await Promise.resolve();
      });

      expect(window.open).toHaveBeenCalledWith(
        'https://cdn.example.com/rare-cancer-contact.pdf',
        '_blank',
      );
    });

    it('should use the default GitHub download URL when yaml omits RCI_DOWNLOAD_CONFIG', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      global.fetch = jest.fn().mockRejectedValue(new Error('network'));
      window.open = jest.fn();

      renderRareCancerView({
        ...rareCancerWithDownloadData,
        RCI_DOWNLOAD_CONFIG: undefined,
      });
      fireEvent.click(screen.getByText(/Download contact form/i));

      await act(async () => {
        await Promise.resolve();
      });

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('rare-cancer-study_contact.pdf'),
        '_blank',
      );
    });
  });

  describe('Side effects', () => {
    it('should scroll to a hash anchor after content paints', () => {
      jest.useFakeTimers();
      const scrollTo = jest.fn();
      window.scrollTo = scrollTo;

      renderRareCancerView(multiTopicRareCancerData, ['/rare#RC_SECTION']);
      const anchor = document.getElementById('RC_SECTION');
      Object.defineProperty(anchor, 'offsetTop', { configurable: true, value: 800 });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({ top: 745, behavior: 'smooth' }),
      );
      jest.useRealTimers();
    });
  });

  describe('Navigation interactions', () => {
    it('should highlight topic and subtopic nav items', () => {
      renderRareCancerView(multiTopicRareCancerData);
      expect(clickTopicNav('Rare Topic B')).toHaveClass('selected');
      expect(clickSubtopicNav('Rare Sub A')).toHaveClass('selected');
    });

    it('should switch sticky/absolute/static nav on scroll and footer proximity', () => {
      renderRareCancerView(multiTopicRareCancerData);
      triggerResourceScroll('MCIBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
      triggerResourceScrollAbsolute('MCIBody', 50);
      expect(document.getElementById('leftNav').className).toContain('navListAbsolute');
      triggerResourceScrollToTop('MCIBody');
      expect(document.getElementById('leftNav').className).toBe('navList');
    });

    it('should use desktop, tablet, and mobile footer indexes on scroll', () => {
      const widths = [1300, 900, 500];
      widths.forEach((width, index) => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });
        const { unmount } = renderRareCancerView(multiTopicRareCancerData);
        const body = document.getElementById('MCIBody');
        Object.defineProperty(body, 'offsetTop', { configurable: true, value: 0 });
        const footer = document.getElementsByTagName('footer')[index === 0 ? 0 : index === 1 ? 1 : 2];
        const rectSpy = jest.spyOn(footer, 'getBoundingClientRect').mockReturnValue({ top: 2000 });
        Object.defineProperty(document.documentElement, 'scrollTop', {
          configurable: true,
          writable: true,
          value: 200,
        });
        fireEvent.scroll(document);
        expect(rectSpy).toHaveBeenCalled();
        unmount();
      });
    });

    it('should expand then collapse a mobile section', () => {
      renderRareCancerView(multiTopicRareCancerData);
      const mobileHeader = document.querySelector('.mciTitleMobile');
      fireEvent.click(mobileHeader);
      expect(mobileHeader.className).not.toContain('sectionCollapse');
      fireEvent.click(mobileHeader);
      expect(mobileHeader.className).toContain('sectionCollapse');
    });
  });

  describe('Edge cases', () => {
    it('should render when rareCancerContent is missing', () => {
      expect(() =>
        renderRareCancerView({ rareCancerIntroText: 'Intro only.' }),
      ).not.toThrow();
      expect(screen.getByText(/Intro only/i)).toBeInTheDocument();
    });
  });
});
