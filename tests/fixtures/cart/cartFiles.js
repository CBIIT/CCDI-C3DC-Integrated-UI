export const cartFileIds = ['file-1', 'file-2'];

export const cartManifestRow = {
  guid: 'guid-1',
  file_name: 'sample.tsv',
  participant_id: 'PART-01',
  md5sum: 'abc123',
};

export const cartTableConfig = {
  api: 'CART_QUERY',
  dataKey: 'files',
  columns: [{ dataField: 'file_name' }],
  tableMsg: 'No files',
  paginationAPIField: 'fileList',
  defaultSortField: 'file_name',
  defaultSortDirection: 'asc',
  extendedViewConfig: {},
};
