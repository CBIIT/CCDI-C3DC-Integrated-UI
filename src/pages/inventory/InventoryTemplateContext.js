import React, { createContext, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  facetsConfig as facetsConfigParticipants,
  facetsExploreFilesConfig,
  facetSectionVariables as facetSectionVariablesParticipants,
  facetSectionVariablesExploreFiles,
  queryParams,
} from '../../bento/dashTemplate';
import { tabContainers, exploreFilesTabs } from '../../bento/dashboardTabData';
export const EXPLORE_PARTICIPANTS_PATH = '/exploreParticipants';
export const EXPLORE_FILES_PATH = '/exploreFiles';
const InventoryTemplateContext = createContext(null);
export function InventoryTemplateProvider({ children }) {
  const { pathname } = useLocation();
  const value = useMemo(() => {
    const isFiles = pathname === EXPLORE_FILES_PATH;
    return {
      mode: isFiles ? 'files' : 'participants',
      basePath: isFiles ? EXPLORE_FILES_PATH : EXPLORE_PARTICIPANTS_PATH,
      facetsConfig: isFiles ? facetsExploreFilesConfig : facetsConfigParticipants,
      facetSectionVariables: isFiles ? facetSectionVariablesExploreFiles : facetSectionVariablesParticipants,
      tabItems: isFiles ? exploreFilesTabs : tabContainers,
      queryParams,
    };
  }, [pathname]);
  return (
    <InventoryTemplateContext.Provider value={value}>
      {children}
    </InventoryTemplateContext.Provider>
  );
}
export function useInventoryTemplate() {
  const ctx = useContext(InventoryTemplateContext);
  if (!ctx) {
    throw new Error('useInventoryTemplate must be used within InventoryTemplateProvider');
  }
  return ctx;
}
/** Datafield names allowed for the current explore template (facet filters). */
export function getFacetDatafields(facetsConfig) {
  return new Set(facetsConfig.map((f) => f.datafield));
}
