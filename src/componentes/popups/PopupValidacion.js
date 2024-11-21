import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

const PopupValidacion = ({ trigger, setTrigger, onRedirect }) => {
  const handleClose = () => {
    setTrigger(false);
    // Remove the redirect logic if you don't want to redirect
    if (onRedirect) onRedirect();
  };

  const navigate = useNavigate();
  const [successPopup, setSuccessPopup] = useState(false);

  return (
    <Dialog open={trigger} onClose={() => setTrigger(false)}>
      <DialogTitle>Verificación exitosa</DialogTitle>
      <DialogContent>
        <p>Tu cuenta ha sido verificada</p>
      </DialogContent>
      <DialogActions>
        {/* Make the "Ok" button close the popup */}
        <Button color="primary" onClick={handleClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupValidacion;
