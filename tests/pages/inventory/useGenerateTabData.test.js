jest.mock('../../../src/pages/inventory/tabs/TabPanel', () => () => <div>panel</div>);

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import useGenerateTabData from '../../../src/pages/inventory/tabs/hooks/useGenerateTabData';

function Probe(props) {
  const { generatedTabData } = useGenerateTabData(props);
  return (
    <div>
      {generatedTabData.map((tab, i) => (
        <div key={i}>{tab.label.content}</div>
      ))}
    </div>
  );
}

const tabContainers = [{ name: 'Participants', count: 'numberOfParticipants', tabHeaderStyle: {} }];
const dashboardStats = { numberOfParticipants: 9 };
const activeFilters = {};

describe('useGenerateTabData', () => {
  it('should generate labels from dashboard stats', () => {
    render(
      <Probe
        tabContainers={tabContainers}
        activeFilters={activeFilters}
        dashboardStats={dashboardStats}
        activeTab={0}
      />,
    );
    expect(screen.getByText('Participants')).toBeInTheDocument();
    expect(screen.getByText('(9)')).toBeInTheDocument();
  });
});
