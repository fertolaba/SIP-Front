import React, { useState } from "react";
import { TextField, Button, Box, Checkbox, FormControlLabel, Typography, Link, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from "react-router-dom";
import fetchWithTimeout from "../error/_fetchWithTimeOut";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../../ui/login.css';
import Popupreestablecer from "./Popupreestablecer";

export default function Login() {
  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPopupOpen, setPopupOpen] = useState(false); 
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const navigate = useNavigate();

  const handleRegisterRedirect = () => {
    navigate('/registro'); 
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  
    if (!validateInputs()) return;

    const credentials = {
      email: data.get('email'),
      password: data.get('password'),
    };

    setLoading(true);
    setLoginError(''); 

    try {
      const user = await handleLogin(credentials);
      console.log('Usuario autenticado:', user);
      localStorage.removeItem('likedEvents');
      localStorage.setItem('userId', user.userId); 
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('role', user.role);
      handleRedirect(user.role);
    } catch (error) {
      setLoginError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ingrese un correo válido.";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Ingrese una contraseña válida.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await fetchWithTimeout('http://localhost:4002/api/v1/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Error en el login');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; 
    }
  };
  const handleClosePopup = () => {
    setPopupOpen(true);
  };

  const handleVerifyEmail = (email) => {
    console.log('Email a verificar:', email);
    setPopupOpen(false);
  };

  const handleRedirect = (role) => {
    if (role === 'CLIENT') {
      navigate('/client-dashboard'); 
    } else if (role === 'ARTIST') {
      navigate('/artist-dashboard'); 
    } else {
      navigate('/login'); 
    }
  };

  const handleOpenResetPopup = () => {
    setPopupOpen(false); 
    navigate('/reestablecer'); 
  };

  return (
    <div id='login'>
        <div id='login-image' className="login"></div>
        <div id='login-register' className="login">
            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }} id='login-form'>
                <Typography variant="h4" gutterBottom>
                    Iniciar sesión
                </Typography>
                <form onSubmit={handleSubmit} id='login-form'>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        margin="normal"
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                    <TextField
                        fullWidth
                        label="Contraseña"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Recuérdame"
                    />
                    <Button
                        className='register'
                        fullWidth
                        variant="contained"
                        type="submit"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        {loading ? 'Cargando...' : 'Iniciar sesión'}
                    </Button>
                    {loginError && (
                        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {loginError}
                        </Typography>
                    )}
                    <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                        ¿No tienes una cuenta?{' '}
                        <Link component="button" onClick={handleRegisterRedirect}>
                            Registrarse
                        </Link>
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                        <Link component="button1" onClick={handleClosePopup}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </Typography>
                </form>
            </Box>
        </div>
        <Popupreestablecer 
          open={isPopupOpen} 
          onClose={() => setPopupOpen(false)} 
          onVerify={handleVerifyEmail} 
          onOpenResetPopup={handleOpenResetPopup} // Pasa la nueva función como prop
        />
    </div>
  );
}
