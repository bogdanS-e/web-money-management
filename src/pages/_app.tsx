import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

//import CheckAuth from '@/components/auth/CheckAuth';

import theme from '@styles/theme';
import { store } from '@/store';
import { getUser } from '@/api/user';
import { useRequest } from '@/utils/hooks/useRequest';
import { selectIsLoggedIn } from '@/store/selectors';
import CheckAuth from '@/components/auth/CheckAuth';


const GlobalStyles = createGlobalStyle`
  * {
    font-family: 'Raleway', sans-serif;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    color: #000;
    background-color: #fff;
  }

  .MuiTypography-root {
    font-family: 'Raleway' !important;
  }
`;

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');

    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  console.log(process.env.NEXT_PUBLIC_BASE_URL);
  console.log(process.env.MONGO_URL);
  console.log(process.env.MAIL_ID);
  console.log(process.env.MAIL_PASSWORD);
  return (
    <Provider store={store}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <StylesProvider injectFirst>
          <CheckAuth />
          <CssBaseline />
          <GlobalStyles />
          <Component {...pageProps} />
        </StylesProvider>
      </MuiPickersUtilsProvider>
    </Provider>
  );
};

export default App;
