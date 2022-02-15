import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {
  LinearProgress,
  ThemeProvider,
  StylesProvider,
} from '@material-ui/core';

import theme from '@/styles/theme';

export const loading = () => {
  const node =
    document.getElementById('loadingprogressbar') ||
    document.createElement('div');

  node.setAttribute('id', 'loadingprogressbar');

  document.getElementById('header')?.appendChild(node);

  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <StyledLinearProgress />
      </StylesProvider>
    </ThemeProvider>,
    node,
  );

  const stopLoading = () => {
    ReactDOM.unmountComponentAtNode(node);
    node.remove();
  };

  return stopLoading;
};

export const stopLoading = () => {
  const node = document.getElementById('loadingprogressbar');

  if (!node) return;

  ReactDOM.unmountComponentAtNode(node);
  node.remove();
};

const StyledLinearProgress = styled(LinearProgress)`
  width: 100%;
  position: absolute;
  bottom: -2px;
`;
