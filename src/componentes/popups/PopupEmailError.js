import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Link } from '@mui/material';
import { useNavigate } from "react-router-dom";
import React ,{ useState }from 'react';

function PopupEmailError({ open, onClose, message }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>{message}</DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PopupEmailError;