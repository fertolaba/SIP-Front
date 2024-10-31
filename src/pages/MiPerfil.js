import React from 'react';
import { Box, TextField, Typography, Button, Paper, Divider, LinearProgress } from '@mui/material';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
export default function MiPerfil() {
  return (
    <>
    <Header/>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información de Usuario
        </Typography>
        
        <TextField
          label="Nombre Completo"
          defaultValue="Prueba"
          fullWidth
          margin="normal"
        />
         <TextField
          label="Apellido"
          defaultValue="Prueba "
          fullWidth
          margin="normal"
        />       
        <TextField
          label="Email"
          defaultValue="prueba@example.com"
          fullWidth
          margin="normal"
        />
        
        <TextField
          label="Edad"
          defaultValue="20"
          fullWidth
          margin="normal"
        />
        
        <TextField
          label="Rol"
          defaultValue="Artista"
          fullWidth
          margin="normal"
        />
        
        <TextField
          label="Localidad"
          defaultValue="Belgrano"
          fullWidth
          margin="normal"
        />
                <TextField
          label="Genero"
          defaultValue="Rock"
          fullWidth
          margin="normal"
        />

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Guardar Cambios
        </Button>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Estadisticas
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Interaccion</Typography>
          <LinearProgress variant="determinate" value={70} color="primary" />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Asistencia</Typography>
          <LinearProgress variant="determinate" value={50} color="error" />
        </Box>

      </Paper>
    </Box>
    <Footer/>
    </>
  );
}
