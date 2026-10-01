const mockQuery = jest.fn();
const mockClient = { query: mockQuery };

jest.mock('@apollo/client', () => ({
  gql: (parts) => parts,
  useApolloClient: () => mockClient,
}));

import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import useKmplot from '../../../src/pages/CohortAnalyzer/HistogramPanel/survival/useKmplot';
import useRiskTable from '../../../src/pages/CohortAnalyzer/HistogramPanel/survival/useRiskTable';

const EMPTY = [];

function KmProbe({ c1 = EMPTY, c2 = EMPTY, c3 = EMPTY }) {
  const { data, loading, error } = useKmplot({ c1, c2, c3 });
  return (
    <div>
      <span>km-count:{data.length}</span>
      <span>km-loading:{String(loading)}</span>
      <span>km-error:{error ? error.message : 'none'}</span>
    </div>
  );
}

function RiskProbe({ c1 = EMPTY, c2 = EMPTY, c3 = EMPTY }) {
  const { data, loading, error } = useRiskTable({ c1, c2, c3 });
  return (
    <div>
      <span>risk-count:{data && data.cohorts ? data.cohorts.length : 0}</span>
      <span>risk-loading:{String(loading)}</span>
      <span>risk-error:{error ? error.message : 'none'}</span>
    </div>
  );
}

describe('survival data hooks', () => {
  let consoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('does not query when no cohorts are selected', () => {
    render(
      <>
        <KmProbe />
        <RiskProbe />
      </>,
    );
    expect(screen.getByText('km-count:0')).toBeInTheDocument();
    expect(screen.getByText('risk-count:0')).toBeInTheDocument();
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('loads KM data and clears its loading state', async () => {
    mockQuery.mockResolvedValue({
      data: { kMPlot: [{ id: 'one', time: 3, event: 1, group: 'c1' }] },
    });
    render(<KmProbe c1={['p1']} />);
    expect(screen.getByText('km-loading:true')).toBeInTheDocument();
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByText('km-count:1')).toBeInTheDocument();
    expect(screen.getByText('km-loading:false')).toBeInTheDocument();
  });

  it('surfaces KM GraphQL errors', async () => {
    mockQuery.mockResolvedValue({ errors: [{ message: 'km failed' }] });
    render(<KmProbe c2={['p2']} />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByText('km-error:km failed')).toBeInTheDocument();
  });

  it('loads and normalizes risk table data', async () => {
    mockQuery.mockResolvedValue({
      data: {
        riskTableData: {
          cohorts: [
            {
              cohort: 'c1',
              survivalData: [{ group: '0 Months', subjects: 2 }],
            },
          ],
          timeIntervals: [0, 6],
        },
      },
    });
    render(<RiskProbe c1={['p1']} />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByText('risk-count:1')).toBeInTheDocument();
    expect(screen.getByText('risk-loading:false')).toBeInTheDocument();
  });

  it('surfaces rejected risk table requests', async () => {
    mockQuery.mockRejectedValue(new Error('risk failed'));
    render(<RiskProbe c3={['p3']} />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByText('risk-error:risk failed')).toBeInTheDocument();
  });
});
