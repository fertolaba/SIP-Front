import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";


function Verificar(props) {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [successPopup, setSuccessPopup] = useState(false);
    const navigate = useNavigate();

    const handleVerify = () => {
        if (email && token) { 
            props.onVerify(email, token);
            setSuccessPopup(true); 
        } else {
            alert("Ingrese email y token de verificación.");
        }
    };

    const handleCloseSuccessPopup = () => {
        setSuccessPopup(false);
        navigate('/login'); 
    };

    return (
        <>
            <Dialog open={props.trigger} onClose={() => props.setTrigger(false)} maxWidth="xs" fullWidth>
                <DialogTitle>
                    Ingrese token de validación
                    <IconButton
                        aria-label="close"
                        onClick={() => props.setTrigger(false)}
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
                    <TextField
                        label="Token de validación"
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleVerify} color="primary" variant="contained">
                        Verificar
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default Verificar;
