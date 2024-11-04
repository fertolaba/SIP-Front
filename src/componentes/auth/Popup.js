import React from 'react';
import '../../ui/Popup.css';
import { IconButton, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

function Popup({ trigger, setTrigger, message = "Contraseña reestablecida" }) {
    const navigate = useNavigate();

    const handleRedirect = () => {
        setTrigger(false);
        navigate('/login');
    };

    return trigger ? (
        <div className="popup">
            <div className="popup-inner">
                <IconButton
                    aria-label="close"
                    onClick={() => setTrigger(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                    {message}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRedirect}
                    sx={{ mt: 2 }}
                >
                    Ir a Iniciar Sesión
                </Button>
            </div>
        </div>
    ) : null;
}

export default Popup;
