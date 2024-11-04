import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function Popupreestablecer({ open, onClose, onOpenResetPopup }) {
    const [email, setEmail] = useState('');

    const handleVerify = async (email) => {
        try {
            const response = await fetch(`http://localhost:4002/api/auth/forgot-password?email=${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error en la verificación');
            }

            const data = await response.json();
            console.log("Verificación exitosa:", data);

        } catch (error) {
            console.error('Error al verificar:', error);
        }
    };

    const handleOpenResetPopup = () => {
        onClose();  // Cierra este popup actual
        onOpenResetPopup();  // Abre el popup de reestablecimiento
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                Ingresar email para enviar token
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleVerify(email)} color="primary" variant="contained">
                    Enviar
                </Button>
                <Button onClick={handleOpenResetPopup} color="primary" variant="contained">
                    Tengo mi código
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Popupreestablecer;
