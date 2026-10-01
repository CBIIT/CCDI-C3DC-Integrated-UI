import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChartView from '../../../src/pages/studyDetail/overview/chart/ChartView';

describe('ChartView', () => {
  describe('Rendering', () => {
    it('should render category rows and formatted participant counts', () => {
      render(
        <ChartView
          data={[
            { group: 'Leukemia', subjects: 1000 },
            { group: 'Neuroblastoma', subjects: 250 },
          ]}
        />,
      );

      expect(screen.getByText('CATEGORY')).toBeInTheDocument();
      expect(screen.getByText('Leukemia')).toBeInTheDocument();
      expect(screen.getByText('1,000')).toBeInTheDocument();
      expect(screen.getByText('Neuroblastoma')).toBeInTheDocument();
      expect(screen.getByText('250')).toBeInTheDocument();
    });

    it('should use modal layout and custom headers when requested', () => {
      const { container } = render(
        <ChartView
          data={[{ group: 'Genomics', subjects: 12 }]}
          categoryHeader="DATA CATEGORY"
          valueHeaderLines={['Number of', 'Files']}
          isModalView
          chartId="study-profile-chart-modal"
        />,
      );

      expect(container.querySelector('#study-profile-chart-modal')).toBeInTheDocument();
      expect(screen.getByText('DATA CATEGORY')).toBeInTheDocument();
      expect(screen.getByText('Files')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should render nothing when there is no chart data', () => {
      const { container } = render(<ChartView data={[]} />);
      expect(container).toBeEmptyDOMElement();
    });
  });
});
