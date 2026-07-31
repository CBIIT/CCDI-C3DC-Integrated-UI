import React, { useContext } from 'react';
import {
  btnTypes,
  types,
} from '@bento-core/paginated-table';
import {
  tooltipContentAddAll, 
  tooltipContent,
  tooltipContentAddToNewCohort,
  tooltipContentAddToExistingCohort,
  tooltipContentListAll,
} from '../../../../bento/dashboardTabData';
import { alertMessage } from '../../../../bento/fileCentricCartWorkflowData';
import { CustomDropDown } from './CustomDropDown';
import { CustomButton } from './customButton';
import { CohortStateContext } from '../../../../components/CohortSelectorState/CohortStateContext';

const GetOptions = () => {
  const { state } = useContext(CohortStateContext);
  return Object.keys(state);
}

const getParticipants = () => { 
  const { state } = useContext(CohortStateContext);
  return ["All Participants", "Selected Participants", ...Object.values(state).map(cohort => ({cohortId:cohort.cohortId, cohortName:cohort.cohortName}))];
}

const getParticipantOptions = () => { 
  return ["All Participants", "Selected Participants"];
}

export const layoutConfig = [{
  container: 'buttons',
  size: 'xl',
  clsName: 'container_header',
  items: [
  ],
}];

/**
* Configuration display component based on index
* CAUTION: provide position of table component
*/
export const wrapperConfig = [{
  container: 'buttons',
  size: 'xl',
  clsName: 'container_header',
  items: [
    {
      title: 'ADD ALL FILTERED FILES',
      clsName: 'add_all_button',
      type: types.BUTTON,
      role: btnTypes.ADD_ALL_FILES,
      btnType: btnTypes.ADD_ALL_FILES,
      tooltipCofig: tooltipContentAddAll,
      conditional: false,
      alertMessage,
    },
    {
      title: 'ADD SELECTED FILES',
      clsName: 'add_selected_button',
      type: types.BUTTON,
      role: btnTypes.ADD_SELECTED_FILES,
      btnType: btnTypes.ADD_SELECTED_FILES,
      tooltipCofig: tooltipContent,
      conditional: true,
      alertMessage,
    },
    {
      title: 'Create Cohort',
      clsName: 'add_selected_button',
      type: types.COHORT_ELEM,
      role: btnTypes.CUSTOM_ELEM,
      btnType: btnTypes.CUSTOM_ELEM,
      tooltipCofig: tooltipContentAddToNewCohort,
      conditional: false,
      CohortViewElem: () => {
        const options = getParticipantOptions();
        return (
          <CustomDropDown borderColor={"#73C7BE"} label={"CREATE NEW COHORT"} backgroundColor={"#375C67"} type={"new"} options={options} enabledWithoutSelect={true}/>
        )
      },
      alertMessage,
    },
    {
      title: 'Add Participants to Existing Cohort',
      clsName: 'add_selected_button',
      type: types.COHORT_ELEM,
      role: btnTypes.CUSTOM_ELEM,
      btnType: btnTypes.CUSTOM_ELEM,
      section: 'addToExisting',
      tooltipCofig: tooltipContentAddToExistingCohort,
      conditional: true,
      CohortViewElem: () => {
        let options = getParticipants();
        return (
          <CustomDropDown label={"ADD PARTICIPANTS TO EXISTING COHORT"} backgroundColor={"#0B4E75"} borderColor={"#73A9C7"} options={options} type={"existing"} enabledWithoutSelect={true}/>
        )
      }
    },
    {
      title: 'View All Cohorts',
      clsName: 'add_selected_button',
      type: types.COHORT_ELEM,
      role: btnTypes.CUSTOM_ELEM,
      btnType: btnTypes.CUSTOM_ELEM,
      tooltipCofig: tooltipContentListAll,
      conditional: true,
      CohortViewElem: () => {
        let options = GetOptions();
        return (
          <CustomButton borderColor={"#C79673"} label={"VIEW ALL COHORTS(" + options.length + ")"} cohortsAvailable={options.length > 0} backgroundColor={"#935824"} hoverColor={"#704015"} type={"VIEW"} />
        )
      },
      alertMessage,
    }],
},
{
  container: 'paginatedTable',
  paginatedTable: true,
},
{
  container: 'buttons',
  size: 'xl',
  clsName: 'container_footer',
  items: [
    {
      title: 'ADD ALL FILTERED FILES',
      clsName: 'add_all_button',
      type: types.BUTTON,
      role: btnTypes.ADD_ALL_FILES,
      btnType: btnTypes.ADD_ALL_FILES,
      tooltipCofig: tooltipContentAddAll,
      conditional: false,
      alertMessage,
    },
    {
      title: 'ADD SELECTED FILES',
      clsName: 'add_selected_button',
      type: types.BUTTON,
      role: btnTypes.ADD_SELECTED_FILES,
      btnType: btnTypes.ADD_SELECTED_FILES,
      tooltipCofig: tooltipContent,
      conditional: true,
      alertMessage,
    },
  ],
},
];

/**
 * 1. addFileQuery - query to addAll files or add selected files on cart
 * 2. responseKeys - provided respose key for addFileQuery
 */
export const configWrapper = (tab, configs) => {
  
  // Constants for tabs that show header/footer and hide file cart actions.
  const TABS_WITH_HEADER_FOOTER = ["Participants", "Files"];
  const TABS_HIDING_FILE_CART_ACTIONS = ["Participants"];

  // Determine if the tab shows header/footer and if the file cart actions are hidden.
  const tabShowsHeaderFooter = TABS_WITH_HEADER_FOOTER.includes(tab.name);
  const tabHidesFileCartActions = TABS_HIDING_FILE_CART_ACTIONS.includes(tab.name);

  // Filter out header/footer containers if the tab does not show them.
  const containers = tabShowsHeaderFooter
    ? configs
    : configs.filter(
      (c) =>
        c.clsName !== "container_header" && c.clsName !== "container_footer",
    );

  return containers.map((container) => {
    // Paginated table slot has no configurable toolbar items here.
    if (container.paginatedTable) {
      return { ...container, items: [] };
    }

    // Participants: hide "add files to cart" actions; cohort controls stay.
    const items = container.items
      .filter((item) => {
        const isFileCartBtn =
          item.role === btnTypes.ADD_ALL_FILES ||
          item.role === btnTypes.ADD_SELECTED_FILES;
        return !tabHidesFileCartActions || !isFileCartBtn;
      })
      .map((item) => ({
        ...item,
        addFileQuery:
          item.role === btnTypes.ADD_ALL_FILES
            ? tab.addAllFileQuery
            : tab.addSelectedFilesQuery,
        dataKey: tab.addFilesRequestVariableKey,
        responseKeys:
          item.role === btnTypes.ADD_ALL_FILES
            ? tab.addAllFilesResponseKeys
            : tab.addFilesResponseKeys,
      }));

    return { ...container, items };
  });
};
