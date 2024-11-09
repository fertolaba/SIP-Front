import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, Paper, Divider, LinearProgress } from '@mui/material';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import usuariosServices from '../service/usuarios.services';

export default function MiPerfil() {
  const userId = localStorage.getItem('userId'); 
  const [userData, setUserData] = useState({
    nombreCompleto: '',
    apellido: '',
    email: '',
    edad: '',
    localidad: '',
    genero: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); 
      try {
        const data = await usuariosServices.getUserById(userId); 
        setUserData({
          nombreCompleto: data.name, 
          apellido: data.lastName, 
          email: data.email,
          edad: data.edad,

          localidad: data.localidad.name, 
          genero: data.generosMusicalesPreferidos.join(', '), 
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error al cargar los datos del usuario');
      } finally {
        setLoading(false); 
      }
    };

    if (userId) {
      fetchUserData(); 
    }
  }, [userId]);

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%', mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Información de Usuario
          </Typography>
          
          {loading ? (
            <LinearProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <TextField
                label="Nombre Completo"
                value={userData.nombreCompleto}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} 
              />
              <TextField
                label="Apellido"
                value={userData.apellido}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} 
              />       
              <TextField
                label="Email"
                value={userData.email}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} 
              />
              <TextField
                label="Edad"
                value={userData.edad}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} 
              />
              <TextField
                label="Localidad"
                value={userData.localidad}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} 
              />
              <TextField
                label="Género"
                value={userData.genero}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} 
              />
            </>
          )}
        </Paper>

        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Estadísticas
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Interacción</Typography>
            <LinearProgress variant="determinate" value={70} color="primary" />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Asistencia</Typography>
            <LinearProgress variant="determinate" value={50} color="error" />
          </Box>
        </Paper>
      </Box>
      <Footer />
    </>
  );
}
