import React, { useState, useEffect } from 'react';
import '../../ui/login.css';
import { useNavigate } from 'react-router-dom';
import fetchWithTimeout from '../error/_fetchWithTimeOut';
import Popup from './Popup';
import { TextField, Button,Box,Checkbox,FormControlLabel,Typography,FormControl,InputLabel,Select,MenuItem,FormHelperText,Link,IconButton,InputAdornment} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Verificar from './Verificar';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    nombre: '',
    apellido: '',
    edad: '',
    ubicacion: '',
    generosMusicalesPreferidos: [],
    aceptarTerminos: false,
    email: '',
    confirmEmail: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rol, setRol] = useState('');
  const [errors, setErrors] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const [generosMusicales, setGenerosMusicales] = useState([]); 
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
  const [localidades, setLocalidades] = useState([]);

  useEffect(() => {
    const fetchGenerosMusicales = async () => {
      try {
        const response = await fetch('http://localhost:4002/api/music-genres');
        if (!response.ok) {
          throw new Error('Error al obtener géneros musicales');
        }
        const data = await response.json();
        setGenerosMusicales(data);
      } catch (error) {
        console.error('Error al cargar géneros musicales:', error);
      }
    };

    const fetchLocalidades = async () => {
      try {
        const response = await fetch('http://localhost:4002/api/localidad');
        if (!response.ok) {
          throw new Error('Error al obtener localidades');
        }
        const data = await response.json();
        setLocalidades(data);
      } catch (error) {
        console.error('Error al cargar localidades:', error);
      }
    };
    fetchLocalidades();
    fetchGenerosMusicales();
    handleVerify();
  }, []);

  const handleVerify = async (email, token) => {
    try {
      const response = await fetch(`http://localhost:4002/api/auth/verify?token=${token}&email=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error en la verificación');
      }

      const data = await response.json();
      console.log("Verificación exitosa:", data);
      setIsVerifyPopupOpen(false); 
      setIsPopupOpen(true); 
    } catch (error) {
      console.error('Error al verificar:', error);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/login');
  };


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAgeChange = (e) => {
    setFormData({
      ...formData,
      edad: e.target.value,
    });
  };

  const handleInteresesChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      generosMusicalesPreferidos: value,
    });
  };

  const formValido = () => {
    const { nombreUsuario, nombre, apellido, edad, generosMusicalesPreferidos, email, confirmEmail, password, aceptarTerminos } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};

    if (!nombreUsuario) newErrors.nombreUsuario = "El nombre de usuario es obligatorio.";
    if (!nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!apellido) newErrors.apellido = "El apellido es obligatorio.";
    if (!emailRegex.test(email)) newErrors.email = "Por favor ingresa un email válido.";
    if (email !== confirmEmail) newErrors.confirmEmail = "Los correos electrónicos no coinciden.";
    if (!confirmEmail) newErrors.confirmEmail = "Por favor ingresa un email.";
    if (password.length < 7) {
      newErrors.password = "La contraseña debe tener al menos 7 caracteres.";
  } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "La contraseña debe contener al menos una letra mayúscula.";
  } else if (!/[a-z]/.test(password)) {
      newErrors.password = "La contraseña debe contener al menos una letra minúscula.";
  } else if (!/[0-9]/.test(password)) {
      newErrors.password = "La contraseña debe contener al menos un número.";
  }
  
    if (!edad || edad < 15 || edad > 99) newErrors.edad = 'Debe tener entre 15 y 100 años';
    if (!formData.localidadId) newErrors.ubicacion = "Debes seleccionar una ubicación.";

    if (generosMusicalesPreferidos.length === 0) newErrors.generosMusicalesPreferidos = "Debes seleccionar al menos un interés musical.";
    if (!aceptarTerminos) newErrors.aceptarTerminos = "Debes aceptar los Términos y Condiciones.";
    if (!rol) newErrors.rol = "Debes seleccionar al menos un rol.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      edad: parseInt(formData.edad, 10),
      password: formData.password,
      role: rol,
      genres: formData.generosMusicalesPreferidos, 
      localidadId: formData.localidadId
    };

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
      setIsVerifyPopupOpen(true);
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
<FormControl fullWidth margin="normal" error={Boolean(errors.rol)}>
  <InputLabel
    id="rol-label"
    style={{ fontWeight: 'bold', color: '#000' }} 
  >
    Rol
  </InputLabel>
  <Select
    className="left"
    labelId="rol-label"
    id="rol-select"
    value={rol}
    label="Rol"
    name="rol"
    onChange={(e) => setRol(e.target.value)}
    style={{
      fontWeight: 'bold',           
      backgroundColor: '#f0f0f0', 

    }}
  >
      <MenuItem value="CLIENT">Asistente</MenuItem>
      <MenuItem value="ARTIST">Artista</MenuItem>
    </Select>
    <FormHelperText>{errors.rol}</FormHelperText>
    {rol === 'CLIENT' && (
      <FormHelperText style={{ color: '#4caf50' }}>
        Como cliente, podrá explorar y asistir a eventos disponibles en la plataforma.
      </FormHelperText>
    )}
    {rol === 'ARTIST' && (
      <FormHelperText style={{ color: '#4caf50' }}>
        Como artista, tendrá la posibilidad de crear y gestionar sus propios eventos.
      </FormHelperText>
    )}
  </FormControl>

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
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
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
            <div id='column'>
              <FormControl fullWidth margin="normal" error={Boolean(errors.edad)}>
                <InputLabel id="edad-label">Edad</InputLabel>
                <Select
                  labelId="edad-label"
                  id="edad-select"
                  value={formData.edad}
                  onChange={handleAgeChange}
                  name="edad"
                  label="Edad"
                >
                  {Array.from({ length: 46 }, (_, i) => 15 + i).map((age) => (
                    <MenuItem key={age} value={age}>
                      {age}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.edad}</FormHelperText>
              </FormControl>
              <FormControl fullWidth margin="normal" error={Boolean(errors.generosMusicalesPreferidos)}>
              <InputLabel id="intereses-label">Intereses musicales</InputLabel>
              <Select
                labelId="intereses-label"
                id="intereses-select"
                multiple
                value={formData.generosMusicalesPreferidos}
                onChange={handleInteresesChange}
                renderValue={(selected) => selected.join(', ')}
              >
                {generosMusicales.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.generosMusicalesPreferidos}</FormHelperText>
            </FormControl>

            </div>

            <FormControl fullWidth margin="normal" error={Boolean(errors.ubicacion)}>
              <InputLabel id="ubicacion-label">Ubicación</InputLabel>
              <Select
                labelId="ubicacion-label"
                id="ubicacion-select"
                value={formData.localidadId || ''} 
                label="Ubicación"
                onChange={(e) => {
                  const selectedLocalidadId = e.target.value; 
                  setFormData({
                    ...formData,
                    localidadId: selectedLocalidadId, 
                  });
                }}
                name="ubicacion"
              >
                {localidades.map((localidad) => (
                  <MenuItem key={localidad.id} value={localidad.id}> 
                    {localidad.nombre}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.ubicacion}</FormHelperText>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.aceptarTerminos}
                  onChange={handleChange}
                  name="aceptarTerminos"
                />
              }
              label="Acepto los Términos y Condiciones"
            />
            {errors.aceptarTerminos && <Typography color="error">{errors.aceptarTerminos}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Registrarse
            </Button>
            <Typography variant="body2" align="center" mt={2}>
              ¿Ya tienes cuenta? <Link href="#" onClick={handleRegisterRedirect}>Inicia sesión</Link>
            </Typography>

          </form>
          <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} message="Registro exitoso!">
    <Typography variant="h6">Registro exitoso!</Typography>
</Popup>

        </Box>
      </div>
      <Verificar 
    trigger={isVerifyPopupOpen} 
    setTrigger={setIsVerifyPopupOpen} 
    onVerify={handleVerify} 
>
</Verificar>


    </div>
  );
};

export default Registro;
