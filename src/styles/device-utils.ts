import { css } from 'styled-components';

import { DeviceType } from './types';

const screenWidth = {
  mobile: {
    from: 0,
    to: 480,
  },
  tablet: {
    from: 481,
    to: 1024,
  },
  desktop: {
    from: 1024,
    to: 100000,
  },
};

const mediaQuery = (style, from: number, to: number) => {
  return css`@media only screen and (min-width: ${from}px) and (max-width: ${to}px) {
    ${style}
  }`;
};

const mobileOnly = (style) => {
  return mediaQuery(style, screenWidth.mobile.from, screenWidth.mobile.to);
};

const tabletOnly = (style) => {
  return mediaQuery(style, screenWidth.tablet.from, screenWidth.tablet.to);
};

const mobileAndTabletOnly = (style) => {
  return mediaQuery(style, screenWidth.mobile.from, screenWidth.tablet.to);
};

const desktopOnly = (style) => {
  return mediaQuery(style, screenWidth.desktop.from, screenWidth.desktop.to);
};

const landscapeOnly = (style) => {
  return css`@media (orientation: landscape) {
    ${style}
  }`;
};

const portraitOnly = (style) => {
  return css`@media (orientation: portrait) {
    ${style}
  }`;
};

const getDeviceType = (width: number) => {
  if (width < screenWidth.tablet.from) {
    return DeviceType.Mobile;
  } else if (width > screenWidth.tablet.to) {
    return DeviceType.Desktop;
  }

  return DeviceType.Tablet;
};

export {
  screenWidth,
  mediaQuery,
  mobileOnly,
  tabletOnly,
  mobileAndTabletOnly,
  desktopOnly,
  landscapeOnly,
  portraitOnly,
  getDeviceType,
};
