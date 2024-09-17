import React, { useState } from 'react';
import { TextField, Button, Box, Checkbox, FormControlLabel, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    nombre: '',
    apellido: '',
    interes: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear cuenta
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre de usuario"
          name="nombreUsuario"
          value={formData.nombreUsuario}
          onChange={handleChange}
          margin="normal"
          required
        />
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
          fullWidth
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          margin="normal"
          required
        />
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
          value={formData.email}
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
            labelId="rol-label"
            id="rol-select"
            value={rol}
            label="Rol"
            onChange={rolChange}
          >
            <MenuItem value="Asistente">Asistente</MenuItem>
            <MenuItem value="Artista">Artista</MenuItem>
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
          fullWidth
          variant="contained"
          type="submit"
          color="primary"
          sx={{ mt: 2 }}
        >
          Registrarse
        </Button>
      </form>
    </Box>
  );
};

export default Registro;
