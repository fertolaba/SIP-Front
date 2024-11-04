import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, Paper, Divider, LinearProgress } from '@mui/material';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import fetchWithTimeout from '../componentes/error/_fetchWithTimeOut';

export default function MiPerfil() {
  const userId = localStorage.getItem('userId'); // Obtener el ID del usuario del localStorage
  const [userData, setUserData] = useState({
    nombreCompleto: '',
    apellido: '',
    email: '',
    edad: '',
    rol: '',
    localidad: '',
    genero: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithTimeout(`http://localhost:4002/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }
        const data = await response.json();
        // Asumiendo que la respuesta tiene una estructura que puedes desestructurar directamente
        setUserData({
          nombreCompleto: data.name, // Ajusta según tu estructura de respuesta
          apellido: data.lastName, // Ajusta según tu estructura de respuesta
          email: data.email,
          edad: data.edad,
          rol: data.role,
          localidad: data.localidad.name, // Suponiendo que 'localidad' tiene un campo 'name'
          genero: data.generosMusicalesPreferidos.join(', '), // Suponiendo que es un array
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    

    fetchUserData();
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
                InputProps={{ readOnly: true }} // Campo de solo lectura
              />
              <TextField
                label="Apellido"
                value={userData.apellido}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} // Campo de solo lectura
              />       
              <TextField
                label="Email"
                value={userData.email}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} // Campo de solo lectura
              />
              <TextField
                label="Edad"
                value={userData.edad}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} // Campo de solo lectura
              />
              <TextField
                label="Rol"
                value={userData.rol}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} // Campo de solo lectura
              />
              <TextField
                label="Localidad"
                value={userData.localidad}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} // Campo de solo lectura
              />
              <TextField
                label="Género"
                value={userData.genero}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} // Campo de solo lectura
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
