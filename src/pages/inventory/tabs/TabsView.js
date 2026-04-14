import React, { useContext }  from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { generateQueryStr } from '@bento-core/util';
import {
  changeTab,
} from '../../../components/Inventory/InventoryState';
import { queryParams } from '../../../bento/dashTemplate';
import { useInventoryTemplate } from '../useInventoryTemplate';
import TabPanel from './TabPanel';
import { tabResponsiveBreakpoints } from '../../../bento/dashboardTabData';
import { Tabs as BentoTabs }  from '@bento-core/tab';
import { customTheme } from './DefaultTabTheme';
import CohortModalGenerator from '../cohortModal/cohortModalGenerator';
import { CohortModalContext } from '../cohortModal/CohortModalContext';

const Tabs = (props) => {
   
  const { currentTab } = props;
  const { mode, tabItems, basePath } = useInventoryTemplate();
  const { showCohortModal, setShowCohortModal} = useContext(CohortModalContext);
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();

  const handleTabChange = (event, value) => {
    const paramValue = {
      tab_participants: 0,
      tab_files: 0,
    };
    if (mode === 'files') {
      paramValue['tab_files'] = value;
    } else {
      paramValue['tab_participants'] = value;
    }
    const queryStr = generateQueryStr(query, queryParams, paramValue);
    navigate(`${basePath}${queryStr}`, { replace: false });
    dispatch(changeTab(paramValue.tab_participants, paramValue.tab_files, 'not-facet'));
  };

  const { CohortModal } = CohortModalGenerator();


  /**
  * 1. change <name> to <display> as array item
  * 2. <display> -> [tab.name, props.dashboardStats[tab.count]]
  */
  const getTabs = (tabs) => tabs.map((tab) => ({
    ...tab,
    name: tab.name,
    hasToolTip: true,
    toolTipText: tab.toolTipText,
    count: tab.count !== "none" ? `(${props.dashboardStats[tab.count].toLocaleString()})` : "(NA)",
    display: tab.count !== "none" ?  [tab.name, props.dashboardStats[tab.count].toLocaleString()] :"NA",
    clsName:  `${tab.name}`.toLowerCase().replace(' ', '_') ,
    tooltipStyles: {border: '1px solid #2D5380', arrowBorder: '1px solid #598AC5'}
  }));

  return (
    <>
      <CohortModal
        open={showCohortModal}
        onCloseModal={() => setShowCohortModal(false)}
      />
      <BentoTabs
        tabItems={getTabs(tabItems)}
        currentTab={currentTab}
        handleTabChange={handleTabChange}
        customTheme={customTheme}
        enableGrouping={true}
        responsiveBreakpoints={tabResponsiveBreakpoints}
      />
      {
        tabItems.map((tab, index) => (
          <React.Fragment key={tab.tableID || tab.name || index}>
            <div hidden={currentTab !== index}>
              <TabPanel
                {...props}
                tab={tab}
                config={tab}
                activeTab={index === currentTab}
              />
            </div>
          </React.Fragment>
        ))
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  currentTab: state.inventoryReducer.exploreMode === 'files' ? state.inventoryReducer.tabFiles : state.inventoryReducer.tabParticipants,
});
export default connect(mapStateToProps, null)(Tabs);
