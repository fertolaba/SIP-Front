import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import React from 'react';

const PopupTokenEnviado = ({ trigger, setTrigger }) => {
    const handleClose = () => {
        setTrigger(false); // Cierra el popup al presionar "Cerrar"
    };

    return (
        <Dialog open={trigger} onClose={handleClose}>
            <DialogTitle>Token enviado</DialogTitle>
            <DialogContent>
                <p>Revise su email para obtener el token.</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupTokenEnviado;
