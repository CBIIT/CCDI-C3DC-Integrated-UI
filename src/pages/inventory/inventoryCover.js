import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useLocation,
    useSearchParams,
    useNavigate,
  } from "react-router-dom";
import { useApolloClient } from '@apollo/client';
import { updateFilterState } from '@bento-core/facet-filter';
import { updateUploadData, updateAutocompleteData, updateUploadMetadata, resetUploadData, } from '@bento-core/local-find';
import store from '../../store';
import { withStyles, CircularProgress, Backdrop } from '@material-ui/core';
import {
    inDataloading, updateImportfrom, syncUpDashboard, afterInitialLoading, return2Page, returnQueryUrl, changeTab, restoreActionType, getFacetDatafields
} from '../../components/Inventory/InventoryState';
import styles from './inventoryStyle';
import { DASHBOARD_QUERY_NEW } from '../../bento/dashboardTabData';
import { queryParams } from '../../bento/dashTemplate';
import { useInventoryTemplate } from './useInventoryTemplate';

const SPECIAL_QUERY_KEYS = new Set(['import_from', 'p_id', 'u', 'u_fc', 'u_um', 'tab']);

const InventoryCover = ({
  classes,
}) => {
    const { basePath, facetsConfig, tabItems } = useInventoryTemplate();
    const [searchParams] = useSearchParams();
    // const filterState = useSelector((state) => state.statusReducer.filterState);
    // const localFindAutocomplete = useSelector((state) => state.localFind.autocomplete);
    // const localFindUpload = useSelector((state) => state.localFind.upload);
    const isDataloading = useSelector((state) => state.inventoryReducer.isDataloading);
    const initialLoading = useSelector((state) => state.inventoryReducer.initialLoading);
    const return_2_page= useSelector((state) => state.inventoryReducer.return_2_page);
    const return_query_url= useSelector((state) => state.inventoryReducer.return_query_url);
    const action_type= useSelector((state) => state.inventoryReducer.action_type);
    
    const client = useApolloClient();

    const query = new URLSearchParams(useLocation().search);

    const location = useLocation();

    const navigationType = location.state && location.state.navigationType;

    const navigate = useNavigate();

    // Drop facet query params that do not apply to the current explore template; clamp tab index.
    useEffect(() => {
        const allowedFacetDatafields = getFacetDatafields(facetsConfig);
        const q = new URLSearchParams(location.search);
        let changed = false;
        [...q.keys()].forEach((key) => {
            if (SPECIAL_QUERY_KEYS.has(key)) return;
            if (key.endsWith('_unknownAges')) {
                const base = key.replace(/_unknownAges$/, '');
                if (!allowedFacetDatafields.has(base)) {
                    q.delete(key);
                    changed = true;
                }
                return;
            }
            if (!allowedFacetDatafields.has(key)) {
                q.delete(key);
                changed = true;
            }
        });
        const tabIdx = parseInt(q.get('tab') || '0', 10);
        if (!Number.isNaN(tabIdx) && tabIdx >= tabItems.length) {
            q.set('tab', '0');
            changed = true;
            store.dispatch(changeTab(0, 'facet'));
        }
        if (changed) {
            const qs = q.toString();
            navigate(`${basePath}${qs ? `?${qs}` : ''}`, { replace: true });
        }
    }, [location.pathname, location.search, basePath, facetsConfig, tabItems.length, navigate]);

    async function getData(filters) {
        let result = await client.query({
        query: DASHBOARD_QUERY_NEW,
        variables: filters,
        })
        .then((response) => response.data);
        return result;
    }

    const generateFacetFilters = (filters, query, queryParams) => {
        let newFilterState = {};
        let unknownAgesState = {};
        
        queryParams.forEach((param) => {
            if (param === 'import_from' || param === 'p_id' || param === 'u' || param === 'u_fc' || param === 'u_um' || param === 'tab') {
                    return;
            }
            const paramValues = query.get(param);
            if (paramValues) {
                if (param === 'age_at_diagnosis' || param === 'age_at_treatment_start' || param === 'age_at_response' || param === 'age_at_last_known_survival_status' || param === 'participant_age_at_collection') {
                    const rangeParams = paramValues.split(',');
                    const lowerBound = parseInt(rangeParams[0]);
                    const upperBound = parseInt(rangeParams[1]);
                    if (rangeParams.length !== 2 || typeof lowerBound !==  'number' || Number.isNaN(lowerBound) || typeof upperBound !==  'number' || Number.isNaN(upperBound)) {
                        return;
                    } else {
                        filters[param] = [lowerBound, upperBound];
                        newFilterState[param] = [lowerBound, upperBound];
                        
                        // Handle unknownAges parameter for age-related filters
                        const unknownAgesParam = `${param}_unknownAges`;
                        const unknownAgesValue = query.get(unknownAgesParam);
                        if (unknownAgesValue) {
                            unknownAgesState[param] = unknownAgesValue;
                        } else {
                            // Default to "include" if not specified
                            unknownAgesState[param] = 'include';
                        }
                    }
                } else {
                    filters[param] = paramValues.split('|');
                    newFilterState[param] = {};
                    paramValues.split('|').forEach((item) => {
                        newFilterState[param][item] = true;
                    });
                }
            }
        });
        
        // Set default unknownAges values for age-related parameters that don't have values
        const ageRelatedParams = ['age_at_diagnosis', 'age_at_treatment_start', 'age_at_response', 'age_at_last_known_survival_status', 'participant_age_at_collection'];
        ageRelatedParams.forEach(param => {
            if (!unknownAgesState[param]) {
                unknownAgesState[param] = 'include';
            }
        });
        
        // Add unknownAgesState to the return object
        return { newFilterState, unknownAgesState };
    }

    useEffect(() => {

        // If there are no query parameters and the user is returning to a page,
        if (query.size === 0 && return_2_page === true) {
            navigate(`${basePath}${return_query_url}`);
            return;
        }

        //Check if the user is returning to the same page from the main menu
        if (query.size === 0 && return_2_page === false && return_query_url !== '' && navigationType === 'main_menu') {
            navigate(`${basePath}${return_query_url}`);
            return;
        }
        
        // Parse all query params
        let filters = {};
        const import_from = query.get('import_from');
        const participant_id = query.get('p_id');
        const upload = query.get('u');
        const upload_filecontent = query.get('u_fc');
        const upload_unmatched = query.get('u_um');
        const tab = query.get('tab');
        // Helper to finish the rest of the logic after import_from is handled
        const continueWithFilters = (extraParticipantIds = []) => {
            filters.participant_ids = [];
            if (participant_id) {
                filters.participant_ids = [...filters.participant_ids, ...participant_id.split('|')];
            }
            if (upload) {
                filters.participant_ids = [...filters.participant_ids, ...upload.split('|')];
            }
            if (extraParticipantIds.length > 0) {
                filters.import_data = extraParticipantIds;
            }
            const { newFilterState, unknownAgesState } = generateFacetFilters(filters, query, queryParams);

            // Add unknownAges parameters to filters for GraphQL query
            // Only include unknownAges parameters if they are not "include" (default)
            Object.keys(unknownAgesState).forEach(key => {
                const unknownAgesValue = unknownAgesState[key];
                // Handle both string and array values
                const value = Array.isArray(unknownAgesValue) ? unknownAgesValue[0] : unknownAgesValue;
                if (value && value !== 'include') {
                    const unknownAgesParam = `${key}_unknownAges`;
                    filters[unknownAgesParam] = [value];
                }
            });

            // Update autocomplete data
            if (participant_id) {
                const data = participant_id.split('|').map((item) => ({
                    type: 'participantIds',
                    title: item,
                }));
                store.dispatch(updateAutocompleteData(data));
            } else {
                store.dispatch(updateAutocompleteData([]));
            }

            // Update upload data and metadata
            if (upload) {
                const data = upload.split('|').map((item) => ({
                    participant_id: item,
                }));
                let fc = '';
                let um = [];
                if (upload_filecontent && upload_unmatched) {
                    fc = upload_filecontent.split('|').join(',');
                    um = upload_unmatched.split('|');
                } else {
                    fc = upload.split('|').join(',');
                    um = [];
                }
                const metadata = {
                    filename: "",
                    fileContent: fc,
                    matched: data,
                    unmatched: um,
                };
                store.dispatch(updateUploadData(data));
                store.dispatch(updateUploadMetadata(metadata));
            } else {
                store.dispatch(resetUploadData());
            }

            store.dispatch(updateFilterState(newFilterState));

            // Handle tab
            if (tab) {
                const tab_number = parseInt(tab, 10);
                !isNaN(tab_number) && store.dispatch(changeTab(tab_number, 'facet'));
            } else {
                store.dispatch(changeTab(0, 'facet'));
            }

            // Data loading logic
            if (action_type === "facet") {
                store.dispatch(inDataloading(true));
                getData(filters).then((result) => {
                    if (result.searchParticipants) {
                        store.dispatch(return2Page(false));
                        store.dispatch(returnQueryUrl(window.location.search));
                        store.dispatch(afterInitialLoading());
                        store.dispatch(inDataloading(false));
                        store.dispatch(syncUpDashboard(filters, result.searchParticipants));
                    }
                });
            } else {
                store.dispatch(return2Page(false));
                store.dispatch(returnQueryUrl(window.location.search));
                store.dispatch(restoreActionType());
            }
        };

        // Handle import_from if present
        if (import_from) {
            fetch(import_from)
                .then(response => response.json())
                .then(jsonData => {
                    store.dispatch(updateImportfrom(import_from, jsonData));
                    // If jsonData is an array of participant IDs, pass them to continueWithFilters
                    continueWithFilters(Array.isArray(jsonData) ? jsonData.map(obj => JSON.stringify(obj)) : []);
                })
                .catch(error => {
                    console.error("Failed to fetch import_from JSON:", error);
                    store.dispatch(updateImportfrom(null, []));
                    continueWithFilters();
                });
        } else {
            store.dispatch(updateImportfrom(null, []));
            continueWithFilters();
        }
    }, [searchParams, navigationType, location.pathname, basePath]);

    // Listen for unknownAgesState changes and update URL
    const unknownAgesState = useSelector((state) => state.statusReducer.unknownAgesState);
    const [previousUnknownAgesState, setPreviousUnknownAgesState] = useState(null);
    
    useEffect(() => {
        if (unknownAgesState && previousUnknownAgesState !== unknownAgesState) {
            const query = new URLSearchParams(window.location.search);
            let hasChanges = false;
            
            // Update URL with unknownAges parameters
            Object.keys(unknownAgesState).forEach(key => {
                const unknownAgesParam = `${key}_unknownAges`;
                const value = unknownAgesState[key];
                // Only update URL if value is not "include" (default)
                if (value && value !== 'include') {
                    query.set(unknownAgesParam, value);
                    hasChanges = true;
                } else if (value === 'include') {
                    // Remove parameter if it's the default value
                    query.delete(unknownAgesParam);
                    hasChanges = true;
                }
            });
            
            // Update URL if there are changes
            if (hasChanges) {
                const newUrl = `${basePath}${query.toString() ? '?' + query.toString() : ''}`;
                navigate(newUrl, { replace: true });
            }
            
            setPreviousUnknownAgesState(unknownAgesState);
        }
    }, [unknownAgesState, navigate, previousUnknownAgesState, basePath]);

    useEffect(() => {
        return () => {
            console.log("do something when left!");
            store.dispatch(return2Page(true));
        };
    }, []);

    return (
        <Backdrop className={classes.backdrop} open={!initialLoading && isDataloading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default withStyles(styles)(InventoryCover);
