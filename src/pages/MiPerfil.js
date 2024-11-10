import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, Paper, Divider, LinearProgress, MenuItem, FormControl, Select, InputLabel, FormHelperText , Link} from '@mui/material';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import usuariosServices from '../service/usuarios.services';
import generosServices from '../service/generos.services';
import PopupEditar from './PopupEditar';

export default function MiPerfil() {
  const userId = localStorage.getItem('userId');
  
  const [userData, setUserData] = useState({
    nombreCompleto: '',
    apellido: '',
    username: '',
    email: '',
    edad: '',
    localidad: '',
    genero: [], // Inicializamos como array para soportar selección múltiple
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [localidades, setLocalidades] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [generos, setGeneros] = useState([]);
  const [errors, setErrors] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const generos = await generosServices.getGeneros();
        setGeneros(generos);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGeneros();
  }, []);

  useEffect(() => {
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
  }, []);

  const handleInteresesChange = (e) => {
    const { value } = e.target;
    setUserData({
      ...userData,
      genero: typeof value === 'string' ? value.split(',') : value, // Almacenamos como array
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const data = await usuariosServices.getUserById(userId);
        setUserData({
          nombreCompleto: data.name,
          apellido: data.lastName,
          email: data.email,
          username: data.username,
          edad: data.edad,
          localidad: data.localidad ? data.localidad.id : '',
          genero: data.generosMusicalesPreferidos || [], 
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocalidadChange = (event) => {
    setUserData((prevData) => ({
      ...prevData,
      localidad: event.target.value,
    }));
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    const updatedUserData = {
      ...userData,
      localidad: userData.localidad,
      genres: userData.genero || [],
      lastName: userData.apellido,
      name: userData.nombreCompleto
      
    };
    console.log('Datos que se enviarán para actualizar:', updatedUserData);
    

    try {
      await usuariosServices.updateUser(userId, updatedUserData);
      setIsUpdated(true);
      setIsPopupOpen(true);  
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      if (error.response) {
        console.error('Detalles del error:', await error.response.text());
      }
      setError('Error al actualizar los datos del usuario');
    }
    setLoading(false);
  };

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
                label="Nombre de Usuario"
                name="username"
                value={userData.username}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
              />
              <TextField
                label="Nombre"
                name="nombreCompleto"
                value={userData.nombreCompleto}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
              />
              <TextField
                label="Apellido"
                name="apellido"
                value={userData.apellido}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
              />
              <TextField
                label="Email"
                name="email"
                value={userData.email}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Edad"
                name="edad"
                value={userData.edad}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="localidad-label">Localidad</InputLabel>
                <Select
                  labelId="localidad-label"
                  value={userData.localidad}
                  onChange={handleLocalidadChange}
                  label="Localidad"
                >
                  {localidades.map((localidad) => (
                    <MenuItem key={localidad.id} value={localidad.id}>
                      {localidad.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" error={Boolean(errors.genero)}>
                <InputLabel id="intereses-label">Intereses musicales</InputLabel>
                <Select
                  labelId="intereses-label"
                  id="intereses-select"
                  multiple
                  label="Intereses musicales"
                  value={userData.genero}
                  onChange={handleInteresesChange}
                >
                  {generos.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.genero}</FormHelperText>
              </FormControl>

              <Button variant="contained" color="primary" onClick={handleUpdateUser} sx={{ mt: 2 }}>
                Guardar Cambios
              </Button>
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

      <PopupEditar trigger={isPopupOpen} setTrigger={setIsPopupOpen}>
        <h3>Evento creado </h3>
        <p>Tu evento ha sido registrado exitosamente.</p>
        <Link component="button" >Ok </Link>
      </PopupEditar>
      <Footer />
    </>
  );
}