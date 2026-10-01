/**
 * ToolsResourceView — nested vs flat YAML content, nav, scroll, collapse.
 */

jest.mock('../../../../src/assets/about/Data_Usage_Policies_Header.png', () => 'header.png', { virtual: true });

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToolsResourceView from '../../../../src/pages/resource/ToolsResourcePage/ToolsResourceView';
import {
  clickTopicNav,
  triggerResourceScroll,
  triggerResourceScrollAbsolute,
  triggerResourceScrollToTop,
  toggleMobileSection,
} from '../shared/resourceViewTestUtils';
import {
  flatToolsResourceData,
  minimalToolsResourceData,
} from '../../../fixtures/resource/resourceDataViewProps';
import { multiTopicToolsData } from '../../../fixtures/resource/resourceInteractionData';

function renderToolsView(data = minimalToolsResourceData) {
  return render(
    <MemoryRouter>
      <ToolsResourceView data={data} />
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
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });
});

describe('ToolsResourceView', () => {
  describe('Rendering', () => {
    it('should render nested tools topics and intro', () => {
      renderToolsView();
      expect(screen.getByText('Tools')).toBeInTheDocument();
      expect(screen.getAllByText('Tools Topic One').length).toBeGreaterThan(0);
      expect(screen.getByText(/Tools intro for unit test/i)).toBeInTheDocument();
      expect(screen.getByText(/Tool section body for testing/i)).toBeInTheDocument();
    });

    it('should render flat topic and subtopic items when lists are absent', () => {
      renderToolsView(flatToolsResourceData);
      expect(screen.getAllByText('Flat Topic').length).toBeGreaterThan(0);
      expect(screen.getByText('Flat Subtopic')).toBeInTheDocument();
      expect(screen.getByText(/Flat topic body/i)).toBeInTheDocument();
    });
  });

  describe('Side effects', () => {
    it('should call window.scrollTo on mount', () => {
      renderToolsView();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('Navigation interactions', () => {
    it('should highlight a topic when its nav item is clicked', () => {
      renderToolsView(multiTopicToolsData);
      const topic = clickTopicNav('Tools B');
      expect(topic).toHaveClass('selected');
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it('should apply sticky then absolute then static nav classes on scroll', () => {
      renderToolsView(multiTopicToolsData);
      triggerResourceScroll('ToolsBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
      triggerResourceScrollAbsolute('ToolsBody', 50);
      expect(document.getElementById('leftNav').className).toContain('navListAbsolute');
      triggerResourceScrollToTop('ToolsBody');
      expect(document.getElementById('leftNav').className).toBe('navList');
    });

    it('should use tablet and mobile footer indexes on scroll', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 900,
      });
      const { unmount } = renderToolsView(multiTopicToolsData);
      triggerResourceScroll('ToolsBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
      unmount();

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      renderToolsView(multiTopicToolsData);
      triggerResourceScroll('ToolsBody');
      expect(document.getElementById('leftNav').className).toContain('navListSticky');
    });

    it('should toggle mobile section visibility', () => {
      renderToolsView(multiTopicToolsData);
      const mobileHeader = toggleMobileSection();
      expect(mobileHeader.className).not.toContain('sectionCollapse');
      toggleMobileSection();
      expect(document.querySelector('.mciTitleMobile').className).toContain('sectionCollapse');
    });
  });

  describe('Edge cases', () => {
    it('should render with an empty toolsContent array', () => {
      expect(() =>
        renderToolsView({ ...minimalToolsResourceData, toolsContent: [] }),
      ).not.toThrow();
      expect(screen.getByText('Tools')).toBeInTheDocument();
    });
  });
});
