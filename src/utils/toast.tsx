import React from 'react';
import ReactDOM from 'react-dom';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps, Color } from '@material-ui/lab/Alert';

import useToggle from './hooks/useToggle';

const Alert: React.FC<AlertProps> = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
};

interface Props {
  severity: Color;
  text: string;
  node: HTMLDivElement;
}

const ToastComponent: React.FC<Props> = ({ severity, text, node }) => {
  const [isOpen, close] = useToggle(true);

  const onClose = React.useCallback(() => {
    close.disable();
    ReactDOM.unmountComponentAtNode(node);
    node.remove();
  }, [close, node]);

  return (
    <Snackbar style={{ zIndex: '2147483646' }} open={isOpen} autoHideDuration={6000} onClose={onClose}>
      <Alert severity={severity}>{text}</Alert>
    </Snackbar>
  );
};

export const toast = (severity: Color, text: string) => {
  const node = document.createElement('div');

  document.getElementById('__next')?.appendChild(node);

  ReactDOM.render(
    <ToastComponent severity={severity} text={text} node={node} />,
    node,
  );
};
