import { createMuiTheme } from '@material-ui/core/styles';

import vars from '@vars';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: vars.colors.green,
      contrastText: vars.colors.white,
    },
    secondary: {
      main: vars.colors.black,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
  },
});
