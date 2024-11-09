import React ,{ useState }from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Link } from '@mui/material';
import { useNavigate } from "react-router-dom";

const EventoPopup = ({ trigger, setTrigger, onRedirect }) => {
  const handleClose = () => {
    setTrigger(false);
    if (onRedirect) onRedirect();
  };

  const navigate = useNavigate();
  const [successPopup, setSuccessPopup] = useState(false);

  const handlePopup = () => {
    setSuccessPopup(false);
    navigate('/MisEventos'); 
};

  return (
    <Dialog open={trigger} onClose={() => setTrigger(false)}>
      <DialogTitle>Evento creado</DialogTitle>
      <DialogContent>
        <p>Tu evento ha sido registrado exitosamente.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePopup} color="primary">
          Ver evento
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventoPopup;
