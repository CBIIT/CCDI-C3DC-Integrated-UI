import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import headerImg from '../../assets/resources/Studies_Header.png';
import { table } from '../../bento/studiesData';
import { TableView } from '@bento-core/paginated-table';
import { themeConfig } from './tableConfig/Theme';
import { configColumn } from './tableConfig/Column.js';
import studyIcon from '../../assets/icons/Study_Icon.svg';
import breadcrumbIcon from '../../assets/icons/Breadcrumb_Icon.svg';
import { useApolloClient } from '@apollo/client';
import { GET_NUMBER_OF_STUDIES } from '../../bento/studiesData';
import {
  applyStudiesTableLayout,
  syncStudiesTableHeaderPadding,
  resetStudiesTableColumnWidths,
} from './studiesTableLayout';

const TABLE_CHROME_HEIGHT = 130;

const getTableBodyHeight = () => Math.min(
  600,
  Math.max(window.innerHeight - 420, 360),
);

const getTableRegionHeight = () => getTableBodyHeight() + TABLE_CHROME_HEIGHT;

const StudiesContainer = styled.div`
  .breadcrumb {
    font-family: Public Sans;
    font-weight: 400;
    font-size: 16px;
    line-height: 162%;
    padding-left: 30px;
    // margin-left: 50px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .breadcrumbIcon {
    position: relative;
    top: 4px;
  }
  .resourceHeader {
    width: 100%;
    background: #e6ebee;
  }

  .resourceHeaderBackground {
    width: 100%;
    height: 214px;
    background-image: url(${headerImg});
    background-repeat:no-repeat;
    background-position:center;
    background-size: cover;
  }

  .resourceHeaderText {
    // width: 1420px;
    margin: 0 auto;
    padding: 150px 0 0 88px;
    color: #19676D;
    font-family: Poppins;
    font-size: 40px;
    font-weight: 400;
  }

  .resourceTitleContainer {
    background: #0E546E;
  }

  .resourceTitle {
    // width: 1420px;
    margin: 0 auto;
    display: flex;
    line-height: 38px;
    background: #0E546E;
    font-family: Poppins;
    font-weight: 600;
    color: #ffffff;
    font-size: 35px;
    padding: 13px 0 13px 88px;
  }

  .resourceBody {
    margin-left: 45px;
    margin-right: 45px;
    padding-top: 45px;
    padding-bottom: 45px;
  }

  .studiesTableWrapper {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    & > *:not(#tableContainer) {
      flex: 0 0 auto;
    }

    #addScrollContainer {
      display: none !important;
    }

    #tableContainer {
      flex: 0 0 auto;
      min-height: 0;
      overflow-x: auto !important;
      overflow-y: auto !important;
    }

    #tableContainer .MuiTableHead-root {
      position: relative;
      z-index: 2;
    }

    #tableContainer .MuiTableHead-root .MuiTableCell-head {
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: #ffffff !important;
      box-shadow: inset 0 -1px 0 #000000;
    }

    #tableContainer .MuiTableHead-root .MuiTableSortLabel-root {
      background-color: #ffffff;
    }
  }

  .studyIcon{
    margin-left: 30px;
  }

  @media (min-width: 1420px) {
    .breadcrumb {
        width: 1420px;
        margin: 0 auto;
    }
  }
`;

const StudiesView = () => {

  const client = useApolloClient();

  const [studies, setNumStudies] = useState(0);
  const [studiesData, setStudiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableRegionHeight, setTableRegionHeight] = useState(getTableRegionHeight);
  const [tableBodyHeight, setTableBodyHeight] = useState(getTableBodyHeight);
  
  const initTblState = (initialState) => ({
    ...initialState,
    title: 'Studies Table',
    query: table.api,
    paginationAPIField: table.paginationAPIField,
    dataKey: table.dataKey,
    columns: configColumn(table.columns),
    sortBy: table.defaultSortField,
    sortOrder: table.defaultSortDirection,
    extendedViewConfig: table.extendedViewConfig,
    selectedRows: [],
    rowsPerPageOptions: [50, 100],
    rowsPerPage: 50,
    page: 0,
  });

  async function fetchAllStudies() {
    try {
      setLoading(true);
      resetStudiesTableColumnWidths();
      const [studiesResult, countResult] = await Promise.all([
        client.query({
          query: table.api,
          variables: {
            first: 10000, // Fetch all studies
            offset: 0,
            order_by: table.defaultSortField,
            sort_direction: table.defaultSortDirection,
          },
        }),
        client.query({
          query: GET_NUMBER_OF_STUDIES,
          variables: {},
        })
      ]);
      
      setStudiesData(studiesResult.data[table.paginationAPIField] || []);
      setNumStudies(countResult.data.numberOfStudies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching studies:', error);
      setLoading(false);
    }
  }

  const applyTableLayout = useCallback(() => {
    const tableContainer = document.querySelector('.studiesTableWrapper #tableContainer');
    const addScrollContainer = document.querySelector('.studiesTableWrapper #addScrollContainer');

    if (addScrollContainer) {
      addScrollContainer.style.display = 'none';
    }

    if (tableContainer) {
      applyStudiesTableLayout(tableContainer, tableBodyHeight);
    }
  }, [tableBodyHeight]);

  useEffect(() => {
    fetchAllStudies();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      resetStudiesTableColumnWidths();
      setTableBodyHeight(getTableBodyHeight());
      setTableRegionHeight(getTableRegionHeight());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (loading) {
      return undefined;
    }

    let observer;
    let rafId;

    const scheduleLayout = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(() => {
        applyTableLayout();
        window.requestAnimationFrame(() => {
          applyTableLayout();
          const tableContainer = document.querySelector('.studiesTableWrapper #tableContainer');
          syncStudiesTableHeaderPadding(tableContainer);
        });
      });
    };

    scheduleLayout();

    const wrapper = document.querySelector('.studiesTableWrapper');
    if (wrapper && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(scheduleLayout);
      observer.observe(wrapper, { childList: true, subtree: true });
    }

    window.addEventListener('resize', scheduleLayout);

    return () => {
      window.removeEventListener('resize', scheduleLayout);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, [loading, studiesData, tableRegionHeight, tableBodyHeight, applyTableLayout]);

  return (
    <StudiesContainer>
      <div className='breadcrumb'><a href='/'>Home</a>
        <img src={breadcrumbIcon} alt="breadcrumb icon" className='breadcrumbIcon'/>
      Studies
      </div>
      <div className='resourceHeader'>
        <div className='resourceHeaderBackground'>
          <div className='resourceHeaderText'>{/*Title here*/}</div>
        </div>
      </div>
      <div className='resourceTitleContainer'>
        <div className='resourceTitle'>Studies<img src={studyIcon} alt="study icon" className='studyIcon'/></div>
      </div>
      <div className='resourceBody'>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading studies...</div>
        ) : (
          <div
            className="studiesTableWrapper"
            style={{ height: `${tableRegionHeight}px` }}
          >
            <TableView
              initState={initTblState}
              themeConfig={themeConfig}
              server={false}
              tblRows={studiesData}
              totalRowCount={studiesData.length || studies}
            />
          </div>
        )}
      </div>
    </StudiesContainer>
  );
}

export default StudiesView;
