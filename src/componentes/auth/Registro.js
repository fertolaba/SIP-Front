import React, { useState } from 'react';
import '../../ui/login.css';
import { TextField, Button, Box, Checkbox, FormControlLabel, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import fetchWithTimeout from '../error/_fetchWithTimeOut';
import Popup from './Popup';

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
  const [errors, setErrors] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleRegisterRedirect = () => {
    navigate('/login'); 
  };

  const rolChange = (event) => {
    setRol(event.target.value); 
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

  const formValido=()=>{
    const { nombreUsuario, nombre, apellido, edad, ubicacion, intereses, email, confirmEmail, password, aceptarTerminos } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};

    if (!nombreUsuario) newErrors.nombreUsuario = "El nombre de usuario es obligatorio.";
    if (!nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!apellido) newErrors.apellido = "El apellido es obligatorio.";
    if (!emailRegex.test(email)) newErrors.email = "Por favor ingresa un email válido.";
    if (email !== confirmEmail) newErrors.confirmEmail = "Los correos electrónicos no coinciden.";
    if (!confirmEmail) newErrors.confirmEmail = "Por favor ingresa un email.";
    if (password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    if (edad < 15 || edad > 99) newErrors.edad = 'Debe tener entre 15 y 100 años';
    if (!ubicacion) newErrors.ubicacion = "Debes seleccionar una ubicación.";
    if (intereses.length === 0) newErrors.intereses = "Debes seleccionar al menos un interes musical.";
    if (!aceptarTerminos) newErrors.aceptarTerminos = "Debes aceptar los Términos y Condiciones.";
    if (rol.length === 0)newErrors.rol ="Debes seleccionar al menos un rol.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValido()) {
      return;
    }

    const registerRequest = {
      email: formData.email,
      username: formData.nombreUsuario,
      name: formData.nombre,
      lastName: formData.apellido,
      edad: parseInt(formData.edad), 
      password: formData.password,
      role: rol , 
      intereses: formData.intereses,
      ubicacion: formData.ubicacion
    };
    console.log('Datos del registro:', registerRequest);

    try {
      const response = await fetchWithTimeout('http://localhost:4002/api/v1/auth/register', {
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
      setIsPopupOpen(true);  
      
      

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
              error={Boolean(errors.nombreUsuario)}
              helperText={errors.nombreUsuario}
            />
            <div id='column'>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                margin="normal"
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}               
              />
            <TextField
              className='left'
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              margin="normal"
              error={Boolean(errors.apellido)}
              helperText={errors.apellido}
            />
            </div>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Confirmar Email"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              margin="normal"
              error={Boolean(errors.confirmEmail)}
              helperText={errors.confirmEmail}
            />
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              error={Boolean(errors.password)}
              helperText={errors.password}
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
                error={Boolean(errors.edad)}
                helperText={errors.edad}
              />
            <FormControl fullWidth margin="normal" error={Boolean(errors.rol)}>
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
              <FormHelperText>{errors.rol}</FormHelperText>
            </FormControl>
            </div>
            <FormControl fullWidth margin="normal" error={Boolean(errors.intereses)}>
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
                <MenuItem value="ROCK">Rock</MenuItem>
                <MenuItem value="POP">Pop</MenuItem>
                <MenuItem value="JAZZ">Jazz</MenuItem>
                <MenuItem value="CLASSICAL">Classical</MenuItem>
                <MenuItem value="HIPHOP">Hiphop</MenuItem>
                <MenuItem value="REGGAE">Reggae</MenuItem>
                <MenuItem value="ELECTRONIC">Electronic</MenuItem>
                <MenuItem value="METAL">Metal</MenuItem>
                <MenuItem value="LATIN">Latin</MenuItem>

              </Select>
              <FormHelperText>{errors.intereses}</FormHelperText>
            </FormControl>
            <FormControl fullWidth margin="normal" error={Boolean(errors.ubicacion)}>
              <InputLabel id="ubicacion-label">Ubicación</InputLabel>
              <Select
                labelId="ubicacion-label"
                id="ubicacion-select"
                value={formData.ubicacion}
                label="Ubicación"
                onChange={handleChange}
                name="ubicacion"
              >
                <MenuItem value="Belgrano">Belgrano</MenuItem>
                <MenuItem value="Nunez">Nuñez</MenuItem>
              </Select>
              <FormHelperText>{errors.ubicacion}</FormHelperText>
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
              error={Boolean(errors.aceptarTerminos)}
            />
            {errors.aceptarTerminos && (
              <Typography color="error" variant="body2">
                {errors.aceptarTerminos}
              </Typography>
            )}
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
            <Typography variant="body1" align="center" sx={{ mt: 2 }} class="text">
              ¿Ya tienes cuenta? <Link component="button" onClick={handleRegisterRedirect}>
            Iniciar sesion
          </Link>
            </Typography>
          </form>
        </Box>
      </div>
      <Popup trigger={isPopupOpen} setTrigger={setIsPopupOpen}>
        <h3>Registro exitoso</h3>
        <p>Tu cuenta ha sido registrada exitosamente.</p>
        <Link component="button" onClick={handleRegisterRedirect}>Ir al login </Link>
      </Popup>
    </div>
  );
};

export default Registro;