import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Link } from '@mui/material';
import { useNavigate } from "react-router-dom";
import React ,{ useState }from 'react';

const PopupError = ({ trigger, setTrigger, onRedirect }) => {
    const handleClose = () => {
      setTrigger(false);
      if (onRedirect) onRedirect();
    };
  
    const navigate = useNavigate();
    const [successPopup, setSuccessPopup] = useState(false);
  

    return (
      <Dialog open={trigger} onClose={() => setTrigger(false)}>
        <DialogTitle>Problema de validacion</DialogTitle>
        <DialogContent>
          <p>Verifique los datos</p>
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
    );
  };

export default PopupError;