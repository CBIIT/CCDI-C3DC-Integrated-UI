jest.mock('@apollo/client', () => {
  function HttpLink(opts) { this.uri = opts.uri; }
  function InMemoryCache(opts) { this.opts = opts; }
  function ApolloClient(opts) {
    this.cache = opts.cache;
    this.link = opts.link;
  }
  const ApolloLink = function ApolloLink(handler) {
    this.handler = handler;
  };
  ApolloLink.from = (links) => links;
  ApolloLink.split = (test, left, right) => ({ test, left, right });
  return {
    ApolloClient,
    InMemoryCache,
    ApolloLink,
    HttpLink,
  };
});

import client from '../../src/utils/graphqlClient';

function operation(clientName, fetchOptions) {
  const context = { clientName, fetchOptions };
  return {
    getContext: () => context,
    setContext: (updater) => {
      Object.assign(context, updater(context));
    },
  };
}

describe('graphqlClient', () => {
  it('should export an Apollo client with a cache and link', () => {
    expect(client).toBeDefined();
    expect(client.cache).toBeDefined();
    expect(client.cache.opts.typePolicies.CohortManifestResult.keyFields).toEqual([
      'participant_id',
      'diagnosis',
    ]);
    expect(client.link).toHaveLength(2);
  });

  it('should send interop operations to the interop link with no-cache', () => {
    const [policyLink, splitLink] = client.link;
    const forward = jest.fn(() => 'next');
    const interop = operation('interopService');
    expect(policyLink.handler(interop, forward)).toBe('next');
    expect(interop.getContext().fetchOptions.fetchPolicy).toBe('no-cache');
    const withOptions = operation('interopService', { headers: { a: 1 } });
    policyLink.handler(withOptions, forward);
    expect(withOptions.getContext().fetchOptions.headers).toEqual({ a: 1 });
    expect(splitLink.test(interop)).toBe(true);
    expect(splitLink.left).toBeDefined();
    expect(splitLink.right).toBeDefined();
  });

  it('should cache other operations on the backend link', () => {
    const backend = operation('backend');
    const forward = jest.fn();
    client.link[0].handler(backend, forward);
    expect(backend.getContext().fetchOptions.fetchPolicy).toBe('cache-first');
    expect(client.link[1].test(backend)).toBe(false);
    expect(forward).toHaveBeenCalledWith(backend);
  });
});
