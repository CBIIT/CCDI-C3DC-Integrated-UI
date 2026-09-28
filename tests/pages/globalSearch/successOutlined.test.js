import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessOutlined from '../../../src/pages/globalSearch/Cards/participant/Snackbar/SuccessOutlined';

jest.mock('@bento-core/util', () => ({
  createSvgIcon: (node, name) => {
    const Icon = () => <svg data-icon={name}>{node}</svg>;
    return Icon;
  },
}));

describe('SuccessOutlined', () => {
  it('should render the cart success icon', () => {
    const { container } = render(<SuccessOutlined />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
