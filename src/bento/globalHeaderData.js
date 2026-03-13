import Logo from '../assets/header/Portal_Logo.svg';
import LogoSmall from '../assets/header/Portal_Logo_Small.svg';
import searchbarIcon from '../assets/header/Search_Icon.svg';
import cartLogo from '../assets/header/Cart_Logo.svg';
import usFlagSmall from "../assets/header/us_flag_small.png";

// globalHeaderLogo image 468x100
// globalHeaderImage: image 2200x100
export const headerData = {
  globalHeaderLogo: Logo,
  globalHeaderLogoSmall: LogoSmall,
  globalHeaderLogoLink: '/',
  globalHeaderLogoAltText: 'Portal Logo',
  globalHeaderSearchIcon: searchbarIcon,
  globalHeaderSearchIconAltText: 'search Icon',
};

export const USGovBannerData = {
  logo: usFlagSmall,
};

export const navMobileList = [
  {
      name: 'Home',
      link: '/home',
      className: 'navMobileItem',
  },
  {
    name: 'Explore',
    link: '/explore',
    className: 'navMobileItem',
  },
  {
    name: 'Cohort Analyzer',
    link: '/cohortAnalyzer',
    className: 'navMobileItem',
  },
  {
    name: 'Studies',
    link: '/studies',
    className: 'navMobileItem',
  },
  {
    name: 'Data Model',
    link: '/data-model',
    className: 'navMobileItem',
  },
  {
      name: 'About',
      link: '/about',
      className: 'navMobileItem clickable',
  },
  {
    name:'CCDI Hub',
    link: 'https://ccdi.cancer.gov/',
    className: 'navMobileItem',
    externalLink: true,
  },
  {
    name: 'My File',
    link: '/fileCentricCart',
    className: 'cart',
  },
];

export const navbarSublists = {
  "About": [
    {
      name: 'About',
      link: '/about',
      className: 'navMobileSubItem',
    },
    {
      name: 'Announcements',
      link: '/announcements',
      className: 'navMobileSubItem',
    },
    {
      name: 'Release Notes',
      link: '/release-notes-pdf',
      className: 'navMobileSubItem',
      externalLink: true,
    },
    {
      name: 'User Guide',
      link: '/user-guide',
      className: 'navMobileSubItem',
    },
  ],
};

export const navBarCartData = {
  cartLabel: '',
  cartLink: '/fileCentricCart',
  cartIcon: cartLogo,
  cartIconAlt: 'cart_logo',
  cartLabelType: 'labelUnderCount',
};