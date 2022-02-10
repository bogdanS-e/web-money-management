import { TStyle } from './types';
import { getOS, OS } from '../utils/user-agent-utils';

const macOnly = (style: TStyle) => getOS() === OS.Mac ? style : undefined;

const windowsOnly = (style: TStyle) => getOS() === OS.Windows ? style : undefined;

const linuxOnly = (style: TStyle) => getOS() === OS.Linux ? style : undefined;

export {
  macOnly,
  windowsOnly,
  linuxOnly,
};
