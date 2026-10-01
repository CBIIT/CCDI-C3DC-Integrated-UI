jest.mock('react-dom', () => ({
  render: (...args) => global.__rootRender(...args),
}));

jest.mock('@apollo/client', () => ({
  ApolloProvider: ({ children }) => children,
}));

jest.mock('../src/components/App', () => () => null);

jest.mock('../src/utils/graphqlClient', () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

import React from 'react';

describe('application entry', () => {
  it('should render the app into the root node', () => {
    global.__rootRender = jest.fn();
    document.body.innerHTML = '<div id="root"></div>';
    jest.resetModules();
    require('../src/index');
    expect(global.__rootRender).toHaveBeenCalled();
    const [element, node] = global.__rootRender.mock.calls[0];
    expect(React.isValidElement(element)).toBe(true);
    expect(node).toBe(document.getElementById('root'));
  });
});
