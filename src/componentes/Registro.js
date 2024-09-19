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
    intereses: [],
    aceptarTerminos: false,
    email: '',
    confirmEmail: '',
    password: '',
  });

  const [rol, setRol] = useState([]);

  const rolChange = (event) => {
    const { value } = event.target;
    setRol(typeof value === 'string' ? value.split(',') : value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData({
      ...formData,
      [name]: type === 'checkbox'
        ? checked
        : Array.isArray(value)
        ? value
        : value, 
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

    if (formData.email !== formData.confirmEmail) {
      alert('Los correos electrónicos no coinciden.');
    }
    else if (formData.edad<15 || formData.edad>99 ){
      alert('Debe tener entre 15 y 100 años');
    }else {
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
              value={formData.confirmEmail} // Aquí podrías manejar un campo separado para confirmar el email si lo deseas
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
                  multiple
                  value={rol}
                  label="Rol"
                  onChange={rolChange}
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="CLIENT">Asistente</MenuItem>
                  <MenuItem value="ARTIST">Artista</MenuItem>
                </Select>
              </FormControl>
            </div>
            <FormControl fullWidth margin="normal">
              <InputLabel id="intereses-label">Intereses musicales</InputLabel>
              <Select
                labelId="intereses-label"
                id="intereses-select"
                multiple
                value={formData.intereses}
                label="Intereses"
                onChange={handleChange}
                name="intereses"
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="Genero1">Genero1</MenuItem>
                <MenuItem value="Genero2">Genero2</MenuItem>
              </Select>
            </FormControl>
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
