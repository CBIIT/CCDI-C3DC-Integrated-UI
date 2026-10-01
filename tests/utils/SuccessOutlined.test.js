import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessOutlined from '../../src/utils/SuccessOutlined';

describe('SuccessOutlined', () => {
  it('should render an svg icon', () => {
    const { container } = render(<SuccessOutlined />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
