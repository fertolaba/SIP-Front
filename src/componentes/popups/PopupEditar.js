import React ,{ useState }from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Link } from '@mui/material';
import { useNavigate } from "react-router-dom";

const PopupEditar = ({ trigger, setTrigger, onRedirect }) => {
    const handleClose = () => {
      setTrigger(false);
      if (onRedirect) onRedirect();
    };
  
    const navigate = useNavigate();
    const [successPopup, setSuccessPopup] = useState(false);
  

    return (
      <Dialog open={trigger} onClose={() => setTrigger(false)}>
        <DialogTitle>Perfil actualizado</DialogTitle>
        <DialogContent>
          <p>Tu perfil ha sido actualizado exitosamente.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default PopupEditar;
  