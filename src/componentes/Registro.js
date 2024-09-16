import React, { useState } from 'react';
import { TextField, Button, Box, Checkbox, FormControlLabel, Typography, Divider } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    nombre:'',
    apellido: '',
    interes: '',
    edad:'',
    ubicacion:'',
    aceptarTerminos: false,
    email: '',
    password: '',
    
  });

  const [rol, setRol] = React.useState('');

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
          name="email"
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
            type="edad"
            value={formData.edad}
            onChange={handleChange}
            margin="normal"
            required
          />         
    
        
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Rol</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={rol}
            label="Edad"
            onChange={rolChange}
          >
            <MenuItem value="Asistente">Asistente</MenuItem>
            <MenuItem value="Artista">Artista</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Ubicacion</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formData.ubicacion}
              label="Edad"
              onChange={handleChange}
            >
              <MenuItem >Asistente</MenuItem>
              <MenuItem >Artista</MenuItem>
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
        >
          Registrarse
        </Button>
      </form>
    </Box>
  );
};

export default Registro;
