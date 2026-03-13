import React from "react";
import { withStyles, CssBaseline } from '@material-ui/core';
import { Route, Routes, } from 'react-router-dom';
import Footer from '../ResponsiveFooter/';
import Header from '../ResponsiveHeader/';
import Home from '../../pages/landing/landingController';
import About from '../../pages/about/AboutView';
import AnnouncementPage from "../../pages/announcement/announcementPage";
import PdfReader from "../../pages/pdfReader/pdfReader";
import DataModelNavigator from '../../pages/dmn/DataModelNavigator';
import Error from '../../pages/error/Error';
import Search from '../../pages/globalSearch/searchController';
import Inventory from '../../pages/inventory/inventoryController';
import Cart from '../../pages/cart/cartController';
import ScrollButton from '../ScrollButton/ScrollButtonView';
import StudiesView from '../../pages/studies/studiesView';
import StudiesDetail from "../../pages/studyDetail/studyDetailController";
import OverlayWindow from '../OverlayWindow/OverlayWindow';
import CohortAnalyzerController  from "../../pages/CohortAnalyzer/CohortAnalyzerController";

const Layout = () => {
    return (
    <>
      <CssBaseline />
        <Header />
        <OverlayWindow />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/announcements" element={<AnnouncementPage />} />
          <Route path="/data-model" element={<DataModelNavigator />} />
          <Route path="/release-notes-pdf" element={<PdfReader />} />
          <Route path="/user-guide" element={<PdfReader />} />
          <Route path="/sitesearch" element={<Search />} />
          <Route path="/explore" element={<Inventory />} />
          <Route path="/fileCentricCart" element={<Cart />} />
          <Route path="/cohortAnalyzer" element={<CohortAnalyzerController />} />
          <Route path="/studies" >
            <Route index={true} element={<StudiesView />}></Route>
            <Route path=":studyId" element={<StudiesDetail />} />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
        <ScrollButton />
    </>
    )
}

const styles = (theme) => ({
  '@global': {
    body:{
      backgroundColor:"#ffffff"
    }
  },
});

export default withStyles(styles)(Layout);