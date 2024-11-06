import React, { useState } from "react";
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from "react-router-dom";
import '../../ui/login.css';
import fetchWithTimeout from "../error/_fetchWithTimeOut";

export default function Reestablecer() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);

  const navigate = useNavigate();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResetError('');

    const resetData = { token, email, password };

    try {
      const response = await fetchWithTimeout(`http://localhost:4002/api/auth/reset-password?email=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      if (!response.ok) {
        throw new Error('Error al restablecer la contraseña.');
      }
      setSuccessPopup(true);
    } catch (error) {
      setResetError('Hubo un problema al restablecer la contraseña. Por favor, verifica los datos.');
      console.error('Error al restablecer la contraseña:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setSuccessPopup(false);
    navigate('/login'); 
  };

  return (
    <div id='login'>
      <div id='login-image' className="login"></div>
      <div id='login-register' className="login">
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }} id='login-form'>
          <Typography variant="h4" gutterBottom>
            Reestablecer contraseña
          </Typography>
          <form id='login-form' onSubmit={handleResetPassword}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Nueva contraseña"
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Token"
              name="token"
              onChange={(e) => setToken(e.target.value)}
              value={token}
              margin="normal"
            />
            <Button
              className='register'
              fullWidth
              variant="contained"
              type="submit"
              color="primary"
              sx={{ mt: 2 }}
            >
              {loading ? 'Cargando...' : 'Reestablecer'}
            </Button>
            {resetError && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {resetError}
              </Typography>
            )}
          </form>
        </Box>
      </div>

      <Dialog open={successPopup} onClose={handleClosePopup}>
        <DialogTitle>Contraseña restablecida</DialogTitle>
        <DialogContent>
          <Typography>Tu contraseña ha sido restablecida exitosamente.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary" variant="contained">
            Ir al login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
