// EventoPopup.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Link } from '@mui/material';

const EventoPopup = ({ trigger, setTrigger, onRedirect }) => {
  const handleClose = () => {
    setTrigger(false);
    if (onRedirect) onRedirect();
  };

  return (
    <Dialog open={trigger} onClose={() => setTrigger(false)}>
      <DialogTitle>Evento creado</DialogTitle>
      <DialogContent>
        <p>Tu evento ha sido registrado exitosamente.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventoPopup;
