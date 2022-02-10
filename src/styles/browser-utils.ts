import { TStyle } from './types';
import { Browser, getBrowser } from '../utils/user-agent-utils';

const chromeOnly = (style: TStyle) => getBrowser() === Browser.Chrome ? style : undefined;

const firefoxOnly = (style: TStyle) => getBrowser() === Browser.Firefox ? style : undefined;

const safariOnly = (style: TStyle) => getBrowser() === Browser.Safari ? style : undefined;

const operaOnly = (style: TStyle) => getBrowser() === Browser.Opera ? style : undefined;

const edgeOnly = (style: TStyle) => getBrowser() === Browser.Edge ? style : undefined;

export {
  chromeOnly,
  firefoxOnly,
  safariOnly,
  operaOnly,
  edgeOnly,
};
