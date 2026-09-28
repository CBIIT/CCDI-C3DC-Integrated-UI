import { getFilesID, getQueryVariables } from '../../../src/pages/globalSearch/Cards/participant/WrapperService';

describe('WrapperService', () => {
  it('should cap first at 200000 and query file IDs', async () => {
    const client = {
      query: jest.fn().mockResolvedValue({ data: { fileIDsFromList: ['a'] } }),
    };
    expect(getQueryVariables({ pid: ['p1'] })).toEqual({ pid: ['p1'], first: 200000 });

    const fetchIds = getFilesID({
      client,
      variables: { pid: ['p1'] },
      query: 'FILE_QUERY',
    });
    await expect(fetchIds()).resolves.toEqual({ fileIDsFromList: ['a'] });
    expect(client.query).toHaveBeenCalledWith({
      query: 'FILE_QUERY',
      variables: { pid: ['p1'], first: 200000 },
    });
  });
});
