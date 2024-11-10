import React ,{ useState }from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

const VerificacionExitosa= ({ trigger, setTrigger, onRedirect }) => {
    const handleClose = () => {
      setTrigger(false);
      if (onRedirect) onRedirect();
    };
  
    const navigate = useNavigate();
    const [successPopup, setSuccessPopup] = useState(false);
  

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

export default VerificacionExitosa;
