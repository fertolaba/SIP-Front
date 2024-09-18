import React, { useState } from 'react';
import '../ui/login.css';
import { TextField, Button, Box, Checkbox, FormControlLabel, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    nombre: '',
    apellido: '',
    edad: '',
    ubicacion: '',
    aceptarTerminos: false,
    email: '',
    password: '',
  });

  const [rol, setRol] = useState('');

  const rolChange = (event) => {
    setRol(event.target.value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registerRequest = {
      email: formData.email,
      username: formData.nombreUsuario,
      name: formData.nombre,
      lastname: formData.apellido,
      edad: parseInt(formData.edad), 
      password: formData.password,
      role: rol , 
    };
    console.log('Datos del registro:', registerRequest);

    try {
      const response = await fetch('http://localhost:4002/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerRequest),
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const data = await response.json();
      console.log('Registro exitoso:', data);
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  return (
    <div id='login'>
      <div id='login-image'></div>
      <div id='login-register'>
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }} id='login-form'>
          <Typography variant="h4" gutterBottom>
            Registrarse
          </Typography>
          <form onSubmit={handleSubmit} id='login-form'>
            <TextField
              fullWidth
              label="Nombre de usuario"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              margin="normal"
              required
            />
            <div id='column'>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                className='left'
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                margin="normal"
                required
              />
            </div>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirmar Email"
              name="confirmEmail"
              type="email"
              value={formData.email} // Aquí podrías manejar un campo separado para confirmar el email si lo deseas
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <div id='column'>
              <TextField
                fullWidth
                label="Edad"
                name="edad"
                type="number"
                value={formData.edad}
                onChange={handleChange}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="rol-label">Rol</InputLabel>
                <Select
                  className='left'
                  labelId="rol-label"
                  id="rol-select"
                  value={rol}
                  label="Rol"
                  onChange={rolChange}
                >
                  <MenuItem value="CLIENT">Asistente</MenuItem>
                  <MenuItem value="ARTIST">Artista</MenuItem>
                </Select>
              </FormControl>
            </div>
            <FormControl fullWidth margin="normal">
              <InputLabel id="ubicacion-label">Ubicación</InputLabel>
              <Select
                labelId="ubicacion-label"
                id="ubicacion-select"
                value={formData.ubicacion}
                label="Ubicación"
                onChange={handleChange}
                name="ubicacion"
              >
                <MenuItem value="Ubicacion1">Ubicacion1</MenuItem>
                <MenuItem value="Ubicacion2">Ubicacion2</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  name="aceptarTerminos"
                  checked={formData.aceptarTerminos}
                  onChange={handleChange}
                />
              }
              label="Aceptar los Términos y Condiciones"
            />
            <Button
              className='register'
              fullWidth
              variant="contained"
              type="submit"
              color="primary"
              sx={{ mt: 2 }}
            >
              Registrarse
            </Button>
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              ¿Ya tienes cuenta? <Button color="primary">Inicia sesión</Button>
            </Typography>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default Registro;
