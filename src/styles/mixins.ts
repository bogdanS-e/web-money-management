import vars from './vars';

export const desktop = `(min-width: ${vars.screen_width.tablet}px + 1px)`;

export const tabletAndMobile = `(max-width: ${vars.screen_width.tablet}px)`;

export const tablet = `(min-width: ${vars.screen_width.mobile}px + 1px) and (max-width: ${vars.screen_width.tablet}px)`;

export const mobile = `(max-width: ${vars.screen_width.mobile}px)`;
