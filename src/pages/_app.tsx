import React from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

//import CheckAuth from '@/components/auth/CheckAuth';

import vars from '@vars';
import { theme } from '@/styles/theme';
import { store } from '@/store';


const GlobalStyles = createGlobalStyle`
  * {
    font-family: 'Raleway', sans-serif;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    color: ${vars.colors.black};
    background-color: ${vars.colors.light_grey};
  }

  .MuiTypography-root {
    font-family: 'Raleway' !important;
  }
`;

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');

    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <StylesProvider injectFirst>
            <CssBaseline />
            <GlobalStyles />
            {/* <CheckAuth /> */}
            <Component {...pageProps} />
          </StylesProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
