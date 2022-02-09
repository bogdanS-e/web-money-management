import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';

interface Props {
  open: boolean;
  title: string;
  description: string;
  handleClose: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
}

const ConfirmationDialog: React.FC<Props> = ({
  open,
  handleClose,
  onConfirm,
  title,
  description,
  children,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{title}</DialogTitle>
      {children}
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Confirm
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
