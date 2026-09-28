import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabPanel from '../../../src/pages/studyDetail/overview/tabs/TabPanel';

describe('TabPanel', () => {
  it('should hide inactive panels and show active children', () => {
    const { rerender, container } = render(
      <TabPanel value={1} index={0}>Hidden</TabPanel>,
    );
    expect(container.querySelector('[role="tabpanel"]')).toHaveAttribute('hidden');

    rerender(<TabPanel value={0} index={0}>Visible</TabPanel>);
    expect(container.querySelector('[role="tabpanel"]')).not.toHaveAttribute('hidden');
    expect(container).toHaveTextContent('Visible');
  });
});
