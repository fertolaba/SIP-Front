import React, { useState, useEffect } from 'react';
import '../../ui/login.css';
import { useNavigate } from 'react-router-dom';
import fetchWithTimeout from '../error/_fetchWithTimeOut';
import Popup from "../popups/Popup";
import { TextField, Button,Box,Checkbox,FormControlLabel,Typography,FormControl,InputLabel,Select,MenuItem,FormHelperText,Link,IconButton,InputAdornment} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Verificar from '../popups/Verificar';
import { formValido } from './validacion';
import PopupError from '../popups/PopupError';
import PopupValidacion from '../popups/PopupValidacion';
import PopupRegistro from '../popups/PopupRegistro';



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
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [localidades, setLocalidades] = useState([]);
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSendingToken, setIsSendingToken] = useState(false);




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
      }else{
        setIsSendingToken(true);
      }

      const data = await response.json();
      console.log("Verificación exitosa:", data);
      setIsVerifyPopupOpen(false); 
      setIsSuccessPopupOpen(true); 
    } catch (error) {
      console.error('Error al verificar:', error);
      setErrorMessage('Error en la verificación. Por favor, intente nuevamente.');
      setIsVerifyPopupOpen(true); 
      setIsErrorPopupOpen(true);

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


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reiniciamos errores antes de cada validación/envío
    setErrors({});
  
    // Validación local
    const { isValid, errors: validationErrors } = formValido(formData, rol);
    if (!isValid) {
      setErrors(validationErrors); // Actualizamos solo errores locales
      return;
    }
  
    // Si pasa las validaciones locales, intentamos enviar al backend
    const registerRequest = {
      email: formData.email,
      username: formData.nombreUsuario,
      name: formData.nombre,
      lastName: formData.apellido,
      edad: parseInt(formData.edad, 10),
      password: formData.password,
      role: rol,
      generosMusicalesPreferidos: formData.generosMusicalesPreferidos,
      localidadId: formData.localidadId,
    };
  
    try {
      const response = await fetch('http://localhost:4002/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerRequest),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        
        // Manejo específico del mensaje de error
        if (errorData.message.includes('El email ya está registrado.')) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: 'El email ya está registrado. Por favor, utiliza otro.',
          }));
        } else if (errorData.message.includes('El nombre de usuario ya está registrado.')) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            nombreUsuario: 'El nombre de usuario ya está en uso. Por favor, elige otro.',
          }));
        } else {
          throw new Error('Error en el registro');
        }
        return;
      }else{
        setIsSendingToken(true);
      }

      const data = await response.json();
      sessionStorage.setItem('showVerifyPopup', 'true');

    setIsSendingToken(true);
    setTimeout(() => {
      setIsSendingToken(false);
      navigate('/login');
    }, 2000); 
    } catch (error) {
      console.error('Error al registrar:', error);
      setErrorMessage('Ocurrió un problema. Por favor, intenta nuevamente.');
      setIsErrorPopupOpen(true); 
      setIsSendingToken(false);
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
                Como asistente, podrá explorar y asistir a eventos disponibles en la plataforma.
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
                helperText={errors.nombreUsuario || 'Ingrese un nombre único para su usuario.'}
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
              helperText={errors.email || 'Introduce tu correo electrónico.'}
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
                label="Intereses musicales"
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
              ¿Ya tienes una cuenta? <Link href="#" onClick={handleRegisterRedirect}>Inicia sesión</Link>
            </Typography>


          </form>
          <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} message="Registro exitoso!" />

          <Verificar 
            trigger={isVerifyPopupOpen} 
            setTrigger={setIsVerifyPopupOpen} 
            onVerify={handleVerify} 
            errorMessage={errorMessage}
          />
          
          <PopupRegistro 
            trigger={isSendingToken} 
            setTrigger={setIsSendingToken} 
            onRedirect={handleRegisterRedirect} 
          />


          <PopupValidacion 
            trigger={isSuccessPopupOpen} 
            setTrigger={setIsSuccessPopupOpen} 
            onRedirect={handleRegisterRedirect} 
          />

          <PopupError 
            trigger={isErrorPopupOpen} 
            setTrigger={setIsErrorPopupOpen} 
            onRedirect={handleRegisterRedirect} 
          />

        </Box>
      </div>



    </div>
  );
};

export default Registro;
