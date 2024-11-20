import React ,{ useState }from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

const PopupRegistro= ({ trigger, setTrigger, onRedirect }) => {
    const handleClose = () => {
      setTrigger(false);
      if (onRedirect) onRedirect();
    };
  
    const navigate = useNavigate();
    const [successPopup, setSuccessPopup] = useState(false);
  

    return (
      <Dialog open={trigger} onClose={() => setTrigger(false)}>
        <DialogTitle>Usuario registrado</DialogTitle>
        <DialogContent>
          <p>Enviando token...</p>
        </DialogContent>
      </Dialog>
    );
  };

export default PopupRegistro;
