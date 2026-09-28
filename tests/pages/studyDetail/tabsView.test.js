import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabsView from '../../../src/pages/studyDetail/overview/tabs/TabsView';
import { studyDetail } from '../../fixtures/studies/studyDetail';

jest.mock('../../../src/pages/studyDetail/overview/chart/ChartView', () => ({
  data,
  categoryHeader,
  isModalView,
}) => (
  <div>
    Chart {categoryHeader} {data && data[0] ? data[0].group : 'none'} {isModalView ? 'modal' : 'page'}
  </div>
));

describe('Study profile TabsView', () => {
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
    window.URL.createObjectURL = jest.fn(() => 'blob:profile');
    window.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render the first available profile chart', () => {
      render(<TabsView data={studyDetail} />);
      expect(screen.getByText(/Chart DIAGNOSIS Leukemia page/)).toBeInTheDocument();
    });

    it('should render nothing when profile arrays are empty', () => {
      const { container } = render(
        <TabsView data={{ ...studyDetail, diagnoses: [], anatomic_site: [], data_categories: [] }} />,
      );
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Interactions', () => {
    it('should download the active profile as CSV', () => {
      const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      render(<TabsView data={studyDetail} />);
      fireEvent.click(screen.getByLabelText('Download study profile data'));

      expect(window.URL.createObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should switch profile categories, then open and close the enlarged modal', () => {
      const { container } = render(<TabsView data={studyDetail} />);
      const nativeInput = container.querySelector('input');
      fireEvent.change(nativeInput, { target: { value: 'anatomic_site' } });
      expect(screen.getByText(/Chart ANATOMIC SITE Blood page/)).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText('Expand study profile'));
      expect(screen.getByText(/Study Profile:/)).toBeInTheDocument();
      expect(screen.getAllByText(/Chart DIAGNOSIS Leukemia modal/).length).toBeGreaterThan(0);

      fireEvent.click(screen.getByText(/Study Profile:/).parentElement.querySelector('button'));
      expect(screen.queryByText(/Study Profile:/)).not.toBeInTheDocument();
    });

    it('should download from the modal-only controls', () => {
      const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      render(<TabsView data={studyDetail} isModalView />);
      fireEvent.click(screen.getByLabelText('Download study profile data'));
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should ignore zero-valued groups and keep the top twenty rows', () => {
      const diagnoses = Array.from({ length: 22 }, (_, index) => ({
        group: `Diagnosis ${index + 1}`,
        subjects: index === 0 ? 0 : index,
      }));
      render(
        <TabsView
          data={{
            ...studyDetail,
            diagnoses,
            anatomic_site: null,
            data_categories: [],
          }}
        />,
      );
      expect(screen.getByText(/Chart DIAGNOSIS Diagnosis 2 page/)).toBeInTheDocument();
    });
  });
});
