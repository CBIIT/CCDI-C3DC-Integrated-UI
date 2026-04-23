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
      CohortViewElem: () => <CustomButton borderColor={"#73C7BE"} label={"CREATE COHORT"} backgroundColor={"#375C67"} type={"CREATE"} hoverColor={"#375C67"} />,
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
        let options = GetOptions();
        return (
          <CustomDropDown label={"ADD PARTICIPANTS TO EXISTING COHORT"} backgroundColor={"#0B4E75"} borderColor={"#73A9C7"} options={options} />
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

export const configWrapper = (tab, configs) => {
  // For non-Participants tab, filter out the header and footer button containers
  if (tab.name !== "Participants" && tab.name !== "Files") {
    return configs.filter((container) => container.clsName !== 'container_header' && container.clsName !== 'container_footer');
  }
  return configs;
};