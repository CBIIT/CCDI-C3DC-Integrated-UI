/**
 * Stryker 5 config for Jest 23.
 *
 * Run one named batch at a time (see tests/STRYKER.md):
 *   STRYKER_BATCH=controllers CI=true TZ=UTC ./node_modules/.bin/stryker run
 *
 * Default batch is the next unfinished slice. Do not run without
 * STRYKER_BATCH — a full mutate list takes hours.
 */
const batches = {
  'shared-utils': [
    'src/components/util/Anchor.js',
    'src/components/util/CustodianUtils.js',
    'src/components/util/Date.js',
    'src/components/util/LocalStorage.js',
    'src/components/util/RouteLinks.js',
    'src/components/util/classNameConcat.js',
    'src/components/util/helpers.js',
    'src/utils/Anchor.js',
    'src/utils/LineBreaksRenderer.js',
    'src/utils/SuccessOutlined.js',
    'src/utils/columnsUtil.js',
    'src/utils/custodianUtilFuncs.js',
    'src/utils/date.js',
    'src/utils/env.js',
    'src/utils/exploreNavUtils.js',
    'src/utils/fileTable.js',
    'src/utils/graphqlClient.js',
    'src/utils/localStorage.js',
    'src/utils/sampleFileTable.js',
    'src/utils/useVisitedPageSync.js',
    'src/utils/utils.js',
  ],
  'feature-logic': [
    'src/components/CohortModal/hooks/**/*.js',
    'src/components/CohortModal/pendingCohortUtils.js',
    'src/components/CohortModal/utils.js',
    'src/components/CohortSelectorState/store/**/*.js',
    'src/components/Inventory/InventoryState.js',
    'src/components/Notifications/NotificationFunctions.js',
    'src/pages/cart/customComponent/exportButton/util/**/*.js',
    'src/pages/globalSearch/globalSearchTabQuery.js',
    'src/pages/globalSearch/Cards/utils/**/*.js',
    'src/pages/inventory/sideBar/BentoFilterUtils.js',
    'src/pages/inventory/widget/WidgetUtils.js',
    'src/pages/inventory/tabs/hooks/useGenerateTabData.js',
  ],
  'cohort-analyzer': [
    'src/pages/CohortAnalyzer/CohortAnalyzerUtil/**/*.js',
    'src/pages/CohortAnalyzer/store/cohortAnalyzerLayoutReducer.js',
    'src/pages/CohortAnalyzer/utils/**/*.js',
    'src/pages/CohortAnalyzer/HistogramPanel/utils/**/*.js',
  ],
  controllers: [
    'src/pages/landing/landingController.js',
    'src/pages/error/Error.js',
    'src/pages/pdfReader/pdfReader.js',
    'src/pages/cart/cartController.js',
    'src/pages/cart/customComponent/exportButton/exportButtonController.js',
    'src/pages/globalSearch/searchController.js',
    'src/pages/globalSearch/searchViewController.js',
    'src/pages/studyDetail/studyDetailController.js',
    'src/pages/inventory/inventoryController.js',
    'src/pages/inventory/InventoryRouteSync.js',
    'src/pages/inventory/useInventoryTemplate.js',
  ],
  'resource-controllers': [
    'src/pages/resource/**/*Controller.js',
  ],
  'studies-table': [
    'src/pages/studies/studiesTableLayout.js',
    'src/pages/studies/tableConfig/Column.js',
    'src/pages/studies/tableConfig/DataAvailabilityCell.js',
    'src/pages/studies/tableConfig/DataAvailabilityHeader.js',
  ],
  'document-ellipsis': [
    'src/components/DocumentDownload/DocumentDownloadView.js',
    'src/components/EllipsisText/EllipsisText.js',
  ],
  // Explore page — already mutated: InventoryState, BentoFilterUtils,
  // WidgetUtils, useGenerateTabData, inventoryController, InventoryRouteSync,
  // useInventoryTemplate, exploreNavUtils.
  'explore-page': [
    'src/pages/inventory/inventoryCover.js',
    'src/pages/inventory/CohortComponent.js',
    'src/pages/inventory/switchNav/switchNav.js',
    'src/pages/inventory/tabs/TabsView.js',
  ],
  'explore-view': [
    'src/pages/inventory/inventoryView.js',
    'src/pages/inventory/widget/WidgetView.js',
    'src/pages/inventory/tabs/TabPanel.js',
  ],
  'explore-facets': [
    'src/pages/inventory/filterQueryBar/QueryBarView.js',
    'src/pages/inventory/sideBar/BentoFacetFilter.js',
    'src/pages/inventory/sideBar/NewBentoFacetFilter.js',
  ],
  'explore-table': [
    'src/pages/inventory/tabs/tableConfig/Column.js',
    'src/pages/inventory/tabs/wrapperConfig/CustomDropDown.js',
    'src/pages/inventory/tabs/wrapperConfig/Wrapper.js',
    'src/pages/inventory/tabs/wrapperConfig/customButton.js',
  ],
  'cart-ui': [
    'src/pages/cart/cartView.js',
    'src/pages/cart/cartWrapper.js',
    'src/pages/cart/tableConfig/Column.js',
    'src/pages/cart/customComponent/exportButton/exportButton.js',
  ],
  'global-search-cards': [
    'src/pages/globalSearch/Cards/ConsentCodesRow.js',
    'src/pages/globalSearch/Cards/PropertyItem.js',
    'src/pages/globalSearch/Cards/ValueCard.js',
    'src/pages/globalSearch/Cards/participant/WrapperService.js',
    'src/pages/globalSearch/Cards/files/AddSelectedFiles/AddSelectedFilesController.js',
  ],
  'global-search-view': [
    'src/pages/globalSearch/searchView.js',
  ],
  'studies-view': [
    'src/pages/studies/studiesView.js',
  ],
  'shared-util-heavy': [
    'src/components/util/tables.js',
    'src/components/util/dashboardUtilFunctions.js',
  ],
  // Optional: landingView.js is 1000+ lines (~hours). Not in default queue.
  'landing-view': [
    'src/pages/landing/landingView.js',
  ],
};

const batchName = process.env.STRYKER_BATCH;
if (!batchName || !batches[batchName]) {
  const names = Object.keys(batches).join(', ');
  throw new Error(
    `Set STRYKER_BATCH to one of: ${names}. Example: STRYKER_BATCH=controllers`,
  );
}

module.exports = {
  packageManager: 'npm',
  testRunner: 'jest',
  coverageAnalysis: 'off',
  mutate: batches[batchName],
  ignorePatterns: [
    'coverage',
    'dist',
    '.stryker-tmp',
    'src_c3dc',
    '.agents',
    'reports',
  ],
  jest: {
    projectType: 'custom',
    enableFindRelatedTests: true,
  },
  reporters: ['clear-text', 'progress', 'html', 'json'],
  htmlReporter: {
    baseDir: `reports/mutation/html-${batchName}`,
  },
  jsonReporter: {
    fileName: `reports/mutation/batch-${batchName}.json`,
  },
  tempDirName: '.stryker-tmp',
  timeoutMS: 60000,
  timeoutFactor: 2,
  concurrency: 2,
  logLevel: 'info',
};
